import React from "react";
import { Route, Redirect } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/auth";

const AuthRoute = ({ component: Component, ...props }: { component: any; props: any }) => {
	return (
		<Route
			{...props}
			render={innerProps =>
				firebase.auth().currentUser ? <Component {...innerProps} /> : <Redirect to="/" />
			}
		/>
	);
};

export default AuthRoute;
