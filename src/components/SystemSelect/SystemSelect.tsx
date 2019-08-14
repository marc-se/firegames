import React, { Component } from "react";
// @ts-ignore
import { connect } from "react-redux";
import { Select, message } from "antd";
import firebase from "firebase/app";
import "firebase/database";
import { selectSystem, updateSystems } from "../../reducers/actions.js";
import { System } from "../../types/firebase";

import * as SC from "./StyledComponents";

interface Props {
	dispatch?: any;
	systems?: Array<System>;
}

interface State {}

const Option = Select.Option;

class SystemSelect extends Component<Props, State> {
	componentWillMount() {
		const { systems } = this.props;
		if (systems && systems.length < 1) {
			const systemsRef = firebase.database().ref("systems");
			systemsRef.once("value").then(snap => {
				snap.forEach(system => {
					systems.push(system.val());
				});
				this.props.dispatch(updateSystems(systems));
			});
		}
	}

	componentDidMount() {
		/*
		 * trigger message here and not in Login Component,
		 * cause SystemSelect only mounts once and only if you're logged in
		 */
		this.successMessageSignin();
	}

	handleChange = (e: string) => {
		this.props.dispatch(selectSystem(e));
	};

	successMessageSignin = () => {
		message.success("You successfully signed in! 🌈", 3);
	};

	render() {
		const { systems } = this.props;
		return (
			<SC.Container
				showSearch
				placeholder="Select a System"
				optionFilterProp="children"
				onChange={this.handleChange}
				filterOption={(input: string, option: any) =>
					option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
				}
			>
				<Option key="noneSelection" value="none">
					Keine Auswahl
				</Option>
				{// create systems from firebase data
				systems &&
					systems.map((system, index) => {
						return (
							<Option key={index} value={system.url}>
								{system.title}
							</Option>
						);
					})}
			</SC.Container>
		);
	}
}

let component = SystemSelect;

const mapStateToProps = (state: State) => {
	return {
		...state
	};
};

component = connect(mapStateToProps)(component);

export default component;
