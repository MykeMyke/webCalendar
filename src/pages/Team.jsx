import React from "react";
import { Typography } from "@mui/material";
// import Stafflogo from "../img/Resident-DMs.png";
import "../styles/Global.css";
import ResDmBio from "../components/resDMbioCard";
import { resDMbios } from "../data/resDMbios";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Staff from "../components/staffCards";
import { staff } from "../data/staff";

function Team() {
  return (
    <React.Fragment>
      <Stack spacing={1} sx={{ mb: 3 }}>
        <div className="centraliser">
          <div></div>
          <div>
            {/* <img
              src={Stafflogo}
              alt="Triden Games Staff"
              className="header-art"
            /> */}
            <Typography variant="h2" sx={{ my: 1, textAlign: "center" }}>
              Council Members
            </Typography>
          </div>
          <div></div>
        </div>
        <Typography variant="body" color="text.primary" sx={{ px: 3, maxWidth: "1080px", alignSelf: "center" }}>
          The Council of Triden Games is made up of veterans of the community that help each of their functions run smoothly for our
          members. They give everybody the best possible experience by empowering and advising members in their respective areas -
          whatever you need, they can help you out!
        </Typography>
        <Divider variant="middle" sx={{ py: 1 }} />
        <div className="centraliser">
          <div></div>
          <div className="masonry-staff">
            {staff.map((staffInfo) => (
              <Staff {...staffInfo} key={`bio_${staffInfo.name}`} />
            ))}
          </div>
          <div></div>
        </div>
        <Divider variant="middle" sx={{ py: 1 }} />
      </Stack>
      <Stack spacing={1}>
        <div className="centraliser">
          <div></div>
          <div>
            <img src="/img/Resident-DMs.png" alt="Triden Games Resident DMs" className="header-art" />
          </div>
          <div></div>
        </div>
        <Typography variant="body" color="text.primary" sx={{ px: 3, maxWidth: "1080px", alignSelf: "center" }}>
          The Resident DMs are a dedicated group from all around the world who each month run a pre-released schedule of
          Adventurer's League games. These games are run in all timezones and feature some of the best production value, toolsets
          and streamlining around.
        </Typography>
        <div className="centraliser">
          <div></div>
          <div className="map">
            <iframe
              title="team-map"
              frameborder="0"
              src="https://www.google.com/maps/d/u/0/embed?mid=1rbWNqRKfRhxPgqz_X5VFFTSdJDnrBeE&ehbc=2E312F&zoom=2"
              width="1080"
              height="480"
            ></iframe>
          </div>
          <div></div>
        </div>
      </Stack>
      <Divider variant="middle" sx={{ my: 3 }} />
      <div className="centraliser">
        <div></div>
        <div className="masonry-resDM">
          {resDMbios.map((resDMinfo) => (
            <ResDmBio {...resDMinfo} key={`bio_${resDMinfo.name}`} />
          ))}
        </div>
        <div></div>
      </div>
    </React.Fragment>
  );
}

export default Team;
