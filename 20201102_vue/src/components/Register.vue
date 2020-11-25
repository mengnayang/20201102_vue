<template>
    <div class="register_container">
        <div class="register_form">
            <div class="register_title">
                <span>新用户注册</span>
            </div>
            <el-form label-width="100px" :model="RegisterForm" :rules="RegisterRules" ref="RegisterRef">
                <el-form-item label="用户名" prop="staffName" required>
                    <el-input type="text" v-model="RegisterForm.staffName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="联系方式" prop="staffPhone" required>
                    <el-input type="text" v-model="RegisterForm.staffPhone" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="staffPassword" required>
                    <el-input type="password" v-model="RegisterForm.staffPassword" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="staffPassword1" required>
                    <el-input type="password" v-model="RegisterForm.staffPassword1" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" round size="small" @click="submit()">提交</el-button>
                    <el-button type="info" round size="small" @click="reset()">重置</el-button>
                    <el-button type="primary" round size="small" @click="return_login()">返回</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default{
        name:'Register',
        data(){
            //校验姓名
            var checkName = (rule, value, callback) => {
                if (value == '') {
                    callback(new Error('姓名不能为空'))
                } 
            } 
            var checkPhone = (rule, value, callback) => {
                if (value == '') {
                    callback(new Error('联系方式不能为空'))
                } else {
                    let isNull = value.match(/^1(3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/)
                    if (isNull == null) {
                        callback(new Error('联系方式不合法'))
                    }
                }
            }
            var checkPassword = (rule, value, callback) => {
                if (value == '') {
                    callback(new Error('新密码不能为空'))
                } else {
                    if (value.length < 8 || value.length > 16) {
                        callback(new Error('密码必须满足8~16位'))
                    }
                }
            }
            var checkPassword1 = (rule, value, callback) => {
                if (value == '') {
                    callback(new Error('新密码不能为空'))
                } else {
                    if (value.length < 8 || value.length > 16) {
                        callback(new Error('密码必须满足8~16位'))
                    } else {
                        if (value != this.RegisterForm.staffPassword) {
                            callback(new Error('两次密码输入不一致'))
                        }
                    }
                }
            }
            return{
                //注册表单信息
                RegisterForm:{
                    staffName:'',
                    staffPhone:'',
                    staffPassword:'',
                    staffPassword1:''
                },
                //检验注册表单的合法性
                RegisterRules:{
                    staffName:[
                        {validator:checkName, trigger:'blur'}
                    ],
                    staffPhone:[
                        {validator:checkPhone, trigger:'blur'}
                    ],
                    staffPassword:[
                        {validator:checkPassword, trigger:"blur"}
                    ],
                    staffPassword1:[
                        {validator:checkPassword1, trigger:'blur'}
                    ]
                }
            }
        },
        methods:{
            //返回登陆页面
            return_login() {
                this.$router.back()
            },
            //注册表单重置
            reset() {
                this.$refs.RegisterRef.resetFields()
            },
            //提交注册信息
            submit() {
                let RegisterForm_1 = {
                    staffName : this.RegisterForm.staffName,
                    staffPhone : this.RegisterForm.staffPhone,
                    staffPassword : this.RegisterForm.staffPassword
                }

                let data = {
                    staff: JSON.stringify(RegisterForm_1)
                }

                this.$axios.post('/staff/insert',this.$qs.stringify(data))
                .then((res) => {
                    if (res.data.success) {
                        this.$message.success('注册成功,3s后跳转')
                        //延迟3s跳转到首页
                        setTimeout(() => {
                            this.$router.back()
                        },3000)
                    } else {
                        this.$message.error('注册失败')
                        this.reset()
                    }
                })
                .catch((err) => {
                    this.$message.error(err)
                })
            }
        }
    }
</script>

<style lang="less" scoped>
.register_container{
    background: url("../assets/image/bg.jpg") no-repeat;
    background-size: 100% 100%;
    height: 100%;
}
.register_form{
    width: 450px;
    height: 350px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: #ffffff;
    border-radius: 10px;
    .register_title{
        position: absolute;
        left: 50%;
        font-size: 40px;
        font-family: "微软雅黑",PingFang SC;
        transform: translate(-50%,-50%);
        span{
            background: linear-gradient(right,#813c85,#93d5dc,#1177b0);
            background: -webkit-linear-gradient(right,#813c85,#93d5dc,#1177b0);
            background-clip: text;
            -webkit-background-clip: text;
            color: transparent;
            font-weight: 700;
            text-shadow: #c6e6e8 2px 2px 1px;
        }
    }
    .el-form{
        width: 80%;
        padding: 50px 20px;
        .el-form-item:nth-child(5){
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
        }
    }
}
</style>