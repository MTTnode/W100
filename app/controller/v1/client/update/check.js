'use strict';

const Controller = require('egg').Controller;
const _ = require("lodash");

class CheckController extends Controller {
    async checkVer() {
        const { ctx, service, app } = this;
        ctx.helper.pre("checkVer", {
          version: { type: 'string' },
          client: { type: 'string' },
        });
        let res = await ctx.model.WeexVersion.find({"client":ctx.query.client}).sort({ create_time: -1 }).limit(1);
        let json = res[0];
        json.remark = json.remark.replace(/\\n/g, '\n');
        let ver1 = ctx.query.version;
        let ver2 = json.version;
        let ver1_0 = ver1.substr(0, ver1.lastIndexOf('.'));
        let ver1_1 = ver1.substr(ver1.lastIndexOf('.') + 1, ver1.length);
        let ver2_0 = ver2.substr(0, ver2.lastIndexOf('.'));
        let ver2_1 = ver2.substr(ver2.lastIndexOf('.') + 1, ver2.length);
        if(ver1 == ver2){
          json["update_status"] = '0';
        }else{
          if (parseFloat(ver1_0) > parseFloat(ver2_0)) {
            json["update_status"] = '0';
          } else if (parseFloat(ver1_0) === parseFloat(ver2_0)) {
            if (parseInt(ver1_1) > parseInt(ver2_1)) {
              json["update_status"] = '0';
            }
          }
        }
        if(json.update_version){
          let ver3 = json.update_version;
          let ver3_0 = ver3.substr(0, ver3.lastIndexOf('.'));
          let ver3_1 = ver3.substr(ver3.lastIndexOf('.') + 1, ver3.length);
          if (parseFloat(ver3_0) > parseFloat(ver1_0)) {
            json["update_status"] = '2';
          } else if (parseFloat(ver3_0) === parseFloat(ver1_0)) {
            if (parseInt(ver3_1) > parseInt(ver1_1)) {
              json["update_status"] = '2';
            }
          }
        }

        ctx.body = {
          code: 0,
          message: 'OK',
          data: json
        };
        ctx.helper.end("checkVer");
    }

}

module.exports = CheckController;
