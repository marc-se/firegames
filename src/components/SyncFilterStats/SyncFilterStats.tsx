import React, { useState, useEffect } from "react";
import { Button, Row } from "antd";
// @ts-ignore
import { connect } from "react-redux";
import { updateGlobalGamesStatusForSystems } from "../../utils/updateGlobalGamesStatusForSystems.js";

import * as SC from "./StyledComponents";

interface Props {
	selectedSystem?: string;
}

interface State {
	loading: boolean;
}

const SyncFilterStats = (props: Props) => {
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const { selectedSystem } = props;
		setTimeout(() => setLoading(false), 1000);
		updateGlobalGamesStatusForSystems(selectedSystem);
	}, [loading]);

	const handleSync = () => {
		setLoading(true);
	};

	return (
		<Row type="flex">
			<SC.Container span={24}>
				Sync Filter Stats
				<Button icon="sync" size="small" loading={loading} onClick={handleSync}>
					Sync
				</Button>
			</SC.Container>
		</Row>
	);
};

let component = SyncFilterStats;

const mapStateToProps = (state: State) => {
	return {
		...state
	};
};

component = connect(mapStateToProps)(component);

export default component;
