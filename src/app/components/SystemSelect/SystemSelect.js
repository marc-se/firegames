import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Select, message } from 'antd';
import * as firebase from 'firebase';
import { selectSystem, updateSystems } from '../../../../reducers/actions.js';

import styles from './SystemSelect.scss';

const Option = Select.Option;

let systems = [];

class SystemSelect extends Component {
	static propTypes = {
		dispatch: React.PropTypes.func,
		systems: React.PropTypes.arrayOf(React.PropTypes.object),
	};

	componentWillMount() {
		const systemsRef = firebase.database().ref('systems');
		systemsRef.once('value').then(snap => {
			snap.forEach(system => {
				systems.push(system.val());
			});
			this.props.dispatch(updateSystems(systems));
		});
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
		message.success('You successfully signed in! 🌈', 3);
	};

	render() {
		return (
			<Select
				showSearch
				className={styles.dropdown}
				placeholder="Select a System"
				optionFilterProp="children"
				onChange={e => this.handleChange(e)}
				filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
			>
				<Option key="noneSelection" value="none">Keine Auswahl</Option>
				{// create systems from firebase data
				this.props.systems.map((system, index) => {
					return <Option key={index} value={system.url}>{system.title}</Option>;
				})}
			</Select>
		);
	}
}

let component = SystemSelect;

const mapStateToProps = state => {
	return {
		...state,
	};
};

component = connect(mapStateToProps)(component);

export default component;
