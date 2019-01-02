import firebase from "firebase/app";
import "firebase/database";

export function updateGlobalGamesStatusForSystems(system, type, checked) {
	// TODO: update, how many games (in total) are in playing / finished / untouched state for each system

	const gamesRef = firebase.database().ref(`games/${system}`);
	const updateFile = firebase.database().ref(`systems/${system}`);

	// check whether it's necessary to fetch games
	if (type !== null && checked !== null) {
		let playingCount = 0;
		let finishedCount = 0;
		let untouchedCount = 0;
		systemRef
			.once("value", snap => {
				const data = snap.val();
				switch (type) {
					case "playing":
						if (checked) {
							playingCount = data.playing + 1;
						}
						break;
					case "finished":
						break;
					default:
				}
			})
			.then(res => {
				updateFile.update({
					playing: playingCount,
					finished: finishedCount,
					untouched: untouchedCount
				});
			});
	}

	gamesRef.on("value", snap => {
		let data = snap.val();
		let games = [];

		Object.keys(data).forEach(game => {
			// add key to object
			data[game].key = game;
			// push object to games list
			games.push(data[game]);
		});

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
