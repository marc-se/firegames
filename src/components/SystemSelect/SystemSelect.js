import React, { Component } from "react";
import { connect } from "react-redux";
import { Select, message } from "antd";
import styled from "styled-components";
import firebase from "firebase/app";
import "firebase/database";
import { selectSystem, updateSystems } from "../../reducers/actions.js";

const Option = Select.Option;

const FireGamesSelect = styled(Select)`
	width: 100%;
	padding-bottom: 5px;
`;

class SystemSelect extends Component {
	componentWillMount() {
		const { systems } = this.props;
		if (systems.length < 1) {
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

	handleChange(value) {
		// update redux store
		this.props.dispatch(selectSystem(value));
	}

	successMessageSignin = () => {
		message.success("You successfully signed in! 🌈", 3);
	};

	render() {
		return (
			<FireGamesSelect
				showSearch
				placeholder="Select a System"
				optionFilterProp="children"
				onChange={e => this.handleChange(e)}
				filterOption={(input, option) =>
					option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
				}
			>
				<Option key="noneSelection" value="none">
					Keine Auswahl
				</Option>
				{// create systems from firebase data
				this.props.systems.map((system, index) => {
					return (
						<Option key={index} value={system.url}>
							{system.title}
						</Option>
					);
				})}
			</FireGamesSelect>
		);
	}
}

let component = SystemSelect;

const mapStateToProps = state => {
	return {
		...state
	};
};

component = connect(mapStateToProps)(component);

export default component;
