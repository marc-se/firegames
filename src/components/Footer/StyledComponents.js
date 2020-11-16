import styled from "styled-components";
import { Layout } from "antd";
import { Row } from "antd";

const { Footer } = Layout;

export const FooterContainer = styled(Footer)`
	position: fixed;
	bottom: 0;
	left: 0;
	z-index: 1;
	background: #f7f7f7 !important;
	width: 100%;
	font-size: 12px !important;
`;

export const FooterRow = styled(Row)`
	align-items: center;
`;

export const RightAlignText = styled.span`
	text-align: right;
	display: block;
`;
