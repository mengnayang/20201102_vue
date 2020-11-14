<template>
    <div class="forget_pwd_container">
        <div class="forget_pwd">
            <el-steps :active="activeIndex" finish-status="success" align-center>
                <el-step title="用户须知"></el-step>
                <el-step title="身份验证"></el-step>
                <el-step title="密码修改"></el-step>
            </el-steps>
            <div class="forget_content">
                <div v-if="activeIndex == 0">
                    <p>1. 禁止恶意修改密码</p>
                    <p>2. 修改密码的次数不得超过一周三次</p>
                    <p>3. 验证发送超过三次将禁止该用户修改密码</p>
                    <el-radio-group v-model="radio">
                        <el-radio :label="1" @change="accept()">我同意</el-radio>
                        <el-radio :label="0" @change="reject()">我不接受</el-radio>
                    </el-radio-group>
                </div>
                <div v-else-if="activeIndex == 1">
                    <div class="forget_pwd_form">
                        <el-form  label-width="80px" :model="info" :rules="InfoRules" ref="InfoRef">
                            <el-form-item label="手机号" required prop="staffPhone">
                                <el-input type="text" v-model="info.staffPhone" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="验证码" required prop="checkCode">
                                <el-input type="text" v-model="info.checkCode" auto-complete="off"></el-input>  
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
                <div v-else class="set_pwd_form">
                    <el-form  label-width="80px" :model="password" :rules="PasswordRules" ref="PasswordRef">
                        <el-form-item label="新密码" required prop="staffPassword">
                            <el-input type="password" v-model="password.staffPassword" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="确认密码" required prop="staffPassword1">
                            <el-input type="password" v-model="password.staffPassword1" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <el-button :disabled="isDisabled" @click="next()">{{textInfo}}</el-button>
        </div>
    </div>
</template>

<script>
    export default{
        name:'ForgetPwd',
        data() {
            var checkPhone = (rule, value, callback) => {
                if (value == '') {
                    callback(new Error('联系方式不能为空'))
                } else {
                    let isNull = value.match(/^1(3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/)
                    if (isNull == null) {
                        callback(new Error('联系方式不合法'))
                    } else {
                        this.$axios.get('/staff/code')
                        .then((res) => {
                            console.log(res.data.obj.checkCode)
                            this.returnCode = res.data.obj.checkCode
                        })
                        .catch((err) => {
                            this.$message.error(err)
                        })
                    }
                }
            }
            var checkCode = (rule, value, callback) => {
                if (this.info.staffPhone == '') {
                    callback(new Error('输入手机号将自动获取验证码'))
                } else {
                    if(value == '') {
                        callback(new Error('验证码不能为空'))
                    } else {
                        if (value != this.returnCode) {
                            callback(new Error('验证码错误'))
                        }
                    }
                }
            }
            var checkPwd = (rule, value, callback) => {
                if (value == '') {
                    callback(new Error('新密码不能为空'))
                } else {
                    if (value.length < 8 || value.length > 16) {
                        callback(new Error('密码必须满足8~16位'))
                    }
                }
            }
            var checkPwd1 = (rule, value, callback) => {
                if (value == '') {
                    callback(new Error('确认密码不能为空'))
                } else {
                    if (value.length < 8 || value.length > 16) {
                        callback(new Error('密码必须满足8~16位'))
                    } else if(value != this.password.staffPassword) {
                        callback(new Error('两次密码输入不一致'))
                    }
                }
            }
            return{
                activeIndex:0,
                isDisabled:true,
                radio:'',
                returnCode:'',
                textInfo:'下一步',
                info:{
                    staffPhone:'',
                    checkCode:''
                },
                password:{
                    staffPassword:'',
                    staffPassword1:'',
                },
                InfoRules:{
                    staffPhone:[
                        {validator:checkPhone}
                    ],
                    checkCode:[
                        {validator:checkCode}
                    ]
                },
                PasswordRules:{
                    staffPassword:[
                        {validator:checkPwd}
                    ],
                    staffPassword1:[
                        {validator:checkPwd1}
                    ]
                }
                
            }
        },
        methods:{
            //操作的下一步跳转
            next() {
                console.log(this.activeIndex)
                var flag = true
                if (this.activeIndex == 0) {
                    this.activeIndex++;
                } else if (this.activeIndex == 1) {
                    this.$refs.InfoRef.validate(valid => {
                        flag = valid
                    })
                    if (flag) {
                        this.activeIndex++;
                    }   
                } else if (this.activeIndex == 2) {
                    this.$refs.PasswordRef.validate(valid => {
                        flag = valid
                    })
                    if (flag) {
                        this.activeIndex++;
                    }   
                    this.textInfo = '已完成'
                } else if (this.activeIndex == 3) {
                    this.$message.success('密码修改成功，2s后请重新登陆')
                    setInterval(() => {
                        this.$router.go(-1)
                    },3000)
                }
            },
            //同意，下一步
            accept() {
                this.isDisabled = false
            },
            //拒绝，不进行下一步
            reject() {
                this.isDisabled = true
            }
        }
    }
</script>

<style lang="less" scoped>
.forget_pwd_container{
    background: url("../assets/image/bg.jpg");
    size: 100% 100%;
    height: 100%;
}
.forget_pwd{
    width: 450px;
    height: 350px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: #fff;
    border-radius: 10px;
    padding: 30px;
}
.forget_content{
    width: 85%;
    height: 55%;
    position: absolute;
    border: 1px solid green;
    margin: 20px 0;
    div:nth-child(1){
        padding: 35px 60px;
        .el-radio-group{
            transform: translate(40%);
        }
    }
}
.forget_pwd_form{
    width: 80%;
    position: absolute;
    top: 35%;
    left: 60%;
    transform: translate(-60%,-30%);
    .el-form{
        .el-form-item{
            margin: 0;
            padding: 10px 0;
            .el-input{
                padding: 0;
            }
        }
    }
}
.set_pwd_form{
    width: 80%;
    position: absolute;
    top: 35%;
    left: 60%;
    transform: translate(-60%,-30%);
    .el-form{
        .el-form-item{
            margin: 0;
            padding: 10px 0;
            .el-input{
                padding: 0;
            }
        }
    }
}
.el-button{
    transform: translate(200%,650%);
}
</style>