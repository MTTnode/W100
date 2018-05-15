module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const transactSchema = new Schema({
    base: { type: String  },
    markets: { type: String  }
  });

  return mongoose.model('Transact', transactSchema, 'transact');
}
