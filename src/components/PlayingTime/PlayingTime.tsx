import React, { useState, useEffect } from "react";
import { Tooltip, Spin, Icon } from "antd";
import { connect } from "react-redux";
// @ts-ignore
import { HowLongToBeatService } from "howlongtobeat";
import firebase from "firebase/app";
import "firebase/database";

import { TimeIcon } from "./StyledComponents";

interface State {}

interface Props {
	title: string;
	gameId: string;
	selectedSystem?: string;
	time: number;
}

const Load = <Icon type="loading" style={{ fontSize: 24 }} spin />;

const PlayingTime = (props: Props) => {
	const [hover, setHover] = useState(false);
	const [loading, setLoading] = useState(true);
	const [playtime, setPlaytime] = useState("");

	const { time } = props;

	useEffect(() => {
		if (time > 0) {
			setLoading(false);
		}
	}, [props]);

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
						playtime: parseFloat(playtime)
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

	if (hover && time === 0) {
		getPlaytime(title);
	}

	return (
		<div onMouseEnter={changeHover}>
			<Tooltip
				placement="topLeft"
				title={
					loading ? <Spin indicator={Load} /> : `${time > 0 ? `playtime: ~${time} h` : playtime}`
				}
			>
				{title}
				{time > 0 && <TimeIcon type="history" />}
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

// @ts-ignore
component = connect(mapStateToProps)(component);

export default component;
