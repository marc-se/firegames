import styled from "styled-components";
import { List, Input } from "antd";

export const DataList = styled(List)`
	&& {
		margin: 0 10px 70px 10px;
	}
`;

export const ContentWrapper = styled.div`
	margin: 0 10px 10px 10px;
`;

export const TextInput = styled(Input)`
	min-width: 300px;
`;
