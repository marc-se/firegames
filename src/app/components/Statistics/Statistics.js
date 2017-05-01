import React from 'react';
import { Link } from 'react-router';

import CountUp from 'react-countup';
import * as firebase from 'firebase';
import { Layout, Row, Col, Card, Button } from 'antd';

import styles from './Statistics.scss';

export default class Statistics extends React.Component {

	constructor() {
		super();

		this.state = {
			data: null,
		};
	}

	componentDidMount() {
		let systemsRef = firebase.database().ref('systems');

		let systems = [];

		systemsRef.once('value', snap => {
			let obj = snap.val();

			for(let system in obj) {
				const value = obj[system];
				systems.push({system, value});
			}
		}).then( () => {
			this.setState({
				data: systems,
			});
		});

	}

	render() {

		let data = this.state.data;
		let sortedData = [];
		if (data !== null) {
			sortedData = data.sort( (x, y) => y.value.games - x.value.games);
		}

		return (
			<Layout className={styles.layout}>
				<Row className={styles.head}>
					<Col span="24">
						<h1>STATISTICS</h1>
					</Col>
				</Row>
				<Row type="flex" justify="start">
					{
						sortedData.map( (node, i) => {
							return(
								<Col span="6" key={ i } className={styles.cardWrapper}>
									<Card title={node.value.title} style={{ width: '80%' }}>
										<CountUp start={0} end={ node.value.games } duration={3.0}/>
									</Card>
								</Col>
							);
						})
					}
				</Row>
				<div className={ styles.fixedBar }>
					<Row type="flex" justify="start">
						<Col span="2"/>
						<Col span="20">
							<Link to='/'>
								<Button>Back</Button>
							</Link>
						</Col>
						<Col span="2"/>
					</Row>
				</div>
			</Layout>
		);
	}
}
