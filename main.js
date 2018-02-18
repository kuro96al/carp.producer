const twitter = require('twitter');
const AWS = require('aws-sdk');
const fs = require('fs');
const Sentimental = require('./connection/models/Sentimental');

// aws config
AWS.config.loadFromPath('./aws-config.json');

//aws service
var s3 = new AWS.S3();
// s3.listBuckets(function(err, data) {
//   if (err) console.log(err, err.stack); // an error occurred
//   else     console.log(data);           // successful response
// });

var comprehend = new AWS.Comprehend();

//twitter
var twitterKey = JSON.parse(fs.readFileSync('./twitter-key.json', 'utf8'));
const client = new twitter(twitterKey);

var stream = client.stream('statuses/filter', { track: 'BTC' });

var out = [];
var date = new Date();
var now = date.getTime();

//streaming data
stream.on('data', function (event) {
    //comprehend
    var params = {
        LanguageCode: 'en', /* required */
        Text: event.text /* required */
    };
    comprehend.detectSentiment(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else console.log(data);           // successful response
        const sentimental = new Sentimental([
            data.Sentiment,
            data.SentimentScore.Mixed,
            data.SentimentScore.Neutral,
            data.SentimentScore.Negative,
            data.SentimentScore.Positive
        ]);

        //insert to mysql
        sentimental.add()
            .then((result) => { sentimental.end(); console.log(result); })
            .catch((result) => { sentimental.end(); console.log(result); });
    });

    var now_d = new Date(parseInt(now));
    var twitter_d = new Date(parseInt(event.timestamp_ms));
    //1時間ごとにS3に保存
    if (now_d.getHours() < twitter_d.getHours()) {
        var data = out;
        out = [];
        var d = new Date(parseInt(now));
        var year = d.getFullYear();
        var month = d.getMonth() + 1;
        var day = d.getDate();
        var hour = (d.getHours() < 10) ? '0' + d.getHours() : d.getHours();
        console.log(d);
        out.push({
            text: event.text,
            user_id: event.user.id,
            timestamp: event.timestamp_ms
        });
        s3.putObject({
            Bucket: 'carp-producer/twitter-data',
            Key: year + '-' + month + '-' + day + '-' + hour + '.json',
            Body: JSON.stringify(data),
            ContentType: "application/json"
        },
            function (err, data) {
                console.log(JSON.stringify(err), JSON.stringify(data));
            });
    }
});

stream.on('error', function (error) {
    throw error;
});


