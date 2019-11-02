import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Row, Col, Button } from "antd";

import { FooterContainer, RightAlignText } from "./StyledComponents";

const Footer = () => {
	const location = useLocation();
	return (
		<FooterContainer>
			<Row>
				<Col span={2}>FireGames | {new Date().getFullYear()}</Col>
				<Col span={16}>
					{location.pathname !== "/cms" && (
						<Link to="/cms">
							<Button type="primary">Back</Button>
						</Link>
					)}
				</Col>
				<Col span={6}>
					<RightAlignText>v1.5.0</RightAlignText>
				</Col>
			</Row>
		</FooterContainer>
	);
};

export default Footer;
