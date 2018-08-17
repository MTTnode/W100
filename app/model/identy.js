module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const IdentySchema = new Schema({
    type: { type: String },
    uid: { type: String },
    name: { type: String },
    representatrive: { type: String },  //法人
    beneficial_name: { type: String },  //受益人
    birthday: { type: String },
    addr: { type: String },
    place: { type: String },  //永久居住地
    contact: { type: String },
    funds: { type: String },
    nationality: { type: String },  //国籍
    identy_number: { type: String },  //证件号码
    nature: { type: String },
    info: { type: String },
    sign: { type: String }, //法人签字
    create_time: { type: Date, default: Date.now },
    status: { type: String }  //“0”审核中“1”审核通过“2”审核未通过
  });

  return mongoose.model('Identy', IdentySchema, 'identy');
}
