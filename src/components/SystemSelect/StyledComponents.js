import styled from "styled-components";
import { Select } from "antd";

export const Container = styled(Select)`
	width: 100%;
	min-width: ${({ minwidth }) => (minwidth ? `${minwidth}px` : "inherit")};
	padding-bottom: 5px;
`;
