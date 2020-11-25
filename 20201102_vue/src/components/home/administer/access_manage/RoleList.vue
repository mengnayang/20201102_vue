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
                <el-table-column label="用户名称" prop="staffName" align="center"></el-table-column>
                <el-table-column label="角色名称" prop="staffPositionName" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-tooltip effect="light" placement="top" content="编辑" :enterable="false">
                            <el-button type="success" size="mini" icon="el-icon-edit"></el-button>
                        </el-tooltip>
                        <el-tooltip effect="light" placement="top" content="删除" :enterable="false">
                            <el-button type="danger" size="mini" icon="el-icon-delete"></el-button>
                        </el-tooltip>
                        <el-tooltip effect="light" placement="top" content="分配角色" :enterable="false">
                            <el-button type="warning" size="mini" icon="el-icon-setting"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
    export default{
        name: 'RoleList',
        data() {
            return{
                //请求权限列表的先决条件
                queryInfo:{
                    pageIndex:0,
                    total:0,
                    infoCount:4
                },
                //二级菜单列表
                secondaryMenuList:[],
                secondaryMenuId:''
            }
        },
        created() {
            this.getRoleList()
        },
        methods:{
            //获取部分权限列表
            getRoleList() {
                // 获取当前二级菜单的id
                this.secondaryMenuList = window.sessionStorage.getItem('secondaryMenuList')
                console.log(this.secondaryMenuList)
                this.secondaryMenuList = JSON.parse(this.secondaryMenuList)
                console.log(this.secondaryMenuList)

                // while(true) {
                //     let i = 0
                //     if (this.secondaryMenuList[i].secondaryMenuUrl == this.$route.path && i < this.secondaryMenuList.length) {
                //         this.secondaryMenuId = this.secondaryMenuList[i].secondaryMenu
                //         break;
                //     }
                // }

                let data = {
                    pageIndex:this.queryInfo.pageIndex,
                    pageSize:this.queryInfo.infoCount,
                    staffId:window.sessionStorage.getItem('staffId'),
                    secondaryMenuId:this.secondaryMenuId
                }
                console.log(data)
                // this.$axios.post('http://localhost:8080/stafflistjurisdiction',this.$qs.stringify(data),{
                //     headers:{
                //         staffToken: window.sessionStorage.getItem('staffToken')
                //     }
                // })
                // .then((res) => {
                //     console.log(res)
                // })
                // .catch((err) => {
                //     this.$message.error(err.errMsg)
                // })
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