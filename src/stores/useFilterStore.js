import { create } from "zustand";
import { persist } from "zustand/middleware";

// the prefix serves as a namespace so we will not delete other keys, unless they pick this name
// leave this the same unless you have a reason to change this
const SHOW_KEY_PREFIX = "_tridenCalendarZFilter_";

const realms = [
  { value: "Forgotten Realms", text: "Forgotten Realms" },
  { value: "Eberron", text: "Eberron" },
  { value: "Ravnica", text: "Ravnica" },
  { value: "Misthunters", text: "Misthunters" },
  { value: "Strixhaven", text: "Strixhaven" },
  { value: "Wildemount", text: "Wildemount" },
  { value: "Other Setting", text: "Other Setting" },
];

const variants = [
  { value: "Resident AL", text: "Resident Adventurer's League" },
  { value: "Guest AL DM", text: "Community DM Adventurer's League" },
  { value: "Epic AL", text: "Epic Adventurers League" },
  { value: "Non-AL One Shot", text: "Non-AL One Shot" },
  { value: "Campaign", text: "Campaign" },
];

const timeSlots = [
  { value: 0, text: "Midnight-4AM" },
  { value: 1, text: "4AM-8AM" },
  { value: 2, text: "8AM-Noon" },
  { value: 3, text: "Noon-4PM" },
  { value: 4, text: "4PM-8PM" },
  { value: 5, text: "8PM-Midnight" },
];

const days = [
  { value: 0, text: "Sunday" },
  { value: 1, text: "Monday" },
  { value: 2, text: "Tuesday" },
  { value: 3, text: "Wednesday" },
  { value: 4, text: "Thursday" },
  { value: 5, text: "Friday" },
  { value: 6, text: "Saturday" },
];

const tiers = [
  { value: 1, text: "1" },
  { value: 2, text: "2" },
  { value: 3, text: "3" },
  { value: 4, text: "4" },
];

const tierMap = new Map();
tierMap.set(1, { min: 1, max: 4 });
tierMap.set(2, { min: 5, max: 10 });
tierMap.set(3, { min: 11, max: 16 });
tierMap.set(4, { min: 17, max: 20 });

function variantFilterFn(gameData, variants) {
  return variants?.length ? variants.includes(gameData.variant) : true;
}

function realmFilterFn(gameData, realms) {
  return realms?.length ? realms.includes(gameData.realm) : true;
}

function playTestFilterFn(gameData, pt) {
  return pt === undefined ? true : gameData.play_test === pt;
}

function streamingFilterFn(gameData, st) {
  return st === undefined ? true : gameData.streaming === st;
}

function slotFilterFn(gameData, slots) {
  return slots.length === 0 || slots.some((s) => s === gameData.slot);
}

function dayFilterFn(gameData, days) {
  return days.length === 0 || days.some((s) => s === gameData.day);
}

function nameFilterFn(gameData, activeName) {
  return activeName
    ? (gameData.players &&
        gameData.players.some(
          (player) =>
            player &&
            ((player.discord_name && player.discord_name.toLocaleLowerCase().includes(activeName.toLocaleLowerCase())) ||
              (player.discord_id && player.discord_id.toString().toLocaleLowerCase() === activeName.toLocaleLowerCase())),
        )) ||
        (gameData.standby &&
          gameData.standby.some(
            (player) =>
              player &&
              ((player.discord_name && player.discord_name.toLocaleLowerCase().includes(activeName.toLocaleLowerCase())) ||
                (player.discord_id && player.discord_id.toString().toLocaleLowerCase() === activeName.toLocaleLowerCase())),
          )) ||
        (gameData.dm_name && gameData.dm_name.toLocaleLowerCase().includes(activeName.toLocaleLowerCase()))
    : true;
}

function filterGames(data, activeName, day, slot, realms, variants, tiers, playTests, streaming) {
  if (
    day?.length > 0 ||
    slot?.length > 0 ||
    activeName?.length > 0 ||
    realms?.length > 0 ||
    variants?.length > 0 ||
    tiers?.length > 0
  ) {
    //tier fn is odd, becuse we have games that can span ranges, and people can seelct multiple different tiers
    //would be nice to have a jest test setup, but logic is if:
    // 1) game min >= tier min AND
    // 2) game min < next tier up's min
    // then it qualifies.  we also loop through tiers so somebody could pick tiers 2,4 if they had the itching
    let tierFn;
    if (tiers?.length) {
      tierFn = (gameData) => {
        return tiers.some((t) => {
          return gameData.level_min >= tierMap.get(t).min && (t === 4 || gameData.level_min < tierMap.get(t + 1).min);
        });
      };
    } else {
      tierFn = () => true;
    }

    return data.filter((gameData) => {
      return (
        slotFilterFn(gameData, slot) &&
        dayFilterFn(gameData, day) &&
        nameFilterFn(gameData, activeName) &&
        realmFilterFn(gameData, realms) &&
        variantFilterFn(gameData, variants) &&
        tierFn(gameData) &&
        playTestFilterFn(gameData, playTests === undefined ? playTests : playTests) &&
        streamingFilterFn(gameData, streaming === undefined ? streaming : streaming)
      );
    });
  } else {
    return data;
  }
}

const useFilterStore = create(
  persist(
    (set, get) => ({
      allRealms: realms,
      realms: [],
      setRealms: (rea) => set({ realms: rea }),
      allTimeSlots: timeSlots,
      slots: [],
      setSlots: (sl) => set({ slots: sl }),
      allDays: days,
      days: [],
      setDays: (dys) => set({ days: dys }),
      name: undefined,
      setName: (nm) => set({ name: nm }),
      allVariants: variants,
      variants: [],
      setVariants: (vr) => set({ variants: vr }),
      allTiers: tiers,
      tiers: [],
      setTiers: (tr) => set({ tiers: tr }),
      playTest: undefined,
      setPlayTest: (pt) => set({ playTest: pt === "" || pt === undefined ? undefined : pt === "true" }),
      streaming: undefined,
      setStreaming: (st) => set({ streaming: st === "" || st === undefined ? undefined : st === "true" }),
      filter: (games) =>
        filterGames(
          games,
          get().name,
          get().days,
          get().slots,
          get().realms,
          get().variants,
          get().tiers,
          get().playTest,
          get().streaming,
        ),
    }),
    {
      name: SHOW_KEY_PREFIX,
      partialize: (state) => Object.fromEntries(Object.entries(state).filter(([key]) => !key.startsWith("all") && key != "filter")),
    },
  ),
);

export default useFilterStore;
