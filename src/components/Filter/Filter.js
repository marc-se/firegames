import React, { Component } from "react";
import { connect } from "react-redux";
import { Badge, Switch, Icon, Row } from "antd";
import firebase from "firebase/app";
import "firebase/database";

import * as SC from "./StyledComponents";

import { setPlayingFilter, setFinishedFilter, setUntouchedFilter } from "../../reducers/actions.js";
import { updateGlobalGamesStatusForSystems } from "../../utils/updateGlobalGamesStatusForSystems.js";

class Filter extends Component {
	state = {
		playing: 0,
		finished: 0,
		untouched: 0
	};

	componentDidUpdate(prevProps) {
		const { selectedSystem } = this.props;
		if (selectedSystem !== prevProps.selectedSystem && selectedSystem !== "none") {
			const systemRef = firebase.database().ref(`systems/${selectedSystem}`);

			systemRef.on("value", snap => {
				let data = snap.val();

				if (data.finished || data.untouched || data.playing) {
					this.setState({
						playing: data.playing,
						finished: data.finished,
						untouched: data.untouched
					});
				} else {
					updateGlobalGamesStatusForSystems(selectedSystem);
				}
			});
		} else if (selectedSystem !== prevProps.selectedSystem && selectedSystem === "none") {
			this.setState({
				playing: 0,
				finished: 0,
				untouched: 0
			});
		}
	}

	handlePlayingFilter(value) {
		this.props.dispatch(setPlayingFilter(value));
	}

	handleFinishedFilter(value) {
		this.props.dispatch(setFinishedFilter(value));
	}

	handleNeverPlayedFilter(value) {
		this.props.dispatch(setUntouchedFilter(value));
	}

	render() {
		const { playing, finished, untouched } = this.state;
		const { selectedSystem, showFinished, showPlaying, showUntouched } = this.props;
		const showStatistics = selectedSystem !== "none";

		return (
			<Row type="flex">
				<SC.Container span={24}>
					Playing
					<SC.ItemGroup>
						<Badge
							showZero={showStatistics ? true : false}
							count={playing}
							style={{
								backgroundColor: "#fff",
								color: "#999",
								boxShadow: "0 0 0 1px #d9d9d9 inset"
							}}
						/>
						<Switch
							checked={showPlaying}
							checkedChildren={<Icon type="check" />}
							unCheckedChildren={<Icon type="close" />}
							onChange={value => this.handlePlayingFilter(value)}
							disabled={!showStatistics}
						/>
					</SC.ItemGroup>
				</SC.Container>
				<SC.Container span={24}>
					Finished
					<SC.ItemGroup>
						<Badge
							showZero={showStatistics ? true : false}
							count={finished}
							style={{
								backgroundColor: "#fff",
								color: "#999",
								boxShadow: "0 0 0 1px #d9d9d9 inset"
							}}
						/>
						<Switch
							checked={showFinished}
							checkedChildren={<Icon type="check" />}
							unCheckedChildren={<Icon type="close" />}
							onChange={value => this.handleFinishedFilter(value)}
							disabled={!showStatistics}
						/>
					</SC.ItemGroup>
				</SC.Container>
				<SC.Container span={24}>
					Untouched
					<SC.ItemGroup>
						<Badge
							showZero={showStatistics ? true : false}
							count={untouched}
							style={{
								backgroundColor: "#fff",
								color: "#999",
								boxShadow: "0 0 0 1px #d9d9d9 inset"
							}}
						/>
						<Switch
							checked={showUntouched}
							checkedChildren={<Icon type="check" />}
							unCheckedChildren={<Icon type="close" />}
							onChange={value => this.handleNeverPlayedFilter(value)}
							disabled={!showStatistics}
						/>
					</SC.ItemGroup>
				</SC.Container>
			</Row>
		);
	}
}

let component = Filter;

const mapStateToProps = state => {
	return {
		...state
	};
};

component = connect(mapStateToProps)(component);

export default component;
