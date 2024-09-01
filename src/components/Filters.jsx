import React from "react";
import { useMemo, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Drawer,
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormLabel,
  TextField,
  Typography,
} from "@mui/material";
import { ChevronLeft } from "@mui/icons-material";
import useFilterStore from "../stores/useFilterStore";
import useUserStore from "../stores/useUserStore";

function TernaryFilter({ label, name, value, onChange }) {
  return (
    <FormControl sx={{ border: "1px solid lightgray", px: 1 }}>
      <FormLabel>
        <Typography variant="subtitle2">{label}</Typography>
      </FormLabel>
      <RadioGroup row aria-label="horizontal-radio-group" name={name} value={value} onChange={(evt) => onChange(evt.target.value)}>
        <FormControlLabel value={true} control={<Radio size="small" checked={value === true} />} label="Yes" />
        <FormControlLabel value={false} control={<Radio size="small" checked={value === false} />} label="No" />
        <FormControlLabel
          value={undefined}
          control={<Radio size="small" checked={value === null || value === undefined} />}
          label="Any"
        />
      </RadioGroup>
    </FormControl>
  );
}

function Filters() {
  const [open, setOpen] = useState(false);
  const user = useUserStore((s) => s.user);
  const [
    allTimeSlots,
    allDays,
    allRealms,
    allVariants,
    allTiers,
    sName,
    setName,
    slots,
    setSlots,
    days,
    setDays,
    realms,
    setRealms,
    variants,
    setVariants,
    tiers,
    setTiers,
    playTest,
    setPlayTest,
    streaming,
    setStreaming,
  ] = useFilterStore((s) => [
    s.allTimeSlots,
    s.allDays,
    s.allRealms,
    s.allVariants,
    s.allTiers,
    s.name,
    s.setName,
    s.slots,
    s.setSlots,
    s.days,
    s.setDays,
    s.realms,
    s.setRealms,
    s.variants,
    s.setVariants,
    s.tiers,
    s.setTiers,
    s.playTest,
    s.setPlayTest,
    s.streaming,
    s.setStreaming,
  ]);
  const name = useMemo(() => {
    return sName || "";
  }, [sName]);

  const dayStrings = useMemo(() => {
    return (allDays || []).map((slot) => slot.text);
  }, [allDays]);
  const timeStrings = useMemo(() => {
    return (allTimeSlots || []).map((slot) => slot.text);
  }, [allTimeSlots]);
  const { filterString, filterCount } = useMemo(() => {
    const fs = [];
    if (name?.length) {
      fs.push(`Name: ${name}`);
    }
    if (days?.length) {
      fs.push(
        `Days: ${days
          .sort()
          .map((day) => dayStrings[day])
          .join(", ")}`,
      );
    }
    if (slots?.length) {
      fs.push(
        `Start Time: ${slots
          .sort()
          .map((slot) => timeStrings[slot])
          .join(", ")}`,
      );
    }
    if (realms?.length) {
      fs.push(`Realm${realms.length == 1 ? "" : "s"}: ${realms.join(", ")}`);
    }
    if (variants?.length) {
      fs.push(`Type${variants.length == 1 ? "" : "s"}: ${variants.join(", ")}`);
    }
    if (tiers?.length) {
      fs.push(`Tier${tiers.length == 1 ? "" : "s"}: ${tiers.join(", ")}`);
    }
    if (playTest !== undefined) {
      fs.push(`Play Test? ${playTest ? "Yes" : "No"}`);
    }
    if (streaming !== undefined) {
      fs.push(`Streaming? ${streaming ? "Yes" : "No"}`);
    }

    return {
      filterString: fs.join(", "),
      filterCount: fs.length,
    };
  }, [name, days, slots, realms, variants, tiers, playTest, streaming]);

  const dayVals = useMemo(() => {
    return allDays.filter((day) => days.includes(day.value));
  }, [allDays, days]);

  const timeSlotVals = useMemo(() => {
    return allTimeSlots.filter((slot) => slots.includes(slot.value));
  }, [allTimeSlots, slots]);

  const realmVals = useMemo(() => {
    if (realms?.length) {
      return allRealms.filter((realm) => realms.includes(realm.value));
    }
    return [];
  }, [allRealms, realms]);
  const variantVals = useMemo(() => {
    if (variants?.length) {
      return allVariants.filter((vr) => variants.includes(vr.value));
    }
    return [];
  }, [allVariants, variants]);
  const tierVals = useMemo(() => {
    if (tiers?.length) {
      return allTiers.filter((vr) => tiers.includes(vr.value));
    }
    return [];
  }, [allTiers, tiers]);
  return (
    <>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "40px 100px 80px 1fr",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: 2,
          mb: 2,
          ml: 2,
          mr: 2,
        }}
      >
        <span>Filters:</span>
        <Button color="secondary" variant="contained" onClick={() => setOpen(!open)}>
          Edit{filterCount ? ` (${filterCount})` : ""}
        </Button>
        {filterString?.length ? (
          <>
            <Button
              color="secondary"
              variant="contained"
              onClick={() => {
                setName("");
                setDays([]);
                setSlots([]);
                setRealms([]);
                setVariants([]);
                setTiers([]);
                setPlayTest(undefined);
                setStreaming(undefined);
              }}
            >
              Clear
            </Button>
            <span class="desktopOnly">{filterString}</span>
          </>
        ) : null}
      </Box>
      <Drawer variant="temporary" BackdropProps={{ invisible: true }} open={open}>
        <Box
          sx={{
            paddingTop: "15px",
            maxWidth: "300px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            gap: 2,
            mx: 2,
          }}
        >
          <Box sx={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
            <Button color="secondary" variant="contained" onClick={() => setOpen(false)}>
              <ChevronLeft />
              Close Filters
            </Button>
          </Box>
          <TextField
            className="Name-Filter"
            id="nameFilter"
            label="Filter by Discord Name"
            helperText={
              <>
                Type Discord Name
                {user?.discord_name ? (
                  <>
                    {" "}
                    or
                    <Button
                      color="secondary"
                      size="small"
                      sx={{ ml: 2, height: "1.25rem", px: 2 }}
                      variant="contained"
                      onClick={() => setName(name === user.discord_name ? "" : user.discord_name)}
                    >
                      {name === user.discord_name ? "Clear" : "Me"}
                    </Button>
                  </>
                ) : null}
              </>
            }
            variant="outlined"
            size="small"
            margin="dense"
            value={name}
            onChange={(evt) => setName(evt.target.value)}
          />
          <Autocomplete
            multiple
            id="combo-box-days"
            options={allDays}
            getOptionLabel={(slot) => slot.text}
            getOptionKey={(slot) => slot.value}
            value={dayVals}
            onChange={(evt, value) => setDays(value.map((val) => val.value))}
            renderInput={(params) => <TextField {...params} label="Days" />}
          />
          <Autocomplete
            multiple
            id="combo-box-slots"
            options={allTimeSlots}
            getOptionLabel={(slot) => slot.text}
            getOptionKey={(slot) => slot.value}
            value={timeSlotVals}
            onChange={(evt, value) => setSlots(value.map((val) => val.value))}
            renderInput={(params) => <TextField {...params} label="Time Slots" />}
          />
          <Autocomplete
            multiple
            id="combo-box-realms"
            options={allRealms}
            getOptionLabel={(realm) => realm.text}
            getOptionKey={(realm) => realm.value}
            value={realmVals}
            onChange={(evt, value) => setRealms(value.map((val) => val.value))}
            renderInput={(params) => <TextField {...params} label="Realms" />}
          />
          <Autocomplete
            multiple
            id="combo-box-vars"
            options={allVariants}
            getOptionLabel={(variant) => variant.text}
            getOptionKey={(variant) => variant.value}
            value={variantVals}
            onChange={(evt, value) => setVariants(value.map((val) => val.value))}
            renderInput={(params) => <TextField {...params} label="Game Type" />}
          />
          <Autocomplete
            multiple
            id="combo-box-tiers"
            options={allTiers}
            getOptionLabel={(tier) => tier.text}
            getOptionKey={(tier) => tier.value}
            value={tierVals}
            onChange={(evt, value) => setTiers(value.map((val) => val.value))}
            renderInput={(params) => <TextField {...params} label="Tiers" />}
          />
          <TernaryFilter label="Play Test?" name="playTest" value={playTest} onChange={(val) => setPlayTest(val)} />
          <TernaryFilter label="Streaming?" name="streaming" value={streaming} onChange={(val) => setStreaming(val)} />
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => {
              setName("");
              setSlots([]);
              setRealms([]);
              setVariants([]);
              setTiers([]);
              setPlayTest(undefined);
              setStreaming(undefined);
            }}
          >
            Clear All
          </Button>
        </Box>
      </Drawer>
    </>
  );
}

export default Filters;
