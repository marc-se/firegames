import styled from "styled-components";
import { Input, Select, Radio, Alert } from "antd";

const RadioGroup = Radio.Group;

export const Genres = styled.div`
	margin: 10px 0;
	background: #ececec;
	padding: 10px;
	line-height: 30px;
	div {
		border: 1px dashed #c4c4c4;
	}
`;

export const InputField = styled(Input)`
	margin-bottom: 10px !important;
`;

export const RadioItemGroup = styled(RadioGroup)`
	margin-bottom: 10px !important;
`;

export const Dropdown = styled(Select)`
	width: 100%;
`;

export const CheckboxGroup = styled.div`
	display: flex;
`;

export const InputWrapper = styled.div`
	padding: 0 0 10px 0;
`;

export const Label = styled.label`
	margin-right: 5px;
`;

export const Error = styled(Alert)`
	margin-top: 20px !important;
`;
