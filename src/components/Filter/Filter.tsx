import React, { useState, useEffect } from "react";
// @ts-ignore
import { connect } from "react-redux";
import { Badge, Switch, Icon, Row } from "antd";
import firebase from "firebase/app";
import "firebase/database";

import * as SC from "./StyledComponents";

import { setPlayingFilter, setFinishedFilter, setUntouchedFilter } from "../../reducers/actions.js";
import { updateGlobalGamesStatusForSystems } from "../../utils/updateGlobalGamesStatusForSystems.js";

interface Props {
	selectedSystem?: string;
	dispatch?: any;
	showFinished?: boolean;
	showPlaying?: boolean;
	showUntouched?: boolean;
}

interface State {}

const Filter = (props: Props) => {
	const [playing, setPlaying] = useState(0);
	const [finished, setFinished] = useState(0);
	const [untouched, setUntouched] = useState(0);

	useEffect(() => {
		const { selectedSystem } = props;
		const systemRef = firebase.database().ref(`systems/${selectedSystem}`);
		if (selectedSystem !== "none") {
			systemRef.on("value", snap => {
				let data = snap.val();

				if (data.finished || data.untouched || data.playing) {
					setPlaying(data.playing);
					setFinished(data.finished);
					setUntouched(data.untouched);
				} else {
					updateGlobalGamesStatusForSystems(selectedSystem);
				}
			});
		} else {
			setPlaying(0);
			setFinished(0);
			setUntouched(0);
		}
	});

	const handlePlayingFilter = (e: boolean) => props.dispatch(setPlayingFilter(e));

	const handleFinishedFilter = (e: boolean) => props.dispatch(setFinishedFilter(e));

	const handleNeverPlayedFilter = (e: boolean) => props.dispatch(setUntouchedFilter(e));

	const { selectedSystem, showFinished, showPlaying, showUntouched } = props;
	const showStatistics = selectedSystem !== "none";

	return (
		<Row type="flex">
			<SC.Container span={24}>
				Playing
				<SC.ItemGroup>
					<Badge
						showZero={showStatistics ? true : false}
						count={playing}
						style={{
							backgroundColor: "#fff",
							color: "#999",
							boxShadow: "0 0 0 1px #d9d9d9 inset"
						}}
					/>
					<Switch
						checked={showPlaying}
						checkedChildren={<Icon type="check" />}
						unCheckedChildren={<Icon type="close" />}
						onChange={handlePlayingFilter}
						disabled={!showStatistics}
					/>
				</SC.ItemGroup>
			</SC.Container>
			<SC.Container span={24}>
				Finished
				<SC.ItemGroup>
					<Badge
						showZero={showStatistics ? true : false}
						count={finished}
						style={{
							backgroundColor: "#fff",
							color: "#999",
							boxShadow: "0 0 0 1px #d9d9d9 inset"
						}}
					/>
					<Switch
						checked={showFinished}
						checkedChildren={<Icon type="check" />}
						unCheckedChildren={<Icon type="close" />}
						onChange={handleFinishedFilter}
						disabled={!showStatistics}
					/>
				</SC.ItemGroup>
			</SC.Container>
			<SC.Container span={24}>
				Untouched
				<SC.ItemGroup>
					<Badge
						showZero={showStatistics ? true : false}
						count={untouched}
						style={{
							backgroundColor: "#fff",
							color: "#999",
							boxShadow: "0 0 0 1px #d9d9d9 inset"
						}}
					/>
					<Switch
						checked={showUntouched}
						checkedChildren={<Icon type="check" />}
						unCheckedChildren={<Icon type="close" />}
						onChange={handleNeverPlayedFilter}
						disabled={!showStatistics}
					/>
				</SC.ItemGroup>
			</SC.Container>
		</Row>
	);
};

let component = Filter;

const mapStateToProps = (state: State) => {
	return {
		...state
	};
};

// @ts-ignore
component = connect(mapStateToProps)(component);

export default component;
