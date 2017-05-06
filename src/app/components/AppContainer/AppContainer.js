import React from 'react';
import { connect } from 'react-redux';
import { Layout, Row, Col, BackTop, Button } from 'antd';
import SVGInline from 'react-svg-inline';
import { Link } from 'react-router';
import logo from '../../assets/logo.svg';
import * as firebase from 'firebase';

import Filter from '../Filter/Filter.js';
import SystemSelect from '../SystemSelect/SystemSelect.js';
import GamesTable from '../GamesTable/GamesTable.js';
import AddGame from '../AddGame/AddGame.js';
import AddSystem from '../AddSystem/AddSystem.js';
import Login from '../Login/Login.js';

import styles from './AppContainer.scss';

const { Header, Footer, Sider, Content } = Layout;

class AppContainer extends React.Component {
	static propTypes = {
		dispatch: React.PropTypes.func,
		loggedIn: React.PropTypes.bool,
	};

	render() {
		return firebase.auth().currentUser
			? <Layout className={styles.layout}>
					<Header className={styles.header}>
						<Row type="flex" justify="start">
							<Col span="8">
								<div className={styles.brand}><SVGInline svg={logo} /></div>
							</Col>
							<Col span="16" className={styles.rightHeaderColumn}>
								<Login renderLogout />
							</Col>
						</Row>
					</Header>
					<hr />
					<Layout className={styles.contentLayout}>
						<Sider className={styles.sider}>
							<div className={styles.sidebarWrapper}>
								<SystemSelect />
								<hr />
								<Filter />
							</div>
						</Sider>
						<Content className={styles.content}>
							<Row>
								<Col span={24} className={styles.contentColSpacing}>
									<AddGame buttonTitle="Add Game" />
									<AddSystem />
									<Link to="statistics">
										<Button type="primary" icon="bar-chart">Statistics</Button>
									</Link>
									<div className={styles.key}>🕹 = playing | ✅ = finished</div>
								</Col>
							</Row>
							<GamesTable />
						</Content>
					</Layout>
					<Footer className={styles.footer}>
						<Row>
							<Col span={6} className={styles.footerLeft}>
								FireGames | {new Date().getFullYear()}
							</Col>
							<Col span={12} />
							<Col span={6} className={styles.footerRight}>
								v1.0
							</Col>
						</Row>
					</Footer>
					<BackTop />
				</Layout>
			: <Login />;
	}
}

let component = AppContainer;

const mapStateToProps = state => {
	return {
		...state,
	};
};

component = connect(mapStateToProps)(component);

export default component;
