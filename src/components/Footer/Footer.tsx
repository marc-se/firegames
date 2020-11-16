import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Col, Button } from "antd";

import { FooterContainer, FooterRow, RightAlignText } from "./StyledComponents";

const Footer = () => {
	const location = useLocation();
	return (
		<FooterContainer>
			<FooterRow>
				<Col span={2}>FireGames | {new Date().getFullYear()}</Col>
				<Col span={1} />
				<Col span={15}>
					{location.pathname !== "/cms" && (
						<Link to="/cms">
							<Button type="primary">Back</Button>
						</Link>
					)}
				</Col>
				<Col span={6}>
					<RightAlignText>v1.5.4</RightAlignText>
				</Col>
			</FooterRow>
		</FooterContainer>
	);
};

export default Footer;
