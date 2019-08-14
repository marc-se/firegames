import React from "react";
// @ts-ignore
import { connect } from "react-redux";
import { Layout, Row, Col, BackTop, Button } from "antd";
import { Link } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/auth";
import logo from "../../assets/logo.svg";

import Filter from "../Filter/Filter";
import SystemSelect from "../SystemSelect/SystemSelect";
import SyncFilterStats from "../SyncFilterStats/SyncFilterStats";
import GamesTable from "../GamesTable/GamesTable";
import AddGame from "../AddGame/AddGame";
import AddSystem from "../AddSystem/AddSystem";
import AddGenre from "../AddGenre/AddGenre";
import Login from "../Login/Login";

import * as SC from "./StyledComponents";

interface Props {
	selectedSystem: string;
	dispatch: any;
}

interface State {}

const AppContainer = (props: Props) => {
	const { selectedSystem } = props;
	return firebase.auth().currentUser ? (
		<SC.Container>
			<SC.Head>
				<Row type="flex" justify="start">
					<Col span={8}>
						<SC.Brand src={logo} />
					</Col>
					<Col span={16} className="rightHeaderColumn">
						<Login renderLogout />
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
						<SC.RightAlignText>v1.2.6</SC.RightAlignText>
					</Col>
				</Row>
			</SC.FooterContainer>
			<BackTop />
		</SC.Container>
	) : (
		<Login />
	);
};

let component = AppContainer;

const mapStateToProps = (state: State) => {
	return {
		...state
	};
};

component = connect(mapStateToProps)(component);

export default component;

//export default AppContainer;