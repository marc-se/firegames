import React from 'react';
import { connect } from 'react-redux';
import { Switch, Icon, Row, Col } from 'antd';
import { setPlayingFilter, setFinishedFilter, setUntouchedFilter } from '../../../../reducers/actions.js';

import styles from './Filter.scss';

class Filter extends React.Component {

	static propTypes = {
		dispatch: React.PropTypes.func,
		showPlaying: React.PropTypes.bool,
		showFinished: React.PropTypes.bool,
		showUntouched: React.PropTypes.bool,
	}

	constructor() {
		super();
	}

	handlePlayingFilter(value) {
		this.props.dispatch(setPlayingFilter(value));
	}

	handleFinishedFilter(value) {
		this.props.dispatch(setFinishedFilter(value));
	}

	handleNeverPlayedFilter(value) {
		this.props.dispatch(setUntouchedFilter(value));
	}

	render() {
		return (
			<Row type='flex'>
				<Col span={24}>
					<div className={ styles.filter }>
						Playing
						<Switch
							checked={ this.props.showPlaying }
							checkedChildren={<Icon type='check' />}
							unCheckedChildren={<Icon type='cross' />}
							onChange={ (value) => this.handlePlayingFilter(value) }
						/>
					</div>
				</Col>
				<Col span={24}>
					<div className={ styles.filter }>
						Finished
						<Switch
							checked={ this.props.showFinished }
							checkedChildren={<Icon type='check' />}
							unCheckedChildren={<Icon type='cross' />}
							onChange={ (value) => this.handleFinishedFilter(value) }
						/>
					</div>
				</Col>
				<Col span={24}>
					<div className={ styles.filter }>
						Untouched
						<Switch
							checked={ this.props.showUntouched }
							checkedChildren={<Icon type='check' />}
							unCheckedChildren={<Icon type='cross' />}
							onChange={ (value) => this.handleNeverPlayedFilter(value) }
						/>
					</div>
				</Col>
			</Row>
		);
	}
}

let component = Filter;

const mapStateToProps = (state) => {
	return {
		...state,
	};
};

component = connect(
	mapStateToProps,
)(component);

export default component;
