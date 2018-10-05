import React from "react";
import { Tag } from "antd";
import styled from "styled-components";
import * as firebase from "firebase";

const { CheckableTag } = Tag;

export default class GenreTagList extends React.Component {
	state = {
		genreTags: [],
		selectedTags: []
	};

	componentDidMount() {}

	render() {
		return (
			<React.Fragment>
				{genreTags.map(tag => (
					<CheckableTag
						key={tag}
						type="dashed"
						checked={selectedTags.indexOf(tag) > -1}
						onChange={checked => this.handleChange(tag, checked)}
					>
						{tag}
					</CheckableTag>
				))}
			</React.Fragment>
		);
	}
}
