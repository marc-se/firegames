import React from "react";
import { connect } from "react-redux";
import { Switch, Icon, Row, Col } from "antd";
import styled from "styled-components";
import firebase from "firebase/app";
import "firebase/database";
import { setPlayingFilter, setFinishedFilter, setUntouchedFilter } from "../../reducers/actions.js";
import { updateGlobalGamesStatusForSystems } from "../../utils/updateGlobalGamesStatusForSystems.js";

const FireGamesFilterWrapper = styled(Col)`
	padding: 5px 0;
	color: #292c33;
	font-weight: 300;
	display: flex !important;
	justify-content: space-between;
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
			let statisticsAvailable = false;
			let playingCount = 0;
			let finishedCount = 0;
			let untouchedCount = 0;

			const systemRef = firebase.database().ref(`systems/${selectedSystem}`);

			systemRef
				.once("value", snap => {
					let data = snap.val();

					if (data.finished || data.untouched || data.playing) {
						statisticsAvailable = true;
						playingCount = data.playing;
						finishedCount = data.finished;
						untouchedCount = data.untouched;
					}
				})
				.then(res => {
					if (!statisticsAvailable) {
						updateGlobalGamesStatusForSystems(selectedSystem);
					}

					this.setState({
						playing: playingCount,
						finished: finishedCount,
						untouched: untouchedCount
					});
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
					Playing {showStatistics && `(${playing})`}
					<Switch
						checked={showPlaying}
						checkedChildren={<Icon type="check" />}
						unCheckedChildren={<Icon type="cross" />}
						onChange={value => this.handlePlayingFilter(value)}
						disabled={!showStatistics}
					/>
				</FireGamesFilterWrapper>
				<FireGamesFilterWrapper span={24}>
					Finished {showStatistics && `(${finished})`}
					<Switch
						checked={showFinished}
						checkedChildren={<Icon type="check" />}
						unCheckedChildren={<Icon type="cross" />}
						onChange={value => this.handleFinishedFilter(value)}
						disabled={!showStatistics}
					/>
				</FireGamesFilterWrapper>
				<FireGamesFilterWrapper span={24}>
					Untouched {showStatistics && `(${untouched})`}
					<Switch
						checked={showUntouched}
						checkedChildren={<Icon type="check" />}
						unCheckedChildren={<Icon type="cross" />}
						onChange={value => this.handleNeverPlayedFilter(value)}
						disabled={!showStatistics}
					/>
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
