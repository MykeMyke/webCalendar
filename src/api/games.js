import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import useAlertStore from "../stores/useAlertStore";
import { useShallow } from "zustand/react/shallow";
import { addHours } from "date-fns";
import { apiHost, applyCsrf } from "./utils";
import useUserStore from "../stores/useUserStore";

const gamesUrl = `${apiHost}/api/games/`;

/**
 * Convience method just so we dont have to type this on every required validation.
 * @param {*} field they field, either an object with a label or a string label
 * @returns a string error message
 */
const req = (field) => {
  const label = typeof field === "string" ? label : field.label;
  return `${label} is required`;
};

/**
 * Get all games.
 * @returns the axios response
 */
function getGames() {
  return axios.get(gamesUrl, {
    withCredentials: true,
  });
}

/**
 * Get a single game by its id
 * @param {*} id the pk of the game
 * @returns the axios response
 */
function getGame(id) {
  return axios.get(gamesUrl + id, {
    withCredentials: true,
  });
}

function createGame(values) {
  return axios.post(gamesUrl, values, { withCredentials: true, headers: applyCsrf() });
}

function updateGame(values) {
  return axios.patch(`${gamesUrl}${values.id}/`, values, { withCredentials: true, headers: applyCsrf() });
}

function deleteGameById(id) {
  return axios.delete(`${gamesUrl}${id}/`, { withCredentials: true, headers: applyCsrf() });
}

function joinGameById(id) {
  return axios.post(`${gamesUrl}${id}/join/`, {}, { withCredentials: true, headers: applyCsrf() });
}

function dropGameById(id) {
  return axios.post(`${gamesUrl}${id}/drop/`, {}, { withCredentials: true, headers: applyCsrf() });
}

/**
 * The hook to get games
 * @returns the games, formatted for use
 */
export function useGames() {
  const queryClient = useQueryClient();
  const [setSuccess, setError, setWarning] = useAlertStore(useShallow((s) => [s.setSuccess, s.setError, s.setWarning]));
  const user = useUserStore((s) => s.user);

  const { data, isLoading, error, status } = useQuery({
    queryKey: ["games"],
    queryFn: async () => {
      const rsp = await getGames();

      const data = rsp.data
        .map((game) => {
          const dt = new Date(game.datetime);
          return {
            ...game,
            datetime: new Date(game.datetime),
            players: game.players,
            standby: game.waitlist,
            day: dt.getDay(),
            slot: Math.floor(dt.getHours() / 4),
            datetime_open_release: game.datetime_open_release === null ? null : new Date(game.datetime_open_release),
            datetime_release: game.datetime_release === null ? null : new Date(game.datetime_release),
          };
        })
        .sort((a, b) => {
          return a.datetime - b.datetime;
        });
      return data;
    },
  });

  const { mutate: joinGame, isLoading: isJoining } = useMutation({
    mutationFn: async ({ id, name }) => {
      const response = await joinGameById(id);
      return response;
    },
    onSuccess: (response, { id, name }) => {
      const rspUser = response.data;
      //unseenservant does not send an error if user is already in game
      if (rspUser?.game) {
        const current = data;
        const currentIdx = data.findIndex((gm) => gm.id == id);
        if (currentIdx >= 0) {
          if (rspUser.standby) {
            current[currentIdx].standby.push(rspUser);
            current[currentIdx].standingBy = true;
          } else {
            current[currentIdx].players.push(rspUser);
            current[currentIdx].playing = true;
          }
          //optimistically change
          queryClient.setQueryData(["games"], current);
        }
        setSuccess(`You have joined ${name}`);
        queryClient.refetchQueries({ queryKey: ["user_data"], exact: true });
        queryClient.refetchQueries({ queryKey: ["games"], exact: true });
      } else {
        setWarning("You are already in this game");
        //refetch the query, if this is the case, likely updated in discord while web session active
        queryClient.refetchQueries({ queryKey: ["games"], exact: true });
      }
    },
    onError: (error) => {
      setError(error?.response?.data?.message || "Unknown error");
    },
  });

  const { mutate: dropGame, isLoading: isDropping } = useMutation({
    mutationFn: async ({ id, name }) => {
      const response = await dropGameById(id);
      return response;
    },
    onSuccess: (response, { id, name }) => {
      setSuccess(`You have dropped from game ${name}`);
      queryClient.refetchQueries({ queryKey: ["user_data"], exact: true });
      queryClient.refetchQueries({ queryKey: ["games"], exact: true });
    },
    onError: (error) => {
      if (error?.response?.status === 400) {
        setWarning(error?.response?.data?.message || "Unknown error");
        //refresh games list, likely droppped from discord
        queryClient.refetchQueries({ queryKey: ["user_data"], exact: true });
        queryClient.refetchQueries({ queryKey: ["games"], exact: true });
      } else {
        setError(error?.response?.data?.message || "Unknown error");
      }
    },
  });

  const userModifiedData = useMemo(() => {
    if (data && user.loggedIn) {
      return data.map((game) => {
        return {
          ...game,
          is_dm: !!game.user_is_dm,
          playing: !!game.user_is_player,
          standingBy: !!game.user_is_waitlisted,
        };
      });
    } else {
      return (
        data?.map((game) => {
          return { ...game, is_dm: false, playing: false };
        }) || []
      );
    }
  }, [data, user]);

  return {
    isLoading,
    data: userModifiedData || data,
    error,
    status,
    joinGame,
    isJoining,
    dropGame,
    isDropping,
  };
}

