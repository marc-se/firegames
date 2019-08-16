export interface System {
	alias: string;
	finished: number;
	games: number;
	playing: number;
	title: string;
	untouched: number;
	url: string;
}

export interface Game {
	finished: boolean;
	genre: string;
	playing: boolean;
	region: string;
	title: string;
}

export interface Genre {
	title: string;
	url: string;
}
