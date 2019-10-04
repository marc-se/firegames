import React, { Fragment, useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/database";

import { Genre } from "../../types/firebase";

import * as SC from "./StyledComponents";

interface Props {
	defaultValue?: Array<string>;
	onChange: (genres: Array<string>) => void;
}

const GenreTagList = (props: Props) => {
	const [genreTags, setGenreTags] = useState([] as Array<Genre>);
	const [selectedTags, setSelectedTags] = useState([] as Array<string>);

	async function fetchTags() {
		try {
			const genreRef = await firebase.database().ref(`genres`);
			const { defaultValue } = props;
			await genreRef.on("value", snap => {
				let data = snap.val();
				let genreTags: Array<Genre> = [];

				Object.keys(data).forEach(genre => {
					data[genre].key = genre;
					genreTags.push(data[genre]);
				});

				setGenreTags(genreTags);
				setSelectedTags(defaultValue || []);
			});
		} catch (error) {
			console.error(error);
		}
	}

	useEffect(() => {
		fetchTags();
	}, []);

	function handleChange(checked: boolean, tag: string) {
		const { onChange } = props;
		const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter(t => t !== tag);
		setSelectedTags(nextSelectedTags);
		onChange(nextSelectedTags);
	}

	return (
		<Fragment>
			{genreTags.map((tag: Genre) => {
				const tagName: string = tag.title;
				const isSelected = selectedTags.indexOf(tagName) > -1;
				return (
					<SC.GenreTag
						checked={isSelected}
						key={tag.title}
						onChange={(checked: boolean) => handleChange(checked, tag.title)}
					>
						{tagName}
					</SC.GenreTag>
				);
			})}
		</Fragment>
	);
};

export default GenreTagList;
