const twitter = require('twitter');
const fs = require('fs');

//twitter
var twitterKey = JSON.parse(fs.readFileSync('./twitter-key.json', 'utf8'));
const client = new twitter(twitterKey);

var clientStream = client.stream('statuses/filter', { track: 'BTC' });

var twitterStreaming = (function () {
    function stream(callback) {
        clientStream.on('data', function (event) {
            callback(event.text);
        });
        clientStream.on('error', function (error) {
            throw error;
        });
    }

    return {
        stream: stream
    }
})();
module.exports = twitterStreaming;