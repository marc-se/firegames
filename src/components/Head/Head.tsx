import React from "react";
import { Row, Col } from "antd";

import logo from "../../assets/logo.svg";

import Logout from "../Logout/Logout";

import { Container, Brand, Separator } from "./StyledComponents";

interface Props {}

const Head = (props: Props) => {
	return (
		<React.Fragment>
			<Container>
				<Row type="flex" justify="start">
					<Col span={8}>
						<Brand src={logo} />
					</Col>
					<Col span={16} className="rightHeaderColumn">
						<Logout />
					</Col>
				</Row>
			</Container>
			<Separator />
		</React.Fragment>
	);
};

export default Head;
