/* eslint-disable */
import {
	SELECT_SYSTEM,
	PLAYING_FILTER,
	FINISHED_FILTER,
	UNTOUCHED_FILTER,
	UPDATE_SYSTEMS,
	LOGGED_IN
} from "./actions.js";

const initialState = {
	selectedSystem: "none",
	filterType: "",
	showPlaying: false,
	showFinished: false,
	showUntouched: false,
	loggedIn: false,
	systems: []
};

export default function reducer(state = initialState, action = {}) {
	const patched = { ...state };

	switch (action.type) {
		case LOGGED_IN:
			patched.loggedIn = action.isLoggedIn;
			return patched;

		case SELECT_SYSTEM:
			patched.selectedSystem = action.system;
			return patched;

		case PLAYING_FILTER:
			patched.filterType = action.isSelected ? "PLAYING_FILTER" : "";
			patched.showPlaying = action.isSelected;
			patched.showFinished = false;
			patched.showUntouched = false;

			return patched;

		case FINISHED_FILTER:
			patched.filterType = action.isSelected ? "FINISHED_FILTER" : "";
			patched.showPlaying = false;
			patched.showFinished = action.isSelected;
			patched.showUntouched = false;

			return patched;

		case UNTOUCHED_FILTER:
			patched.filterType = action.isSelected ? "UNTOUCHED_FILTER" : "";
			patched.showPlaying = false;
			patched.showFinished = false;
			patched.showUntouched = action.isSelected;

			return patched;

		case UPDATE_SYSTEMS:
			if (action.systems.length > 0) {
				patched.systems = [...action.systems];
				return patched;
			} else {
				return patched;
			}

		default:
			return state;
	}
}
