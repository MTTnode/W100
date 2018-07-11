
module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const PaymentWithdrawSchema = new Schema({
        create_time: { type: Number },  //订单创建时间
        uid: { type: String },      //用户ID
        platform: { type: String },      //支付平台 dora  blc

        channel: { type: String },   //用户的来源渠道标记
        payment_order_id: { type: Number }, //自己生成的唯一订单号(redis计数)
        
        /////////////////
        //支付方式  1、支付宝  2、微信  3、快捷  4、转账  
        bank_name: { type: String },    //支付宝、微信 平安银行
        card_no: { type: String },      //支付宝、微信 平安银行  账号/卡号
        card_name: { type: String },      //用户名称
        
        exchange_rate: { type: String },    //订单生成时汇率
        order_number: { type: String },     //订单号
        order_ptime: { type: String },      //确认时间
        order_status: { type: String },     //订单状态
        amount: { type: String },           //订单金额  (扣除手续费后将到账的法币)
        amount_usd:  { type: String },      //订单美元金额(原始提现请求)
        actual_amount: { type: String },    //实际到账（法币）
       
        trade_no: { type: String },         //支付公司的订单号
        client_ip: { type: String },        //客户请求生成订单时的IP
        callback_ip: { type: String },      //平台确认到账通知的IP
        
        amount_fee: { type: String },   //下单时的交易费(金额)
        platform_order_return: { type: String },   //去平台下单时，返回的订单信息

        order_post_data:  { type: String }, //订单审核过需要发送的请求数据
        //client_arg: { type: String },   //客户端的请求
        
    });


    return mongoose.model('PaymentWithdraw', PaymentWithdrawSchema);
}
