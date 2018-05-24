'use strict';

const moment = require("moment");
const Controller = require('egg').Controller;
const _ = require("lodash");

class StatisticsController extends Controller {
    async index() {
        const { ctx, service, app } = this;
        
        let day = moment().format("YYYY-MM-DD");
        //new user
        let androidNewUser = await app.redis.smembers("androidNewUser_" + day);
        let iosNewUser = await app.redis.smembers("iosNewUser_" + day);

        //DAU
        let androidDAU = await app.redis.smembers("androidDAU_" + day);
        let iosDAU = await app.redis.smembers("iosDAU_" + day);

        //DAIP
        let androidDAIP = await app.redis.smembers("androidDAIP_" + day);
        let iosDAIP = await app.redis.smembers("iosDAIP_" + day);

        //LHT
        let LHT_100 = await app.redis.hget('LHT', "100_" + day);
        LHT_100 = LHT_100 ? LHT_100 : 0;
        let LHT_500 = await app.redis.hget('LHT', "500_" + day);
        LHT_500 = LHT_500 ? LHT_500 : 0;
        let LHT_1000 = await app.redis.hget('LHT', "1000_" + day);
        LHT_1000 = LHT_1000 ? LHT_1000 : 0;
        let LHT_1001 = await app.redis.hget('LHT', "1000+_" + day);
        LHT_1001 = LHT_1001 ? LHT_1001 : 0;
        let LHT = parseInt(LHT_100) + parseInt(LHT_500) + parseInt(LHT_1000) + parseInt(LHT_1001);

        ctx.body = {
            code: 0,
            data: {
              androidNewUser: androidNewUser ? androidNewUser.length : 0,
              iosNewUser: iosNewUser ? iosNewUser.length : 0,
              androidDAU: androidDAU.length,
              iosDAU: iosDAU.length,
              androidDAIP: androidDAIP ? androidDAIP.length : 0,
              iosDAIP: iosDAIP ? iosDAIP.length : 0,
              LHT_100: LHT_100, 
              LHT_500: LHT_500,
              LHT_1000: LHT_1000,
              LHT_1001: LHT_1001
            },
            message: "OK",
        };
    }

    async getDAU(){
      const { ctx, service, app } = this;
        
      let dayList = [];
      let androidDAU = [];
      let iosDAU = [];
      let LHT_100 = [];
      let LHT_500 = [];
      let LHT_1000 = [];
      let LHT_over1000 = [];
      let androidNewUser = [];
      let iosNewUser = [];
      let androidDAIP = [];
      let iosDAIP = [];
      for(let i = 6; i > 0;i--){
        let day = moment().subtract(i, 'days').format("YYYY-MM-DD");
        dayList.push(day);
        let _dau = await app.redis.smembers("androidDAU_" + day);
        let _iosdau = await app.redis.smembers("iosDAU_" + day);
        let _lht100 = await app.redis.hget('LHT', "100_" + day);
        let _lht500 = await app.redis.hget('LHT', "500_" + day);
        let _lht1000 = await app.redis.hget('LHT', "1000_" + day);
        let _lhtover1000 = await app.redis.hget('LHT', "1000+_" + day);
        let _anuser = await app.redis.smembers("androidNewUser_" + day);
        let _inuser = await app.redis.smembers("iosNewUser_" + day);
        let _aip = await app.redis.smembers("androidDAIP_" + day);
        let _iip = await app.redis.smembers("iosDAIP_" + day);
        androidDAU.push(_dau.length);
        androidNewUser.push(_anuser.length);
        iosDAU.push(_iosdau.length);
        iosNewUser.push(_inuser.length);
        androidDAIP.push(_aip.length);
        iosDAIP.push(_iip.length);
        LHT_100.push(_lht100 ? parseInt(_lht100) : 0);
        LHT_500.push(_lht500 ? parseInt(_lht500) : 0);
        LHT_1000.push(_lht1000 ? parseInt(_lht1000) : 0);
        LHT_over1000.push(_lhtover1000 ? parseInt(_lhtover1000) : 0);
      }
      dayList.push(moment().format("YYYY-MM-DD"));
      let _anDau = await app.redis.smembers("androidDAU_" + moment().format("YYYY-MM-DD"));
      let iosD = await app.redis.smembers("iosDAU_" + moment().format("YYYY-MM-DD"));
      let anuser = await app.redis.smembers("androidNewUser_" + moment().format("YYYY-MM-DD"));
      let inuser = await app.redis.smembers("iosNewUser_" + moment().format("YYYY-MM-DD"));
      androidDAU.push(_anDau.length);
      iosDAU.push(iosD.length);
      androidNewUser.push(anuser.length);
      iosNewUser.push(inuser.length);
      let aip = await app.redis.smembers("androidDAIP_" + moment().format("YYYY-MM-DD"));
      let iip = await app.redis.smembers("iosDAIP_" + moment().format("YYYY-MM-DD"));
      androidDAIP.push(aip.length);
      iosDAIP.push(iip.length);
      let lht100 = await app.redis.hget('LHT', "100_" + moment().format("YYYY-MM-DD"))
      LHT_100.push(lht100 ? parseInt(lht100) : 0);
      let lht500 = await app.redis.hget('LHT', "500_" + moment().format("YYYY-MM-DD"))
      LHT_500.push(lht500 ? parseInt(lht500) : 0);
      let lht1000 = await app.redis.hget('LHT', "1000_" + moment().format("YYYY-MM-DD"))
      LHT_1000.push(lht1000 ? parseInt(lht1000) : 0);
      let lhtover1000 = await app.redis.hget('LHT', "1000+_" + moment().format("YYYY-MM-DD"))
      LHT_over1000.push(lhtover1000 ? parseInt(lhtover1000) : 0);

      ctx.body = {
        code: 0,
        data: {
          dayList: dayList,
          DAU: {
            androidDAU: androidDAU,
            iosDAU: iosDAU
          },
          LHT: {
            LHT_100: LHT_100,
            LHT_500: LHT_500,
            LHT_1000: LHT_1000,
            LHT_over1000: LHT_over1000
          },
          NewUser: {
            androidNewUser: androidNewUser,
            iosNewUser: iosNewUser
          },
          DIP: {
            androidDAIP: androidDAIP,
            iosDAIP: iosDAIP
          }
        }
      }
    }
}

module.exports = StatisticsController;
