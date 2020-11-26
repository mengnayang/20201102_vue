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
            <el-table :data="staffList" border stripe @expand-change="getRoleById()">
                <!-- 展开列 -->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                    </template>
                </el-table-column>
                <!-- 索引列 -->
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
                        <el-tooltip effect="light" placement="top" content="分配权限" :enterable="false">
                            <el-button type="warning" size="mini" icon="el-icon-setting"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-pagination
        :current-page="queryInfo.pageIndex" :page-sizes="[queryInfo.infoCount]" 
        :page-size="queryInfo.infoCount" :total="queryInfo.total"
        @current-change="currentChange"
        layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
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
                secondaryMenuId:'',
                //权限列表
                staffList:[],
                //功能列表
                functionList:[]
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
                this.secondaryMenuList = JSON.parse(this.secondaryMenuList)
                // console.log(this.secondaryMenuList)

                for(var i = 0; i < this.secondaryMenuList.length; i++) {
                    if (this.secondaryMenuList[i].secondaryMenuUrl == this.$route.path) {
                        // console.log(this.secondaryMenuList[i].secondaryMenuId)
                        this.secondaryMenuId = this.secondaryMenuList[i].secondaryMenuId
                    }
                }

                let data = {
                    pageIndex:this.queryInfo.pageIndex,
                    pageSize:this.queryInfo.infoCount,
                    userId:window.sessionStorage.getItem('staffId'),
                    secondaryMenuId:this.secondaryMenuId
                }
                // console.log(data)
                this.$axios.post('/stafflistjurisdiction',this.$qs.stringify(data),{
                    headers:{
                        staffToken: window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    // console.log(res)
                    if (res.data.success) {
                        this.staffList = res.data.staffAList
                        // console.log(this.staffList)
                        this.queryInfo.total = res.data.recordSum
                        if (res.data.functionList != null) {
                            this.functionList = res.data.functionList
                        }
                    }    
                })
                .catch((err) => {
                    this.$message.error(err.errMsg)
                })
            },
            //获取指定用户的权限
            getRoleById(row, expandedRows) {
                console.log(row)
                console.log(expandedRows)
                // let data = {
                //     staffId:staffId,
                //     UserId:window.sessionStorage.getItem('staffId')
                // }
                // console.log(data)
                // this.$axios.post('/stafflistjurisdiction/jurisdictiondistribution',this.$qs.stringify(data),{
                //     headers:{
                //         satffToken:window.sessionStorage.getItem('staffToken')
                //     }
                // })
                // .then((res) => {
                //     console.log(res)
                // })
                // .catch((err) => {
                //     console.log(err.errMsg)
                // })
            },
            //获取指定权限列表的信息
            currentChange(currentPage){
                this.queryInfo.pageIndex = currentPage
                this.getRoleList()
            },
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
.el-form{
    margin-right: 30px;
}
.el-pagination{
    width: 50%;
    margin: 10px auto;
}
</style>