module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const WeexUserSchema = new Schema({
    name: { type: String },
    password: { type: String },
    role: { type: Number },  //0,管理员  1，普通用户
    isLogin: { type: Number },  //0,未登录  1，登陆过
    create_time: { type: Date, default: Date.now }
  });

  return mongoose.model('WeexUser', WeexUserSchema, 'weex_user');
}
