import React from 'react';
import { connect } from 'react-redux';
import {
	Modal,
	Button,
	Input,
	Tag,
	Checkbox,
	Select,
	Radio,
	Alert,
	message,
} from 'antd';
import * as firebase from 'firebase';

import styles from './AddGame.scss';

const { CheckableTag } = Tag;

// TODO: get genres from firebase -> add new genres object to firebase
const genreTags = [
	'Action',
	'Adventure',
	'Arcade',
	'Fighting',
	'Horror',
	'Platformer',
	'Puzzle',
	'RPG',
	'Racing',
	'Shooter',
	'Simulation',
	'Sports',
	'Strategy',
];

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class AddGame extends React.Component {
	static propTypes = {
		buttonTitle: React.PropTypes.string,
		systems: React.PropTypes.arrayOf(React.PropTypes.object),
		system: React.PropTypes.string,
		editMode: React.PropTypes.bool,
		gameID: React.PropTypes.string,
		gamesCount: React.PropTypes.number,
	};

	state = {
		visible: false,
		selectedGenres: [],
		title: '',
		system: 'null',
		region: 'PAL',
		playing: false,
		finished: false,
		error: false,
		loading: false,
	};

	componentDidMount() {
		const { editMode, gameID, system } = this.props;

		if (editMode) {
			const gameRef = firebase.database().ref(`games/${system}/${gameID}`);
			gameRef.once('value', snap => {
				let game = snap.val();
				let genres = game.genre.split(',');
				this.setState({
					selectedGenres: genres,
					title: game.title,
					system: game.system,
					region: game.region,
					playing: game.playing,
					finished: game.finished,
				});
			});
		}
	}

	showModal = () => {
		this.setState({
			visible: true,
		});
	};

	successMessage = text => {
		message.success(text, 3);
	};

	errorMessage = text => {
		message.error(text, 3);
	};

	handleOk = () => {
		this.setState({
			loading: true,
		});

		const { selectedGenres, title, region, playing, finished } = this.state;
		const { editMode, gameID, system } = this.props;

		let genres = selectedGenres.join();

		if (!editMode) {
			if (
				selectedGenres.length > 0 &&
				title.length > 0 &&
				this.state.system !== 'null'
			) {
				const addNodeAt = firebase.database().ref('games/' + this.state.system);

				let duplicates = null;

				// get snapshot of system node, where you´re trying to add a new node
				return addNodeAt
					.once('value', snap => {
						let obj = snap.val();

						/* check if existing game title & region matches your input title & region
						* YES? -> add item to duplicates array
						*/
						for (let game in obj) {
							const value = obj[game];
							if (
								value.title === this.state.title &&
								value.region === this.state.region
							) {
								duplicates = true;
								this.errorMessage('This Game is already in your collection 😧');
							}
						}

						// when first check above passes, there should be no duplicate entry (if typo matches 100%)
						if (duplicates !== true) {
							duplicates = false;
						}

						// if duplicates array has no items, add new node
						if (duplicates === false) {
							addNodeAt
								.push({
									title: title,
									playing: playing,
									finished: finished,
									genre: genres,
									region: region,
								})
								.then(() => {
									// find system node to update
									let updateStatisticsForSystem = firebase
										.database()
										.ref(`systems/${this.state.system}/`);

									// get games count after adding a new game
									addNodeAt.once('value', snap => {
										let obj = snap.val();
										let gamesCount = Object.keys(obj).length;

										// update games count for statistics -> TODO
										updateStatisticsForSystem.update({
											games: gamesCount,
										});
									});

									this.setState({
										visible: false,
										error: false,
										loading: false,
									});
								})
								.catch(() => {
									this.errorMessage('Oooops, something went wrong... 😰');
									this.setState({
										loading: false,
									});
								});
						}
					})
					.then(() => {
						// display success message
						this.successMessage(
							'You successfully added a new Game to your collection! 🕹'
						);
						return duplicates;
					})
					.catch(() => {
						this.errorMessage('Oooops, something went wrong... 😰');
						this.setState({
							loading: false,
						});
					});
			} else {
				this.setState({
					error: true,
				});
			}
		} else {
			// update data in edit mode
			const updateNodeAt = firebase.database().ref(`games/${system}/${gameID}`);
			updateNodeAt
				.set({
					title: title,
					playing: playing,
					finished: finished,
					genre: genres,
					region: region,
				})
				.then(() => {
					this.successMessage('Edit successfull! 👍🏼');
					this.setState({
						visible: false,
						error: false,
						loading: false,
					});
				})
				.catch(() => {
					this.errorMessage('Oooops, something went wrong... 😰');
					this.setState({
						loading: false,
					});
				});
		}
	};

	handleCancel = () => {
		this.setState({
			visible: false,
		});
	};

	handleChange(tag, checked) {
		const { selectedGenres } = this.state;
		const nextSelectedTags = checked
			? [...selectedGenres, tag]
			: selectedGenres.filter(t => t !== tag);
		this.setState({
			selectedGenres: nextSelectedTags,
		});
	}

	handleRegionChange = e => {
		this.setState({
			region: e.target.value,
		});
	};

	handlePlaying(e) {
		this.setState({
			playing: e.target.checked,
		});
	}

	handleFinished(e) {
		this.setState({
			finished: e.target.checked,
		});
	}

	handleSystemSelect(system) {
		this.setState({
			system,
		});
	}

	handleTitleInput(title) {
		this.setState({
			title,
		});
	}

	handleCloseStatusMessage() {
		this.setState({
			error: false,
		});
	}

	render() {
		const { selectedGenres } = this.state;
		const { editMode } = this.props;
		return (
			<div>
				{editMode
					? <Button
							type="dashed"
							shape="circle"
							icon="edit"
							onClick={this.showModal}
						>
							{this.props.buttonTitle}
						</Button>
					: <Button
							type="primary"
							icon="plus-circle-o"
							onClick={this.showModal}
						>
							{this.props.buttonTitle}
						</Button>}
				<Modal
					title={
						editMode
							? 'Edit your Game 📝'
							: 'Add something to your Collection 🕹'
					}
					visible={this.state.visible}
					onOk={this.handleOk}
					onCancel={this.handleCancel}
					okText={editMode ? 'SAVE' : 'ADD'}
					cancelText="CANCEL"
					confirmLoading={this.state.loading}
				>
					<Input
						onChange={e => this.handleTitleInput(e.target.value)}
						className={styles.titleInput}
						placeholder="Game Title"
						defaultValue={this.state.title !== '' ? this.state.title : null}
					/>
					<Select
						showSearch
						className={styles.dropdown}
						placeholder="Select a System"
						optionFilterProp="children"
						defaultValue={editMode && this.props.system}
						onChange={e => this.handleSystemSelect(e)}
						filterOption={(input, option) =>
							option.props.value.toLowerCase().indexOf(input.toLowerCase()) >=
							0}
					>
						{// create systems from firebase data
						this.props.systems.map((system, index) => {
							return (
								<Option key={index} value={system.url}>{system.title}</Option>
							);
						})}
					</Select>
					<div className={styles.genreWrapper}>
						{genreTags.map(tag => (
							<CheckableTag
								key={tag}
								type="dashed"
								checked={selectedGenres.indexOf(tag) > -1}
								onChange={checked => this.handleChange(tag, checked)}
							>
								{tag}
							</CheckableTag>
						))}
					</div>
					<RadioGroup
						onChange={this.handleRegionChange}
						defaultValue={this.state.region}
						className={styles.radioGroup}
					>
						<RadioButton value="PAL">PAL</RadioButton>
						<RadioButton value="JAP">JAP</RadioButton>
						<RadioButton value="US">US</RadioButton>
					</RadioGroup>
					<div className={styles.checkboxGroup}>
						<Checkbox
							onChange={e => this.handlePlaying(e)}
							defaultChecked={this.state.playing}
						>
							playing
						</Checkbox>
						<Checkbox
							onChange={e => this.handleFinished(e)}
							defaultChecked={this.state.finished}
						>
							finished
						</Checkbox>
					</div>
					{this.state.error &&
						<Alert
							className={styles.errorMessage}
							message="Something is missing 🤔"
							description="Please check your input to add a new Game to your shiny collection.
							Does your Game have a Title, at least one Genre and a System selected?"
							type="error"
							closable
							onClose={() => this.handleCloseStatusMessage()}
							showIcon
						/>}
				</Modal>
			</div>
		);
	}
}

let component = AddGame;

const mapStateToProps = state => {
	return {
		...state,
	};
};

component = connect(mapStateToProps)(component);

export default component;
