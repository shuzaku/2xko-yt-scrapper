const https = require('https'); // <-- Add this at the top

/**
 * Retrieves a list of videos from a specified YouTube channel using the YouTube Data API.
 * Fetches both medium and long duration videos, returning them as an array.
 *
 * @param {Object} channel - The channel object containing YouTube channel information.
 * @param {string} channel.youtubeId - The YouTube channel ID to fetch videos from.
 * @returns {Promise<Array>} A promise that resolves to an array of video objects.
 */
function getVideos(channel) {
  return new Promise((resolve, reject) => {
    const maxResults = 10;
    var routeMedium = `https://www.googleapis.com/youtube/v3/search?key=AIzaSyBxA-A4ivOENnpEVYgHompe5dVVkCjPPNY&channelId=${channel.youtubeId}&part=snippet,id&order=date&type=video&videoDuration=medium&maxResults=${maxResults}`;
    var routeLong = `https://www.googleapis.com/youtube/v3/search?key=AIzaSyBxA-A4ivOENnpEVYgHompe5dVVkCjPPNY&channelId=${channel.youtubeId}&part=snippet,id&order=date&type=video&videoDuration=long&maxResults=${maxResults}`;

    let videos = [];
    let count = 0;

    // scrubbing channel...
    https.get(routeMedium, (resp) => {
      let data = '';

      // A chunk of data has been received.
      resp.on('data', (chunk) => {
        data += chunk;
      });

      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        try {
          data = JSON.parse(data);
          count += data.items.length
          videos.push(...data.items);
        } catch (err) {
          console.log("Error parsing JSON: " + err.message);
          reject(err);
        }
      });

    }).on("error", (err) => {
      console.log("Error: " + err.message);
      reject(err);
    });

    https.get(routeLong, (resp) => {
      let data = '';

      // A chunk of data has been received.
      resp.on('data', (chunk) => {
        data += chunk;
      });

      resp.on('end', () => {
        try {
          data = JSON.parse(data);
          if (data.items) {
            videos.push(...data.items); // <-- Fix: flatten array
            count += data.items.length;
            console.log(`youtube data retrieved: ${count} found`);
          }
          resolve(videos);
        } catch (err) {
          console.log("Error parsing JSON: " + err.message);
          reject(err);
        }
      });
    }).on("error", (err) => {
      console.log("Error: " + err.message);
      reject(err);
    });
  });
}

module.exports = { getVideos };