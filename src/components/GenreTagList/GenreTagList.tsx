import React, { Component } from "react";
import firebase from "firebase/app";
import "firebase/database";

import { Genre } from "../../types/firebase";

import * as SC from "./StyledComponents";

interface State {
	genreTags: Array<string>;
	selectedTags: Array<string>;
}

interface Props {
	defaultValue?: Array<string>;
	onChange: (genres: Array<string>) => void;
}

export default class GenreTagList extends Component<Props, State> {
	state = {
		genreTags: [],
		selectedTags: []
	};

	componentDidMount() {
		const genreRef = firebase.database().ref(`genres`);
		const { defaultValue } = this.props;
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
				genreTags,
				selectedTags: defaultValue || []
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
						<SC.GenreTag
							checked={isSelected}
							key={tag.title}
							onChange={(checked: boolean) => this.handleChange(tagName, checked)}
						>
							{tagName}
						</SC.GenreTag>
					);
				})}
			</React.Fragment>
		);
	}
}
