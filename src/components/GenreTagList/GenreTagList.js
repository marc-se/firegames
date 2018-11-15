import React from "react";
import { Tag } from "antd";
import firebase from "firebase/app";
import "firebase/database";

const { CheckableTag } = Tag;

export default class GenreTagList extends React.Component {
	state = {
		genreTags: [],
		selectedTags: []
	};

	componentDidMount() {
		const genreRef = firebase.database().ref(`genres`);
		genreRef.once("value", snap => {
			let data = snap.val();
			let genreTags = [];

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

	handleChange(tag, checked) {
		const { selectedTags } = this.state;
		const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter(t => t !== tag);
		this.setState({
			selectedTags: nextSelectedTags
		});
		this.props.onChange(nextSelectedTags);
	}

	render() {
		const { genreTags, selectedTags } = this.state;
		return (
			<React.Fragment>
				{genreTags.map(tag => (
					<CheckableTag
						key={tag.url}
						type="dashed"
						checked={selectedTags.indexOf(tag.title) > -1}
						onChange={checked => this.handleChange(tag.title, checked)}
					>
						{tag.title}
					</CheckableTag>
				))}
			</React.Fragment>
		);
	}
}
