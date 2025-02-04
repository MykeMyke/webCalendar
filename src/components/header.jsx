import React from "react";
import { NavLink } from "react-router-dom";

import { AppBar, Box, Toolbar, Grid } from "@mui/material";

import AuthButton from "./authentication/AuthButton";
import JoinDiscordButton from "./authentication/JoinDiscordButton";
import useUserStore from "../stores/useUserStore";

import "../styles/Global.css";

<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />;

const Header = () => {
  const user = useUserStore((s) => s.user);

  return (
    <Box sx={{ justifyContent: "space-between", color: "red" }}>
      <AppBar position="fixed">
        <Toolbar>
          <Grid container direction="row" spacing={1.4} textAlign="center" alignItems="center" sx={{ mb: 0.6 }}>
            <Grid item>
              <NavLink
                style={({ isActive }) => {
                  return {
                    color: isActive ? "red" : "White",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    textDecoration: "none",
                  };
                }}
                to="/"
                activeclassname="is-active"
              >
                About <br></br>Triden
              </NavLink>
            </Grid>
            <Grid item>
              <NavLink
                style={({ isActive }) => {
                  return {
                    color: isActive ? "red" : "White",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    textDecoration: "none",
                  };
                }}
                to="/calendar"
                activeclassname="is-active"
              >
                Games <br></br>Calendar
              </NavLink>
            </Grid>
            <Grid item>
              <NavLink
                style={({ isActive }) => {
                  return {
                    color: isActive ? "red" : "White",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    textDecoration: "none",
                  };
                }}
                to="/team"
                activeclassname="is-active"
              >
                The <br></br>Team
              </NavLink>
            </Grid>
            <Grid item>
              <NavLink
                style={({ isActive }) => {
                  return {
                    color: isActive ? "red" : "White",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    textDecoration: "none",
                  };
                }}
                to="/benefits"
                activeclassname="is-active"
              >
                Member <br></br>Benefits
              </NavLink>
            </Grid>
          </Grid>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 1.8,
              alignItems: "center",
            }}
          >
            {!user.loggedIn && <JoinDiscordButton />}
            <AuthButton />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
