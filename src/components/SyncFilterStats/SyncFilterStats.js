import React from "react";
import { Button, Row, Col } from "antd";
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

export default class SyncFilterStats extends React.Component {
	state = {
		loading: false,
		iconLoading: false
	};

	enterLoading = () => {
		this.setState({ loading: true });
	};

	enterIconLoading = () => {
		this.setState({ iconLoading: true });
	};

	render() {
		return (
			<Row type="flex">
				<Container span={24}>
					Sync Filter Stats
					<Button
						icon="sync"
						size="small"
						loading={this.state.iconLoading}
						onClick={this.enterIconLoading}
					>
						Sync
					</Button>
				</Container>
			</Row>
		);
	}
}
