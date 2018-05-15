module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const WeexBlSchema = new Schema({
    ip: { type: String },
    uid: { type: String },
    type: { type: Number, default: 0 },  //0,短暂屏蔽  1，永久屏蔽
    start_time: { type: Date, default: Date.now },
    end_time: { type: Date, default: Date.now},
    content: { type: String }   //屏蔽原因
  });

  return mongoose.model('WeexBl', WeexBlSchema, 'weex_bl');
}