export const minToTier = (min) => {
  if (!min || min < 5) {
    return 1;
  }
  if (min < 11) {
    return 2;
  }
  if (min < 17) {
    return 3;
  }
  return 4;
};

/**
 * Get a game by a hook and return a form and methods to manipulate
 * @param {*} id the pk of a game, or "new"
 * @returns
 */
export function useGame(id) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(id !== "new");
  const [setSuccess, setError] = useAlertStore(useShallow((s) => [s.setSuccess, s.setError]));

  const navigate = useNavigate();
  const {
    data: game,
    status,
    error: gameError,
  } = useQuery({
    queryKey: ["games", id],
    queryFn: async ({ queryKey }) => {
      setIsLoading(true);
      const game = await getGame(queryKey[1]);
      if (game?.data) {
        return {
          ...game.data,
          tier: minToTier(game.data.level_min),
          staged: game.data.datetime_release !== null,
          datetime: game.data.datetime ? new Date(game.data.datetime) : null,
          datetime_release: game.data.datetime_release ? new Date(game.data.datetime_release) : null,
          datetime_open_release: game.data.datetime_open_release ? new Date(game.data.datetime_open_release) : null,
        };
      }
      throw Error("Cannot parse game");
    },
    enabled: id !== "new",
  });
  useEffect(() => {
    if (status === "success") {
      formik.setValues(game);
      setIsLoading(false);
    }
  }, [game, status]);

  const deleteGame = useMutation({
    mutationFn: (values) => {
      setIsLoading(true);
      return deleteGameById(id);
    },
    enabled: id !== "new",
    onSettled: () => {
      setIsLoading(false);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
      setSuccess("Game has been deleted");
      navigate("/calendar");
    },
  });

  const saveGame = useMutation({
    mutationFn: (values) => {
      setIsLoading(true);
      if (id === "new") {
        return createGame(values);
      }
      return updateGame(values);
    },
    onSettled: () => {
      setIsLoading(false);
    },
    onSuccess: (response) => {
      if (id === "new") {
        setSuccess("Game has been created");
        navigate(`/members/games/edit/${response.data.id}`);
      } else {
        setSuccess("Game has been updated");
      }
    },
    onError: (error) => {
      if (error?.response?.status) {
        switch (error.response.status) {
          case 400:
            setError(error.response.data?.message || error.message);
            const fieldErrors = error.response?.data.errors;
            formik.setErrors(fieldErrors);
            break;
          case 403:
          case 500:
          default:
            setError(error.response.data?.message || error.message);
        }
      }
    },
  });
  const formik = useFormik({
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: Yup.object().shape({
      name: Yup.string().label("Name").required(req),
      module: Yup.string().label("Module Code").required(req),
      description: Yup.string().label("Description").required(req).min(1, req),
      warnings: Yup.string().label("Warnings"),
      level_min: Yup.number()
        .integer()
        .label("Min Level")
        .test("level_min", (value, context) => {
          if (value < 1 || value > 20) {
            return context.createError({
              path: "level_min",
              message: ({ label }) => `Must be between 1 and 20`,
            });
          }
          if (context?.parent?.level_max < value) {
            return context.createError({
              path: "level_min",
              message: ({ label }) => `Min cannot be greater than Max`,
            });
          }
          return true;
        }),
      level_max: Yup.number()
        .integer()
        .label("Max Level")
        .test("level_max", (value, context) => {
          if (value < 1 || value > 20) {
            return context.createError({
              path: "level_max",
              message: ({ label }) => `Must be between 1 and 20`,
            });
          }
          if (context?.parent?.level_min > value) {
            return context.createError({
              path: "level_max",
              message: ({ label }) => `Max cannot be less than Min`,
            });
          }
          return true;
        }),
      max_players: Yup.number()
        .integer("You can't have fractions of a player")
        .label("Players")
        .test("max_players", (value, context) => {
          if (context?.parent?.variant !== "Epic AL" && value > 8) {
            return context.createError({
              path: "max_players",
              message: ({ label }) => `Only Epics may have more than 8 players`,
            });
          }
          return true;
        }),
      duration: Yup.number()
        .label("Duration")
        .integer("Whole hours only")
        .max(8, "Games longer than 8 hours are unreasonable")
        .min(1, "Games cannot be instantaneous"),
      datetime: Yup.date().required().min(new Date(), "Game start must be in the future"),
      datetime_release: Yup.date()
        .nullable()
        .label("Patreon Release")
        .test(
          ("datetime_release",
          (value, context) => {
            if (context.parent.staged) {
              if (!value || value.getTime() >= context.parent.datetime.getTime()) {
                return context.createError({
                  path: "datetime_release",
                  message: ({ label }) => `${label} must be before Game Time`,
                });
              }
            }
            return true;
          }),
        ),
      datetime_open_release: Yup.date()
        .label("General Release")
        .required()
        .test(
          ("datetime_open_release",
          (value, context) => {
            if (value.getTime() >= context.parent.datetime.getTime()) {
              return context.createError({
                path: "datetime_open_release",
                message: ({ label }) => `${label} must be before Game Time`,
              });
            }
            if (context.parent.staged && value.getTime() < context.parent.datetime_release.getTime()) {
              return context.createError({
                path: "datetime_open_release",
                message: ({ label }) => `${label} must be after Patreon Release`,
              });
            }
            return true;
          }),
        ),
    }),
    initialValues: {
      name: "",
      module: "",
      realm: "Forgotten Realms",
      variant: "Resident AL",
      description: "",
      max_players: 6,
      tier: 1,
      level_min: 1,
      level_max: 4,
      warnings: "",
      streaming: false,
      play_test: false,
      datetime: addHours(new Date(), 337), //2 weeks + 1  hour, rather than calling addHours(addWeeks(..))
      datetime_release: addHours(new Date(), 1),
      datetime_open_release: addHours(new Date(), 169), //see above
      staged: true,
      duration: 4,
      ready: true,
    },
    onSubmit: (values) => {
      saveGame.mutate(values);
    },
  });

  return {
    isLoading,
    formik,
    saveGame,
    deleteGame,
  };
}
