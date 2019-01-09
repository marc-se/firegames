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
	static getDerivedStateFromProps(props, state) {
		const { selectedSystem } = props;
		let statisticsAvailable = false;

		if (selectedSystem !== "none") {
			const systemRef = firebase.database().ref(`systems/${selectedSystem}`);

			systemRef
				.once("value", snap => {
					let data = snap.val();

					statisticsAvailable = data.finished || data.untouched || data.playing ? true : false;
				})
				.then(res => {
					if (!statisticsAvailable) {
						updateGlobalGamesStatusForSystems(selectedSystem);
					}
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
		return (
			<Row type="flex">
				<FireGamesFilterWrapper span={24}>
					Playing
					<Switch
						checked={this.props.showPlaying}
						checkedChildren={<Icon type="check" />}
						unCheckedChildren={<Icon type="cross" />}
						onChange={value => this.handlePlayingFilter(value)}
					/>
				</FireGamesFilterWrapper>
				<FireGamesFilterWrapper span={24}>
					Finished
					<Switch
						checked={this.props.showFinished}
						checkedChildren={<Icon type="check" />}
						unCheckedChildren={<Icon type="cross" />}
						onChange={value => this.handleFinishedFilter(value)}
					/>
				</FireGamesFilterWrapper>
				<FireGamesFilterWrapper span={24}>
					Untouched
					<Switch
						checked={this.props.showUntouched}
						checkedChildren={<Icon type="check" />}
						unCheckedChildren={<Icon type="cross" />}
						onChange={value => this.handleNeverPlayedFilter(value)}
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
