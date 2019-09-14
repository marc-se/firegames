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
	const handleLogout = () => {
		const { dispatch } = props;
		firebase
			.auth()
			.signOut()
			.then(() => {
				// TODO: keep session
				dispatch(selectSystem("none"));
				dispatch(loggedIn(false));
			});
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
