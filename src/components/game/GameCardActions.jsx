import React, { useState } from "react";

import { Button } from "@mui/material";

import { ReleaseDate } from "../../utils/releasedate";
import useUserStore from "../../stores/useUserStore";
import ConfirmDialog from "./ConfirmDialog";

export default function GameCardActions({
  id,
  is_dm,
  name,
  datetime_release,
  datetime_open_release,
  playing,
  standingBy,
  joinGame,
  isJoining,
  dropGame,
}) {
  const user = useUserStore((s) => s.user);
  const [showConfirm, setShowConfirm] = useState(false);
  const now = new Date();
  if (!user?.loggedIn) {
    return ReleaseDate(datetime_release, datetime_open_release);
  }

  const userAllowedJoin = () => {
    if (datetime_open_release.getTime() < now.getTime()) return true;
    else if (user.patreon && datetime_release?.getTime() < now.getTime()) return true;
    else if (user.resDM && datetime_release?.getTime() < now.getTime()) return true;
    return false;
  };

  if (!is_dm) {
    if (playing || standingBy) {
      return (
        <React.Fragment>
          <Button
            aria-describedby={`drop-${id}`}
            variant="outlined"
            disabled={isJoining}
            onClick={() => setShowConfirm(true)}
            size="small"
            sx={{ pt: 0.25, pb: 0, mt: 0.4, mb: 1.1, mr: 1 }}
            color="secondary"
          >
            Drop Now
          </Button>
          <ConfirmDialog
            open={showConfirm}
            onClose={() => setShowConfirm(false)}
            onConfirm={() => dropGame({ id, name })}
            gameName={name}
          />
        </React.Fragment>
      );
    }
    if (userAllowedJoin()) {
      return (
        <Button
          aria-describedby={`join-${id}`}
          variant="contained"
          disabled={isJoining}
          onClick={() => joinGame({ id, name })}
          size="small"
          sx={{ pt: 0.25, pb: 0, mt: 0.4, mb: 1.1, mr: 1 }}
          color="secondary"
        >
          Join Now
        </Button>
      );
    }
  }
  return ReleaseDate(datetime_release, datetime_open_release);
}
