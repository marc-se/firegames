import firebase from "firebase/app";
import "firebase/database";

export function updateGlobalGamesStatusForSystems(system, type, gameObj) {
	const gamesRef = firebase.database().ref(`games/${system}`);
	const systemRef = firebase.database().ref(`systems/${system}`);

	// check whether it's necessary to fetch games
	if (type && gameObj) {
		let playingCount = 0;
		let finishedCount = 0;
		let untouchedCount = 0;

		systemRef
			.once("value", snap => {
				const data = snap.val();
				switch (type) {
					case "playing":
						finishedCount = data.finished;
						playingCount = gameObj.playing ? data.playing - 1 : data.playing + 1;
						untouchedCount =
							gameObj.playing && !gameObj.finished ? data.untouched + 1 : data.untouched - 1;
						break;
					case "finished":
						finishedCount = gameObj.finished ? data.finished - 1 : data.finished + 1;
						playingCount = data.playing;
						untouchedCount =
							!gameObj.playing && gameObj.finished ? data.untouched + 1 : data.untouched - 1;
						break;
					default:
				}
			})
			.then(res => {
				systemRef.update({
					playing: playingCount,
					finished: finishedCount,
					untouched: untouchedCount
				});
			});
	} else {
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

			systemRef.update({
				playing: playingCount,
				finished: finishedCount,
				untouched: untouchedCount
			});
		});
	}
}
