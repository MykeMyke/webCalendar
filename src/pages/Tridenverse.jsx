import "../styles/Global.css";
import React from "react";
import { Grid, Divider, List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material";
import LabelImportantIcon from "@mui/icons-material/LabelImportant";
import TridenverseModules from "../components/TridenverseModules";

function ListPoint({ content }) {
  return (
    <ListItem disablePadding>
      <ListItemIcon>
        <LabelImportantIcon />
      </ListItemIcon>
      <ListItemText primary={content} />
    </ListItem>
  );
}

function Tridenverse() {
  return (
    <React.Fragment>
      <TridenverseModules />
      {/* <div className="fab-bottom">
        <div className="centraliser">
          <div></div>
          <Fab
            variant="extended"
            size="medium"
            color="primary"
            aria-label="add"
          >
            <DescriptionIcon sx={{ mr: 1 }} />
            Tridenverse Modules on DMsGuild
          </Fab>
          <div></div>
        </div>
      </div> */}
      <Grid container spacing={1} direction="column" alignItems="center" justifyContent="flex-start" sx={{ px: 2, mb: 2 }}>
        <Grid item>
          <Typography variant="h2" sx={{ textAlign: "center" }}>
            Welcome to the <strong>Tridenverse!</strong>
          </Typography>
        </Grid>
        <Grid item>
          <Divider
            variant="middle"
            sx={{
              my: 0.6,
            }}
          />
          <Typography variant="h5" color="text.primary" sx={{ mt: 2, mb: 1 }}>
            The Tridenverse is simply our way of helping <strong> all</strong> authors from our community get the benefit of our
            brand which is recognised for quality, without taking away anything from their individual style!
          </Typography>
          <Divider
            variant="middle"
            sx={{
              mt: 2,
              mb: 0.6,
            }}
          />
          <Typography variant="h5" color="text.primary" sx={{ mt: 2, mb: 1, textAlign: "center" }}>
            Check out adventures we've published{" "}
            <a
              href="https://docs.google.com/spreadsheets/d/e/2PACX-1vSnNBURnnNqhhSHTEIBHilSeq9Q1Sh902UeaSV014IjzlTC6C7iEDzy_bVigvYrhtHWXsqH52L0vFhX/pubhtml"
              target="_blank"
              rel="noreferrer"
            >
              on DMsGuild
            </a>{" "}
          </Typography>
          <Divider
            variant="middle"
            sx={{
              mt: 2,
              mb: 0.6,
            }}
          />
          <Typography variant="h5" color="text.primary" sx={{ mt: 2, mb: 1 }}>
            Whether you're new to adventure writing or have released things previously, we have excellent support for writers to
            make publishing your adventures as easy as possible! This includes:
            <List sx={{ mt: 1 }}>
              <ListPoint content="Active support, templates and guides for planning, writing, and releasing DC adventures." />
              <ListPoint content="A review team to help with proof reading, editing and quality control." />
              <ListPoint content="Marketing support, advertising in suitable communities, DMsGuild association." />
              <ListPoint content="A rich, pre-built wildspace to set your adventure in if you wish - lore, art and hooks to suit your adventure." />
              <ListPoint content="Commercial licence for professional stock art from Dean Spencer." />
              <ListPoint content="Commercial license to Forgotten Adventures assets (including for DungeonDraft)." />
            </List>
          </Typography>
          <Divider
            variant="middle"
            sx={{
              my: 0.6,
            }}
          />
          <Typography variant="h5" color="text.primary" sx={{ mt: 2, mb: 2, textAlign: "center" }}>
            Getting involved is simple! Just{" "}
            <a href="https://discord.gg/JDB6BYTK9T" target="_blank" rel="noreferrer">
              join our Discord
            </a>{" "}
            and grab yourself the <em>DungeonCraft Writer</em> role.
          </Typography>
          <Divider
            variant="middle"
            sx={{
              my: 0.6,
            }}
          />
        </Grid>
        <Grid item>
          <Divider
            variant="middle"
            sx={{
              my: 0.6,
            }}
          />
        </Grid>
        <Grid item>
          <img src="/img/TridenAdvert_v2_web.webp" alt="Tridenverse" className="MainBanner" />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default Tridenverse;
