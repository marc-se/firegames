import styled from "styled-components";
import { Select } from "antd";

export const Container = styled(Select)`
	width: 100%;
	min-width: ${({ minWidth }) => (minWidth ? `${minWidth}px` : "inherit")}
	padding-bottom: 5px;
`;
