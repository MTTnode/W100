module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const WeexStatSchema = new Schema({
    uid: { type: String },
    event_type: { type: String },
    coin_type: { type: String },
    coin_amount: { type: String },
    source: { type: String },
    create_time: { type: Date, default: Date.now }
  });

  return mongoose.model('WeexStat', WeexStatSchema, 'weexStat');
}
