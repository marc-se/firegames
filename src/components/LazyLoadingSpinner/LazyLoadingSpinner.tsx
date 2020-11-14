// @ts-nocheck
import React from "react";
import { Spin, Icon } from "antd";

import { Container } from "./StyledComponents";

const loadingIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

export default () => (
	<Container>
		<Spin indicator={loadingIcon} />
	</Container>
);
