import styled from "styled-components";
import { Input } from "antd";

export const Container = styled.div`
	height: 100vh;
	display: flex;
	align-items: center;
	padding-bottom: 12px;
	background: linear-gradient(to right, #eaecc6, #2bc0e4);
`;

export const LoginBox = styled.div`
	width: auto;
	max-width: 450px;
	margin: 0 auto;
`;

export const InputField = styled(Input)`
	margin: 0 0 12px 0 !important;
`;

export const FeedbackWrapper = styled.div`
	display: flex;
	justify-content: center;
	position: absolute;
	top: calc(50% - 120px);
	left: 50%;
	transform: translate(-50%, -50%);
`;
