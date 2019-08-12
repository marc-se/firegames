import React, { Component } from "react";
import { Button, Row } from "antd";
import { connect } from "react-redux";
import { updateGlobalGamesStatusForSystems } from "../../utils/updateGlobalGamesStatusForSystems.js";

import * as SC from "./StyledComponents";

class SyncFilterStats extends Component {
	state = {
		loading: false
	};

	handleSync = () => {
		const { selectedSystem } = this.props;
		this.setState({ loading: true }, () => {
			setTimeout(() => this.setState({ loading: false }), 1000);
			updateGlobalGamesStatusForSystems(selectedSystem);
		});
	};

	render() {
		return (
			<Row type="flex">
				<SC.Container span={24}>
					Sync Filter Stats
					<Button icon="sync" size="small" loading={this.state.loading} onClick={this.handleSync}>
						Sync
					</Button>
				</SC.Container>
			</Row>
		);
	}
}

let component = SyncFilterStats;

const mapStateToProps = state => {
	return {
		...state
	};
};

component = connect(mapStateToProps)(component);

export default component;
