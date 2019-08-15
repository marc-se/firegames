import React, { Component } from "react";
import { Tooltip, Spin, Icon } from "antd";
// @ts-ignore
import { HowLongToBeatService } from "howlongtobeat";

interface State {
	hover: boolean;
	loading: boolean;
}

interface Props {
	title: string;
}

// async function getPlaytime(term: string) {
// 	console.log("search term:", term);
// 	let hltbService = new HowLongToBeatService();
// 	try {
// 		const result = await hltbService.search(term);
// 		if (result && result[0] && result[0].gameplayMain) {
// 			console.log(term, result[0].gameplayMain);
// 			return result[0].gameplayMain;
// 		}
// 		return "no time found";
// 	} catch (err) {
// 		console.log("fetch failed", err);
// 	}
// }

// const PlayingTime = (props: Props) => {
// 	return (
// 		<Tooltip placement="topLeft" title={`${getPlaytime(props.title)}`}>
// 			{props.title}
// 		</Tooltip>
// 	);
// };

// export default PlayingTime;

const Load = <Icon type="loading" style={{ fontSize: 24 }} spin />;

export default class PlayingTime extends Component<Props, State> {
	state = {
		hover: false,
		loading: true
	};

	async getPlaytime(term: string) {
		console.log("search term:", term);
		let hltbService = new HowLongToBeatService();
		try {
			const result = await hltbService.search(term);
			if (result && result[0] && result[0].gameplayMain) {
				console.log(term, result[0].gameplayMain);
				this.setState({ loading: false });
				return result[0].gameplayMain;
			}
			return "no time found";
		} catch (err) {
			console.log("fetch failed", err);
		}
	}

	changeHover = () => {
		const { hover } = this.state;
		this.setState({ hover: !hover });
	};

	render() {
		const { hover, loading } = this.state;
		const { title } = this.props;

		if (hover) {
			return (
				<Tooltip
					placement="topLeft"
					title={loading ? <Spin indicator={Load} /> : `${this.getPlaytime(title)}`}
				>
					{title}
				</Tooltip>
			);
		}
		return <div onMouseEnter={this.changeHover}>{title}</div>;
	}
}
