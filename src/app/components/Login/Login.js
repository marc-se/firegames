import React from 'react';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import { Icon, Input, Button, Card, message } from 'antd';
import { Row, Col } from 'antd';
import { loggedIn } from '../../../../reducers/actions.js';

import styles from './Login.scss';
import * as firebase from 'firebase';

const { Content } = Layout;

class Login extends React.Component {
	static propTypes = {
		loggedIn: React.PropTypes.bool,
		renderLogout: React.PropTypes.bool,
		dispatch: React.PropTypes.func,
	};

	state = {
		username: '',
		password: '',
	};

	componentDidMount() {
		firebase.auth().onAuthStateChanged(firebaseUser => {
			if (firebaseUser) {
				this.successMessageSignin();
			} else {
				// not logged in
			}
		});
	}

	handleUserNameInput(e) {
		this.setState({
			username: e.target.value,
		});
	}

	handlePasswordInput(e) {
		this.setState({
			password: e.target.value,
		});
	}

	handleLogin() {
		let email = this.state.username;
		let pass = this.state.password;
		const auth = firebase.auth();
		auth.signInWithEmailAndPassword(email, pass).then(() => {
			this.props.dispatch(loggedIn(true));
		});

		// TODO: handle wrong login credentials, maybe show message and shake login form
		// const promise = auth.signInWithEmailAndPassword(email, pass);
		// promise.catch( e => console.log(e.message));
	}

	handleLogout = () => {
		firebase.auth().signOut().then(() => {
			// TODO: keep session
			this.props.dispatch(loggedIn(false));
		});
	};

	errorMessage = () => {
		message.error('Something went wrong 😰', 3);
	};

	render() {
		const { renderLogout } = this.props;
		return renderLogout
			? <div className={styles.logout}>
					Logout<Button shape="circle" icon="poweroff" type="dashed" onClick={this.handleLogout} />
				</div>
			: <Layout>
					<Content className={styles.loginOverlayWrapper}>
						<Card>
							<Row type="flex" justify="center">
								<Col span={24} className={styles.loginInput}>
									<Input
										prefix={<Icon type="user" style={{ fontSize: 13 }} />}
										placeholder="Username"
										onChange={e => this.handleUserNameInput(e)}
									/>
								</Col>
								<Col span={24} className={styles.loginInput}>
									<Input
										prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
										type="password"
										placeholder="Password"
										onChange={e => this.handlePasswordInput(e)}
									/>
								</Col>
								<Col span={24}>
									<Button onClick={() => this.handleLogin()}>
										Login
									</Button>
								</Col>
							</Row>
						</Card>
					</Content>
				</Layout>;
	}
}

let component = Login;

const mapStateToProps = state => {
	return {
		...state,
	};
};

component = connect(mapStateToProps)(component);

export default component;
