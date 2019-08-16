import React, { Component } from "react";
import { Button, Row } from "antd";
// @ts-ignore
import { connect } from "react-redux";
import { updateGlobalGamesStatusForSystems } from "../../utils/updateGlobalGamesStatusForSystems.js";

import * as SC from "./StyledComponents";

interface Props {
	selectedSystem?: string;
}

interface State {
	loading: boolean;
}

class SyncFilterStats extends Component<Props, State> {
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
		const { loading } = this.state;
		return (
			<Row type="flex">
				<SC.Container span={24}>
					Sync Filter Stats
					<Button icon="sync" size="small" loading={loading} onClick={this.handleSync}>
						Sync
					</Button>
				</SC.Container>
			</Row>
		);
	}
}

let component = SyncFilterStats;

const mapStateToProps = (state: State) => {
	return {
		...state
	};
};

component = connect(mapStateToProps)(component);

export default component;
