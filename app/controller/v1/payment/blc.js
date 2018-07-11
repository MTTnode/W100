'use strict';

const Controller = require('egg').Controller;
const _ = require("lodash");
let dateFormat = require('date-format');
let crypto = require('crypto');
const moment = require('moment');

let OrderStatus = {
    "notArrived": "1", //未到账 ,等待支付
    "partialPayment": "2", //2部分支付
    //"waitingForConfirmation": "3",
    "Arrived": "10", //到账
    //"cancel": "20", //主动取消
    //"cancel_": "21", //被动取消
    //"cancel_22": "22", //不完整的订单取消
    "exception": 222, //异常
}

let bank_ = {
    "中国工商银行": 1, //ICBC
    "招商银行": 2, //CMB
    "中国建设银行": 3, //CCB
    "中国农业银行": 4, //ABC
    "中国银行": 5, //BOC
    "交通银行": 6, //BCM
    "中国民生银行": 7, //CMBC
    "中信银行": 8, //ECC

};

let arr_banks_info = [{
        bank_id: 1,
        bank_name: "中国工商银行",
        abbreviation: "ICBC"
    },
    {
        bank_id: 2,
        bank_name: "招商银行",
        abbreviation: "CMB"
    },
    {
        bank_id: 3,
        bank_name: "中国建设银行",
        abbreviation: "CCB"
    },
    {
        bank_id: 4,
        bank_name: "中国农业银行",
        abbreviation: "ABC"
    },
    {
        bank_id: 5,
        bank_name: "中国银行",
        abbreviation: "BOC"
    },
    {
        bank_id: 6,
        bank_name: "交通银行",
        abbreviation: "BCM"
    },
    {
        bank_id: 7,
        bank_name: "中国民生银行",
        abbreviation: "CMBC"
    },
    {
        bank_id: 8,
        bank_name: "中信银行",
        abbreviation: "ECC"
    },
];


class BlcController extends Controller {

    getLockKey(uid) {
        return "LOCK_PAY_BLC_" + uid;
    };

    MD5(content) {
        var md5 = crypto.createHash('md5');
        md5.update(content);
        return md5.digest('hex');
    }

