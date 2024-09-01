import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";

import { Box, Skeleton, Divider } from "@mui/material";
import { Fab, Grid, Typography } from "@mui/material";

import AddBoxIcon from "@mui/icons-material/AddBox";

import Filters from "../components/Filters";
import JoinDiscordButton from "../components/authentication/JoinDiscordButton";
import LoginButton from "../components/authentication/LoginButton";
import useFilterStore from "../stores/useFilterStore";
import { checkDaysToGo } from "../utils/daysToGo";
import useUserStore from "../stores/useUserStore";
import Game from "../components/calendarCard";
import { useGames } from "../api/games";

import "../styles/Global.css";

function dummyGame(name) {
  return { dm_name: name, datetime: Math.random() };
}

function DiscordButton({ children }) {
  return (
    <JoinDiscordButton
      color="secondary"
      sx={{
        py: 0.5,
        px: 0.8,
        lineHeight: "1.2",
        textAlign: "center",
        fontSize: "0.75rem",
      }}
    >
      {children}
    </JoinDiscordButton>
  );
}

export default function Calendar() {
  const user = useUserStore((s) => s.user);
  const [name, days, slots, realms, filter, variants, tiers, playTest, streaming] = useFilterStore(
    useShallow((s) => [s.name, s.days, s.slots, s.realms, s.filter, s.variants, s.tiers, s.playTest, s.streaming]),
  );

  const { data, isLoading, joinGame, dropGame } = useGames();
  const filtered = useMemo(() => {
    if (isLoading || !data) {
      return [
        dummyGame("one"),
        dummyGame("two"),
        dummyGame("three"),
        dummyGame("four"),
        dummyGame("five"),
        dummyGame("six"),
        dummyGame("seven"),
        dummyGame("eight"),
        dummyGame("nine"),
        dummyGame("ten"),
        dummyGame("eleven"),
        dummyGame("twelve"),
      ];
    }
    return filter(data);
  }, [isLoading, data, filter, name, days, slots, realms, variants, tiers, user, playTest, streaming]);

  const lastDate = useMemo(() => {
    return data?.map((a) => a.datetime).reverse()[0] || new Date();
  }, [data]);

  const navigate = useNavigate();
  return (
    <React.Fragment>
      <Grid container spacing={1} direction="row" alignItems="center" justifyContent="flex-start" sx={{ mb: 2 }}>
        <Grid item sx={{ ml: 1.5, pr: 1.5 }}>
          <img src="/img/TridenAvatar2048.png" alt="Triden Games" className="Logo" />
        </Grid>
        <Grid item xs={9}>
          <Typography variant="h5" color="text.primary" sx={{ fontSize: "1.2rem" }}>
            {isLoading ? (
              <Skeleton animation="wave" />
            ) : (
              <React.Fragment>
                <strong>
                  {data.length} game{data.length === 1 ? "" : "s"}
                </strong>{" "}
                in the next {checkDaysToGo(lastDate)} days
              </React.Fragment>
            )}
          </Typography>
          <Typography variant="subtitle1" color="text.primary">
            {isLoading ? (
              <Skeleton animation="wave" />
            ) : (
              <>
                {user.loggedIn ? (
                  <>
                    {user.credit_max
                      ? `${user.credit_available}/${user.credit_max} credit${user.credit_max === 1 ? "" : "s"}`
                      : "No credits"}{" "}
                    available
                  </>
                ) : (
                  <React.Fragment>
                    <DiscordButton>Join Our Discord</DiscordButton> and{" "}
                    <LoginButton
                      sx={{
                        px: 0,
                        lineHeight: "1.2",
                        my: 1.5,
                        textAlign: "center",
                        fontSize: "0.75rem",
                      }}
                    >
                      Login
                    </LoginButton>{" "}
                    to play
                  </React.Fragment>
                )}
              </>
            )}
          </Typography>
        </Grid>
      </Grid>
      <Divider variant="middle" sx={{ mb: 2.5 }} />
      <Filters />
      <Grid container spacing={3} justify="center" sx={{ px: 2, mb: 3, position: "relative" }}>
        {filtered.map((gameData) => (
          <Grid key={`${gameData.dm_name}_${gameData.datetime}_${gameData.id}`} item xs={12} sm={6} md={4} lg={3}>
            <Game props={gameData} isLoading={isLoading} joinGame={joinGame} dropGame={dropGame} />
          </Grid>
        ))}
        {user?.isDm ? (
          <Box>
            <Fab
              variant="extended"
              color="primary"
              aria-label="add"
              sx={{ position: "fixed", bottom: "1%", right: "10%" }}
              onClick={() => navigate("/members/games/new")}
            >
              <AddBoxIcon fontSize="large" sx={{ mr: 1 }} /> Create a Game
            </Fab>
          </Box>
        ) : null}
      </Grid>
    </React.Fragment>
  );
}
