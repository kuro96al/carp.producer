const AWS = require('aws-sdk');
const fs = require('fs');
const Sentimental = require('./connection/models/Sentimental');
const twitter = require('./twitter-streaming');

// aws config
AWS.config.loadFromPath('./aws-config.json');

//aws service
var s3 = new AWS.S3();
// s3.listBuckets(function(err, data) {
//   if (err) console.log(err, err.stack); // an error occurred
//   else     console.log(data);           // successful response
// });

var comprehend = new AWS.Comprehend();

//twitter stream
twitter.stream(streamConsume);
//other streams


var out = [];
var now = new Date().getTime();
var past;

//streaming data
function streamConsume(text) {
    past = now;
    now = new Date().getTime();
    //comprehend
    var params = {
        LanguageCode: 'en', /* required */
        Text: text /* required */
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

    out.push({
        text: text,
        timestamp: now
    });

    //1時間ごとにS3に保存
    if (new Date(past).getHours() < new Date(now).getHours()) {
        var data = out;
        out = [];
        var d = new Date(now);
        var year = d.getFullYear();
        var month = d.getMonth() + 1;
        var day = d.getDate();
        var hour = (d.getHours() < 10) ? '0' + d.getHours() : d.getHours();

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
}



