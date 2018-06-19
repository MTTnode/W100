module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const WeexBlSchema = new Schema({
    name: { type: String },
    password: { type: String },
    role: { type: Number },  //0,管理员  1，普通用户
    create_time: { type: Date, default: Date.now }
  });

  return mongoose.model('WeexUser', WeexBlSchema, 'weex_user');
}
