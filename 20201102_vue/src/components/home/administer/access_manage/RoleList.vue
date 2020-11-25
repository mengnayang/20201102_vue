<template>
    <div class="role_list_container">
        <!-- 面包屑导航 -->
        <el-breadcrumb>
            <el-breadcrumb-item :to="{path : '/welcome'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <!-- 添加角色区域 -->
            <el-row>
                <el-col>
                    <el-button type="primary">添加角色</el-button>
                </el-col>
            </el-row>
            <!-- 角色列表区域 -->
            <el-table>
                <el-table-column type="index" label="序号" align="center"></el-table-column>
                <el-table-column label="角色名称" prop="" align="center"></el-table-column>
                <el-table-column prop="角色描述" align="center"></el-table-column>
                <el-table-column prop="操作" align="center"></el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
    export default{
        name: 'RoleList',
        data() {
            return{

            }
        },
        created() {
            this.getRoleList()
        },
        methods:{
            getRoleList() {
                let data = {
                    
                }
                this.$axios.post('',this.$qs.stringify(data),{
                    headers:{
                        staffToken: window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    console.log(res)
                })
                .catch((err) => {
                    this.$message.error(err.errMsg)
                })
            }
        }
    }
</script>

<style lang="less" scoped>
.el-card{
    margin-top: 10px;
    box-shadow: 0 1px 1px rgba(0,0, 0, 0.15);
    .el-row{
        margin-bottom: 10px;
        &:last-child{
            margin-bottom: 0;
        }
    }
}
</style>