module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const CoinsDoOrderSchema = new Schema({
        create_time: { type: Number },  //订单创建时间
        uid: { type: String },
        price: { type: String },//商户订单金额（人民币金额）
       
        coin_sign: { type: String },
        cur_sign: { type: String },
        /////////////////
        order_number: { type: String },
        order_ptime: { type: String },
        order_status: { type: String },
        coin_rate: { type: String },
        coin_address: { type: String },
        coin_amount: { type: String },
        coin_wait: { type: String },
        coin_paid: { type: String },
        coin_cfmed: { type: String },
        valid_second: { type: String },
    });



    return mongoose.model('CoinsDoOrder', CoinsDoOrderSchema);
}