    /**
     * 充值
     */
    async generateOrders() {
        const {
            ctx,
            service,
            app
        } = this;
        ctx.helper.pre("generateOrders", {
            //header
            ver: {
                type: 'string'
            },
            source: {
                type: 'string'
            },
            uid: {
                type: 'string'
            },
            token: {
                type: 'string'
            },
            ////body
            bank_name: {
                type: 'string'
            },
            card_name: {
                type: 'string'
            },
            card_no: {
                type: 'string'
            },
            amount: {
                type: 'number'
            },
        });

        let retBody = {
            code: 1000,
            message: "OK",
            cash_sell_rate: "", //汇率
            amount: "", //请求金额
            amount_usd: "", //美元金额
            order_number: "", //订单号
            urlpay: "", //充值订单URL
        };

        let redis = this.ctx.app.redis;
        //生成weexid  需要此处用来计数吗？
        let strKey = this.ctx.service.payment.getPaymentOrderId();
        let nOrderId = await redis.incr(strKey);

        //console.log(ctx.querystring);
        //console.log(ctx.request.body);

        //从配置文件获取基础的配置数据
        let api_key = this.config.w100Payment.client.dora.api_key;
        let company_id = this.config.w100Payment.client.dora.company_id;
        let notify_url = this.config.w100Payment.client.dora.callbackurl;
        let urlBase = this.config.w100Payment.client.dora.url;
        let charset = this.config.w100Payment.client.dora.charset;
        let api_version = this.config.w100Payment.client.dora.api_version;
        //单笔充值的最大最小额度
        let amount_min = this.config.w100Payment.client.dora.amount.amount_min;
        let amount_max = this.config.w100Payment.client.dora.amount.amount_max;
        // let app_id = "app_id_weex"; //Y
        // let _format = "app_id_weex"; //Y

        //商户用户在商户系统存在的唯一ID
        let player_id = this.ctx.arg.uid;
        //参数名称：商家订单金额以元为单位，精确到小数点后两位.例如：12.01
        let amount_money = this.ctx.arg.amount;
        //1：支付宝 2：微信 3：银行卡
        let channel_code = 1; //目前仅支持支付宝
        //1:mobile 2:pc
        let terminal = 1;
        if ('web' == this.ctx.arg.source) {
            terminal = 2;
        }
        //账户名
        let name = this.ctx.arg.card_name;
        //账户号
        let card_no = this.ctx.arg.card_no;
        //请求方的IP地址
        let client_ip = this.ctx.ip;

        let n = isNaN(player_id);
        //用户ID的校验
        if (true == isNaN(player_id) || Number.parseInt(player_id) <= 0) {
            retBody.code = 1003;
            retBody.message = "用户ID异常" + player_id;
            ctx.body = retBody;
            ctx.helper.end("generateOrders");
            return;
        }

        //amount_money校验
        if (true == isNaN(amount_money) || amount_money < amount_min || amount_money > amount_max) {
            retBody.code = 1004;
            retBody.message = "充值金额异常" + amount_money;
            ctx.body = retBody;
            ctx.helper.end("generateOrders");
            return;
        }


        let nowTime = new Date();
        let _timestamp = dateFormat.asString('yyyyMMdd hhmmss', nowTime);
        //生成订单号 20180615182727870-->可以考虑外加用户ID
        let company_order_num = dateFormat.asString('yyyyMMddhhmmssSSS', new Date());
        company_order_num = company_order_num + "" + player_id;
        //let trade_no = company_order_num;
        //console.log('=======================生成订单号========================', company_order_num);

        //获取当前汇率 schedule s10.js从python那边定时拉取数据
        let rate = app.weexHttps.getRate();
        //console.log('=======================获取当前汇率========================', rate);
        if (undefined == rate || null == rate || undefined == rate.cash_sell_rate || null == rate.cash_sell_rate) {
            retBody.code = 1001;
            retBody.message = "error, 服务器获取汇率失败,请稍后再试!";
            ctx.body = retBody;
            ctx.helper.end("generateOrders");

            this.logger.error("[dora.generateOrders]获取汇率失败");
            return;
        }

        //手续费
        let amount_fee = this.config.w100Payment.client.dora.fees.fees_pc;
        if ('web' != this.ctx.arg.source) {
            amount_fee = this.config.w100Payment.client.dora.fees.fees_mobile;
        }

        //有效性加粗略的判断
        if (amount_fee > 100 || amount_fee < 0) {
            retBody.code = 1005;
            retBody.message = "error, 手续费费率异常!";
            ctx.body = retBody;
            ctx.helper.end("generateOrders");

            this.logger.error("[dora.generateOrders]手续费费率异常");
            return;
        }

        //扣除费率后的usd
        let usd = Math.floor(((amount_money * (100 - amount_fee) / 100) / rate.cash_sell_rate) * 100) / 100;


        retBody.cash_sell_rate = rate.cash_sell_rate;
        retBody.amount = amount_money;
        retBody.amount_usd = usd;

        let sign = this.MD5("company_id=" + company_id + "&company_order_num=" + company_order_num + "&player_id=" + player_id + "&amount_money=" + amount_money +
            "&api_version=" + api_version + "&channel_code=" + channel_code + api_key);

        //存mongodb的数据
        let objOrder = {
            create_time: nowTime.getTime(), //订单创建时间
            uid: this.ctx.arg.uid, //用户ID
            platform: "dora", //支付平台
            bank_name: this.ctx.arg.bank_name, //支付宝、微信 平安银行
            card_no: this.ctx.arg.card_no, //支付宝、微信 平安银行  账号/卡号
            card_name: this.ctx.arg.card_name, //卡对应的用户名称
            //card_info: {}, //{"card_type": "debit", "city": "\u5e02\u8f96\u533a", "card_branch": "\u9655\u897f\u7701\u897f\u5b89\u5e02", "province": "\u5317\u4eac\u5e02", "id_name": "\u738b\u6d9b"}

            order_number: company_order_num, //订单号
            //order_ptime: { type: String },      //确认时间
            order_status: OrderStatus["notArrived"], //订单状态 默认未到账
            amount: this.ctx.arg.amount, //订单金额
            amount_usd: usd, //订单美元金额
            //actual_amount: { type: String },    //实际到账
            //order_fee: { type: String },        //费用
            exchange_rate: rate.cash_sell_rate, //到账时汇率
            client_ip: client_ip, //客户请求生成订单时的IP
            payment_order_id: nOrderId, //唯一的订单号
            amount_fee: amount_fee, //下单时的交易费率
        };

        let obj = await this.ctx.service.payment.create(ctx.model.PaymentOrder, objOrder);
        if (obj) {
            let urlMore = "?app_id=&format=&timestamp=" + _timestamp + "&charset=" + charset + "&api_version=" + api_version + "&client_ip=" + client_ip + "&sign=" + sign;
            let biz_content = {
                "company_id": company_id,
                "company_order_num": company_order_num,
                "player_id": player_id,
                "terminal": terminal,
                "channel_code": channel_code,
                "notify_url": notify_url,
                "amount_money": amount_money,
                "extra_param": null,
                "name": name,
                "card_no": card_no
            }
            let urlPayOrder = urlBase + urlMore + "&biz_content=" + JSON.stringify(biz_content);
            retBody.urlpay = urlPayOrder;

            retBody.order_number = company_order_num;

            this.logger.info("[dora.generateOrders]生成订单", amount_fee, urlPayOrder);
        } else {
            retBody.code = 1002;
            retBody.message = "error, db创建订单失败!";
        }


        ctx.body = retBody;
        ctx.helper.end("generateOrders");
    }


