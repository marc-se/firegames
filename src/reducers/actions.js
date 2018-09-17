/*
 * action types
 */
export const SELECT_SYSTEM = "SELECT_SYSTEM";
export const LOGGED_IN = "LOGGED_IN";

export const PLAYING_FILTER = "PLAYING_FILTER";
export const FINISHED_FILTER = "FINISHED_FILTER";
export const UNTOUCHED_FILTER = "UNTOUCHED_FILTER";

export const UPDATE_SYSTEMS = "UPDATE_SYSTEMS";

/*
 * action creators
 */
export function selectSystem(system) {
  return { type: SELECT_SYSTEM, system };
}

export function loggedIn(isLoggedIn) {
  return { type: LOGGED_IN, isLoggedIn };
}

export function setPlayingFilter(isSelected) {
  return { type: PLAYING_FILTER, isSelected };
}

export function setFinishedFilter(isSelected) {
  return { type: FINISHED_FILTER, isSelected };
}

export function setUntouchedFilter(isSelected) {
  return { type: UNTOUCHED_FILTER, isSelected };
}

export function updateSystems(systems) {
  return { type: UPDATE_SYSTEMS, systems };
}
