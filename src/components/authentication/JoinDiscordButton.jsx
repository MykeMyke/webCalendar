import { Button } from "@mui/material";

export default function JoinDiscordButton({ children, ...props }) {
  return (
    <Button
      variant="contained"
      href="https://discord.gg/JDB6BYTK9T"
      target="_blank"
      rel="noreferrer"
      color="accent"
      sx={{
        width: "85px",
        py: 0.5,
        px: 0,
        lineHeight: "1.2",
        my: 1.5,
        textAlign: "center",
        fontSize: "0.65rem",
      }}
      className="HeaderButton"
      {...props}
    >
      {children || "Join our Discord"}
    </Button>
  );
}
