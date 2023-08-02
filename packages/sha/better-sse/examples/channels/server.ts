import path from 'path';
import express from 'express';
import {createSession} from '@sha/better-sse';
import {ticker} from './channels/ticker';

const app = express();

app.use(express.static(path.resolve(__dirname, "./public")));

app.get("/sse", async (req, res) => {
	const session = await createSession(req, res);

	/**
	 * Subscribe the session to all events broadcasted on the ticker channel.
	 */
	ticker.register(session);
});

const PORT = process.env.PORT ?? 8080;

app.listen(PORT, () => {
	console.log(
		`Server listening. Open http://localhost:${PORT} in your browser.`
	);
});
