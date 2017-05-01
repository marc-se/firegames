import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Input, Button, Tag, Checkbox, Spin, Badge } from 'antd';
import * as firebase from 'firebase';

import DeleteDialog from './DeleteDialog.js';
import EditGame from '../AddGame/AddGame.js';

import styles from './GamesTable.scss';

class GamesTable extends Component {
	static propTypes = {
		dispatch: React.PropTypes.func,
		selectedSystem: React.PropTypes.string,
		showPlaying: React.PropTypes.bool,
		showFinished: React.PropTypes.bool,
		showUntouched: React.PropTypes.bool,
		games: React.PropTypes.arrayOf(React.PropTypes.object),
		selectSystem: React.PropTypes.string,
	};

	state = {
		filterDropdownVisible: false,
		games: [],
		filterData: [],
		searchText: '',
		loading: false,
		count: 0,
	};

	componentWillReceiveProps(nextProps) {
		// TODO: dynamically append system-url to gamesRef: e.g. games/gameboy
		/** Data looks like this
		* const data = [{
		* 	key: '-KUm_Sal-H7c8ngbUJgK',
		* 	title: 'Final Fantasy XV',
		* 	region: 'PAL',
		* 	genre: 'RPG',
		* 	playing: true,
		* 	finished: false,
		* }...]
		**/

		if (nextProps.selectedSystem === 'none') {
			this.setState({
				games: [],
				filterData: [],
				loading: false,
				count: 0,
			});
		} else {
			this.setState({
				loading: true,
			});

			const gamesRef = firebase.database().ref(`games/${nextProps.selectedSystem}`);
			gamesRef.on('value', snap => {
				let data = snap.val();
				let games = [];

				Object.keys(data).forEach(game => {
					// add key to object
					data[game].key = game;
					// push object to games list
					games.push(data[game]);
				});

				/* eslint-disable */
				switch (nextProps.filterType) {
					case 'PLAYING_FILTER':
						games = games.filter(game => game.playing === true);
						break;
					case 'FINISHED_FILTER':
						games = games.filter(game => game.finished === true);
						break;
					case 'UNTOUCHED_FILTER':
						games = games.filter(game => !game.playing && !game.finished);
						break;
				}
				/* eslint-enable */

				// sort games alphabetically after filtering (ascending)
				games.sort((a, b) => {
					let gameA = a.title.toUpperCase();
					let gameB = b.title.toUpperCase();
					return gameA < gameB ? -1 : gameA > gameB ? 1 : 0;
				});

				this.setState({
					games: games,
					filterData: games,
					loading: false,
					count: games.length,
				});
			});
		}
	}

	onInputChange = e => {
		this.setState({ searchText: e.target.value });
		this.onSearch();
	};

	playingStateChange = (e, key) => {
		let updateFile = firebase.database().ref(`games/${this.props.selectedSystem}/${key}`);
		updateFile.update({
			playing: e.target.checked,
		});
	};

	finishedStateChange = (e, key) => {
		let updateFile = firebase.database().ref(`games/${this.props.selectedSystem}/${key}`);
		updateFile.update({
			finished: e.target.checked,
		});
	};

	onSearch = () => {
		const { searchText } = this.state;
		const reg = new RegExp(searchText, 'gi');

		// TODO: put filter in redux store and update props.games after filtering
		this.setState({
			filterDropdownVisible: true,
			games: this.state.filterData
				.map(record => {
					const match = record.title.match(reg);
					if (!match) {
						return null;
					}
					return {
						...record,
						title: (
							<span>
								{record.title
									.split(reg)
									.map((text, i) => i > 0 ? [ <span className={styles.highlight}>{match[0]}</span>, text ] : text)}
							</span>
						),
					};
				})
				.filter(record => !!record),
		});
	};

	render() {
		const columns = [
			{
				title: 'Game',
				dataIndex: 'title',
				key: 'title',
				width: '35%',
				filterDropdown: (
					<div className={styles.filterDropdown}>
						<Input
							placeholder="Search title"
							value={this.state.searchText}
							onChange={this.onInputChange}
							onPressEnter={this.onSearch}
						/>
						<Button type="primary" onClick={this.onSearch}>Search</Button>
					</div>
				),
				filterDropdownVisible: this.state.filterDropdownVisible,
				onFilterDropdownVisibleChange: visible => this.setState({ filterDropdownVisible: visible }),
			},
			{
				title: 'Region',
				dataIndex: 'region',
				key: 'region',
				width: '10%',
				// colors -> https://coolors.co/011627-fdfffc-2ec4b6-e71d36-ff9f1c
				render: e => <Tag color={e === 'PAL' ? '#FF9F1C' : e === 'JAP' ? '#2EC4B6' : '#E71D36'}>{e}</Tag>,
			},
			{
				title: 'Genre',
				dataIndex: 'genre',
				key: 'genre',
				width: '25%',
				render: e => {
					let tags = e.split(',');
					return (
						<div>
							{tags.map((tag, i) => <Tag key={i}>{tag}</Tag>)}
						</div>
					);
				},
			},
			{
				title: '🕹',
				dataIndex: 'playing',
				key: 'playing',
				width: '5%',
				render: (e, row) => <Checkbox checked={e} onChange={e => this.playingStateChange(e, row.key)} />,
			},
			{
				title: '✅',
				dataIndex: 'finished',
				key: 'finished',
				width: '5%',
				render: (e, row) => <Checkbox checked={e} onChange={e => this.finishedStateChange(e, row.key)} />,
			},
			{
				title: 'Edit / Delete',
				dataIndex: 'edit',
				key: 'edit',
				width: '20%',
				render: (e, row) => {
					return (
						<div className={styles.editDelete}>
							<EditGame system={this.props.selectedSystem} editMode gameID={row.key} />
							<DeleteDialog system={this.props.selectedSystem} gameID={row.key} className={styles.deleteButton} />
						</div>
					);
				},
			},
		];

		return (
			<div>
				<Badge className={styles.badge} count={this.state.count} />
				{this.state.loading
					? <div className={styles.loadingSpinnerWrapper}><Spin tip="Collecting Games..." /></div>
					: <Table columns={columns} dataSource={this.state.games} pagination={false} scroll={{ y: '65vh' }} />}
			</div>
		);
	}
}

let component = GamesTable;

const mapStateToProps = state => {
	return {
		...state,
	};
};

component = connect(mapStateToProps)(component);

export default component;
