import { Worker, Queue } from 'bullmq';
import redisConfig from '../configs/redis_connection.js';



// Initialize the queue
const audioTranscoderQueue = new Queue('audio_transcoder', redisConfig);

// Define the worker to process jobs
const worker = new Worker('audio_transcoder', async (job) => {
  try {
    
  } catch (error) {
    throw error;
  }
}, redisConfig);

await worker.waitUntilReady();

export default audioTranscoderQueue