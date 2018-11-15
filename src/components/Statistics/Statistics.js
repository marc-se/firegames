import React from "react";
import { Link } from "react-router";
import styled, { injectGlobal } from "styled-components";

import CountUp from "react-countup";
import firebase from "firebase/app";
import "firebase/database";
import { Layout, Row, Col, Card, Button } from "antd";

injectGlobal`
	.ant-card-body {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 200px;
	}
`;

const FireGamesWrapper = styled(Layout)`
	min-height: 100vh;
	background: #fcfcfc;
`;

const FireGamesCardBox = styled(Row)`
	margin-bottom: 60px;
`;

const FireGamesHead = styled(Row)`
	margin: 40px 0;
	text-align: center;
`;

const FireGamesLargeHeading = styled.h1`
	font-size: 32px;
	letter-spacing: 3px;
	text-transform: uppercase;
`;

const FireGamesCardWrapper = styled(Col)`
	padding: 15px;
	text-align: center;
	display: flex;
	justify-content: center;
	align-items: center;

	h3 {
		margin: 0;
		padding: 0;
		line-height: 18px;
		font-size: 18px;
	}

	span {
		font-size: 45px;
	}
`;

const FireGamesBar = styled.div`
	position: fixed;
	bottom: -5px;
	left: 0;
	background: #fff;
	padding: 10px 0 15px 0;
	width: 100vw;
	box-shadow: 0px -9px 14px -10px rgba(204, 204, 204, 0.31);
`;

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
			<FireGamesWrapper>
				<FireGamesHead>
					<Col span="24">
						<FireGamesLargeHeading>STATISTICS</FireGamesLargeHeading>
					</Col>
				</FireGamesHead>
				<FireGamesCardBox type="flex" justify="start">
					{sortedData.map((node, i) => {
						return (
							<FireGamesCardWrapper span="6" key={i}>
								<Card title={node.value.title} style={{ width: "80%" }}>
									<CountUp start={0} end={node.value.games} duration={3.0} />
								</Card>
							</FireGamesCardWrapper>
						);
					})}
				</FireGamesCardBox>
				<FireGamesBar>
					<Row type="flex" justify="start">
						<Col span="2" />
						<Col span="20">
							<Link to="/">
								<Button type="primary">Back</Button>
							</Link>
						</Col>
						<Col span="2" />
					</Row>
				</FireGamesBar>
			</FireGamesWrapper>
		);
	}
}
