import React from "react";
import { connect } from "react-redux";
import { Badge, Switch, Icon, Row, Col } from "antd";
import styled from "styled-components";
import firebase from "firebase/app";
import "firebase/database";

import { setPlayingFilter, setFinishedFilter, setUntouchedFilter } from "../../reducers/actions.js";
import { updateGlobalGamesStatusForSystems } from "../../utils/updateGlobalGamesStatusForSystems.js";

const FireGamesFilterWrapper = styled(Col)`
	padding: 5px 0;
	color: #292c33;
	align-items: center;
	display: flex !important;
	justify-content: space-between;
`;

const FireGamesItemGroup = styled.div`
	> span {
		margin-right: 10px;
	}
`;

class Filter extends React.Component {
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
				<FireGamesFilterWrapper span={24}>
					Playing
					<FireGamesItemGroup>
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
							unCheckedChildren={<Icon type="cross" />}
							onChange={value => this.handlePlayingFilter(value)}
							disabled={!showStatistics}
						/>
					</FireGamesItemGroup>
				</FireGamesFilterWrapper>
				<FireGamesFilterWrapper span={24}>
					Finished
					<FireGamesItemGroup>
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
							unCheckedChildren={<Icon type="cross" />}
							onChange={value => this.handleFinishedFilter(value)}
							disabled={!showStatistics}
						/>
					</FireGamesItemGroup>
				</FireGamesFilterWrapper>
				<FireGamesFilterWrapper span={24}>
					Untouched
					<FireGamesItemGroup>
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
							unCheckedChildren={<Icon type="cross" />}
							onChange={value => this.handleNeverPlayedFilter(value)}
							disabled={!showStatistics}
						/>
					</FireGamesItemGroup>
				</FireGamesFilterWrapper>
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
