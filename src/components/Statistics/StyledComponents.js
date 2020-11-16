import styled, { createGlobalStyle } from "styled-components";
import { Layout, Col } from "antd";

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
	background: white !important;
`;

export const CardContainer = styled.div`
	padding-bottom: 80px;
`;

export const CardHolder = styled(Col)`
	padding: 15px 5px;
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
