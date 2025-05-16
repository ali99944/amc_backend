import { fileURLToPath } from "url"
import fs from 'fs'
import path from "path"
import {parseBuffer} from 'music-metadata'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

import { PassThrough } from "stream"

export async function getAudioDuration(filePath) {
    const fullPath = path.join(__dirname, '../', filePath)
    try {
      const metadata = await parseBuffer(fs.readFileSync(fullPath));
      return metadata.format.duration; // Duration in seconds
    } catch (error) {
      throw new Error(`Error reading metadata: ${error.message}`);
    }
}

export const secondsToMMSS = seconds => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
  
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};


export function getLocalAudioStream(filePath) {
  try {
    const absolutePath = path.resolve(filePath);
    
    if (!fs.existsSync(absolutePath)) {
      throw new Error('File not found');
    }

    const fileStream = fs.createReadStream(absolutePath);
    const audioStream = new PassThrough();
    
    fileStream.pipe(audioStream);
    
    return audioStream;
  } catch (error) {
    throw new Error(`Failed to create audio stream: ${error.message}`);
  }
}