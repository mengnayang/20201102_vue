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
                            <div @click="changeCode()" class="code">
                                <!-- 引入验证码组件 -->
                                <identify :identifyCode="identifyCode"></identify>
                            </div>
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
            <el-button-group>
                <el-button v-show="activeIndex > 0" @click="prev()">上一步</el-button>
                <el-button :disabled="isDisabled" @click="next()">{{textInfo}}</el-button>
            </el-button-group>
        </div>
    </div>
</template>

<script>
import identify from '../components/Identify'
    export default{
        name:'ForgetPwd',
            components:{
                identify
            },
        data() {
            var checkPhone = (rule, value, callback) => {
                if (value == '') {
                    callback(new Error('联系方式不能为空'))
                } else {
                    let isNull = value.match(/^1(3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/)
                    if (isNull == null) {
                        callback(new Error('联系方式不合法'))
                    } 
                    // else {
                    //     this.$axios.get('/staff/code')
                    //     .then((res) => {
                    //         console.log(res.data.obj.checkCode)
                    //         this.returnCode = res.data.obj.checkCode
                    //     })
                    //     .catch((err) => {
                    //         this.$message.error(err.message)
                    //     })
                    // }
                }
            }
            var checkCode = (rule, value, callback) => {
                if(value == '') {
                    callback(new Error('验证码不能为空'))
                } else {
                    if (value != this.identifyCode) {
                        callback(new Error('验证码错误'))
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
                // 验证码初始值
                identifyCode: '1234',
                // 验证码的随机取值范围
                identifyCodes: '1234567890',
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
        mounted() {
            // 刷新页面就生成随机验证码
            this.identifyCode = ''
            this.makeCode(this.identifyCodes, 4)
        },
        methods:{
            // 点击验证码刷新验证码
            changeCode () {
                this.identifyCode = ''
                this.makeCode(this.identifyCodes, 4)
            },
            // 生成一个随机整数  randomNum(0, 10) 0 到 10 的随机整数， 包含 0 和 10
            randomNum (min, max) {
                max = max + 1
                return Math.floor(Math.random() * (max - min) + min)
            },
            // 随机生成验证码字符串
            makeCode (data, len) {
                for (let i = 0; i < len; i++) {
                    this.identifyCode += data[this.randomNum(0, data.length - 1)]
                }
            },
            //操作的下一步跳转
            next() {
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
                    this.textInfo = '修改'
                } else if (this.activeIndex == 2) {
                    this.$refs.PasswordRef.validate(valid => {
                        flag = valid
                    })
                    if (flag) {
                        this.activeIndex++;
                    }     
                    let data = {

                    }
                    this.$axios.post('/staff/changePassword', this.$qs.stringify(data))
                    .then((res) => {
                        if (res.data.success) {
                            this.$message.success('密码修改成功，3s后请重新登陆')
                            setTimeout(() => {
                                this.$router.go(-1)
                            },3000)  
                        } else {
                            this.$message.error(res.data.errMsg)
                        }
                    })
                    .catch((err) => {
                        this.$message.error(err.message)
                    })  
                } 
            },
            prev() {
                this.activeIndex = this.activeIndex - 1
                if (this.activeIndex == 1) {
                    this.textInfo = '下一步'
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
    width: 88%;
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
    width: 73%;
    position: absolute;
    height: 70%;
    transform: translate(-14%,-17%);
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
.el-button-group{
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    transform: translateY(650%);
    .el-button{
        margin: 0 10px;
    }
}
.code{
    transform: translate(15%,-20%);
}
</style>