import React from "react";

import { Row, Col } from "antd";

import { FooterContainer, RightAlignText } from "./StyledComponents";

const Footer = () => {
	return (
		<FooterContainer>
			<Row>
				<Col span={6}>FireGames | {new Date().getFullYear()}</Col>
				<Col span={12} />
				<Col span={6}>
					<RightAlignText>v1.5.0</RightAlignText>
				</Col>
			</Row>
		</FooterContainer>
	);
};

export default Footer;
