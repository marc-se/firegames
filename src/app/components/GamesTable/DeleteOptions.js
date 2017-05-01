import React, { Component } from 'react';
import { Button } from 'antd';

import styles from './DeleteOptions.scss';

export default class DeleteOptions extends Component {
	static propTypes = {
		onCancel: React.PropTypes.func,
		onOk: React.PropTypes.func,
	};

	onCancel = () => {
		this.props.onCancel();
	};

	onOk = () => {
		this.props.onOk();
	};

	render() {
		return (
			<div className={styles.deleteOptions}>
				<Button size="small" onClick={this.onCancel}>CANCEL</Button>
				<Button size="small" type="danger" onClick={this.onOk}>DELETE</Button>
			</div>
		);
	}
}
