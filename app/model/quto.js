module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const QutoSchema = new Schema({
    uid: { type: String },
    market: { type: String }
  });

  return mongoose.model('Quto', QutoSchema, 'weex_quto');
}
