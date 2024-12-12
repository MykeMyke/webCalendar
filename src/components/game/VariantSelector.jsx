import { React } from "react";
import { useFormikContext } from "formik";
import { FormControl, FormHelperText, InputLabel } from "@mui/material";
import { Select, MenuItem, Divider } from "@mui/material";

import useUserStore from "../../stores/useUserStore";

export default function VariantSelector(props) {
  const { values, errors, handleChange } = useFormikContext();
  const { user } = useUserStore();

  console.log(user);

  return (
    <FormControl fullWidth error={!!errors.variant}>
      <InputLabel>Game Variant</InputLabel>
      <Select id="variant" name="variant" value={values.variant} label="Game Variant" onChange={handleChange}>
        <MenuItem value={"Resident AL"}>Resident Adventurer's League</MenuItem>
        <MenuItem value={"Guest AL DM"}>Community DM Adventurer's League</MenuItem>
        <Divider fullWidth />
        <MenuItem value={"Epic AL"}>Epic Adventurers League</MenuItem>
        <MenuItem value={"Non-AL One Shot"}>Non-AL One Shot</MenuItem>
        <MenuItem value={"Campaign"}>Campaign</MenuItem>
      </Select>
      {!!errors.realm ? <FormHelperText>{errors.variant}</FormHelperText> : null}
    </FormControl>
  );
}
