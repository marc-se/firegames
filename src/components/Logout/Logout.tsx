import React from "react";
// @ts-ignore
import { Button } from "antd";
import firebase from "firebase/app";
import "firebase/auth";

import { selectSystem, loggedIn } from "../../reducers/actions.js";

import * as SC from "./StyledComponents";

interface Props {
	dispatch?: any;
}

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

export default Logout;
