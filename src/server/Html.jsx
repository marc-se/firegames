/* @flow */
import React from 'react';

/**
 * Wrapper component containing HTML metadata and boilerplate tags.
 * Used in server-side code only to wrap the string output of the
 * rendered route component.
 *
 * The only thing this component doesn't (and can't) include is the
 * HTML doctype declaration, which is added to the rendered output
 * by the server.js file.
 */

type HtmlProps = {
	assets: {
		javascript: {
			client: string
		}
	}
}

export default function Html({ assets }: HtmlProps) {
	return (
		<html lang="de-DE">
			<head>
				<link rel="shortcut icon" href="/favicon.ico?v=3" />
				<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
				<link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
				<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
				<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
				<meta httpEquiv="Accept-CH" content="DPR, Viewport-Width, Width" />
			</head>
			<body>
				<div id="root" />
				<script src={assets.javascript.client} charSet="UTF-8" />
			</body>
		</html>
	);
}
