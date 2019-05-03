import React from "react";
import { Button, Row, Col } from "antd";
import { connect } from "react-redux";
import styled from "styled-components";
import firebase from "firebase/app";
import "firebase/database";
import { updateGlobalGamesStatusForSystems } from "../../utils/updateGlobalGamesStatusForSystems.js";

const Container = styled(Col)`
	padding: 5px 0;
	color: #292c33;
	display: flex !important;
	align-items: center;
	justify-content: space-between;
`;

class SyncFilterStats extends React.Component {
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
				<Container span={24}>
					Sync Filter Stats
					<Button icon="sync" size="small" loading={this.state.loading} onClick={this.handleSync}>
						Sync
					</Button>
				</Container>
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
