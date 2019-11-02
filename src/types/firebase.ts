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
	playtime?: string;
}

export interface Genre {
	title: string;
	url: string;
}

export interface WishlistItem {
	key: string;
	title: string;
	system: string;
	purchased: boolean;
	region: string;
}
