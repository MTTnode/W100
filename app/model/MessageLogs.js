module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const MessageLogsSchema = new Schema({
        create_time: { type: String },
        message_type: { type: String },
        ip: { type: String },
        uid: { type: String },
        key: { type: String }, //关键字 如果是充值 可能是充值id

        info: { type: String },
        send_flag: { type: Boolean },

    });



    return mongoose.model('MessageLogs', MessageLogsSchema);
}
