import React from "react";
// @ts-ignore
import { connect } from "react-redux";
import { Button } from "antd";
import firebase from "firebase/app";
import "firebase/auth";

import { selectSystem, loggedIn } from "../../reducers/actions.js";

import * as SC from "./StyledComponents";

interface Props {
	dispatch?: any;
}

interface State {}

const Logout = (props: Props) => {
	const handleLogout = async () => {
		const { dispatch } = props;
		try {
			await firebase.auth().signOut();
			dispatch(selectSystem("none"));
			dispatch(loggedIn(false));
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<SC.LogoutBox>
			Logout
			<Button shape="circle" icon="poweroff" type="dashed" onClick={handleLogout} />
		</SC.LogoutBox>
	);
};

let component = Logout;

const mapStateToProps = (state: State) => {
	return {
		...state
	};
};

component = connect(mapStateToProps)(component);

export default component;
