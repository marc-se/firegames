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
	width: 25vw;
	margin: 0 auto;
`;

export const InputField = styled(Input)`
	margin: 0 0 12px 0 !important;
`;

export const LogoutBox = styled.div`
	display: flex;
	text-align: center;
	justify-content: center;
	align-items: center;
	position: relative;
	top: 10px;
	button {
		margin-left: 10px;
	}
`;
