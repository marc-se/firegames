import React, { Fragment, useState, useEffect } from "react";
import CountUp from "react-countup";
import firebase from "firebase/app";
import "firebase/database";
import { Card } from "antd";

import Footer from "../Footer/Footer";
import Head from "../Head/Head";

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
		<Fragment>
			<Head />
			<SC.Container>
				<SC.GlobalStyle />
				<SC.CardContainer>
					{sortedData.map((node, i) => {
						return (
							<SC.CardHolder span={4} key={i}>
								<Card title={node.value.title} style={{ width: "80%" }}>
									<CountUp start={0} end={node.value.games} duration={3.0} />
								</Card>
							</SC.CardHolder>
						);
					})}
				</SC.CardContainer>
				<Footer />
			</SC.Container>
		</Fragment>
	);
};

export default Statistics;
