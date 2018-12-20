import firebase from "firebase/app";
import "firebase/database";

export function updateGlobalGamesStatusForSystems(system) {
	// TODO: update, how many games (in total) are in playing / finished / untouched state for each system

	const gamesRef = firebase.database().ref(`games/${system}`);

	gamesRef.on("value", snap => {
		let data = snap.val();
		let games = [];

		Object.keys(data).forEach(game => {
			// add key to object
			data[game].key = game;
			// push object to games list
			games.push(data[game]);
		});

		const updateFile = firebase.database().ref(`systems/${system}`);

		const playingCount = games.filter(game => game.playing === true).length;
		const finishedCount = games.filter(game => game.finished === true).length;
		const untouchedCount = games.filter(game => !game.playing && !game.finished).length;

		console.log("playingCount", playingCount);
		console.log("finishedCount", finishedCount);
		console.log("untouchedCount", untouchedCount);

		updateFile.update({
			playing: playingCount,
			finished: finishedCount,
			untouched: untouchedCount
		});
	});
}
