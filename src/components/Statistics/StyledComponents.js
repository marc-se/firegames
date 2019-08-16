import styled, { createGlobalStyle } from "styled-components";
import { Layout, Row, Col } from "antd";

export const GlobalStyle = createGlobalStyle`
	.ant-card-body {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 200px;
	}
`;

export const Container = styled(Layout)`
	min-height: 100vh;
	background: #fcfcfc;
`;

export const Head = styled(Row)`
	margin: 40px 0;
	text-align: center;
`;

export const LargeHeading = styled.h1`
	font-size: 32px;
	letter-spacing: 3px;
	text-transform: uppercase;
`;

export const CardContainer = styled.div`
	padding-bottom: 60px;
`;

export const CardHolder = styled(Col)`
	padding: 15px;
	text-align: center;
	display: flex !important;
	justify-content: center;

	h3 {
		margin: 0;
		padding: 0;
		line-height: 18px;
		font-size: 18px;
	}

	span {
		font-size: 45px;
	}
`;

export const Bar = styled.div`
	position: fixed;
	bottom: -5px;
	left: 0;
	background: #fff;
	padding: 10px 0 15px 0;
	width: 100vw;
	box-shadow: 0px -9px 14px -10px rgba(204, 204, 204, 0.31);
`;
