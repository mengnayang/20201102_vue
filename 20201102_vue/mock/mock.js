const Mock = require('mockjs')
var random = Mock.Random

//模拟用户登陆
Mock.mock('/staff/login',{
    "code": 0,
    "obj": 
    {
        "id":'100',
        "staffName":"管理员",
        "staffPassword": 15342424242,
        "staffPosition": 100,
        "staffStatus":1000,
        "token":'adui##gca664'
    }
    // {
    //   "id": 1,
    //   "staffName": "小明",
    //   "staffPassword": 15353535353,
    //   "staffPosition":1,
    //   "staffStatus":1000,
    //   "token": "1asd123"
    //  }
    //  {
    //   "id": '2',
    //   "staffName": "小红",
    //   "staffPassword": 15364646464,
    //   "staffPosition":5,
    //   "staffStatus":1001,
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

//获取验证码
Mock.mock('/staff/code',{
    "code":0,
    "obj":{
        "checkCode":random.integer(1000,9999)
    }
})

//请求管理员的功能菜单
Mock.mock('/administer/menu',{
    "code":0,
    "obj":[
        {
            "id":100,
            "name":"用户管理",
            "url":"/userManage",
            "children":[
                {
                    "id":101,
                    "name":"用户列表",
                    "url":"/userList"
                }
            ]
        },{
            "id":200,
            "name":"权限管理",
            "url":"/accessManage",
            "children:":[
                {
                    "id":201,
                    "name":"角色列表",
                    "url":"/roleList"
                }
            ]
        },{
            "id":300,
            "name":"权限管理",
            "url":"/accessManage",
            "children:":[
                {
                    "id":301,
                    "name":"角色列表",
                    "url":"/roleList"
                }
            ]
        },{
            "id":400,
            "name":"销售统计",
            "url":"/sellStatistic",
            "children":[
                {
                    "id":401,
                    "name":"年月季度",
                    "url":"/monthYear"
                }
            ]
        },{
            "id":500,
            "name":"发布公告",
            "url":"/issueNotice",
            "children":[
                {
                    "id":501,
                    "name":"公告信息",
                    "url":"/noticeInfo"
                },
                {
                    "id":502,
                    "name":"添加公告",
                    "url":"/addNotice"
                }
            ]
        }
    ]
})

//获取用户信息
Mock.mock('/user/userList',{
    "code":0,
    "obj|4":[
        {
            "staffId":/^[0-9a-zA-z]{3}$/,
            "staffName":"@name()",
            "staffPhone":/^1\d{10}$/,
            "staffPassword":/^[0-9a-zA-Z]{10}$/,
            "staffPosition":/^[1-6]{1}$/,
            "staffStatus|1":[1000,1001,0,-1]
        }
    ]
})

//添加新用户
Mock.mock('/user/addUser',{
    "code":0,
    "obj":{
        "msg":"添加成功"
    }
})

//添加新用户
Mock.mock('/user/editUser',{
    "code":0,
    "obj":{
        "msg":"修改成功"
    }
})

Mock.mock('/user/deleteUser',{
    "code":0,
    "obj":{
        "msg":"删除成功"
    }
})

//请求用户的功能菜单
Mock.mock('/staff/menu',{
    "code":0,
    "obj":[
        {
            "id":100,
            "name":"库存管理",
            "url":"/storeManage",
            "children":[
                {
                    "id":101,
                    "name":"查库存",
                    "url":"/searchStore"
                },
                {
                    "id":102,
                    "name:":"订单信息",
                    "url":"/orderInfo"
                },
                {
                    "id":103,
                    "name":"采购入库单",
                    "url":"/bookEnter"
                }
            ]
        },{
            "id":200,
            "name":"销售管理",
            "url":"/sellManage",
            "children:":[
                {
                    "id":201,
                    "name":"零售管理",
                    "url":"/boyOne"
                },
                {
                    "id":202,
                    "name":"批发管理",
                    "url":"/butMany"
                }
            ]
        },{
            "id":300,
            "name":"盘点管理",
            "url":"/recordManage",
            "children":[
                {
                    "id":301,
                    "name":"盘点记录",
                    "url":"/orderRecord"
                }
            ]
        },{
            "id":400,
            "name":"销售统计",
            "url":"/sellStatistic",
            "children":[
                {
                    "id":401,
                    "name":"年月季度",
                    "url":"/monthYear"
                }
            ]
        },{
            "id":500,
            "name":"发布公告",
            "url":"/issueNotice",
            "children":[
                {
                    "id":501,
                    "name":"公告信息",
                    "url":"/noticeInfo"
                },
                {
                    "id":502,
                    "name":"添加公告",
                    "url":"/addNotice"
                }
            ]
        }
    ]
})

//库存部分商品数据
Mock.mock('/goods/goodsInfo',{
    "code":0,
    "obj|3":[{
        "goods_img":"@image('100x100','#894FC4', '#ffffff', 'png','" +  random.name() + "')",
        "goods_id|1":/\d{3,5}\w{3,5}/,
        "goods_name|1":['方便面','金典牛奶','银桥牛奶','有机牧场','特仑苏','旺仔牛奶','草莓牛奶'],
        "goods_category|1":['奶制品','速食类','零食类'],
        "brand_name|1":['银桥','汇丰','蒙牛','伊利'],
        "goods_store|1":[random.integer(1000,10000),random.integer(1000,10000),random.integer(1000,10000)],
        "date_manufacture":"@date()",
        "shelf_life|1":[random.integer(3,60),random.integer(3,60),random.integer(3,60)],
        "goods_price|1":[random.integer(10,30),random.integer(10,30),random.integer(10,30)],
        "unit|1":["桶","袋","包","盒","箱"],
        "standards|1":['200ml','200g','200L','1kg']
    }]
})

//查询指定需求的商品
Mock.mock('/goods/searchGood',{
    "obj|3":[{
        "goods_img":"@image('100x100','#894FC4', '#ffffff', 'png','" +  random.name() + "')",
        "goods_id|1":/\d{3,5}\w{3,5}/,
        "goods_name|1":['方便面','金典牛奶','银桥牛奶','有机牧场','特仑苏','旺仔牛奶','草莓牛奶'],
        "goods_category|1":['奶制品','速食类','零食类'],
        "brand_name|1":['银桥','汇丰','蒙牛','伊利'],
        "goods_store|1":[random.integer(1000,10000),random.integer(1000,10000),random.integer(1000,10000)],
        "date_manufacture":"@date()",
        "shelf_life|1":[random.integer(3,60),random.integer(3,60),random.integer(3,60)],
        "goods_price|1":[random.integer(10,30),random.integer(10,30),random.integer(10,30)],
        "unit|1":["桶","袋","包","盒","箱"],
        "standards|1":['200ml','200g','200L','1kg']
    }]
})

//部分订单信息
Mock.mock('/orders/ordersInfo',{
    "code":0,
    "obj|3":[{
        "orders_id|1":/\d{3,5}\w{3,5}/,
        "goods_img":"@image('100x100','#894FC4', '#ffffff', 'png','" +  random.name() + "')",
        "goods_id|1":/\d{3,5}\w{3,5}/,
        "goods_name|1":['方便面','金典牛奶','银桥牛奶','有机牧场','特仑苏','旺仔牛奶','草莓牛奶'],
        "goods_category|1":['奶制品','速食类','零食类'],
        "brand_name|1":['银桥','汇丰','蒙牛','伊利'],
        "goods_store|1":[random.integer(1000,10000),random.integer(1000,10000),random.integer(1000,10000)],
        "date_manufacture":"@date()",
        "shelf_life|1":[random.integer(3,60),random.integer(3,60),random.integer(3,60)],
        "goods_price|1":[random.integer(10,30),random.integer(10,30),random.integer(10,30)],
        "unit|1":["桶","袋","包","盒","箱"],
        "standards|1":['200ml','200g','200L','1kg'],
        "godown_entry_id":/\d{3,5}\w{3,5}/,
        "godown_entry_date":"@date()",
        "godown_entry_status|1":[1,2,3,4,5,0]
    }]
})


//查询指定需求的订单信息
Mock.mock('/orders/searchOrder',{
    "code":0,
    "obj|3":[{
        "orders_id|1":/\d{3,5}\w{3,5}/,
        "goods_img":"@image('100x100','#894FC4', '#ffffff', 'png','" +  random.name() + "')",
        "goods_id|1":/\d{3,5}\w{3,5}/,
        "goods_name|1":['方便面','金典牛奶','银桥牛奶','有机牧场','特仑苏','旺仔牛奶','草莓牛奶'],
        "goods_category|1":['奶制品','速食类','零食类'],
        "brand_name|1":['银桥','汇丰','蒙牛','伊利'],
        "goods_store|1":[random.integer(1000,10000),random.integer(1000,10000),random.integer(1000,10000)],
        "date_manufacture":"@date()",
        "shelf_life|1":[random.integer(3,60),random.integer(3,60),random.integer(3,60)],
        "goods_price|1":[random.integer(10,30),random.integer(10,30),random.integer(10,30)],
        "unit|1":["桶","袋","包","盒","箱"],
        "standards|1":['200ml','200g','200L','1kg'],
        "godown_entry_id":/\d{3,5}\w{3,5}/,
        "godown_entry_date":"@date()",
        "godown_entry_status|1":[1,2,3,4,5,0]
    }]
})

//部分采购入库单信息
Mock.mock('/enterStore/enterStoreInfo',{
    "code":0,
    "obj|3":[{
        "orders_id|1":/\d{3,5}\w{3,5}/,
        "goods_img":"@image('100x100','#894FC4', '#ffffff', 'png','" +  random.name() + "')",
        "goods_id|1":/\d{3,5}\w{3,5}/,
        "goods_name|1":['方便面','金典牛奶','银桥牛奶','有机牧场','特仑苏','旺仔牛奶','草莓牛奶'],
        "goods_category|1":['奶制品','速食类','零食类'],
        "brand_name|1":['银桥','汇丰','蒙牛','伊利'],
        "goods_store|1":[random.integer(1000,10000),random.integer(1000,10000),random.integer(1000,10000)],
        "date_manufacture":"@date()",
        "shelf_life|1":[random.integer(3,60),random.integer(3,60),random.integer(3,60)],
        "goods_price|1":[random.integer(10,30),random.integer(10,30),random.integer(10,30)],
        "unit|1":["桶","袋","包","盒","箱"],
        "standards|1":['200ml','200g','200L','1kg'],
        "godown_entry_id":/\d{3,5}\w{3,5}/,
        "godown_entry_date":"@date()",
        "godown_entry_status|1":[1,2,3,4,5,0],
        "godown_entry_num|1":/\d{3,5}/,
        "godown_entry_ paid|1":/\d{2,3}/
    }]
})