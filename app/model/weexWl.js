module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const WeexWlSchema = new Schema({
    ip: { type: String },
    uid: { type: String },
    url: { type: String },
    content: { type: String }   //原因
  });

  return mongoose.model('WeexWl', WeexWlSchema, 'weex_wl');
}
