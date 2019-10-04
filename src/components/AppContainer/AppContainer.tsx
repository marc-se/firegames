import React from "react";
import firebase from "firebase/app";
import "firebase/auth";
import { Redirect } from "react-router-dom";
// @ts-ignore
import { connect } from "react-redux";
import { Layout, Row, Col, BackTop, Button } from "antd";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.svg";

import Filter from "../Filter/Filter";
import SystemSelect from "../SystemSelect/SystemSelect";
import SyncFilterStats from "../SyncFilterStats/SyncFilterStats";
import GamesTable from "../GamesTable/GamesTable";
import AddGame from "../AddGame/AddGame";
import AddSystem from "../AddSystem/AddSystem";
import AddGenre from "../AddGenre/AddGenre";
import Logout from "../Logout/Logout";

import * as SC from "./StyledComponents";

interface Props {
	selectedSystem: string;
	dispatch: any;
}

interface State {}

const AppContainer = (props: Props) => {
	const { selectedSystem } = props;
	const isAuthorized = firebase.auth().currentUser;

	if (isAuthorized) {
		return (
			<SC.Container>
				<SC.Head>
					<Row type="flex" justify="start">
						<Col span={8}>
							<SC.Brand src={logo} />
						</Col>
						<Col span={16} className="rightHeaderColumn">
							<Logout />
						</Col>
					</Row>
				</SC.Head>
				<SC.Separator />
				<Layout>
					<SC.Sidebar>
						<SC.SidebarContainer>
							<SystemSelect />
							<SC.Separator />
							<Filter />
							{selectedSystem !== "none" && (
								<React.Fragment>
									<SC.Separator />
									<SyncFilterStats />
								</React.Fragment>
							)}
						</SC.SidebarContainer>
					</SC.Sidebar>
					<SC.ContentContainer>
						<Row>
							<Col span={24}>
								<SC.InsideCol>
									<AddGame buttonTitle="Add Game" />
									<AddSystem />
									<AddGenre />
									<Link to="statistics">
										<Button type="primary" icon="bar-chart">
											Statistics
										</Button>
									</Link>
									<SC.Symbols>
										<span role="img" aria-label="Games with state: playing">
											🕹
										</span>
										= playing |{" "}
										<span role="img" aria-label="Games with state: finished">
											✅
										</span>
										= finished
									</SC.Symbols>
								</SC.InsideCol>
							</Col>
						</Row>
						<GamesTable />
					</SC.ContentContainer>
				</Layout>
				<SC.FooterContainer>
					<Row>
						<Col span={6}>FireGames | {new Date().getFullYear()}</Col>
						<Col span={12} />
						<Col span={6}>
							<SC.RightAlignText>v1.4.1</SC.RightAlignText>
						</Col>
					</Row>
				</SC.FooterContainer>
				<BackTop />
			</SC.Container>
		);
	}
	return <Redirect to="/" />;
};

let component = AppContainer;

const mapStateToProps = (state: State) => {
	return {
		...state
	};
};

component = connect(mapStateToProps)(component);

export default component;