    /**
     * 查询充值记录
     */
    async getOrdersList() {
        const {
            ctx,
            service,
            app
        } = this;
        ctx.helper.pre("getOrdersList", {
            //header
            ver: {
                type: 'string'
            },
            source: {
                type: 'string'
            },
            uid: {
                type: 'string'
            },
            token: {
                type: 'string'
            },
        });


        //1、根据用户id查询订单记录
        let objQuery = {
            uid: this.ctx.arg.uid,
            platform: "blc",
        };

        let jsonSort = {
            create_time: -1
        };

        let nLimit = 50;

        let retOrders = await this.ctx.service.payment.queryList(ctx.model.PaymentOrder, objQuery, jsonSort, nLimit);

        let results = [];

        for (var i = 0; i < retOrders.length; i++) {

            //显示时，截断入账显示
            let usd = 0;
            if (undefined != retOrders[i].actual_amount_usd && null != retOrders[i].actual_amount_usd) {
                usd = Math.floor(retOrders[i].actual_amount_usd * 100) / 100;
            }

            let actual_amount = 0;
            if (undefined != retOrders[i].actual_amount && null != retOrders[i].actual_amount) {
                actual_amount = retOrders[i].actual_amount;
            }

            usd = "" + usd;
            actual_amount = "" + actual_amount;

            let info = retOrders[i].platform_order_return;
            if (!info) {
                continue;
            }
            let data = JSON.parse(info);
            if (!data) {
                continue;
            }

            let collectionAccountBankID = data.collectionAccountBankID;
            let platform_order_bank_name = "";
            for (let i = 0; i < arr_banks_info.length; i++) {
                if (collectionAccountBankID == arr_banks_info[i].bank_id) {
                    platform_order_bank_name = arr_banks_info[i].bank_name;
                    break;
                }
            }

            let platform_order_info = {
                "accountNumber": data.accountNumber,
                "accountName": data.accountName,
                "amount": data.amount,
                "email": data.email,
                "transactionDate": data.transactionDate,
                "remarks": data.remarks,
                "bankBranch": data.bankBranch,
                "bank_name": platform_order_bank_name,
            };


            results.push({
                create_time: retOrders[i].create_time,
                order_number: retOrders[i].order_number,

                bank_name: retOrders[i].bank_name,
                card_no: retOrders[i].card_no,
                card_name: retOrders[i].card_name,

                order_status: retOrders[i].order_status,
                amount: retOrders[i].amount,
                amount_usd: retOrders[i].amount_usd,
                actual_amount: actual_amount,
                actual_amount_usd: usd,
                amount_fee: retOrders[i].amount_fee,

                platform_order_info: platform_order_info,
            });
        }

        ctx.body = {
            code: 1000,
            data: results,
            message: results == null ? "error" : "OK",
        };

        ctx.helper.end("getOrdersList");
    }

    /**
     * 查询手续费费率
     */
    async getTradingInfo() {
        const {
            ctx,
            service,
            app
        } = this;
        ctx.helper.pre("getTradingInfo", {
            //header
            ver: {
                type: 'string'
            },
            source: {
                type: 'string'
            },
            uid: {
                type: 'string'
            },
            token: {
                type: 'string'
            },
        });

        let rate = app.weexHttps.getRate();
        let cash_sell_rate = null;
        if (rate) {
            cash_sell_rate = rate.cash_sell_rate;
        }

        if (!rate) {
            ctx.body = {
                code: 1001,
                data: {},
                message: "汇率获取失败",
            };;
            ctx.helper.end("getTradingInfo");
            return;
        }


        let fees = this.config.w100Payment.client.dora.fees;
        let amount = this.config.w100Payment.client.dora.amount;


        if (!fees || !amount) {
            ctx.body = {
                code: 1002,
                data: {},
                message: "配置文件异常",
            };;
            ctx.helper.end("getTradingInfo");
            return;
        }

        let jsonInfo = {
            "fees": fees,
            "amount": amount,
            "bank": arr_banks_info,
            "rate": cash_sell_rate
        }


        ctx.body = {
            code: 1000,
            data: jsonInfo,
            message: "OK",
        };



        ctx.helper.end("getOrdersList");
    }

