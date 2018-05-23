var t = require("./app/extend/context.js");
t.okex.reset24hr(["BTCUSD"],function(){
    console.log(t.okex.get24hr());
});