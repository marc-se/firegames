import React from "react";
import { connect } from "react-redux";
import { Layout } from "antd";
import { Icon, Button, message } from "antd";
import { Row, Col } from "antd";
import { loggedIn, selectSystem } from "../../reducers/actions.js";

import firebase from "firebase/app";
import "firebase/auth";

import * as SC from "./StyledComponents";

const { Content } = Layout;

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
			<SC.LogoutBox>
				Logout
				<Button shape="circle" icon="poweroff" type="dashed" onClick={this.handleLogout} />
			</SC.LogoutBox>
		) : (
			<Layout>
				<SC.Container>
					<Content>
						<SC.LoginBox>
							<Row type="flex" justify="center">
								<Col span={24}>
									<SC.InputField
										prefix={<Icon type="user" style={{ fontSize: 13 }} />}
										placeholder="Username"
										onChange={e => this.handleUserNameInput(e)}
										onKeyPress={this.handlePressEnter}
									/>
								</Col>
								<Col span={24}>
									<SC.InputField
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
						</SC.LoginBox>
					</Content>
				</SC.Container>
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