    /**
     * 回调 depositApply
     */
    async depositApply() {
        const {
            ctx,
            service,
            app
        } = this;
        ctx.helper.pre("depositApply", {
            //header
            ver: {
                type: 'string'
            },
            source: {
                type: 'string'
            },
            uid: {
                type: 'string'
            },
            token: {
                type: 'string'
            },
            ////body
            bank_name: {
                type: 'string'
            },
            card_name: {
                type: 'string'
            },
            card_no: {
                type: 'string'
            },
            amount: {
                type: 'number'
            },

        });

        let redis = this.ctx.app.redis;
        //生成weexid  需要此处用来计数吗？
        let strKey = this.ctx.service.payment.getPaymentOrderId();
        let nOrderId = await redis.incr(strKey);



        let retBody = {
            code: 1000,
            message: "OK",
            cash_sell_rate: "", //汇率
            amount: "", //请求金额
            amount_usd: "", //美元金额
            order_number: "", //订单号
            platform_order_info: {}, //平台生成的订单详情
        };

        let keyConfig = this.config.w100Payment.client.blc.keyConfig;
        //商户ID：支付系统提供给商户的数字编码
        let merchantID = this.config.w100Payment.client.blc.merchantID;
        //url 地址
        let urlDepositApply = this.config.w100Payment.client.blc.url_DepositApply;
        //单笔充值的最大最小额度
        let amount_min = this.config.w100Payment.client.blc.amount.amount_min;
        let amount_max = this.config.w100Payment.client.blc.amount.amount_max;
        //商户网址域名
        let webUrl = this.config.w100Payment.client.blc.webUrl;

        //金额：数字，必须两位小数点，无千位符
        let amount = this.ctx.arg.amount;

        //用户ID：用户在商户平台使用的账户号，字符串
        let userID = this.ctx.arg.uid;
        //将用来转账的银行卡卡号
        let bankAccountNumber = this.ctx.arg.card_no; //"6227002432330218252";
        //将用来转账的银行卡卡主名字
        let bankAccountName = this.ctx.arg.card_name;

        let bank_name = this.ctx.arg.bank_name;

        //使用终端：1电脑端2手机端3平板9其他
        let terminal = 2;
        if ('web' == this.ctx.arg.source) {
            terminal = 1;
        }
        //请求方的IP地址
        let ip_address = this.ctx.ip;


        //用户ID的校验
        if (true == isNaN(userID) || Number.parseInt(userID) <= 0) {
            retBody.code = 1001;
            retBody.message = "用户ID异常" + userID;
            ctx.body = retBody;
            ctx.helper.end("depositApply");
            return;
        }


        //amount校验
        if (true == isNaN(amount) || amount < amount_min || amount > amount_max) {
            retBody.code = 1002;
            retBody.message = "充值金额异常" + amount;
            ctx.body = retBody;
            ctx.helper.end("depositApply");
            return;
        }

        /*
        amount = amount.toFixed(2);
        if(amount.toString().split(".")[1].length!=2){
            retBody.code = 1003;
            retBody.message = "充值金额异常,必须2位小数" + amount;
            ctx.body = retBody;
            ctx.helper.end("depositApply");
            return;
        }
        */



        //银行编码：用户发起充值的银行，编码详情见附件5.2
        let bankID = 0;
        for (let i = 0; i < arr_banks_info.length; i++) {
            if (bank_name == arr_banks_info[i].bank_name) {
                bankID = arr_banks_info[i].bank_id;
                break;
            }
        }

        if (bankID <= 0) {
            retBody.code = 1004;
            retBody.message = "不支持应该银行卡转账: " + bank_name;
            ctx.body = retBody;
            ctx.helper.end("depositApply");
            return;
        }


        let nowTime = new Date();
        //商户订单号：唯一性的字符串
        let merchantUniqeuID = "BLC" + dateFormat.asString('yyyyMMddhhmmssSSS', nowTime) + "" + userID;

        //充值渠道：1网银转账 2 快捷充值 3个人电子钱包 4 H5模式 5 比特币 6 收银台
        let depositType = 1;
        let groupID = 0;

        let notes = "";
        let remarks = "0";
        //订单匹配模式：1商户附言2 支付系统附言
        let remarksMatchingType = 2;


        //let sign = this.MD5(this.MD5(keyConfig) + merchantID + bankID + amount + merchantUniqeuID + userID + depositType + groupID + webUrl + notes + remarks + remarksMatchingType);
        let sign = this.MD5(this.MD5(keyConfig) + merchantID + bankID + amount + merchantUniqeuID + userID + depositType + groupID + webUrl + notes)


        let objQuery = {
            "merchantID": merchantID, //商户ID：支付系统提供给商户的数字编码
            "bankID": bankID, //银行编码：用户发起充值的银行，编码详情见附件5.2
            "amount": amount, //金额：数字，必须两位小数点，无千位符
            "merchantUniqueID": merchantUniqeuID, //商户订单号：唯一性的字符串
            "bankAccountNumber": bankAccountNumber, //银行卡卡号：用户的银行卡卡号
            "bankAccountName": bankAccountName, //用户姓名：用户的银行卡姓名
            "userID": userID, //用户ID：用户在商户平台使用的账户号，字符串
            "depositType": depositType, //充值渠道：1网银转账 2 快捷充值 3个人电子钱包 4 H5模式 5 比特币 6 收银台
            "groupID": groupID,
            "webUrl": webUrl, //商户网址域名
            "notes": notes, //支付系统备用字段        如果bankID为30，该参数需要传输支付宝账号  
            "remarks": remarks, //附言：如果 remarksMatchingType 为1或者4 ，note不能为空，支持中文，英文和数字，暂不支持特殊符号  
            //如果bank_id为，该参数需要传输支付宝账号

            /*
            订单匹配模式：1商户附言2 支付系统附言
            如果bankID为30并且depositType为1或2时，
            该参数必须为1，商户需要传输用户的真实姓名
            如果depositType为4、5、6时，该参数可默认为2
            */
            "remarksMatchingType": remarksMatchingType,
            "terminal": terminal, //使用终端：1电脑端2手机端3平板9其他
            "sign": sign,
            "ip_address": ip_address
        };



        const result = await ctx.curl(urlDepositApply, {
            //跳过HTTPS 的验证
            "rejectUnauthorized": false,
            // 必须指定 method
            method: 'POST',
            // 通过 contentType 告诉 HttpClient 以 JSON 格式发送
            contentType: 'json',
            data: objQuery,
            // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
            dataType: 'json',
        });

        //ctx.body = result.data;

        console.log(result.data);

        let testReturn = {
            "accountNumber": "621559370002100000", //收款银行卡卡号
            "accountName": "薛CX", //收款人姓名
            "amount": "50.22", //订单金额
            "email": "",
            "merchantUniqueID": "20180627163243", //weex的支付订单号
            "transactionDate": "20180627163243", //订单时间
            "remarks": "J5FQ", //用户转账时需要添加的备注
            "transactionOrderNumber": "Wx012018062702181580477", //支付公司的订单号
            "status": 1, //请求生成订单的返回值，1才成功
            "bankBranch": "陕西省西XXX支行营业室", //收款银行开户行地址
            "depositType": 1, //充值渠道：1网银转账 2 快捷充值 3个人电子钱包 4 H5模式 5 比特币 6 收银台
            "collectionAccountBankID": 1 //收款银行编码：支付系统收款银行卡编码，编码详情见附件5.2  如果depositType为1时，该参数不能为空
        };

        //result.data = testReturn;

        if (1 != result.data.status) {
            retBody.code = 1010;
            retBody.message = "支付平台下单失败";
            ctx.body = retBody;
            ctx.helper.end("depositApply");

            app.logger.error("[blc.depositApply] 支付平台下单失败", objQuery, result.data);

            return;
        }

        //下单成功：
        //获取当前汇率 schedule s10.js从python那边定时拉取数据
        let rate = app.weexHttps.getRate();
        //console.log('=======================获取当前汇率========================', rate);
        if (undefined == rate || null == rate || undefined == rate.cash_sell_rate || null == rate.cash_sell_rate) {
            retBody.code = 1001;
            retBody.message = "error, 服务器获取汇率失败,请稍后再试!";
            ctx.body = retBody;
            ctx.helper.end("generateOrders");

            this.logger.error("[dora.generateOrders]获取汇率失败");
            return;
        }


        //手续费
        let amount_fee = this.config.w100Payment.client.blc.fees.fees_pc;
        if ('web' != this.ctx.arg.source) {
            amount_fee = this.config.w100Payment.client.blc.fees.fees_mobile;
        }
        //有效性加粗略的判断
        if (amount_fee > 100 || amount_fee < 0) {
            retBody.code = 1005;
            retBody.message = "error, 手续费费率异常!";
            ctx.body = retBody;
            ctx.helper.end("generateOrders");

            this.logger.error("[dora.generateOrders]手续费费率异常");
            return;
        }
        //扣除费率后的usd
        let usd = Math.floor(((amount * (100 - amount_fee) / 100) / rate.cash_sell_rate) * 100) / 100;

        retBody.cash_sell_rate = rate.cash_sell_rate;
        retBody.amount = amount;
        retBody.amount_usd = usd;

        //支付公司的订单号
        let trade_no = result.data.transactionOrderNumber;

        let orderReturn = JSON.stringify(result.data);
        //存mongodb的数据
        let objOrder = {
            create_time: nowTime.getTime(), //订单创建时间
            uid: this.ctx.arg.uid, //用户ID
            platform: "blc", //支付平台
            bank_name: this.ctx.arg.bank_name, //支付宝、微信 平安银行
            card_no: this.ctx.arg.card_no, //支付宝、微信 平安银行  账号/卡号
            card_name: this.ctx.arg.card_name, //卡对应的用户名称
            //card_info: {}, //{"card_type": "debit", "city": "\u5e02\u8f96\u533a", "card_branch": "\u9655\u897f\u7701\u897f\u5b89\u5e02", "province": "\u5317\u4eac\u5e02", "id_name": "\u738b\u6d9b"}

            order_number: merchantUniqeuID, //订单号
            //order_ptime: { type: String },      //确认时间
            order_status: OrderStatus["notArrived"], //订单状态 默认未到账-->如果需要人工审核，可以加入状态
            amount: this.ctx.arg.amount, //订单金额
            amount_usd: usd, //订单美元金额
            //actual_amount: { type: String },    //实际到账
            //order_fee: { type: String },        //费用

            exchange_rate: rate.cash_sell_rate, //到账时汇率
            client_ip: ip_address, //客户请求生成订单时的IP
            payment_order_id: nOrderId, //唯一的订单号(python用)
            amount_fee: amount_fee, //下单时的交易费率
            platform_order_return: orderReturn, //下单成功，平台返回的订单信息

            trade_no: trade_no, //支付公司的订单号
        };

        let obj = await this.ctx.service.payment.create(ctx.model.PaymentOrder, objOrder);
        if (obj) {

        }

        retBody.order_number = merchantUniqeuID;

        let collectionAccountBankID = result.data.collectionAccountBankID;
        let platform_order_bank_name = "";
        for (let i = 0; i < arr_banks_info.length; i++) {
            if (collectionAccountBankID == arr_banks_info[i].bank_id) {
                platform_order_bank_name = arr_banks_info[i].bank_name;
                break;
            }
        }
        //result.data
        let platform_order_info = {
            "accountNumber": result.data.accountNumber,
            "accountName": result.data.accountName,
            "amount": result.data.amount,
            "email": result.data.email,
            "transactionDate": result.data.transactionDate,
            "remarks": result.data.remarks,
            "bankBranch": result.data.bankBranch,
            "bank_name": platform_order_bank_name,
        };
        retBody.platform_order_info = platform_order_info;

        ctx.body = retBody;

        ctx.helper.end("depositApply");
    }

