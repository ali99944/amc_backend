import * as dotenv from 'dotenv'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({
    path: path.join(__dirname, '../.env')
})

import { readFileSync } from 'fs'
import Handlebars from 'handlebars'

export const json_web_token_expires_in = process.env.USER_JSON_WEB_TOKEN_EXPIRES_IN

export const admin_web_token_key = process.env.ADMIN_WEB_TOKEN_KEY
export const user_json_web_token_key = process.env.USER_JSON_WEB_TOKEN_KEY;
export const user_json_web_token_expires_in = process.env.USER_JSON_WEB_TOKEN_EXPIRES_IN

export const smtp_host = process.env.SMTP_HOST || "smtp.ethereal.email";
export const smtp_port = process.env.SMTP_PORT || 587;
export const smtp_user = process.env.SMTP_USER || "yourEmail@gmail.com";
export const smtp_pass = process.env.SMTP_PASS || "yourPassword";

export const mail_activation_template = readFileSync('templates/activation_email_template.html', 'utf8')
export const compiled_mail_activation_template = Handlebars.compile(mail_activation_template)


export const port = process.env.PORT
export const host = process.env.HOST
export const environment = process.env.NODE_ENV
export const is_development = environment === 'development'

export const storage_url = process.env.STORAGE_URL || 'http://localhost:4001/storage'



export const validateConfigFile = () => {
    
    if (!json_web_token_expires_in) {
        throw new Error('JSON_WEB_TOKEN_EXPIRES_IN is not defined in .env file');
    }
    if (!smtp_host) {
        throw new Error('MAIL_HOST is not defined in .env file');
    }
    if (!smtp_port) {
        throw new Error('MAIL_PORT is not defined in .env file');
    }
    if (!smtp_user) {
        throw new Error('MAIL_USERNAME is not defined in .env file');
    }
    if (!smtp_pass) {
        throw new Error('MAIL_PASSWORD is not defined in .env file');
    }
    if(!admin_web_token_key){
        throw new Error('ADMIN_WEB_TOKEN_KEY is not defined in .env file');
    }
}