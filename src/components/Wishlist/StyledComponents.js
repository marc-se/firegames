import styled from "styled-components";
import { Table, Input } from "antd";

export const DataList = styled(Table)`
	&& {
		margin: 0 10px 70px 10px;
	}
`;

export const TextInput = styled(Input)`
	min-width: 300px;
`;

export const BtnWrapper = styled.div`
	margin: 0 10px;
	display: inline-flex;
`;

export const ContentWrapper = styled.div`
	min-height: 40vh;
	margin: 0 10px 10px 10px;
	padding-bottom: 20px;
`;

export const LoadingWrapper = styled.div`
	display: flex;
	justify-content: center;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
`;

export const WishlistFormWrapper = styled.div`
	margin-bottom: 10px;
	background-color: white;
	padding: 5px;
	${({ fixed }) => fixed && `box-shadow: 0px 12px 33px -25px rgba(0,0,0,0.9);`}
`;
