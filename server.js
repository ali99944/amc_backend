import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import compression from "compression";
import cookieParser from "cookie-parser";
import { host, port, validateConfigFile } from "./lib/configs.js";
import { NOT_FOUND_STATUS } from "./lib/status_codes.js";
import logger from "./lib/logger.js";
import errorHandler from "./lib/error_handler.js";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express();

app.use(
    cors({
        origin: '*'
    })
);
app.use(express.json());

app.use('/storage', express.static(path.join(__dirname, './public')))

app.use(compression())
app.use(cookieParser())


const main = async () => {
    try{
        validateConfigFile()
        app.use(
            '/api',
            (await import('./routes/manager_route.js')).default,
            (await import('./routes/artist_route.js')).default,
            (await import('./routes/songs_route.js')).default,
            (await import('./routes/genre_route.js')).default,
            (await import('./routes/playlist_route.js')).default,
            (await import('./routes/user_playlist_route.js')).default,
            (await import('./routes/analytics_route.js')).default,
            (await import('./routes/statistics_route.js')).default,
            (await import('./routes/recommendation_route.js')).default,
            (await import('./routes/user_route.js')).default,
            (await import('./routes/manager_route.js')).default,
            (await import('./routes/interests_route.js')).default,
            (await import('./routes/favorites_route.js')).default,
            (await import('./routes/user_settings_route.js')).default,
            (await import('./routes/settings_route.js')).default,
            (await import('./routes/report_route.js')).default,
            (await import('./routes/terms_conditions_route.js')).default,
            (await import('./routes/privacy_policy_route.js')).default,
            (await import('./routes/contact_messages_route.js')).default,
            (await import('./routes/tag_route.js')).default,
            (await import('./routes/language_route.js')).default,
            (await import('./routes/permissions_route.js')).default,
        )

        app.get('*', (req ,res) => {            
            return res.status(NOT_FOUND_STATUS).json({
                error: '404 Not Found',
                url: req.url
            })
        })

        app.use(errorHandler)

        app.listen(port, () => console.log(`[server] listening on ${host}:${port}`))
    }catch(err){        
        logger.error(err.message)
    }
}

main()