import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CountUp from "react-countup";
import firebase from "firebase/app";
import "firebase/database";
import { Row, Col, Card, Button } from "antd";

import { System } from "../../types/firebase";

import * as SC from "./StyledComponents";

interface StatObj {
	system: string;
	value: System;
}

const Statistics = () => {
	const [systems, setSystems] = useState([] as Array<StatObj>);

	async function fetchSystems() {
		let systems: Array<StatObj> = [];
		try {
			const systemsRef = await firebase.database().ref("systems");
			const snapshot = await systemsRef.once("value");
			const obj = snapshot.val();
			for (let system in obj) {
				const value = obj[system];
				systems.push({ system, value });
			}
			setSystems(systems);
		} catch (error) {
			console.error(error);
		}
	}

	useEffect(() => {
		fetchSystems();
	}, []);

	let sortedData: Array<StatObj> = [];
	if (systems.length > 0) {
		// @ts-ignore
		sortedData = systems.sort((x, y) => y.value.games - x.value.games);
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
};

export default Statistics;
