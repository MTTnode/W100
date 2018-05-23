module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const CoinsDoOrderSchema = new Schema({
        morder_id: { type: String },
        morder_name: { type: String },
        morder_price: { type: String },
        morder_time: { type: String },
        morder_notify: { type: String },
        merch_id: { type: String },
        coin_sign: { type: String },
        cur_sign: { type: String },
        weex_order_status: { type: String },
        /////////////////
        order_number: { type: String },
        order_ptime: { type: String },
        order_status: { type: String },
        coin_rate: { type: String },
        coin_address: { type: String },
        coin_amount: { type: String },
        coin_wait: { type: String },
        coin_paid: { type: Number },
        coin_cfmed: { type: Number },
        valid_second: { type: Number },
    });



    return mongoose.model('CoinsDoOrder', CoinsDoOrderSchema);
}
