import React from 'react';
import styles from './NotFound.scss';

export default class NotFound extends React.Component {
	render() {
		return (
			<div className={ styles.notFoundWrapper }>
				404 not found
			</div>
		);
	}
}
