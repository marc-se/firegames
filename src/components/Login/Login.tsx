import React, { ChangeEvent, KeyboardEvent, Component } from "react";
import { Redirect } from "react-router-dom";
// @ts-ignore
import { connect } from "react-redux";
import { Layout } from "antd";
import { Row, Col, Spin, Icon, Button, Alert } from "antd";
import { selectSystem, loggedIn } from "../../reducers/actions.js";

import firebase from "firebase/app";
import "firebase/auth";

import * as SC from "./StyledComponents";

const { Content } = Layout;

const loadingIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

interface Props {
	dispatch?: any;
	renderLogout?: boolean;
}

interface State {
	username: string;
	password: string;
	loading: boolean;
	error: boolean;
}

class Login extends Component<Props, State> {
	state = {
		username: "",
		password: "",
		loading: false,
		error: false
	};

	handlePressEnter = (e: KeyboardEvent) => {
		if (e.key === "Enter") {
			this.handleLogin();
		}
	};

	handleUserNameInput = (e: ChangeEvent<HTMLInputElement>) => {
		this.setState({
			username: e.target.value
		});
	};

	handlePasswordInput = (e: ChangeEvent<HTMLInputElement>) => {
		this.setState({
			password: e.target.value
		});
	};

	handleLogin() {
		const { username: email, password: pass } = this.state;
		const { dispatch } = this.props;
		this.setState({
			loading: true
		});
		if (email !== "" && pass !== "") {
			firebase
				.auth()
				.signInWithEmailAndPassword(email, pass)
				.then(() => {
					this.setState({
						loading: false
					});
					dispatch(loggedIn(true));
				})
				.catch(error => {
					console.error(error);
					this.setState({
						loading: false,
						error: true
					});
				});
		} else {
			this.setState({
				loading: false,
				error: true
			});
		}
	}

	handleLogout = () => {
		const { dispatch } = this.props;
		firebase
			.auth()
			.signOut()
			.then(() => {
				// TODO: keep session
				dispatch(selectSystem("none"));
				dispatch(loggedIn(false));
			});
	};

	render() {
		const { renderLogout } = this.props;
		const { loading, error } = this.state;

		if (firebase.auth().currentUser && !renderLogout) {
			return <Redirect to="/cms" />;
		}

		return renderLogout ? (
			<SC.LogoutBox>
				Logout
				<Button shape="circle" icon="poweroff" type="dashed" onClick={this.handleLogout} />
			</SC.LogoutBox>
		) : (
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
										prefix={<Icon type="user" style={{ fontSize: 13 }} />}
										placeholder="Username"
										onChange={this.handleUserNameInput}
										onKeyPress={this.handlePressEnter}
									/>
								</Col>
								<Col span={24}>
									<SC.InputField
										prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
										type="password"
										placeholder="Password"
										onChange={this.handlePasswordInput}
										onKeyPress={this.handlePressEnter}
									/>
								</Col>
								<Col span={24}>
									<Button onClick={() => this.handleLogin()}>Login</Button>
								</Col>
							</Row>
						</SC.LoginBox>
					</Content>
				</SC.Container>
			</Layout>
		);
	}
}

let component = Login;

const mapStateToProps = (state: State) => {
	return {
		...state
	};
};

component = connect(mapStateToProps)(component);

export default component;
