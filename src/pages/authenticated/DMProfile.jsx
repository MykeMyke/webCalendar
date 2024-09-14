import React, { useState, useEffect } from "react";

import { Container, Typography, Divider, Box } from "@mui/material";
import { TextField, Button } from "@mui/material";

import { capitalise } from "../../utils/formatting";

import useAlertStore from "../../stores/useAlertStore";
import useUserStore from "../../stores/useUserStore";

import { getUserDMProfile, updateUserDMProfile } from "../../api/dm_profile";

export default function DMProfile() {
  const snackBar = useAlertStore((s) => s.setSuccess);
  const user = useUserStore((s) => s.user);

  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(true);
  const [profileExists, setProfileExists] = useState(false);
  const [dmName, setDMName] = useState("");
  const [dmDescription, setDMDescription] = useState("");
  const [dmRuleText, setDMRuleText] = useState("");
  const [dmMusterText, setDMMusterText] = useState("");

  useEffect(() => {
    if (!refresh) return;

    getUserDMProfile()
      .then((result) => {
        setProfileExists(true);
        setDMName(result.data.name);
        setDMDescription(result.data.description);
        setDMRuleText(result.data.rules_text);
        setDMMusterText(result.data.muster_text);
      })
      .finally(() => {
        setLoading(false);
        setRefresh(false);
      });
  }, [refresh]);

  const handleUpdate = () => {
    updateUserDMProfile({
      name: dmName !== "" ? dmName : `DM ${capitalise(user.username)}`,
      description: dmDescription,
      rules_text: dmRuleText,
      muster_text: dmMusterText,
    })
      .then(() => {
        snackBar("Updated DM profile");
      })
      .finally(() => {
        setRefresh(true);
      });
  };

  return (
    <Container>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "1em" }}>
        <Typography variant="h3">DM Profile Settings</Typography>
        <Divider />

        <TextField
          disabled={loading}
          value={dmName}
          onChange={(e) => setDMName(e.target.value)}
          placeholder="DM Delvemeister"
          label="DM Alias"
        />
        <TextField
          disabled={loading}
          value={dmDescription}
          onChange={(e) => setDMDescription(e.target.value)}
          placeholder="A brief description of yourself as a DM"
          label="Description"
          multiline
          rows={3}
        />
        <TextField
          disabled={loading}
          value={dmRuleText}
          onChange={(e) => setDMRuleText(e.target.value)}
          placeholder="Any rules you may wish to set for your games, you could for example demand all PC information is provided at least 24 hours before the game"
          label="Table Rules"
          multiline
          rows={4}
        />
        <TextField
          disabled={loading}
          value={dmMusterText}
          onChange={(e) => setDMMusterText(e.target.value)}
          placeholder="Specify the text that Unseen Servant will post at the top of your mustering channels"
          label="Mustering text"
          multiline
          rows={4}
        />

        <Button
          variant={profileExists ? "outlined" : "contained"}
          sx={{ width: "60%", margin: "auto" }}
          onClick={handleUpdate}
          disabled={loading}
        >
          {profileExists ? "Update" : "Create"}
        </Button>
        {!profileExists && (
          <React.Fragment>
            <Divider />
            <Typography variant="caption" sx={{ margin: "auto" }}>
              You have not yet created your DM profile, until you do you will be unable to create games
            </Typography>
            <Typography variant="caption" sx={{ margin: "auto" }}>
              The above fields are optional, you can just click create and Unseen Servant will build you a basic profile
            </Typography>
          </React.Fragment>
        )}
      </Box>
    </Container>
  );
}
