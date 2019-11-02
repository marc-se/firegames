import React, { useState } from "react";
import { Tooltip, Spin, Icon } from "antd";
// @ts-ignore
import { connect } from "react-redux";
// @ts-ignore
import { HowLongToBeatService } from "howlongtobeat";
import firebase from "firebase/app";
import "firebase/database";

interface State {}

interface Props {
	title: string;
	gameId: string;
	selectedSystem?: string;
}

const Load = <Icon type="loading" style={{ fontSize: 24 }} spin />;

const PlayingTime = (props: Props) => {
	const [hover, setHover] = useState(false);
	const [loading, setLoading] = useState(true);
	const [playtime, setPlaytime] = useState("");

	async function getPlaytime(term: string) {
		let hltbService = new HowLongToBeatService();
		let apiCallNeeded = true;
		const { selectedSystem, gameId } = props;
		const gameRef = firebase.database().ref(`games/${selectedSystem}/${gameId}`);
		gameRef.once("value", snap => {
			const game = snap.val();
			if (game.playtime) {
				apiCallNeeded = false;
				setLoading(false);
				setPlaytime(`playtime: ~${game.playtime} h`);
			}
		});

		if (apiCallNeeded) {
			try {
				const result = await hltbService.search(term);
				if (result && result[0] && result[0].gameplayMain) {
					const playtime = result[0].gameplayMain;

					gameRef.update({
						playtime: playtime
					});

					setLoading(false);
					setPlaytime(`playtime: ~${result[0].gameplayMain} h`);
				} else {
					setLoading(false);
					setPlaytime("no data found");
				}
			} catch (error) {
				setLoading(false);
				setPlaytime("playtime fetch failed");
				console.error("fetch failed", error);
			}
		}
	}

	const changeHover = () => {
		setHover(!hover);
	};

	const { title } = props;

	if (hover && playtime === "") {
		getPlaytime(title);
	}

	return (
		<div onMouseEnter={changeHover}>
			<Tooltip placement="topLeft" title={loading ? <Spin indicator={Load} /> : `${playtime}`}>
				{title}
			</Tooltip>
		</div>
	);
};

let component = PlayingTime;

const mapStateToProps = (state: State) => {
	return {
		...state
	};
};

component = connect(mapStateToProps)(component);

export default component;
