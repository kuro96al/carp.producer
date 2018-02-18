const Sentimental = require('./models/Sentimental');
const sentimental = new Sentimental(['NEUTRAL', 0,  0, 0, 0]);

sentimental.add()
           .then((result) => { console.log(result); })
           .catch((result) => { console.log(result); });
