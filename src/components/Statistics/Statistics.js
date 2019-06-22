import React from "react";
import { Link } from "react-router";
import CountUp from "react-countup";
import firebase from "firebase/app";
import "firebase/database";
import { Row, Col, Card, Button } from "antd";

import * as SC from "./StyledComponents";

export default class Statistics extends React.Component {
	constructor() {
		super();

		this.state = {
			data: null
		};
	}

	componentDidMount() {
		let systemsRef = firebase.database().ref("systems");

		let systems = [];

		systemsRef
			.once("value", snap => {
				let obj = snap.val();

				for (let system in obj) {
					const value = obj[system];
					systems.push({ system, value });
				}
			})
			.then(() => {
				this.setState({
					data: systems
				});
			});
	}

	render() {
		let data = this.state.data;
		let sortedData = [];
		if (data !== null) {
			sortedData = data.sort((x, y) => y.value.games - x.value.games);
		}

		return (
			<SC.Container>
				<SC.GlobalStyle />
				<SC.Head>
					<Col span={24}>
						<SC.LargeHeading>STATISTICS</SC.LargeHeading>
					</Col>
				</SC.Head>
				<SC.CardContainer>
					{sortedData.map((node, i) => {
						return (
							<SC.CardHolder span={6} key={i}>
								<Card title={node.value.title} style={{ width: "80%" }}>
									<CountUp start={0} end={node.value.games} duration={3.0} />
								</Card>
							</SC.CardHolder>
						);
					})}
				</SC.CardContainer>
				<SC.Bar>
					<Row type="flex" justify="start">
						<Col span={2} />
						<Col span={20}>
							<Link to="/">
								<Button type="primary">Back</Button>
							</Link>
						</Col>
						<Col span={2} />
					</Row>
				</SC.Bar>
			</SC.Container>
		);
	}
}
