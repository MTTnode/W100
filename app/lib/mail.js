/**
 *
 * @Description 邮件发送 
 * 调用方法:sendMail('764952224@qq.com','测试邮件', 'Hi xiaotao,这是一封测试邮件');
 * @Author Tim
 * @Created 2017/04/26
 *
 */

var nodemailer = require('nodemailer')
var smtpTransport = require('nodemailer-smtp-transport');
var config = {
  email: {
    service: 'Gmail',
    user: 'customer_service@bada-soft.com',
    pass: 'weex@123',
  }
};

smtpTransport = nodemailer.createTransport(smtpTransport({
  service: config.email.service,
  auth: {
    user: config.email.user,
    pass: config.email.pass
  }
}));

/**
 * @param {String} recipient 收件人
 * @param {String} subject 发送的主题
 * @param {String} html 发送的html内容
 */
var sendMail = function (recipient, subject, html, app) {
  smtpTransport.sendMail({
    from: config.email.user,
    to: recipient,
    subject: subject,
    html: html
  }, function (error, response) {
    if (error) {
      console.log(error);
    }
    // console.log('发送成功')
    app.getLogger('weexLogger').info(JSON.stringify({event: '新用户发送邮件',user: recipient}));
  });
}

module.exports = sendMail;