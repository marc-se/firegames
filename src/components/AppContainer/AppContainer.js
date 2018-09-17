import React from "react";
import { connect } from "react-redux";
import { Layout, Row, Col, BackTop, Button } from "antd";
import { Link } from "react-router";
import styled from "styled-components";
import logo from "../../assets/logo.svg";
import * as firebase from "firebase";

import Filter from "../Filter/Filter.js";
import SystemSelect from "../SystemSelect/SystemSelect.js";
import GamesTable from "../GamesTable/GamesTable.js";
import AddGame from "../AddGame/AddGame.js";
import AddSystem from "../AddSystem/AddSystem.js";
import Login from "../Login/Login.js";

const { Header, Footer, Sider, Content } = Layout;

const FireGamesLayout = styled(Layout)`
	min-height: 100vh;
	background: white !important;
`;

const SidebarWrapper = styled.div`
	padding: 10px;
`;

const FireGamesHeader = styled(Header)`
	background: white !important;
	height: 70px !important;
	.rightHeaderColumn {
		display: flex;
		flex-direction: row-reverse;
		align-items: center;
	}
`;

const Brand = styled.img`
	width: 225px;
`;

const FireGamesSidebar = styled(Sider)`
	background: white !important;
`;

const FireGamesContent = styled(Content)`
	background: white !important;
	padding: 30px;
	position: relative;
	border-left: 1px solid #ededed;
`;

const Separator = styled.hr`
	border-top: 1px solid #ededed;
	margin: 10px 1em;
`;

const FireGamesInsideCol = styled.div`
	padding-bottom: 15px;
	display: flex;
	align-items: center;
	button {
		margin-right: 10px;
	}
	span {
		font-size: 12px;
	}
`;

const FireGamesSymbols = styled.div`
	margin-left: 10px;
	color: #777;
`;

const FireGamesFooter = styled(Footer)`
	position: fixed;
	bottom: 0;
	left: 0;
	z-index: 1;
	background: #f7f7f7 !important;
	width: 100%;
	font-size: 12px !important;
`;

const RightAlignText = styled.span`
	text-align: right;
	display: block;
`;

class AppContainer extends React.Component {
	render() {
		return firebase.auth().currentUser ? (
			<FireGamesLayout>
				<FireGamesHeader>
					<Row type="flex" justify="start">
						<Col span={8}>
							<Brand src={logo} />
						</Col>
						<Col span={16} className="rightHeaderColumn">
							<Login renderLogout />
						</Col>
					</Row>
				</FireGamesHeader>
				<Separator />
				<Layout>
					<FireGamesSidebar>
						<SidebarWrapper>
							<SystemSelect />
							<Separator />
							<Filter />
						</SidebarWrapper>
					</FireGamesSidebar>
					<FireGamesContent>
						<Row>
							<Col span={24}>
								<FireGamesInsideCol>
									<AddGame buttonTitle="Add Game" />
									<AddSystem />
									<Link to="statistics">
										<Button type="primary" icon="bar-chart">
											Statistics
										</Button>
									</Link>
									<FireGamesSymbols>🕹 = playing | ✅ = finished</FireGamesSymbols>
								</FireGamesInsideCol>
							</Col>
						</Row>
						<GamesTable />
					</FireGamesContent>
				</Layout>
				<FireGamesFooter>
					<Row>
						<Col span={6}>FireGames | {new Date().getFullYear()}</Col>
						<Col span={12} />
						<Col span={6}>
							<RightAlignText>v1.1</RightAlignText>
						</Col>
					</Row>
				</FireGamesFooter>
				<BackTop />
			</FireGamesLayout>
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
