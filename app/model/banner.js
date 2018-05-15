module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const BannerSchema = new Schema({
    type: { type: Number  },
    imgurl: { type: String  },
    deturl: { type: String  },
    id: { type: String  }
  });

  return mongoose.model('Banner', BannerSchema, 'banner');
}
