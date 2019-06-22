import styled from "styled-components";
import { Layout } from "antd";

export const Container = styled.div`
	height: 100vh;
	max-height: 100vh;
	background-color: #fcfcfc;
	background-image: url(https://i.giphy.com/media/3o7buazaauRBkOsUaQ/giphy.webp);
	background-repeat: no-repeat;
	background-size: cover;
	background-attachment: fixed;
	background-position: center;
	position: relative;
`;

export const Message = styled.h1`
	font-size: 45px;
	color: white;
	letter-spacing: 2px;
	text-transform: uppercase;
	position: absolute;
	top: 80%;
	left: 50%;
	transform: translate(-50%, -50%);
	@media only screen and (min-width: 48em) {
		font-size: 74px;
	}
	@media only screen and (min-width: 62em) {
		font-size: 92px;
	}
`;
