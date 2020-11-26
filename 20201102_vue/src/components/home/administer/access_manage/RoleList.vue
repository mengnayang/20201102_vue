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
            <!-- 添加角色区域
            <el-row>
                <el-col>
                    <el-button type="primary">添加角色</el-button>
                </el-col>
            </el-row> -->
            <!-- 角色列表区域 -->
            <el-table :data="staffList"  border stripe @expand-change="expandSelect">
                <!-- 展开列 -->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row v-for="(item,index) in roleList" :key="item.primaryMenuId" :class="['bdBottom','tagCenter',index == 0 ? 'bdTop':'']">
                            <!-- 一级功能 -->
                            <el-col :span="5">
                                <el-tag closable @close="removeRoleById(scope.row,item.primaryMenuId,1)">{{item.primaryMenuName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <el-col :span="19">
                                <el-row v-for="(subItem,index) in item.secondaryMenuTreeList" :key="subItem.secondaryMenuId" :class="[index == 0 ? '':'bdTop','tagCenter']">
                                    <el-col :span="6">
                                        <el-tag type="success" closable @close="removeRoleById(scope.row,subItem.secondaryMenuId,2)">{{subItem.secondaryMenuName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag v-for="deep in subItem.functionTreeList" :key="deep.functionId" type="warning" closable @close="removeRoleById(scope.row,deep.functionId,3)">
                                            {{deep.functionName}}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <!-- 索引列 -->
                <el-table-column type="index" label="序号" align="center" width="80px"></el-table-column>
                <el-table-column label="用户名称" prop="staffName" align="center"></el-table-column>
                <el-table-column label="角色名称" prop="staffPositionName" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button-group v-for="func in functionList_one" :key="func.functionId">
                            <el-tooltip effect="light" placement="top" :content="func.functionName" :enterable="false">
                                <el-button :type="func.btnType" size="mini" :icon="func.btnIcon" @click="getButtonStatus(scope.row,func.functionId)"></el-button>
                            </el-tooltip>
                        </el-button-group>
                        <!-- <el-tooltip effect="light" placement="top" content="编辑" :enterable="false">
                            <el-button type="success" size="mini" icon="el-icon-edit"></el-button>
                        </el-tooltip>
                        <el-tooltip effect="light" placement="top" content="删除" :enterable="false">
                            <el-button type="danger" size="mini" icon="el-icon-delete"></el-button>
                        </el-tooltip>
                        <el-tooltip effect="light" placement="top" content="分配权限" :enterable="false">
                            <el-button type="warning" size="mini" icon="el-icon-setting"></el-button>
                        </el-tooltip> -->
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
        <!-- 编辑用户权限 -->
        <el-dialog title="编辑用户权限" :visible.sync="editUserDialog" width="390px">
            <!-- <el-tree :data="roleList" show-checkbox default-expand-all ref="tree" highlight-current
            :props="defaultProps">

            </el-tree> -->
            <span slot="footer" class="dialog-footer">
                <el-button type="success" @click="editRole()">修改</el-button>
                <el-button type="primary" @click="editUserDialog = false">取消</el-button>
            </span>
        </el-dialog>
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
                functionList:[],
                //一级功能菜单
                functionList_one:[],
                //二级功能菜单
                functionList_two:[],
                //是否已经渲染功能按钮
                isDraw:false,
                //是否存在角色分配
                isExistsHandRole:false,
                // 获取row的key值
                // getRowKeys(row) {
                //     return row.id;
                // },
                //存储展开项的信息
                expands:[],
                //修改用户权限弹框
                editUserDialog:false,
                //树形关系
                // defaultProps: {
                //     children: 'children',
                //     label: 'label'
                // },
                roleList:[],
                //新增
                // expandKeys:[]
            }
        },
        created() {
            this.getRoleList()
        },
        methods:{
            //默认展开行
            getRowKeys(row) {
                return row.id
            },
            //检测行被点击事件,获取操作用户staffId
            expandSelect(row, expandedRows) {
                console.log(row,expandedRows)
                // if(expandedRows.length> 1){
                //     expandedRows.shift()
                // }

                // if (this.expandKeys.indexOf(row.id) >= 0) {
                //     this.expandKeys.shift()
                //     return;
                // }
                var that = this
                if (expandedRows.length) {
                    that.expands = []
                    if (row) {
                        that.expands.push(row.id)// 每次push进去的是每行的ID
                    }
                } else {
                    that.expands = []// 默认不展开
                }
                

                // if (expandedRows.length) {
                //     this.expands = []
                //     if (row) {
                //         this.expands.push(row.id)// 每次push进去的是每行的ID
                //     }
                // } else {
                //     this.expands = []// 默认不展开
                // }
                // console.log(row)
                // console.log(expandedRows)

                // if (this.expands.includes(row.id)) {
                //     this.expands = this.expands.filter(val => val !== row.id);
                // } else {
                //     this.expands.push(row.id);
                // }; 

                // console.log(row,expandedRows)
                let data = {
                    staffId:row.staffId,
                    userId:window.sessionStorage.getItem('staffId')
                }
                // console.log(data)
                this.$axios.post('/stafflistjurisdiction/jurisdictiondelete',this.$qs.stringify(data),{
                    headers:{
                        staffToken:window.sessionStorage.getItem('staffToken'),
                    }
                })
                .then((res) => {
                    this.roleList = res.data.primaryMenuTreeList
                    // console.log(this.roleList)
                })
                .catch((err) => {
                    console.log(err.errMsg)
                })

                if (expandedRows.length > 1) {
                    //只展开当前选项
                    expandedRows.shift()
                }
                console.log(expandedRows.length)
            },
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
                        
                        //渲染功能按钮
                        if(!this.isDraw) {
                            for (let i = 0; i < this.functionList.length; i++) {
                                if (this.functionList[i].functionId == 34) {
                                    this.$set(this.functionList[i],"btnType","success")
                                    this.$set(this.functionList[i],"btnIcon","el-icon-edit")
                                    this.functionList_one.push(this.functionList[i])
                                } else if (this.functionList[i].functionId == 35) {
                                    this.$set(this.functionList[i],"btnType","danger")
                                    this.$set(this.functionList[i],"btnIcon","el-icon-delete")
                                    this.functionList_one.push(this.functionList[i])
                                } else if (this.functionList[i].functionId == 36) {
                                    this.$set(this.functionList[i],"btnType","warning")
                                    this.$set(this.functionList[i],"btnIcon","el-icon-setting")
                                    this.functionList_one.push(this.functionList[i])
                                } else if (this.functionList[i].functionId == 37) {
                                    this.$set(this.functionList[i],"btnType","primary")
                                    this.functionList_two.push(this.functionList[i])
                                    this.isExistsHandRole = true
                                }
                                this.isDraw = true
                            }
                        }
                    }    
                })
                .catch((err) => {
                    this.$message.error(err.errMsg)
                })
            },
            //获取指定权限列表的信息
            currentChange(currentPage){
                this.queryInfo.pageIndex = currentPage
                this.getRoleList()
            },
            //获取按钮功能
            getButtonStatus(rowInfo,functionId) {
                console.log(rowInfo)
                if (functionId == 34) {
                    this.editUserDialog1(rowInfo)
                } else if (functionId == 35) {
                    this.removeUserById(rowInfo)
                } else if (functionId == 36) {
                    this.handRoleDialog1(rowInfo)
                } else if (functionId == 37) {
                    this.handRole()
                }
            },
            // 编辑用户权限弹框
            editUserDialog1(rowInfo) {
                let data = {
                    staffId:rowInfo.staffId,
                    userId:window.sessionStorage.getItem('staffId')
                }
                // console.log(data)
                this.$axios.post('/stafflistjurisdiction/jurisdictiondistribution',this.$qs.stringify(data),{
                    headers:{
                        satffToken:window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    console.log(res)
                })
                .catch((err) => {
                    console.log(err)
                })
            },
            //删除指定用户的权限
            async removeUserById(staff) {
                const confirmResult = await this.$confirm('此操作不可恢复，确认要永久删除该用户的该角色？','删除用户角色',{
                    confirmButtonText:'确认',
                    showCancelButton:true,
                    type: 'warning'
                })
                .catch(err => {
                    this.$message.info('已取消删除')
                })

                if (confirmResult == 'confirm') {
                    //console.log(staff.staffId)
                    //console.log(window.sessionStorage.getItem('staffToken'))
                    let data = {
                        staffId: staff.staffId,
                        userId: window.sessionStorage.getItem('staffId')
                    }
                    this.$axios.post('/stafflistjurisdiction/deletestaff',this.$qs.stringify(data),{
                        headers:{
                            staffToken:window.sessionStorage.getItem('staffToken')
                        }
                    })
                    .then((res) => {
                        // console.log(res)
                        if (res.data.success) {
                            this.$message.success('删除成功')
                            this.getRoleList()
                        }
                    })
                    .catch((err) => {
                        this.$message.error(err.message)
                    })
                }
            },
            //删除用户权限
            removeRoleById(staff,functionId, layer) {
                // console.log(functionId,layer)
                // console.log(this.roleList)
                // console.log(this.roleList[0].secondaryMenuTreeList)
                // console.log(this.roleList[0].secondaryMenuTreeList.length)
                if (layer == 1) {
                    for (let i = 0; i < this.roleList.length; i++) {
                        if (this.roleList[i].primaryMenuId == functionId) {
                            this.$delete(this.roleList,i)
                        }
                    }
                } else if (layer == 2) {
                    for (let i = 0; i < this.roleList.length; i++) {
                        for (let j = 0; j < this.roleList[i].secondaryMenuTreeList.length; j++) {
                            if (this.roleList[i].secondaryMenuTreeList[j].secondaryMenuId == functionId) {
                                this.$delete(this.roleList[i].secondaryMenuTreeList,j)
                            }
                        }
                    }
                } else if (layer == 3) {
                    for (let i = 0; i < this.roleList.length; i++) {
                        for (let j = 0; j < this.roleList[i].secondaryMenuTreeList.length; j++) {
                            for (let k = 0; k < this.roleList[i].secondaryMenuTreeList[j].functionTreeList.length; k++) {
                                if (this.roleList[i].secondaryMenuTreeList[j].functionTreeList[k].functionId == functionId) {
                                    this.$delete(this.roleList[i].secondaryMenuTreeList[j].functionTreeList, k)
                                }
                            }
                        }
                    }
                }
                console.log(this.roleList)

                const confirmResult =  this.$confirm('此操作不可恢复，确认要删除该角色信息？','删除角色',{
                    confirmButtonText:'确认',
                    showCancelButton:true,
                    type: 'warning'
                })
                .catch(err => {
                    this.$message.info('已取消删除')
                })

                let newRoleList = []
                if (confirmResult == 'confirm') {
                    for (let i = 0; i < this.roleList.length; i++) {
                        for (let j = 0; j < this.roleList[i].secondaryMenuTreeList.length; j++) {
                            for (let k = 0; k < this.roleList[i].secondaryMenuTreeList[j].functionTreeList.length; k++) {
                                if (this.roleList[i].secondaryMenuTreeList[j].functionTreeList[k].functionId) {
                                    let list = {
                                        staffId:staff.staffId,
                                        functionId:this.roleList[i].secondaryMenuTreeList[j].functionTreeList[k].functionId,
                                        jurisdictionStatus:1
                                    }
                                    newRoleList.push(list)
                                }
                            }
                        }
                    }
                }
                // console.log(newRoleList)
                let data = {
                    staffJurisdictionList:JSON.stringify(newRoleList),
                    userId:window.sessionStorage.getItem('staffId')
                }
                
                // console.log(data)

                this.$axios.post('/stafflistjurisdiction/jurisdictiondeletecommit',this.$qs.stringify(data),{
                    headers:{
                        staffToken: window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    // console.log(res)
                    if (res.data.success) {
                        this.$message.success('角色功能删除成功')
                    }
                })
                .catch((err) => {
                    this.$message.error(err.message)
                })
                
            },
            //编辑用户角色分配弹窗
            handRoleDialog1(staff) {
                this.handRoleDialog = true

                //存储用户的相关信息,以便角色分配
                this.editRole.staffId = staff.staffId
                this.editRole.staffStatus = staff.staffStatus

                //发送请求,获取用户的角色信息
                let data = {
                    staffId : staff.staffId
                }
                this.$axios.post('/stafflist/positiondistribution',this.$qs.stringify(data),{
                    headers:{
                        staffToken: window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    // console.log(res)
                    // console.log(res.data.staffPositionList)
                    // console.log(res.data.staffPositionRelation)
                    // console.log(res.data.staffPositionList)
                    // console.log(res.data.staffPositionRelation.staffPositionId)
                    // 判断是否存在角色
                    if (res.data.staffPositionRelation != null) {
                        this.editRole.radio = res.data.staffPositionRelation.staffPositionId
                    } else {
                        this.editRole.radio = 0
                    }
                })
                .catch((err) => {
                    this.$message.error(err.errMsg)
                })
            },
            //分配角色
            handRole() {
                //console.log(this.editRole.radio)
                let staffPositionRelation = {
                    staffId: this.editRole.staffId,
                    staffPositionId: this.editRole.radio,
                    staffPositionStatus: 1
                }

                let data = {
                    staffPositionRelation: JSON.stringify(staffPositionRelation)
                }
                // console.log(data)
                this.$axios.post('/stafflist/positiondistributioncommit',this.$qs.stringify(data),{
                    headers:{
                        staffToken: window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    // console.log(res)
                    if (res.data.success) {
                         this.$message.success('角色分配成功')
                        this.getUserList()
                    }
                })
                .catch((err) => {
                    this.$message.error(err.errMsg)
                })
                this.handRoleDialog = false
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
.el-form{
    margin-right: 30px;
}
.el-button-group{
    .el-button{
        margin: 0 5px;
    }
}
.el-pagination{
    width: 50%;
    margin: 10px auto;
}
.el-tag{
    margin: 7px;
}
.bdTop{
    border-top: 1px solid #eee;
}
.bdBottom{
    border-bottom: 1px solid #eee;
}
.tagCenter{
    display: flex;
    align-items: center;
}
</style>