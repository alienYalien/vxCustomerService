var express = require('express');
var router = express.Router();
var sha1=require("../utils/sha1")
var http = require('http');
var request = require('request');
var video=require('./videoplay.js');

const fileWorker = require('./filedownload.js');
/* GET home page. */

var access_token = '';
var expires_in;
var ReplyOpenid = "xxx";//接收消息的客服id,可通过log测试获取

router.get('/', function(req, res, callback) {
  console.log(req.query, '')
  var signature=req.query.signature;
  var timestamp=req.query.timestamp;
  var nonce=req.query.nonce;
  var echostr=req.query.echostr;
  const token="xxx";//设置token
  var str=[nonce,timestamp,token].sort().join('');
  console.log(sha1, '')
  var a= sha1(str).toString()
  // crypto.createHmac("sha1").update(str).digest("hex")
  signature=signature.toUpperCase().toString();
  console.log("compare",a, signature)
  if(a==signature)
  {
  console.log("成功了", '')
  // callback(echostr)
    return res.send(echostr)
  }
  else{
  console.log("失败了", '')
    return res.send("false")
  }
});

/** 接收用户消息 */
router.post("/",function(req,res,callback){
  console.log("接收到用户消息");
  console.log("req.query",req.query);
  console.log("req.body",req.body);
  // var access_token = getAccessToken();
  getAccessToken();
  console.log("getAccessToken:",access_token);//
  if(access_token != ''){
    sendMessage(req.query,req.body);
  }
  return res.send("success");
});

// /** 接受消息 */
// router.post('/',(req,res,next)=>{ 
//   console.log("接收了");
//   console.log("req.query",req.query);
//   console.log("req.body",req.body);
//   var access_token = getAccessToken();
//   if(access_token != ''){
//     sendMessage(req.query,req.body,access_token);
//   }
//   return res.send("success")
// });

//根据获取的token 第三方服务器 发送消息给 开发者手机微信 

// async function sendMessage(mess, reqBody,access_token) {
sendMessage = function (reqQuery, reqBody) {
  console.log("sendMessage");
    var url = 'https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=' + access_token;
    console.log("URL",url);
    console.log("reqBody",ReplyOpenid,reqBody.MsgType,reqBody.Content);
    var j = {
      "touser": ReplyOpenid,
      "msgtype": reqBody.MsgType,
      "text":
      {
          "content" : reqBody.Content
      }
    };
    var options = {
      method: 'POST',
      url: url,
      json: true,
      headers: {
        "content-type": "application/json",
    },
      body: JSON.stringify(j)
    };
    request(options, function(err, response, body) {      
        console.log("response,,");
        if (!err && response.statusCode == 200) {
          console.log("sendMessage success",body);//
        }else {
          console.log("sendMessage err:",err)//
        }
    }); 
  
};

/** 获取access_token */
getAccessToken = function() {
  var expires_in;
  // var access_token = '';
  console.log("getAccessToken");
  var grant_type = "client_credential";
  var appid = "xxx";//wxAppid,小程序后台管理员处获得
  var secret = "xxx";//wxSecret,同上↑

  var url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=' +grant_type+ '&appid=' +appid+ '&secret=' +secret;//接口地址换成自己的APPID和secret
  console.log("URL",url);
  var options = {
    method: 'GET',
    url: url,
  };
    request(options, function(err, response, body) {
      console.log("request,,");
      if (!err && response.statusCode == 200) {
        access_token = JSON.parse(body).access_token;
        expires_in = parseInt(JSON.parse(body).expires_in) - 10;
      }else {
        console.log("getAccessToken err:",err)//
      }
      // return access_token;
    });
};

router.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

module.exports = router;
