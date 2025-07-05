import crypto from 'crypto';
import Randomstring from 'randomstring';

/**
 * Generates a cryptographically secure random string of a given length.
 * Uses 'hex' encoding by default.
 * @param {number} length - The desired length of the string.
 * @param {BufferEncoding} encoding - The encoding to use (e.g., 'hex', 'base64').
 * @returns {string} The generated random string.
 */
export const generateSecureRandomString = (length = 32, encoding = 'hex') => {
  return crypto.randomBytes(Math.ceil(length / 2)).toString(encoding).slice(0, length);
};

/**
 * Generates a random string of a given length using Randomstring library.
 * This is generally faster but not cryptographically secure for sensitive data.
 * @param {number} length - The desired length of the string.
 * @param {object|string} options - Options for Randomstring.generate() or a charset string.
 * @returns {string} The generated random string.
 */
export const generateRandomString = (length = 32, options) => {
  return Randomstring.generate(options || length);
};

/**
 * Generates a random alphanumeric string.
 * @param {number} length - The desired length of the string.
 * @returns {string} The generated random alphanumeric string.
 */
export const generateRandomAlphanumeric = (length = 16) => {
  return Randomstring.generate({
    length,
    charset: 'alphanumeric'
  });
};

/**
 * Generates a random numeric string (OTP-like).
 * @param {number} length - The desired length of the numeric string.
 * @returns {string} The generated random numeric string.
 */
export const generateRandomNumeric = (length = 6) => {
  return Randomstring.generate({
    length,
    charset: 'numeric'
  });
};

/**
 * Generates a random integer within a specified range (inclusive).
 * @param {number} min - The minimum value of the range.
 * @param {number} max - The maximum value of the range.
 * @returns {number} A random integer within the specified range.
 */
export const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Generates a random float (number with decimals) within a specified range.
 * @param {number} min - The minimum value of the range.
 * @param {number} max - The maximum value of the range.
 * @param {number} [decimals=2] - The number of decimal places for the result.
 * @returns {number} A random float within the specified range.
 */
export const getRandomFloat = (min, max, decimals = 2) => {
  const str = (Math.random() * (max - min) + min).toFixed(decimals);
  return parseFloat(str);
};

/**
 * Selects a random element from an array.
 * @param {Array<T>} arr - The array to select from.
 * @returns {T | undefined} A random element from the array, or undefined if the array is empty.
 */
export const getRandomElement = (arr) => {
  if (!arr || arr.length === 0) {
    return undefined;
  }
  return arr[Math.floor(Math.random() * arr.length)];
};

/**
 * Shuffles an array in place using the Fisher-Yates algorithm.
 * @param {Array<T>} arr - The array to shuffle.
 * @returns {Array<T>} The shuffled array (mutated).
 */
export const shuffleArray = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]; // ES6 destructuring swap
  }
  return arr;
};

/**
 * Generates a random boolean value (true or false).
 * @param {number} [probabilityOfTrue=0.5] - The probability of returning true (0.0 to 1.0).
 * @returns {boolean} A random boolean value.
 */
export const getRandomBoolean = (probabilityOfTrue = 0.5) => {
  return Math.random() < probabilityOfTrue;
};

/**
 * Generates a random hex color code.
 * @returns {string} A random hex color code (e.g., "#RRGGBB").
 */
export const getRandomHexColor = () => {
  return '#' + ('000000' + Math.floor(Math.random()*16777215).toString(16)).slice(-6);
};

/**
 * Generates a universally unique identifier (UUID v4).
 * @returns {string} A UUID v4 string.
 */
export const generateUUID = () => {
  return crypto.randomUUID();
};