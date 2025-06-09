const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

/**
 * Fetch JSON data from a given URL.
 * @param {string} url - The URL to fetch.
 * @param {object} options - Optional fetch config (headers, method, etc.).
 * @returns {Promise<object>} Parsed JSON data.
 */
const fetchJson = async (url, options = {}) => {
    try {
        const res = await fetch(url, options);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return await res.json();
    } catch (err) {
        console.error(`[fetchJson] ${err.message}`);
        throw err;
    }
};

/**
 * Fetch a file as buffer (image, audio, video, etc.)
 * @param {string} url
 * @param {object} options
 * @returns {Promise<Buffer>}
 */
const fetchBuffer = async (url, options = {}) => {
    try {
        const res = await fetch(url, options);
        if (!res.ok) throw new Error(`Failed to fetch buffer. Status: ${res.status}`);
        return await res.buffer();
    } catch (err) {
        console.error(`[fetchBuffer] ${err.message}`);
        throw err;
    }
};

/**
 * Delay execution
 * @param {number} ms - Milliseconds to wait
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Pick a random item from an array
 * @param {Array} list
 * @returns {*}
 */
const pickRandom = (list) => list[Math.floor(Math.random() * list.length)];

/**
 * Format bytes to human readable string
 * @param {number} bytes
 * @param {number} decimals
 * @returns {string}
 */
const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024,
        dm = decimals < 0 ? 0 : decimals,
        sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

/**
 * Get file type from extension or MIME
 * @param {string} filePathOrUrl
 * @returns {string}
 */
const getFileType = (filePathOrUrl) => {
    const ext = path.extname(filePathOrUrl).toLowerCase();
    if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') return 'image';
    if (ext === '.mp3' || ext === '.wav') return 'audio';
    if (ext === '.mp4' || ext === '.mov') return 'video';
    return 'file';
};

module.exports = {
    fetchJson,
    fetchBuffer,
    sleep,
    pickRandom,
    formatBytes,
    getFileType
};