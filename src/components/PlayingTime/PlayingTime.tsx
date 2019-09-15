import React, { Component } from "react";
import { Tooltip, Spin, Icon } from "antd";
// @ts-ignore
import { connect } from "react-redux";
// @ts-ignore
import { HowLongToBeatService } from "howlongtobeat";
import firebase from "firebase/app";
import "firebase/database";

interface State {
	hover: boolean;
	loading: boolean;
	playtime: string;
}

interface Props {
	title: string;
	gameId: string;
	selectedSystem?: string;
}

const Load = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class PlayingTime extends Component<Props, State> {
	state = {
		hover: false,
		loading: true,
		playtime: ""
	};

	async getPlaytime(term: string) {
		let hltbService = new HowLongToBeatService();
		let apiCallNeeded = true;
		const { selectedSystem, gameId } = this.props;
		const gameRef = firebase.database().ref(`games/${selectedSystem}/${gameId}`);
		gameRef.once("value", snap => {
			const game = snap.val();
			if (game.playtime) {
				apiCallNeeded = false;
				this.setState({ loading: false, playtime: `playtime: ~${game.playtime} h` });
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

					this.setState({ loading: false, playtime: `playtime: ~${result[0].gameplayMain} h` });
				} else {
					this.setState({ loading: false, playtime: "no data found" });
				}
			} catch (error) {
				this.setState({ loading: false, playtime: "playtime fetch failed" });
				console.error("fetch failed", error);
			}
		}
	}

	changeHover = () => {
		const { hover } = this.state;
		this.setState({ hover: !hover });
	};

	render() {
		const { hover, loading, playtime } = this.state;
		const { title } = this.props;

		if (hover && playtime === "") {
			this.getPlaytime(title);
		}

		return (
			<div onMouseEnter={this.changeHover}>
				<Tooltip placement="topLeft" title={loading ? <Spin indicator={Load} /> : `${playtime}`}>
					{title}
				</Tooltip>
			</div>
		);
	}
}

let component = PlayingTime;

const mapStateToProps = (state: State) => {
	return {
		...state
	};
};

component = connect(mapStateToProps)(component);

export default component;
