import React from "react";
import { connect } from "react-redux";
import { Layout } from "antd";
import { Icon, Input, Button, message } from "antd";
import { Row, Col } from "antd";
import { loggedIn, selectSystem } from "../../reducers/actions.js";

import styled from "styled-components";
import firebase from "firebase/app";
import "firebase/auth";

const { Content } = Layout;

const LoginWrapper = styled.div`
	height: 100vh;
	display: flex;
	align-items: center;
	padding-bottom: 12px;
	background: linear-gradient(to right, #eaecc6, #2bc0e4);
`;

const LoginBox = styled.div`
	width: 25vw;
	margin: 0 auto;
`;

const LoginInput = styled(Input)`
	margin: 0 0 12px 0 !important;
`;

const LogoutBox = styled.div`
	display: flex;
	text-align: center;
	justify-content: center;
	align-items: center;
	position: relative;
	top: 10px;
	button {
		margin-left: 10px;
	}
`;

class Login extends React.Component {
	state = {
		username: "",
		password: ""
	};

	componentDidMount() {
		firebase.auth().onAuthStateChanged(firebaseUser => {
			if (firebaseUser) {
				// TODO: fix
				//this.successMessageSignin();
			} else {
				// not logged in
			}
		});
	}

	handlePressEnter = e => {
		if (e.key === "Enter") {
			this.handleLogin();
		}
	};

	handleUserNameInput(e) {
		this.setState({
			username: e.target.value
		});
	}

	handlePasswordInput(e) {
		this.setState({
			password: e.target.value
		});
	}

	handleLogin() {
		const email = this.state.username;
		const pass = this.state.password;
		if (email !== "" && pass !== "") {
			const auth = firebase.auth();
			auth.signInWithEmailAndPassword(email, pass).then(() => {
				this.props.dispatch(loggedIn(true));
			});
		}
		// TODO: handle wrong login credentials, maybe show message and shake login form
		// const promise = auth.signInWithEmailAndPassword(email, pass);
		// promise.catch( e => console.log(e.message));
	}

	handleLogout = () => {
		firebase
			.auth()
			.signOut()
			.then(() => {
				// TODO: keep session
				this.props.dispatch(selectSystem("none"));
				this.props.dispatch(loggedIn(false));
			});
	};

	errorMessage = () => {
		message.error("Something went wrong 😰", 3);
	};

	render() {
		const { renderLogout } = this.props;
		return renderLogout ? (
			<LogoutBox>
				Logout
				<Button shape="circle" icon="poweroff" type="dashed" onClick={this.handleLogout} />
			</LogoutBox>
		) : (
			<Layout>
				<LoginWrapper>
					<Content>
						<LoginBox>
							<Row type="flex" justify="center">
								<Col span={24}>
									<LoginInput
										prefix={<Icon type="user" style={{ fontSize: 13 }} />}
										placeholder="Username"
										onChange={e => this.handleUserNameInput(e)}
										onKeyPress={this.handlePressEnter}
									/>
								</Col>
								<Col span={24}>
									<LoginInput
										prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
										type="password"
										placeholder="Password"
										onChange={e => this.handlePasswordInput(e)}
										onKeyPress={this.handlePressEnter}
									/>
								</Col>
								<Col span={24}>
									<Button onClick={() => this.handleLogin()}>Login</Button>
								</Col>
							</Row>
						</LoginBox>
					</Content>
				</LoginWrapper>
			</Layout>
		);
	}
}

let component = Login;

const mapStateToProps = state => {
	return {
		...state
	};
};

component = connect(mapStateToProps)(component);

export default component;
