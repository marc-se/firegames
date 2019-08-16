import styled from "styled-components";
import { Tag } from "antd";

const { CheckableTag } = Tag;

export const GenreTag = styled(CheckableTag)`
	border: ${({ checked }) => (checked ? "none" : "1px dashed grey !important")};
	&:hover {
		cursor: pointer;
	}
`;
