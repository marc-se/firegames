import styled from "styled-components";
import { Col } from "antd";

export const Container = styled(Col)`
	padding: 5px 0;
	color: #292c33;
	align-items: center;
	display: flex !important;
	justify-content: space-between;
`;

export const ItemGroup = styled.div`
	> span {
		margin-right: 10px;
	}
`;
