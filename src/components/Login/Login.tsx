// @ts-nocheck
import React, { ChangeEvent, KeyboardEvent, useState } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { LoadingOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { Layout } from "antd";
import { Row, Col, Spin, Button, Alert, message } from "antd";
import { loggedIn } from "../../reducers/actions.js";

import firebase from "firebase/app";
import "firebase/auth";

import * as SC from "./StyledComponents";

const { Content } = Layout;

const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

interface Props {
	dispatch?: any;
}

interface State { }

const Login = (props: Props) => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);

	const handlePressEnter = (e: KeyboardEvent) => {
		if (e.key === "Enter") {
			handleLogin();
		}
	};

	const handleUserNameInput = (e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value);

	const handlePasswordInput = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

	const successMessageSignin = () => message.success("You successfully signed in! 🎉", 3);

	const handleLogin = async () => {
		const { dispatch } = props;

		setLoading(true);

		if (username !== "" && password !== "") {
			try {
				await firebase.auth().signInWithEmailAndPassword(username, password);
				successMessageSignin();
				setLoading(false);
				dispatch(loggedIn(true));
			} catch (error) {
				console.error(error);
				setLoading(false);
				setError(true);
			}
		} else {
			setLoading(false);
			setError(true);
		}
	};

	if (firebase.auth().currentUser) {
		return <Redirect to="/cms" />;
	}

	return (
        <Layout>
			<SC.Container>
				<Content>
					<SC.LoginBox>
						{loading && (
							<SC.FeedbackWrapper>
								<Spin indicator={loadingIcon} />
							</SC.FeedbackWrapper>
						)}
						{error && (
							<SC.FeedbackWrapper>
								<Alert
									message="LOGIN FAILED"
									description="Wrong username or password"
									type="error"
								/>
							</SC.FeedbackWrapper>
						)}
						<Row type="flex" justify="center">
							<Col span={24}>
								<SC.InputField
									prefix={<UserOutlined style={{ fontSize: 13 }} />}
									placeholder="Username"
									onChange={handleUserNameInput}
									onKeyPress={handlePressEnter}
								/>
							</Col>
							<Col span={24}>
								<SC.InputField
									prefix={<LockOutlined style={{ fontSize: 13 }} />}
									type="password"
									placeholder="Password"
									onChange={handlePasswordInput}
									onKeyPress={handlePressEnter}
								/>
							</Col>
							<Col span={24}>
								<Button onClick={handleLogin}>Login</Button>
							</Col>
						</Row>
					</SC.LoginBox>
				</Content>
			</SC.Container>
		</Layout>
    );
};

let component = Login;

const mapStateToProps = (state: State) => {
	return {
		...state
	};
};

// @ts-ignore
component = connect(mapStateToProps)(component);

export default component;
