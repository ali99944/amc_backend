import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import compression from "compression";
import cookieParser from "cookie-parser";
import ErrorHandlerMiddleware from "./middlewares/error_handler.js";
import { host, port, validateConfigFile } from "./lib/configs.js";
import { NOT_FOUND } from "./lib/status_codes.js";
import logger from "./lib/logger.js";
import { getLocalAudioStream } from "./lib/audio.js";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express();

app.use(cors());
app.use(express.json());

app.use('/storage', express.static(path.join(__dirname, './public')))

app.use(compression())
app.use(cookieParser())


app.get("/", (req, res) => {
    res.send("Hello World!");
});

// Route to stream audio files
app.get('/api/stream-audio', (req, res) => {
    try {
      const filePath = `./public/audios/audio_iZCtzzU4mW.mp3`;
      const audioStream = getLocalAudioStream(filePath);
      
      // Set appropriate headers
      res.set({
        'Content-Type': 'audio/mpeg', // Adjust based on your audio format
        'Transfer-Encoding': 'chunked'
      });
      
      // Pipe the audio stream to the response
      audioStream.pipe(res);
      
      // Handle errors
      audioStream.on('error', (err) => {
        console.error('Stream error:', err);
        if (!res.headersSent) {
          res.status(500).send('Error streaming audio');
        }
      });
      
    } catch (error) {
      console.error(error);
      res.status(404).send('Audio file not found');
    }
  });



const main = async () => {
    try{
        validateConfigFile()
        app.use(
            '/api',
            (await import('./routes/authenticaiton_route.js')).default,
            (await import('./routes/users_route.js')).default,
            (await import('./routes/manager_route.js')).default,
            (await import('./routes/songs_route.js')).default,
            (await import('./routes/genre_route.js')).default,
            (await import('./routes/artist_route.js')).default,
            (await import('./routes/playlist_route.js')).default,
            (await import('./routes/settings_route.js')).default,
            (await import('./routes/analytics_route.js')).default,
            (await import('./routes/statistics_route.js')).default,
            (await import('./routes/user_lists_route.js')).default
        )

        app.get('*', (req ,res) => {
            return res.status(NOT_FOUND).json({
                error: '404 Not Found',
                url: req.url
            })
        })

        app.use(ErrorHandlerMiddleware)

        app.listen(port, () => console.log(`[server] listening on ${host}:${port}`))
    }catch(err){
        logger.error(err.message)
    }
}

main()