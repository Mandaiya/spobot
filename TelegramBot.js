const TelegramBot = require('node-telegram-bot-api');
const SpotifyWebApi = require('spotify-web-api-node');

const token = '5164304737:AAFfRgQNILMzslHfomA86kSQpZiisKmRnv4';
const spotifyApi = new SpotifyWebApi({
  clientId: '22b6125bfe224587b722d6815002db2b',
  clientSecret: 'c9c63c6fbf2f467c8bc68624851e9773'
});

const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/search (.+)/, (msg, match) => {
  const fromId = msg.from.id;
  const searchTerm = match[1];
  spotifyApi.searchTracks(searchTerm)
    .then(data => {
      const tracks = data.body.tracks.items;
      const message = tracks.map(track => `*${track.name}* by ${track.artists[0].name}`).join('\n');
      bot.sendMessage(fromId, message, {parse_mode: 'Markdown'});
    })
    .catch(err => console.error(err));
});

bot.onText(/\/play (.+)/, (msg, match) => {
  const fromId = msg.from.id;
  const trackName = match[1];
  spotifyApi.searchTracks(trackName)
    .then(data => {
      const tracks = data.body.tracks.items;
      if (tracks.length === 0) {
        bot.sendMessage(fromId, 'No tracks found.');
        return;
      }
      const track = tracks[0];
      const audioStream = track.preview_url;
      bot.sendAudio(fromId, audioStream);
    })
    .catch(err => console.error(err));
});

// Implement playlist creation, user authentication, and natural language processing here

