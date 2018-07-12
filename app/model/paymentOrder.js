//参考表 cash_deposit
module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const PaymentOrderSchema = new Schema({
        create_time: { type: Number },  //订单创建时间
        uid: { type: String },      //用户ID
        platform: { type: String },      //支付平台 dora  blc
        
        /////////////////
        //支付方式  1、支付宝  2、微信  3、快捷  4、转账  
        bank_name: { type: String },    //支付宝、微信 平安银行
        card_no: { type: String },      //支付宝、微信 平安银行  账号/卡号
        card_name: { type: String },      //用户名称
        //card_info: { type: String },    //{"card_type": "debit", "city": "\u5e02\u8f96\u533a", "card_branch": "\u9655\u897f\u7701\u897f\u5b89\u5e02", "province": "\u5317\u4eac\u5e02", "id_name": "\u738b\u6d9b"}

        exchange_rate: { type: String },    //订单生成时汇率
        order_number: { type: String },     //订单号
        order_ptime: { type: String },      //确认时间
        order_status: { type: String },     //订单状态
        amount: { type: String },           //订单金额
        amount_usd:  { type: String },      //订单美元金额
        actual_amount: { type: String },    //实际到账
        actual_amount_usd: { type: String },    //实际到账人民币转美元
        order_fee: { type: String },        //费用
        

        trade_no: { type: String },         //支付公司的订单号
        client_ip: { type: String },        //客户请求生成订单时的IP
        callback_ip: { type: String },      //平台确认到账通知的IP
        payment_order_id: { type: Number }, //自己生成的唯一订单号
        amount_fee: { type: String },   //下单时的交易费率
        platform_order_return: { type: String },   //去平台下单时，返回的订单信息
        source: { type: String },    //PC Android IOS  
    });


    return mongoose.model('PaymentOrder', PaymentOrderSchema);
}
