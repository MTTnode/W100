

const https = require('https');
var userInfo = {};

module.exports = app => {
    app.addSingleton('tg', createTg);
}


function createTg(config, app) {
    req = async function (url, fn) {
        return new Promise((resolve, reject) => {
            https.get(url, (res) => {
                var data = "";
                res.on('data', (d) => {
                    data += d;
                });
                res.on('end', () => {
                    data = JSON.parse(data);
                    return resolve(data);
                });

            }).on('error', (e) => {
                console.error(e);
                return resolve(null);
            });
        });
    }
    postRequest = async function (chat_id, text) {
        var postData = JSON.stringify({
            chat_id: chat_id,
            text: text
        })
        const options = {
            hostname: 'api.telegram.org',
            path: '/bot' + config.key + '/sendMessage',
            method: 'POST',
            headers: {
                'Content-Length': Buffer.byteLength(postData),
                'Content-Type': 'application/json; charset=UTF-8'

            }
        };
        return new Promise((resolve, reject) => {
            const req = https.request(options, res => {
                res.on('data', d => {
                    process.stdout.write(d);
                    return resolve();
                });
            });


            req.on('error', e => {
                console.error(e);
                return resolve();
            });
            req.write(postData);

            req.end();
        });

    }
    // 创建实例
    const client = {
        loopDBMessage: async function loopDBMessage(db) {
            if (Object.keys(userInfo).length == 0) {
                let flag = await this.resetUserInfo();
                if (flag == false) {
                    console.log("egg-tg 获取失败");
                    return;
                }
            }

            let sendInfos = await db.find({ send_flag: false });
            for (var i = 0; i < sendInfos.length; i++) {
                let sendinfo = sendInfos[i];
                await this.sendMsg("cc", sendinfo.message_type + ", " + sendinfo.create_time + " " + sendinfo.info);
                await db.update({ _id: sendinfo._id }, {
                    $set: {
                        send_flag: true
                    }
                });
            }
            return;
        },
        resetUserInfo: async function resetUserInfo() {
            let outRes = await req('https://api.telegram.org/bot' + config.key + '/getUpdates');
            if (outRes == null || !outRes.ok) {
                return false;
            }
            for (var i = 0; i < outRes.result.length; i++) {
                let chat = outRes.result[i].message.chat;
                userInfo[chat.last_name] = chat.id;
            }
            console.log(userInfo);
            console.log("egg-tg.resetUserInfo end");
            return true;
        },
        sendMsg: async function sendMsg(last_name, text) {
            console.log("egg-tg.sendMsg begin");
            let chatid = userInfo[last_name];
            await postRequest(chatid, text);
        }
    };

    return client;
}

// var a = createTg();
// a.resetUserInfo(() => {
//     console.log("end");
//     a.sendMsg("cc", "你好", () => {
//         console.log("end");
//     });
// });
