<template>
    <div class="register_contaienr">
        <div class="register_form">
            <el-form label-width="100px">
                <el-form-item label="用户名" required>
                    <el-input type="text" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="联系方式" required>
                    <el-input type="text" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="新密码" required>
                    <el-input type="password" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" required>
                    <el-input type="password" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" round size="mini">提交</el-button>
                    <el-button type="primary" round size="mini" @click="return_login()">返回</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default{
        name:'Register',
        data(){
            return{

            }
        },
        methods:{
            return_login() {
                this.$router.back()
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
    height: 300px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    .el-form{
        .el-form-item:nth-child(5){
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
        }
    }
}
</style>