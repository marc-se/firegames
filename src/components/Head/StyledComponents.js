import styled from "styled-components";
import { Layout } from "antd";
const { Header } = Layout;

export const Container = styled(Header)`
	background: white !important;
	height: 70px !important;
	.rightHeaderColumn {
		display: flex;
		flex-direction: row-reverse;
		align-items: center;
	}
`;

export const Brand = styled.img`
	width: 225px;
`;

export const Separator = styled.hr`
	border-top: 1px solid #ededed;
	margin: 10px 1em;
`;
