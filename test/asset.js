

const https = require('http');


const options = {
    hostname: '222.73.56.202',
    port: 7001    ,

    //  hostname: '127.0.0.1',
    // port: 59606    ,

    path: '/v1/user/asset',
    method: 'GET',
    headers: {
        ver: "V1.1.1",
        token: "EE88616B45C44803991B785F059B19AC",
        uid: 1,
        source: "ios"

    }
};

const req = https.request(options, res => {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);

    res.on('data', d => {
        process.stdout.write(d);
    });
});


req.on('error', e => {
    console.error(e);
});
req.end();
