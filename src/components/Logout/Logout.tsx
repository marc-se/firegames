import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { PoweroffOutlined } from '@ant-design/icons';
import { Button } from "antd";
import firebase from "firebase/app";
import "firebase/auth";

import { selectSystem, loggedIn } from "../../reducers/actions.js";

import * as SC from "./StyledComponents";

interface Props {
	dispatch?: any;
}

interface State {
	redirect: boolean;
}

const Logout = (props: Props) => {
	const [redirect, setRedirect] = useState(false);

	const handleLogout = async () => {
		const { dispatch } = props;
		try {
			await firebase.auth().signOut();
			dispatch(selectSystem("none"));
			dispatch(loggedIn(false));
			setRedirect(true);
		} catch (error) {
			console.error(error);
		}
	};

	return redirect ? (
		<Redirect to="/" />
	) : (
		<SC.LogoutBox>
			Logout
			<Button shape="circle" icon={<PoweroffOutlined />} type="dashed" onClick={handleLogout} />
		</SC.LogoutBox>
	);
};

let component = Logout;

const mapStateToProps = (state: State) => {
	return {
		...state
	};
};

// @ts-ignore
component = connect(mapStateToProps)(component);

export default component;
