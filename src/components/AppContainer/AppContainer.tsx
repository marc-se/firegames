import React from "react";
import firebase from "firebase/app";
import "firebase/auth";
import { Redirect } from "react-router-dom";
// @ts-ignore
import { connect } from "react-redux";
import { Layout, Row, Col, BackTop, Button } from "antd";
import { Link } from "react-router-dom";

import { selectSystem } from "../../reducers/actions.js";

import Filter from "../Filter/Filter";
import SystemSelect from "../SystemSelect/SystemSelect";
import SyncFilterStats from "../SyncFilterStats/SyncFilterStats";
import GamesTable from "../GamesTable/GamesTable";
import AddGame from "../AddGame/AddGame";
import AddSystem from "../AddSystem/AddSystem";
import AddGenre from "../AddGenre/AddGenre";
import Head from "../Head/Head";
import Footer from "../Footer/Footer";

import * as SC from "./StyledComponents";

interface Props {
	selectedSystem?: string;
	dispatch?: any;
}

interface State {}

const AppContainer = (props: Props) => {
	const { selectedSystem } = props;
	const isAuthorized = firebase.auth().currentUser;

	const handleSystemChange = (e: string) => props.dispatch(selectSystem(e));

	if (isAuthorized) {
		return (
			<SC.Container>
				<Head />
				<Layout>
					<SC.Sidebar>
						<SC.SidebarContainer>
							<SystemSelect handleChange={handleSystemChange} />
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
									<Link to="wishlist">
										<Button type="primary" icon="heart">
											Wishlist
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
				<Footer />
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

// @ts-ignore
component = connect(mapStateToProps)(component);

export default component;
