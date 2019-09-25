import styled from "styled-components";
import { Layout } from "antd";

const { Footer, Sider, Content } = Layout;

export const Container = styled(Layout)`
	min-height: 100vh;
	background: white !important;
`;

export const SidebarContainer = styled.div`
	padding: 10px;
`;

export const Sidebar = styled(Sider)`
	background: white !important;
`;

export const ContentContainer = styled(Content)`
	background: white !important;
	padding: 30px;
	position: relative;
	border-left: 1px solid #ededed;
`;

export const Separator = styled.hr`
	border-top: 1px solid #ededed;
	margin: 10px 1em;
`;

export const InsideCol = styled.div`
	padding-bottom: 15px;
	display: flex;
	align-items: center;
	button {
		margin-right: 10px;
	}
	span {
		font-size: 12px;
	}
`;

export const Symbols = styled.div`
	margin-left: 10px;
	color: #777;
`;

export const FooterContainer = styled(Footer)`
	position: fixed;
	bottom: 0;
	left: 0;
	z-index: 1;
	background: #f7f7f7 !important;
	width: 100%;
	font-size: 12px !important;
`;

export const RightAlignText = styled.span`
	text-align: right;
	display: block;
`;
