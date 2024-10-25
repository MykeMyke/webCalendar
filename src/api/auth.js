import { useEffect, useState } from "react";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiHost, applyCsrf } from "./utils";
import { hasDMRank } from "../utils/ranks";
import useUserStore from "../stores/useUserStore";
import { useShallow } from "zustand/react/shallow";

export function getUserDetails() {
  return axios.get(`${apiHost}/auth/user_details`, { withCredentials: true });
}

export function doLogout() {
  return axios.post(`${apiHost}/auth/logout/`, {}, { withCredentials: true, headers: applyCsrf() });
}

function login() {
  window.location.href = `${apiHost}/discord_auth/login`;
}

export default function useUser() {
  const [user, setUser, setIsLoading, setMethods] = useUserStore(
    useShallow((s) => [s.user, s.setUser, s.setIsLoading, s.setMethods]),
  );
  const queryClient = useQueryClient();
  const { data, isFetching, status } = useQuery({
    queryKey: ["user_data"],
    queryFn: async () => {
      const u = await getUserDetails();
      let us;
      if (u.data?.user_data) {
        us = {
          ...u.data.user_data,
          loggedIn: true,
          patreon: u.data.user_data.ranks?.filter((rank) => rank.patreon).length,
          resDM: u.data.user_data.ranks?.filter((rank) => rank.name.startsWith("ResDM")).length,
          credits: u.data.user_data.ranks?.reduce((tot, rank) => tot + rank.max_games, 0) || 0,
          isDm: hasDMRank(u.data.user_data.ranks),
        };
      } else {
        us = { loggedIn: false };
      }
      setUser(us);
      return us;
    },
  });
  useEffect(() => {
    setIsLoading(status === "pending");
  }, [status]);

  const logoutMutation = useMutation({
    queryKey: ["logout"],
    mutationFn: async () => {
      const result = doLogout().then((rsp) => {
        setUser({ loggedIn: false });
        queryClient.invalidateQueries({ queryKey: ["user_data"] });
      });
    },
  });

  useEffect(() => {
    setMethods({ in: login, out: logoutMutation.mutate });
  }, [logoutMutation, setMethods]);
  return {
    user,
    login,
    logout: logoutMutation.mutate,
  };
}
