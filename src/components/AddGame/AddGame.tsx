import React, { Component, ChangeEvent } from "react";
// @ts-ignore
import { connect } from "react-redux";
import { Modal, Button, Checkbox, Select, Radio, message } from "antd";
import firebase from "firebase/app";
import "firebase/database";
import * as SC from "./StyledComponents";

import GenreTagList from "../GenreTagList/GenreTagList";

import { updateGlobalGamesStatusForSystems } from "../../utils/updateGlobalGamesStatusForSystems.js";
import { System } from "../../types/firebase";

const RadioButton = Radio.Button;
const Option = Select.Option;

interface Props {
	editMode?: boolean;
	gameID?: string;
	system?: string;
	buttonTitle?: string;
	systems?: Array<System>;
}

interface State {
	visible: boolean;
	selectedGenres: Array<string>;
	title: string;
	system: string;
	region: string;
	playing: boolean;
	finished: boolean;
	error: boolean;
	loading: boolean;
}

class AddGame extends Component<Props, State> {
	state = {
		visible: false,
		selectedGenres: [],
		title: "",
		system: "null",
		region: "PAL",
		playing: false,
		finished: false,
		error: false,
		loading: false
	};

	componentDidMount() {
		const { editMode, gameID, system } = this.props;

		if (editMode) {
			const gameRef = firebase.database().ref(`games/${system}/${gameID}`);
			gameRef.once("value", snap => {
				let game = snap.val();
				this.setState({
					selectedGenres: [],
					title: game.title,
					system: game.system,
					region: game.region,
					playing: game.playing,
					finished: game.finished
				});
			});
		}
	}

	showModal = () => {
		this.setState({
			visible: true
		});
	};

	successMessage = (text: string) => {
		message.success(text, 3);
	};

	errorMessage = (text: string) => {
		message.error(text, 3);
	};

	updateGenresList = (genres: Array<string>) => {
		this.setState({
			selectedGenres: genres
		});
	};

	handleOk = () => {
		this.setState({
			loading: true
		});

		const { selectedGenres, title, region, playing, finished } = this.state;
		const { editMode, gameID, system } = this.props;
		const genres = selectedGenres.join();

		if (!editMode) {
			if (selectedGenres.length > 0 && title.length > 0 && this.state.system !== "null") {
				const addNodeAt = firebase.database().ref("games/" + this.state.system);

				let duplicates: boolean = false;

				// get snapshot of system node, where you´re trying to add a new node
				return addNodeAt
					.once("value", snap => {
						let obj = snap.val();

						/* check if existing game title & region matches your input title & region
						 * YES? -> add item to duplicates array
						 */
						for (let game in obj) {
							const value = obj[game];
							if (value.title === title && value.region === region) {
								duplicates = true;
								this.errorMessage("This Game is already in your collection 😧");
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
									region: region
								})
								.then(() => {
									const { system } = this.state;

									// find system node to update
									let updateStatisticsForSystem = firebase.database().ref(`systems/${system}/`);

									// update filter statistics
									updateGlobalGamesStatusForSystems(system);

									// get games count after adding a new game
									addNodeAt.once("value", snap => {
										let obj = snap.val();
										let gamesCount = Object.keys(obj).length;

										// update games count for statistics -> TODO
										updateStatisticsForSystem.update({
											games: gamesCount
										});
									});

									this.setState({
										visible: false,
										error: false,
										loading: false
									});
								})
								.catch(() => {
									this.errorMessage("Oooops, something went wrong... 😰");
									this.setState({
										loading: false
									});
								});
						}
					})
					.then(() => {
						// display success message
						this.successMessage("You successfully added a new Game to your collection! 🕹");
						return duplicates;
					})
					.catch(() => {
						this.errorMessage("Oooops, something went wrong... 😰");
						this.setState({
							loading: false
						});
					});
			} else {
				this.setState({
					error: true,
					loading: false
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
					region: region
				})
				.then(() => {
					this.successMessage("Edit successfull! 👍🏼");
					this.setState({
						visible: false,
						error: false,
						loading: false
					});
				})
				.catch(() => {
					this.errorMessage("Oooops, something went wrong... 😰");
					this.setState({
						loading: false
					});
				});
		}
	};

	handleCancel = () => {
		this.setState({
			loading: false,
			visible: false
		});
	};

	handleRegionChange = (e: ChangeEvent<HTMLInputElement>) => {
		this.setState({
			region: e.target.value
		});
	};

	handlePlaying = (e: any) => {
		this.setState({
			playing: e.target.checked
		});
	};

	handleFinished = (e: any) => {
		this.setState({
			finished: e.target.checked
		});
	};

	handleSystemSelect = (e: ChangeEvent<HTMLInputElement>) => {
		this.setState({
			system: e.target.value
		});
	};

	handleTitleInput = (e: ChangeEvent<HTMLInputElement>) => {
		this.setState({
			title: e.target.value
		});
	};

	handleCloseStatusMessage() {
		this.setState({
			error: false
		});
	}

	render() {
		const { editMode, buttonTitle, systems } = this.props;
		const { loading, title, playing, finished, visible, region, error } = this.state;
		return (
			<React.Fragment>
				{editMode ? (
					<Button type="dashed" shape="circle" icon="edit" onClick={this.showModal}>
						{buttonTitle}
					</Button>
				) : (
					<Button type="primary" icon="plus-circle-o" onClick={this.showModal}>
						{buttonTitle}
					</Button>
				)}
				<Modal
					title={editMode ? "Edit your Game 📝" : "Add something to your Collection 🕹"}
					visible={visible}
					onOk={this.handleOk}
					onCancel={this.handleCancel}
					okText={editMode ? "SAVE" : "ADD"}
					cancelText="CANCEL"
					confirmLoading={loading}
				>
					<SC.InputField
						onChange={this.handleTitleInput}
						placeholder="Game Title"
						defaultValue={title !== "" ? title : null}
					/>
					<SC.Dropdown
						showSearch
						placeholder="Select a System"
						optionFilterProp="children"
						defaultValue={editMode && this.props.system}
						onChange={this.handleSystemSelect}
						filterOption={(input: string, option: any) =>
							option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
						}
					>
						{// create systems from firebase data
						systems &&
							systems.map((system: System, index: number) => {
								return (
									<Option key={index} value={system.url}>
										{system.title}
									</Option>
								);
							})}
					</SC.Dropdown>
					<SC.Genres>
						<GenreTagList onChange={this.updateGenresList} />
					</SC.Genres>
					<SC.RadioItemGroup onChange={this.handleRegionChange} defaultValue={region}>
						<RadioButton value="PAL">PAL</RadioButton>
						<RadioButton value="JAP">JAP</RadioButton>
						<RadioButton value="US">US</RadioButton>
					</SC.RadioItemGroup>
					<SC.CheckboxGroup>
						<Checkbox onChange={this.handlePlaying} defaultChecked={playing}>
							playing
						</Checkbox>
						<Checkbox onChange={this.handleFinished} defaultChecked={finished}>
							finished
						</Checkbox>
					</SC.CheckboxGroup>
					{error && (
						<SC.Error
							message="Something is missing 🤔"
							description="Please check your input to add a new Game to your shiny collection.
							Does your Game have a Title, at least one Genre and a System selected?"
							type="error"
							closable
							onClose={() => this.handleCloseStatusMessage()}
							showIcon
						/>
					)}
				</Modal>
			</React.Fragment>
		);
	}
}

let component = AddGame;

const mapStateToProps = (state: State) => {
	return {
		...state
	};
};

component = connect(mapStateToProps)(component);

export default component;
