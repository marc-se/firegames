import React, { Component } from "react";
import { connect } from "react-redux";
import { Table, Input, Button, Tag, Checkbox, Spin, Badge } from "antd";
import styled from "styled-components";
import firebase from "firebase/app";
import "firebase/database";

import DeleteDialog from "./DeleteDialog.js";
import EditGame from "../AddGame/AddGame.js";
import { updateGlobalGamesStatusForSystems } from "../../utils/updateGlobalGamesStatusForSystems.js";

const FireGamesTable = styled(Table)`
	th {
		font-size: 12px !important;
	}
`;

const FireGamesLoadingSpinner = styled.div`
	width: 100%;
	min-height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;

	> div {
		display: flex;
		align-items: center;
		flex-direction: column;
	}
`;

const FireGamesBadge = styled(Badge)`
	display: flex !important;
	flex-direction: row-reverse !important;
	top: 10px;
	left: 10px;
	z-index: 1;
	p {
		margin-bottom: 0;
		line-height: 20px;
		letter-spacing: 1px;
	}
`;

const FireGamesFilterDropdown = styled.div`
	padding: 8px;
	border-radius: 6px;
	background: #fff;
	box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
	position: relative;
	top: -30px;
	left: 20px;

	input {
		width: 130px;
		margin-right: 8px;
	}
`;

const FireGamesHighlighting = styled.span`
	background: #ff9f1c;
`;

const FireGamesDeleteEdit = styled.div`
	display: flex;
	button {
		margin-right: 10px;
	}
`;

const PLAYING = "playing";
const FINISHED = "finished";

class GamesTable extends Component {
	state = {
		filterDropdownVisible: false,
		games: [],
		filterData: [],
		searchText: "",
		loading: false,
		count: 0
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

		if (nextProps.selectedSystem === "none") {
			this.setState({
				games: [],
				filterData: [],
				loading: false,
				count: 0
			});
		} else {
			this.setState({
				loading: true
			});

			const gamesRef = firebase.database().ref(`games/${nextProps.selectedSystem}`);
			gamesRef.on("value", snap => {
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
					case "PLAYING_FILTER":
						games = games.filter(game => game.playing === true);
						break;
					case "FINISHED_FILTER":
						games = games.filter(game => game.finished === true);
						break;
					case "UNTOUCHED_FILTER":
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
					count: games.length
				});
			});
		}
	}

	// updateGlobalGamesStatus = () => {
	// 	// TODO: update, how many games (in total) are in playing / finished / untouched state for each system
	// 	console.log("triggered");
	// 	const updateFile = firebase.database().ref(`systems/${this.props.selectedSystem}`);
	// 	const { games } = this.state;

	// 	const playingCount = games.filter(game => game.playing === true).length;
	// 	const finishedCount = games.filter(game => game.finished === true).length;
	// 	const untouchedCount = games.filter(game => !game.playing && !game.finished).length;

	// 	console.log("playingCount", playingCount);
	// 	console.log("finishedCount", finishedCount);
	// 	console.log("untouchedCount", untouchedCount);

	// 	// updateFile.update({
	// 	// 	playing: playingCount,
	// 	// 	finished: finishedCount,
	// 	// 	untouched: untouchedCount
	// 	// });
	// };

	onInputChange = e => {
		this.setState({ searchText: e.target.value });
		this.onSearch();
	};

	playingStateChange = (e, key) => {
		const { selectedSystem } = this.props;
		const updateFile = firebase.database().ref(`games/${selectedSystem}/${key}`);
		updateFile.update(
			{
				playing: e.target.checked
			},
			e => {
				if (e) {
					console.log("update failed", e);
				} else {
					updateGlobalGamesStatusForSystems(selectedSystem, PLAYING, e.target.checked);
				}
			}
		);
	};

	finishedStateChange = (e, key) => {
		const { selectedSystem } = this.props;
		const updateFile = firebase.database().ref(`games/${selectedSystem}/${key}`);
		updateFile.update(
			{
				finished: e.target.checked
			},
			e => {
				if (e) {
					console.log("update failed", e);
				} else {
					updateGlobalGamesStatusForSystems(selectedSystem, FINISHED, e.target.checked);
				}
			}
		);
	};

	onSearch = () => {
		const { searchText } = this.state;
		const reg = new RegExp(searchText, "gi");

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
									.map(
										(text, i) =>
											i > 0
												? [<FireGamesHighlighting>{match[0]}</FireGamesHighlighting>, text]
												: text
									)}
							</span>
						)
					};
				})
				.filter(record => !!record)
		});
	};

	render() {
		const columns = [
			{
				title: "Game",
				dataIndex: "title",
				key: "title",
				width: "35%",
				filterDropdown: (
					<FireGamesFilterDropdown>
						<Input
							placeholder="Search title"
							value={this.state.searchText}
							onChange={this.onInputChange}
							onPressEnter={this.onSearch}
						/>
						<Button type="primary" onClick={this.onSearch}>
							Search
						</Button>
					</FireGamesFilterDropdown>
				),
				filterDropdownVisible: this.state.filterDropdownVisible,
				onFilterDropdownVisibleChange: visible => this.setState({ filterDropdownVisible: visible })
			},
			{
				title: "Region",
				dataIndex: "region",
				key: "region",
				width: "10%",
				// colors -> https://coolors.co/011627-fdfffc-2ec4b6-e71d36-ff9f1c
				render: e => (
					<Tag color={e === "PAL" ? "#FF9F1C" : e === "JAP" ? "#2EC4B6" : "#E71D36"}>{e}</Tag>
				)
			},
			{
				title: "Genre",
				dataIndex: "genre",
				key: "genre",
				width: "25%",
				render: e => {
					let tags = e.split(",");
					return (
						<div>
							{tags.map((tag, i) => (
								<Tag key={i}>{tag}</Tag>
							))}
						</div>
					);
				}
			},
			{
				title: "🕹",
				dataIndex: "playing",
				key: "playing",
				width: "5%",
				render: (e, row) => (
					<Checkbox checked={e} onChange={e => this.playingStateChange(e, row.key)} />
				)
			},
			{
				title: "✅",
				dataIndex: "finished",
				key: "finished",
				width: "5%",
				render: (e, row) => (
					<Checkbox checked={e} onChange={e => this.finishedStateChange(e, row.key)} />
				)
			},
			{
				title: "Edit / Delete",
				dataIndex: "edit",
				key: "edit",
				width: "20%",
				render: (e, row) => {
					return (
						<FireGamesDeleteEdit>
							<EditGame system={this.props.selectedSystem} editMode gameID={row.key} />
							<DeleteDialog system={this.props.selectedSystem} gameID={row.key} />
						</FireGamesDeleteEdit>
					);
				}
			}
		];

		return (
			<React.Fragment>
				<FireGamesBadge count={this.state.count} />
				{this.state.loading ? (
					<FireGamesLoadingSpinner>
						<Spin tip="Collecting Games..." />
					</FireGamesLoadingSpinner>
				) : (
					<FireGamesTable
						columns={columns}
						dataSource={this.state.games}
						pagination={false}
						scroll={{ y: "65vh" }}
					/>
				)}
			</React.Fragment>
		);
	}
}

let component = GamesTable;

const mapStateToProps = state => {
	return {
		...state
	};
};

component = connect(mapStateToProps)(component);

export default component;
