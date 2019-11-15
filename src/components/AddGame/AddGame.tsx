import React, { Component, ChangeEvent } from "react";
// @ts-ignore
import { connect } from "react-redux";
import { Modal, Button, Checkbox, Select, Radio, message, InputNumber } from "antd";
import firebase from "firebase/app";
import "firebase/database";
import * as SC from "./StyledComponents";

import GenreTagList from "../GenreTagList/GenreTagList";

import { updateGlobalGamesStatusForSystems } from "../../utils/updateGlobalGamesStatusForSystems.js";
import { System, Game } from "../../types/firebase";

const RadioButton = Radio.Button;
const Option = Select.Option;

interface Props {
	disabled?: boolean;
	editMode?: boolean;
	gameID?: string;
	system?: string;
	title?: string;
	region?: string;
	buttonTitle?: string;
	systems?: Array<System>;
	size?: "small" | "default" | "large" | undefined;
	successCallback?: any;
}

interface State {
	visible: boolean;
	selectedGenres: Array<string>;
	title: string;
	system: string;
	region: string;
	playing: boolean;
	finished: boolean;
	time: string;
	error: boolean;
	loading: boolean;
}

class AddGame extends Component<Props, State> {
	state = {
		visible: false,
		selectedGenres: [],
		title: "",
		system: "",
		region: "PAL",
		playing: false,
		finished: false,
		time: "",
		error: false,
		loading: false
	};

	componentDidMount() {
		const { editMode, gameID, system, title, region } = this.props;

		if (region && system && title && !editMode) {
			this.setState({
				title,
				system,
				region
			});
		}

		if (editMode) {
			const gameRef = firebase.database().ref(`games/${system}/${gameID}`);
			gameRef.once("value", snap => {
				const game = snap.val();
				this.setState({
					selectedGenres: game.genre.split(","),
					title: game.title,
					system: game.system,
					region: game.region,
					playing: game.playing,
					finished: game.finished,
					time: game.playtime || 0
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

		const {
			selectedGenres,
			title,
			region,
			playing,
			finished,
			system: selectedSystem,
			time
		} = this.state;
		const { editMode, gameID, system } = this.props;
		const genres = selectedGenres.join();

		let node: Game = {
			title: title,
			playing: playing,
			finished: finished,
			genre: genres,
			region: region
		};

		if (time !== "") {
			node = {
				title: title,
				playing: playing,
				finished: finished,
				genre: genres,
				region: region,
				playtime: time
			};
		}

		if (!editMode) {
			if (selectedGenres.length > 0 && title.length > 0 && selectedSystem !== "") {
				const addNodeAt = firebase.database().ref("games/" + selectedSystem);

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
								.push(node)
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
						const { successCallback } = this.props;
						if (successCallback) {
							successCallback();
						}
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
				.set(node)
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
		const system = String(e);
		this.setState({
			system
		});
	};

	handleTimeChange = (value: number | undefined) => {
		if (value) {
			this.setState({
				time: value.toString()
			});
		}
	};

	handleTitleInput = (e: ChangeEvent<HTMLInputElement>) => {
		this.setState({
			title: e.target.value
		});
	};

	handleCloseStatusMessage = () => {
		this.setState({
			error: false
		});
	};

	render() {
		const { editMode, buttonTitle, systems, system, size, disabled } = this.props;
		const {
			loading,
			title,
			playing,
			finished,
			visible,
			region,
			error,
			time,
			system: selectedSystem,
			selectedGenres
		} = this.state;

		let systemDefaultVal = "";

		if (editMode && system) {
			systemDefaultVal = system;
		} else if (selectedSystem !== "") {
			systemDefaultVal = selectedSystem;
		}

		return (
			<React.Fragment>
				{editMode ? (
					<Button type="dashed" shape="circle" icon="edit" onClick={this.showModal}>
						{buttonTitle}
					</Button>
				) : (
					<Button
						size={size || "default"}
						type="primary"
						icon="plus-circle-o"
						onClick={this.showModal}
						disabled={disabled || false}
					>
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
						defaultValue={systemDefaultVal !== "" ? systemDefaultVal : undefined}
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
						<GenreTagList onChange={this.updateGenresList} defaultValue={selectedGenres || []} />
					</SC.Genres>
					<SC.InputWrapper>
						<SC.Label>Playtime:</SC.Label>
						<InputNumber
							defaultValue={parseFloat(time) || 0}
							min={0}
							max={999}
							step={0.5}
							onChange={this.handleTimeChange}
						/>
					</SC.InputWrapper>
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
							onClose={this.handleCloseStatusMessage}
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

// @ts-ignore
component = connect(mapStateToProps)(component);

export default component;
