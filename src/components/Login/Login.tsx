import React, { ChangeEvent, KeyboardEvent, Component } from "react";
// @ts-ignore
import { connect } from "react-redux";
import { Layout } from "antd";
import { Row, Col, Spin, Icon, Button, message } from "antd";
import { loggedIn, selectSystem } from "../../reducers/actions.js";

import firebase from "firebase/app";
import "firebase/auth";

import * as SC from "./StyledComponents";

const { Content } = Layout;

const loadingIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

interface Props {
	dispatch: any;
	renderLogout: boolean;
}

interface State {
	username: string;
	password: string;
	loading: boolean;
}

class Login extends Component<Props, State> {
	state = {
		username: "",
		password: "",
		loading: false
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
		this.setState({
			loading: true
		});
		if (email !== "" && pass !== "") {
			const auth = firebase.auth();
			auth.signInWithEmailAndPassword(email, pass).then(() => {
				this.props.dispatch(loggedIn(true));
				this.setState({
					loading: false
				});
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
		const { loading } = this.state;
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
								<SC.Loading>
									<Spin indicator={loadingIcon} />
								</SC.Loading>
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
