import React, { Component } from "react";
import { Tag } from "antd";
import firebase from "firebase/app";
import "firebase/database";

import { Genre } from "../../types/firebase";

const { CheckableTag } = Tag;

interface State {
	genreTags: Array<string>;
	selectedTags: Array<string>;
}

interface Props {
	onChange: (genres: Array<string>) => void;
}

export default class GenreTagList extends Component<Props, State> {
	state = {
		genreTags: [],
		selectedTags: []
	};

	componentDidMount() {
		const genreRef = firebase.database().ref(`genres`);
		genreRef.on("value", snap => {
			let data = snap.val();
			let genreTags: Array<string> = [];

			Object.keys(data).forEach(genre => {
				// add key to object
				data[genre].key = genre;
				// push object to genre list
				genreTags.push(data[genre]);
			});

			this.setState({
				genreTags
			});
		});
	}

	handleChange(tag: string, checked: boolean) {
		const { selectedTags } = this.state;
		const { onChange } = this.props;
		const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter(t => t !== tag);
		this.setState({
			selectedTags: nextSelectedTags
		});
		onChange(nextSelectedTags);
	}

	render() {
		const { genreTags, selectedTags } = this.state;
		return (
			<React.Fragment>
				{genreTags.map((tag: Genre) => {
					const tagName: string = tag.title;
					// @ts-ignore
					const isSelected = selectedTags.indexOf(tagName) > -1;
					return (
						<CheckableTag
							checked={isSelected}
							onChange={checked => this.handleChange(tagName, checked)}
						>
							{tagName}
						</CheckableTag>
					);
				})}
			</React.Fragment>
		);
	}
}
