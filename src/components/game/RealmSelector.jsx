import { React } from "react";
import { useFormikContext } from "formik";
import { FormControl, FormHelperText, InputLabel } from "@mui/material";
import { Select, MenuItem, Divider } from "@mui/material";

export default function RealmSelector(props) {
  const { values, errors, handleChange } = useFormikContext();

  return (
    <FormControl fullWidth error={!!errors.realm}>
      <InputLabel>Realm</InputLabel>
      <Select id="realm" name="realm" value={values.realm} label="Realm" onChange={handleChange}>
        <MenuItem value={"Forgotten Realms"}>Forgotten Realms</MenuItem>
        <MenuItem value={"Eberron"}>Eberron</MenuItem>
        <MenuItem value={"Ravnica"}>Ravnica</MenuItem>
        <MenuItem value={"Misthunters"}>Misthunters</MenuItem>
        <MenuItem value={"Strixhaven"}>Strixhaven</MenuItem>
        <MenuItem value={"Wildemount"}>Wildemount</MenuItem>
        <Divider fullWidth />
        <MenuItem value={"Other setting"}>Other Setting</MenuItem>
      </Select>
      {!!errors.realm ? <FormHelperText>{errors.realm}</FormHelperText> : null}
    </FormControl>
  );
}
