import React, { Component, useEffect } from "react";
// @ts-ignore
import { connect } from "react-redux";
import { Select } from "antd";
import firebase from "firebase/app";
import "firebase/database";
import { updateSystems } from "../../reducers/actions.js";
import { System } from "../../types/firebase";

import * as SC from "./StyledComponents";

interface Props {
	dispatch?: any;
	systems?: Array<System>;
	minWidth?: number;
	handleChange: Function;
}

interface State {}

const Option = Select.Option;

const SystemSelect = (props: Props) => {
	useEffect(() => {
		const { systems } = props;
		if (systems && systems.length < 1) {
			const systemsRef = firebase.database().ref("systems");
			systemsRef.once("value").then(snap => {
				snap.forEach(system => {
					systems.push(system.val());
				});
				props.dispatch(updateSystems(systems));
			});
		}
	});

	const { systems, minWidth } = props;
	return (
		<SC.Container
			showSearch
			minWidth={minWidth}
			placeholder="Select a System"
			optionFilterProp="children"
			onChange={props.handleChange}
			filterOption={(input: string, option: any) =>
				option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
			}
		>
			<Option key="noneSelection" value="none">
				Select a system
			</Option>
			{systems &&
				systems.map((system, index) => {
					return (
						<Option key={index} value={system.url}>
							{system.title}
						</Option>
					);
				})}
		</SC.Container>
	);
};

let component = SystemSelect;

const mapStateToProps = (state: State) => {
	return {
		...state
	};
};

component = connect(mapStateToProps)(component);

export default component;
