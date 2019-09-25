import styled from "styled-components";
import { Layout } from "antd";

const { Sider, Content } = Layout;

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
