// @ts-nocheck
import React from "react";
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from "antd";

import { Container } from "./StyledComponents";

const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

export default () => (
	<Container>
		<Spin indicator={loadingIcon} />
	</Container>
);
