module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const WeexVersionSchema = new Schema({
    version: { type: String },
    client: { type: String },
    update_status: { type: String },  //更新状态  0：不更新，1：提醒更新，2：强制更新
    create_time: { type: Date, default: Date.now },
    remark: { type: String },   //更新说明
    update_version: { type: String }   //强制更新版本
  });

  return mongoose.model('WeexVersion', WeexVersionSchema, 'weexVersion');
}
