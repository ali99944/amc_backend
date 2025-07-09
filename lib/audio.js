import { fileURLToPath } from "url";
import fs from 'fs';
import path from "path";
import { parseBuffer } from 'music-metadata';
import ffmpeg from 'fluent-ffmpeg';
import { PassThrough } from "stream";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Gets the duration of an audio file in seconds.
 * @param {string} filePath - The path to the audio file.
 * @returns {Promise<number>} The duration of the audio file in seconds.
 */
export async function getAudioDuration(filePath) {
    const fullPath = path.join(__dirname, '../', filePath);
    try {
        const metadata = await parseBuffer(fs.readFileSync(fullPath));
        return metadata.format.duration; // Duration in seconds
    } catch (error) {
        throw new Error(`Error reading metadata: ${error.message}`);
    }
}

/**
 * Converts seconds to a MM:SS format.
 * @param {number} seconds - The total seconds.
 * @returns {string} The formatted time string.
 */
export const secondsToMMSS = seconds => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

/**
 * Creates a readable stream for a local audio file.
 * @param {string} filePath - The path to the audio file.
 * @returns {PassThrough} A readable stream of the audio file.
 */
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

/**
 * Gets detailed metadata from an audio file.
 * @param {string} filePath - The path to the audio file.
 * @returns {Promise<import('music-metadata').IAudioMetadata>} The detailed metadata of the audio file.
 */
export async function getAudioMetadata(filePath) {
    const fullPath = path.join(__dirname, '../', filePath);
    try {
        const metadata = await parseBuffer(fs.readFileSync(fullPath));
        return metadata;
    } catch (error) {
        throw new Error(`Error reading metadata: ${error.message}`);
    }
}

/**
 * Converts an audio file to a different format.
 * @param {string} inputPath - The path to the input audio file.
 * @param {string} outputPath - The path to the output audio file.
 * @param {string} format - The target format (e.g., 'mp3', 'aac').
 * @returns {Promise<void>}
 */
export function convertAudio(inputPath, outputPath, format) {
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .toFormat(format)
            .on('end', () => resolve())
            .on('error', (err) => reject(new Error(`Error converting audio: ${err.message}`)))
            .save(outputPath);
    });
}

/**
 * Trims an audio file.
 * @param {string} inputPath - The path to the input audio file.
 * @param {string} outputPath - The path to the output audio file.
 * @param {number} startTime - The start time in seconds.
 * @param {number} duration - The duration to trim in seconds.
 * @returns {Promise<void>}
 */
export function trimAudio(inputPath, outputPath, startTime, duration) {
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .setStartTime(startTime)
            .setDuration(duration)
            .on('end', () => resolve())
            .on('error', (err) => reject(new Error(`Error trimming audio: ${err.message}`)))
            .save(outputPath);
    });
}

/**
 * Changes the volume of an audio file.
 * @param {string} inputPath - The path to the input audio file.
 * @param {string} outputPath - The path to the output audio file.
 * @param {number} volume - The volume multiplier (e.g., 1.5 for 150% volume).
 * @returns {Promise<void>}
 */
export function changeAudioVolume(inputPath, outputPath, volume) {
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .audioFilters(`volume=${volume}`)
            .on('end', () => resolve())
            .on('error', (err) => reject(new Error(`Error changing audio volume: ${err.message}`)))
            .save(outputPath);
    });
}

/**
 * Extracts album art from an audio file.
 * @param {string} filePath - The path to the audio file.
 * @param {string} outputPath - The path to save the extracted album art.
 * @returns {Promise<void>}
 */
export async function extractAlbumArt(filePath, outputPath) {
    try {
        const metadata = await getAudioMetadata(filePath);
        const picture = metadata.common.picture?.[0];
        if (picture) {
            fs.writeFileSync(outputPath, picture.data);
        } else {
            throw new Error('No album art found in the audio file.');
        }
    } catch (error) {
        throw new Error(`Error extracting album art: ${error.message}`);
    }
}


export const transcodeSong = async (inputPath, outputDir, baseName) => {
  const qualities = [
    { bitrate: '128k', suffix: '128' },
    { bitrate: '320k', suffix: '320' },
  ];

  for (const q of qualities) {
    await new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .audioBitrate(q.bitrate)
        .output(`${outputDir}/${baseName}_${q.suffix}.mp3`)
        .on('end', resolve)
        .on('error', reject)
        .run();
    });
  }
};