var t = require("./app/extend/context.js");
t.bian.reset24hr(["BTCUSD"],function(){
    console.log(t.bian.get24hr());
});