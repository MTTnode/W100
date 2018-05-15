module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const WeexHttpSchema = new Schema({
    method: { type: String  },
    url: { type: String  },
    params: { type: String },
    code: { type: Number },
    uid: { type: String  },
    ip: { type: String  },
    token: { type: String },
    create_time: { type: Date }
  });

  return mongoose.model('WeexHttp', WeexHttpSchema, 'weexhttp');
}
