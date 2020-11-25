<template>
    <div class="login_container">
       <div class="login_box">
           <!-- 头像区域 -->
           <div class="login_avater" :class="{'animation':isAnimation}" @mouseleave="start_move" @mouseover="stop_move">
               <i class="iconfont icon_title"></i>
           </div>
           <!-- 表单区域 -->
           <div class="login_form">
               <el-form label-width="100px" :model="LoginForm" :rules="LoginRules" ref="LoginRef">
                    <el-form-item label="手机号" prop="staffPhone" required>
                        <el-input type="text" v-model="LoginForm.staffPhone" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="staffPassword" required>
                        <el-input type="password" v-model="LoginForm.staffPassword" auto-complete="off"></el-input>
                    </el-form-item>
                    <div class="forget_pwd" @click="forget_pwd()">
                        <span>忘记密码</span><i class="el-icon-question"></i>
                    </div>
                    <el-form-item>
                        <el-button type="primary" round size="small" @click="login()">登陆</el-button>
                        <el-button type="info" round size="small" @click="reset()">重置</el-button>
                        <el-button type="primary" round size="small" @click="register()">注册</el-button>
                    </el-form-item>
                </el-form>
           </div>
       </div>
    </div>
</template>

<script>
export default{
    name:'Login',
    data(){
        return{
            //是否显示动画
            isAnimation:true,
            //用户登陆表单信息
            LoginForm:{
                staffPhone:'',
                staffPassword:''
            },
            //用户登陆合法性检验
            LoginRules:{
                //验证手机号的合法性
                staffPhone:[
                    {required:true, message:"手机号不能为空", trigger:"blur"},
                    {pattern:/^1(3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/, message:"手机号不合法", trigger:"blur"}
                ],
                //验证密码的合法性
                staffPassword:[
                    {required:true, message:"密码不能为空", trigger:"blur"},
                    {min:8,max:16,message:"密码的长度必须满足8~16位",trigger:"blur"}
                ]
            }
        }
    },
    methods:{
        //开始动画
        start_move() {
            this.isAnimation = true
        },
        //停止动画
        stop_move() {
            this.isAnimation = false
        },
        //重置登录信息
        reset() {
            this.$refs.LoginRef.resetFields()
        },
        //注册新用户
        register() {
            this.$router.push('/register')
        },
        //用户登陆
        login() {
            this.$refs.LoginRef.validate(valid => {
                if (!valid) return

                let data = {
                    staffA: JSON.stringify(this.LoginForm)
                }

                this.$axios.post('http://localhost:8080/staff/login',this.$qs.stringify(data))
                .then((res) => {
                    console.log(res)
                    if(res.data.success) {
                        this.$message.success('登陆成功')
                        window.sessionStorage.setItem('staffToken',res.data.staffToken)
                        window.sessionStorage.setItem('staffId',res.data.staffId)
                        window.sessionStorage.setItem('staffName',res.data.staffA.staffName)
                        window.sessionStorage.setItem('staffStatus',res.data.staffA.staffStatus)
                        window.sessionStorage.setItem('staffPosition',res.data.staffA.staffPosition)
                        window.sessionStorage.setItem('staffPassword',res.data.staffA.staffPassword)
                        window.sessionStorage.setItem('primaryMenuList',JSON.stringify(res.data.primaryMenuList))
                        window.sessionStorage.setItem('secondaryMenuList',JSON.stringify(res.data.secondaryMenuList))
                        this.$router.push('/home')
                    } 
                })
                .catch((err) => {
                    this.$message.error(err.message)
                })
            })
        },
        forget_pwd() {
            this.$router.push('/forgetPwd')
        }
    }
}
</script>

<style lang="less" scoped>
.login_container{
    background: url("../assets/image/bg.jpg") no-repeat;
    background-size: 100% 100%;
    height: 100%;
}
.login_box{
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 10px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
}
@keyframes titleBg {
    0% {
        background-color: #806d9e;
        transform: translate(-50%,-60%);
    }
    25%{
        background-color: #1a94bc;
        transform: translate(-60%,-50%);
    }
    50%{
        background-color: #806d9e;
        transform: translate(-50%,-40%);
    }
    75%{
        background-color: #63bbd0;
        transform: translate(-40%,-50%);
    }
    100%{
        background-color: #c8adc4;
        transform: translate(-50%,-60%);
    }
}
@-webkit-keyframes titleBg{
    0% {
        background-color: #806d9e;
        transform: translate(-50%,-60%);
    }
    25%{
        background-color:  #1a94bc;
        transform: translate(-60%,-50%);
    }
    50%{
        background-color:#806d9e;
        transform: translate(-50%,-40%);
    }
    75%{
        background-color: #63bbd0;
        transform: translate(-40%,-50%);
    }
    100%{
        background-color:  #c8adc4;
        transform: translate(-50%,-60%);
    }
}
.animation{
    animation: titleBg 5s linear infinite;
    -webkit-animation:titleBg 5s linear infinite;
}
.login_avater{
    width: 110px;
    height: 110px;
    border-radius: 50%;
    background-color: #1296db;
    opacity: 1;
    position: absolute;
    left: 50%;
    cursor: pointer;
    transform: translate(-50%,-50%);
    .iconfont,.icon_title{
        font-size: 90px;
        border-radius: 10px;
        padding: 10px;
    }
}
.login_form{
    width: 80%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-60%,-30%);
    .el-form{
        .el-form-item:nth-child(2){
            margin: 0;
        }
        .forget_pwd{
            width: 20%;
            font-size: 13px;
            transform: translateX(380%);
            margin: 10px 0;
        }
        .forget_pwd:hover{
            cursor: pointer;
            color: #de1c31;
        }
        .el-form-item:nth-child(4){
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
        }
    }
}
</style>