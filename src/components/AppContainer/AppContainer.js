import React from "react";
import { connect } from "react-redux";
import { Layout, Row, Col, BackTop, Button } from "antd";
import { Link } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/auth";
import logo from "../../assets/logo.svg";

import Filter from "../Filter/Filter.js";
import SystemSelect from "../SystemSelect/SystemSelect.js";
import SyncFilterStats from "../SyncFilterStats/SyncFilterStats.js";
import GamesTable from "../GamesTable/GamesTable.js";
import AddGame from "../AddGame/AddGame.js";
import AddSystem from "../AddSystem/AddSystem.js";
import AddGenre from "../AddGenre/AddGenre.js";
import Login from "../Login/Login.js";

import * as SC from "./StyledComponents";

class AppContainer extends React.Component {
	render() {
		const { selectedSystem } = this.props;
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
							<SC.RightAlignText>v1.2.5</SC.RightAlignText>
						</Col>
					</Row>
				</SC.FooterContainer>
				<BackTop />
			</SC.Container>
		) : (
			<Login />
		);
	}
}

let component = AppContainer;

const mapStateToProps = state => {
	return {
		...state
	};
};

component = connect(mapStateToProps)(component);

export default component;