    /**
     * 回调 addTransfer
     */
    async addTransfer() {
        const {
            ctx,
            service,
            app
        } = this;
        ctx.helper.pre("addTransfer", {
            pay_type: {
                type: 'string'
            },
            bank_id: {
                type: 'number'
            },
            amount: {
                type: 'number'
            },
            company_order_num: {
                type: 'string'
            },
            mownecum_order_num: {
                type: 'string'
            },
            pay_card_name: {
                type: 'string'
            },
            pay_card_num: {
                type: 'string'
            },
            channel: {
                type: 'string'
            },
            area: {
                type: 'string'
            },
            fee: {
                type: 'number'
            },
            transaction_charge: {
                type: 'number'
            },
            key: {
                type: 'string'
            },
            deposit_mode: {
                type: 'number'
            },
            base_info: {
                type: 'string'
            },
            operating_time: {
                type: 'string'
            },
            pay_time: {
                type: 'string'
            },
        });

        let msgPost = {
            "pay_type": "String",
            "bank_id": 0,
            "amount": 0,
            "company_order_num": "String",
            "mownecum_order_num": "String",
            "pay_card_name": "String",
            "pay_card_num": "String",
            "channel": "String",
            "area": "String",
            "fee": 0,
            "transaction_charge": 0,
            "key": "String",
            "deposit_mode": 0,
            "base_info": "String",
            "operating_time": "String",
            "pay_time": "String"
        };


        //请求方的IP地址
        let callback_ip = this.ctx.ip;

        //从配置文件获取基础的配置数据
        let keyConfig = this.config.w100Payment.client.blc.keyConfig;
        //商户ID：支付系统提供给商户的数字编码
        let merchantID = this.config.w100Payment.client.blc.merchantID;
        //url 地址
        let urlDepositApply = this.config.w100Payment.client.blc.url_DepositApply;
        //单笔充值的最大最小额度
        let amount_min = this.config.w100Payment.client.blc.amount.amount_min;
        let amount_max = this.config.w100Payment.client.blc.amount.amount_max;

        let redis = this.ctx.app.redis;
        let logdb = this.ctx.model.MessageLogs;

        //lock user
        if (await redis.setnx(this.getLockKey(this.ctx.arg.company_order_num), "1") == 0) {
            app.logger.error("[blc.addTransfer] lock error", this.ctx.arg.company_order_num);
            await logdb.create({
                create_time: moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss'),
                message_type: "exception",
                uid: 0,
                key: "",
                info: "[blc.addTransfer]回调失败，因为订单被锁, 订单id为" + this.ctx.arg.company_order_num,
                send_flag: false,
            });
            ctx.body = {
                "status": 200,
                "error_msg": "订单异常，被锁。", //status 非0时，才可以带返回信息
                "company_order_num": this.ctx.arg.company_order_num,
                "trade_no": this.ctx.arg.trade_no,
            };

            ctx.helper.end("addTransfer");

            return;
        }

        //return;
        //1、根据订单查订单记录
        let objQuery = {
            order_number: this.ctx.arg.company_order_num,
            //order_status: OrderStatus["notArrived"] //增加条件，订单处于未支付确认状态
        };
        let retQuery = await this.ctx.service.payment.query(ctx.model.PaymentOrder, objQuery);
        if (1 != retQuery.length) {
            ctx.body = {
                "status": 201,
                "error_msg": "没找到订单信息", //status 非0时，才可以带返回信息
                "company_order_num": this.ctx.arg.company_order_num,
                "trade_no": this.ctx.arg.trade_no,
            };
            this.logger.error("[dora.callback]没找到订单", this.ctx.arg.company_order_num, this.ctx.arg.trade_no, this.ctx.arg.actual_amount, this.ctx.arg.sign, callback_ip)
            ctx.helper.end("callback");

            await redis.del(this.getLockKey(this.ctx.arg.company_order_num));

            return;
        }

        //订单状态校验
        if (retQuery[0].order_status != OrderStatus["notArrived"]) {
            ctx.body = {
                "status": 202,
                "error_msg": "订单重复被通知", //status 非0时，才可以带返回信息
                "company_order_num": this.ctx.arg.company_order_num,
                "trade_no": this.ctx.arg.trade_no,
            };
            // ctx.set('show-response-time', "xxxx");
            // ctx.set('Content-Type', 'application/json');
            // ctx.set("charset", "UTF-8");

            this.logger.error("[dora.callback]找到订单重复被通知", this.ctx.arg.company_order_num, this.ctx.arg.trade_no, this.ctx.arg.actual_amount, this.ctx.arg.sign, retQuery[0].order_status, callback_ip);
            ctx.helper.end("callback");
            await redis.del(this.getLockKey(this.ctx.arg.company_order_num));
            return;
        }

        //amount_money校验
        if(true==isNaN(this.ctx.arg.actual_amount) || true==isNaN(this.ctx.arg.original_amount) ){
            ctx.body = {
                "status": 206,
                "error_msg": "订单金额参数异常", //status 非0时，才可以带返回信息
                "company_order_num": this.ctx.arg.company_order_num,
                "trade_no": this.ctx.arg.trade_no,
            };
            this.logger.error("[dora.callback]订单金额参数异常", this.ctx.arg.company_order_num, this.ctx.arg.trade_no, this.ctx.arg.actual_amount, this.ctx.arg.sign, this.ctx.arg.original_amount, retQuery[0].amount, callback_ip);
            ctx.helper.end("callback");
            await redis.del(this.getLockKey(this.ctx.arg.company_order_num));
            return;
        }

        //有效性校验(校验订单下单金额)
        if ((retQuery[0].amount != this.ctx.arg.original_amount) && (retQuery[0].amount - this.ctx.arg.original_amount) != 0) {
            ctx.body = {
                "status": 203,
                "error_msg": "订单金额异常", //status 非0时，才可以带返回信息
                "company_order_num": this.ctx.arg.company_order_num,
                "trade_no": this.ctx.arg.trade_no,
            };
            this.logger.error("[dora.callback]订单金额异常", this.ctx.arg.company_order_num, this.ctx.arg.trade_no, this.ctx.arg.actual_amount, this.ctx.arg.sign, this.ctx.arg.original_amount, retQuery[0].amount, callback_ip);
            ctx.helper.end("callback");
            await redis.del(this.getLockKey(this.ctx.arg.company_order_num));
            return;
        }

        if (this.ctx.arg.actual_amount <= 0) {
            this.logger.info("[dora.callback]实际到账金额数值异常", this.ctx.arg.company_order_num, this.ctx.arg.trade_no, this.ctx.arg.actual_amount, this.ctx.arg.sign, this.ctx.arg.original_amount, callback_ip);
            ctx.body = {
                "status": 204,
                "error_msg": "实际到账金额数值异常", //status 非0时，才可以带返回信息
                "company_order_num": this.ctx.arg.company_order_num,
                "trade_no": this.ctx.arg.trade_no,
            };
            ctx.helper.end("callback");
            await redis.del(this.getLockKey(this.ctx.arg.company_order_num));
            return;
        }

        //转换成美元 toFixed(2) 需要截取精度吗 -->不可以用toFixed
        let actual_amount_usd = (this.ctx.arg.actual_amount*(100-retQuery[0].amount_fee)/100 )/ retQuery[0].exchange_rate;

        let order_status = OrderStatus["Arrived"];
        if ((retQuery[0].amount - this.ctx.arg.actual_amount) > 0) {
            order_status = OrderStatus["partialPayment"]; //部分支付
            this.logger.info("[dora.callback]订单金额,部分到账", this.ctx.arg.company_order_num, this.ctx.arg.trade_no, this.ctx.arg.actual_amount, this.ctx.arg.sign, this.ctx.arg.original_amount, retQuery[0].amount, actual_amount_usd, callback_ip);

        } else {
            this.logger.info("[dora.callback]订单金额", this.ctx.arg.company_order_num, this.ctx.arg.trade_no, this.ctx.arg.actual_amount, this.ctx.arg.sign, this.ctx.arg.original_amount, retQuery[0].amount, actual_amount_usd, callback_ip);
        }


        //签名校验
        let mySign = this.MD5("company_id=" + company_id + "&company_order_num=" + this.ctx.arg.company_order_num + "&trade_no=" + this.ctx.arg.trade_no + "&actual_amount=" + this.ctx.arg.actual_amount +
            "&api_version=" + api_version + api_key);
        if (mySign != this.ctx.arg.sign) {
            //测试时可以打印mySign，线上一定要去掉
            this.logger.error("[dora.callback]消息签名不对", mySign, this.ctx.arg.sign, this.ctx.arg.company_order_num, this.ctx.arg.trade_no, callback_ip);
            ctx.body = {
                "status": 205,
                "error_msg": "消息签名不对", //status 非0时，才可以带返回信息
                "company_order_num": this.ctx.arg.company_order_num,
                "trade_no": this.ctx.arg.trade_no,
            };
            await redis.del(this.getLockKey(this.ctx.arg.company_order_num));
            ctx.helper.end("callback");
            return;
        }

        //更新订单状态
        let jsonUpdate = {
            order_status: order_status,
            actual_amount: this.ctx.arg.actual_amount,
            actual_amount_usd: actual_amount_usd,
            trade_no: this.ctx.arg.trade_no,
            order_ptime: new Date().getTime(), //订单确认时间
            callback_ip: callback_ip,
        };

        let _json_condition = {
            _id: retQuery[0]._id,
            order_status: OrderStatus["notArrived"],
        };
        //更新是否带锁
        let retUpdate = await this.ctx.service.payment.update(ctx.model.PaymentOrder, _json_condition /*retQuery[0]._id*/ , jsonUpdate);
        //n nModified ok
        if (1 == retUpdate.nModified && 1 == retUpdate.ok) {
            this.logger.error("[dora.callback]给账户增加资产,begin", retQuery[0].uid, this.ctx.arg.company_order_num, this.ctx.arg.trade_no, this.ctx.arg.actual_amount, this.ctx.arg.sign, this.ctx.arg.original_amount, retQuery[0].amount, actual_amount_usd);

            //通知python给用户增加资产
            let retWeex = await this.ctx.service.payment.addZiChan(retQuery[0].uid, retQuery[0].payment_order_id, actual_amount_usd, "USD", "dora", this.ctx.arg.company_order_num, this.ctx.arg.trade_no);
            if(0 != retWeex){
                this.logger.error("[dora.callback]给账户增加资产,end,失败,需走人工核实", retQuery[0].uid, this.ctx.arg.company_order_num, this.ctx.arg.trade_no, this.ctx.arg.actual_amount, this.ctx.arg.sign, this.ctx.arg.original_amount, retQuery[0].amount, actual_amount_usd);
            }
        } else {
            this.logger.error("[dora.callback]修改订单状态异常", retUpdate.n, retUpdate.ok, retUpdate.nModified, this.ctx.arg.company_order_num, this.ctx.arg.trade_no, this.ctx.arg.actual_amount, this.ctx.arg.sign, this.ctx.arg.original_amount, retQuery[0].amount, actual_amount_usd);

            ctx.body = {
                "status": 206,
                "error_msg": "修改订单状态异常", //status 非0时，才可以带返回信息
                "company_order_num": this.ctx.arg.company_order_num,
                "trade_no": this.ctx.arg.trade_no,

            };
            await redis.del(this.getLockKey(this.ctx.arg.company_order_num));
            ctx.helper.end("callback");
            return;
        }


        ctx.body = {
            "error_msg": "", //status 非0时，才可以带返回信息
            "company_order_num": this.ctx.arg.company_order_num,
            "trade_no": this.ctx.arg.trade_no,
            "status": 0
        }

        await redis.del(this.getLockKey(this.ctx.arg.company_order_num));

        ctx.helper.end("addTransfer");
    }

    /**
     * 回调 exceptionWithdrawApply
     */
    async exceptionWithdrawApply() {
        const {
            ctx,
            service,
            app
        } = this;
        ctx.helper.pre("exceptionWithdrawApply", {
            //header
            // ver: {
            //     type: 'string'
            // },
            // source: {
            //     type: 'string'
            // },

        });


        ctx.helper.end("exceptionWithdrawApply");
    }

    /**
     * 回调 withdrawalResult
     */
    async withdrawalResult() {
        const {
            ctx,
            service,
            app
        } = this;
        ctx.helper.pre("withdrawalResult", {
            //header
            // ver: {
            //     type: 'string'
            // },
            // source: {
            //     type: 'string'
            // },

        });


        ctx.helper.end("withdrawalResult");
    }
}


module.exports = BlcController;