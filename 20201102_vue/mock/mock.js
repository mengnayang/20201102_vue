const Mock = require('mockjs')

//模拟用户登陆
Mock.mock('/staff/login',{
    "code": 0,
    "obj": {
      "id": 1,
      "staffName": "小明",
      "staffPassword": 15353535353,
      "staffPosition":1,
      "staffStatus":1000,
      "token": "1asd123"
     }
    //  {
    //   "id": '2',
    //   "staffName": "小红",
    //   "staffPassword": 15364646464,
    //   "staffPosition":5,
    //   "staffStatus":10001,
    //   "token": "65ghjghfd4"
    //  }
})

//模拟用户注册
Mock.mock('/staff/register',{
    "code":0,
    "obj":{
        "msg":"新用户注册成功"
    }
})