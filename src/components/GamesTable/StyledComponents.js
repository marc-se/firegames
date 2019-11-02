import styled from "styled-components";
import { Table, Badge } from "antd";

// GamesTable.js Components
export const TableContainer = styled(Table)`
	th {
		font-size: 12px !important;
	}
`;

export const LoadingSpinner = styled.div`
	width: 100%;
	min-height: 50vh;
	display: flex;
	justify-content: center;
	align-items: center;

	> div {
		display: flex;
		align-items: center;
		flex-direction: column;
	}
`;

export const SimpleBadge = styled(Badge)`
	display: flex !important;
	flex-direction: row-reverse !important;
	top: 10px;
	left: 10px;
	z-index: 1;
	p {
		margin-bottom: 0;
		line-height: 20px;
		letter-spacing: 1px;
	}
`;

export const DeleteEdit = styled.div`
	display: flex;
	button {
		margin-right: 10px;
	}
`;
