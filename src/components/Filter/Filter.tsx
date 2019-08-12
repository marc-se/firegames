import React, { Component } from "react";
// @ts-ignore
import { connect } from "react-redux";
import { Badge, Switch, Icon, Row } from "antd";
import firebase from "firebase/app";
import "firebase/database";

import * as SC from "./StyledComponents";

import { setPlayingFilter, setFinishedFilter, setUntouchedFilter } from "../../reducers/actions.js";
import { updateGlobalGamesStatusForSystems } from "../../utils/updateGlobalGamesStatusForSystems.js";

interface Props {
	selectedSystem?: string;
	dispatch?: any;
	showFinished?: boolean;
	showPlaying?: boolean;
	showUntouched?: boolean;
}

interface State {
	playing: number;
	finished: number;
	untouched: number;
}

class Filter extends Component<Props, State> {
	state = {
		playing: 0,
		finished: 0,
		untouched: 0
	};

	componentDidUpdate(prevProps: Props) {
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

	handlePlayingFilter = (e: boolean) => {
		this.props.dispatch(setPlayingFilter(e));
	};

	handleFinishedFilter = (e: boolean) => {
		this.props.dispatch(setFinishedFilter(e));
	};

	handleNeverPlayedFilter = (e: boolean) => {
		this.props.dispatch(setUntouchedFilter(e));
	};

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
							onChange={this.handlePlayingFilter}
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
							onChange={this.handleFinishedFilter}
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
							onChange={this.handleNeverPlayedFilter}
							disabled={!showStatistics}
						/>
					</SC.ItemGroup>
				</SC.Container>
			</Row>
		);
	}
}

let component = Filter;

const mapStateToProps = (state: State) => {
	return {
		...state
	};
};

component = connect(mapStateToProps)(component);

export default component;
