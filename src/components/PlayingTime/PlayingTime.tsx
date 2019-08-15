import React, { Component } from "react";
import { Tooltip, Spin, Icon } from "antd";
// @ts-ignore
import { HowLongToBeatService } from "howlongtobeat";

interface State {
	hover: boolean;
	loading: boolean;
	playtime: string;
}

interface Props {
	title: string;
}

const Load = <Icon type="loading" style={{ fontSize: 24 }} spin />;

export default class PlayingTime extends Component<Props, State> {
	state = {
		hover: false,
		loading: true,
		playtime: ""
	};

	async getPlaytime(term: string) {
		let hltbService = new HowLongToBeatService();
		try {
			const result = await hltbService.search(term);
			if (result && result[0] && result[0].gameplayMain) {
				this.setState({ loading: false, playtime: `playtime: ~${result[0].gameplayMain} h` });
			} else {
				this.setState({ loading: false, playtime: "no data found" });
			}
		} catch (err) {
			this.setState({ loading: false, playtime: "playtime fetch failed" });
			console.log("fetch failed", err);
		}
	}

	changeHover = () => {
		const { hover } = this.state;
		this.setState({ hover: !hover });
	};

	render() {
		const { hover, loading, playtime } = this.state;
		const { title } = this.props;

		if (hover && playtime === "") {
			this.getPlaytime(title);
		}

		return (
			<div onMouseEnter={this.changeHover}>
				<Tooltip placement="topLeft" title={loading ? <Spin indicator={Load} /> : `${playtime}`}>
					{title}
				</Tooltip>
			</div>
		);
	}
}
