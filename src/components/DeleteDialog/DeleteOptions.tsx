import React, { Component } from "react";
import { Button } from "antd";

import { DeleteOptionsContainer } from "./StyledComponents";

interface Props {
	onCancel: () => void;
	onOk: () => void;
}

const DeleteOptions = (props: Props) => {
	const onCancel = () => {
		const { onCancel } = props;
		onCancel();
	};

	const onOk = () => {
		const { onOk } = props;
		onOk();
	};

	return (
		<DeleteOptionsContainer>
			<Button size="small" onClick={onCancel}>
				CANCEL
			</Button>
			<Button size="small" type="danger" onClick={onOk}>
				DELETE
			</Button>
		</DeleteOptionsContainer>
	);
};

export default DeleteOptions;
