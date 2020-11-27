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
            <el-table :data="staffList" ref="refTable"  border stripe @expand-change="expandSelect">
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
        <!-- 修改用户信息的弹框 -->
        <el-dialog title="修改用户信息"  :visible.sync="editUserDialog" width="390px">
            <!-- 修改用户的信息表单 -->
            <el-form :model="editStaff" label-width="100px" >
                <el-form-item label="用户名" required prop="staffName"> 
                    <el-input type="text" v-model="editStaff.staffName"></el-input>
                </el-form-item>
                <el-form-item label="联系方式" required prop="staffPhone">
                    <el-input type="text" v-model="editStaff.staffPhone"></el-input>
                </el-form-item>
                <el-form-item label="密码" required prop="staffPassword">
                    <el-input type="password" v-model="editStaff.staffPassword"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="editStaff.staffStatus">
                        <el-option key="1001" value="1001" label="刚注册">刚注册</el-option>
                        <el-option key="1000" value="1000" label="正常">正常</el-option>
                        <el-option key="0" value="0" label="无权限">无权限</el-option>
                        <el-option key="-1" value="-1" label="离职">离职</el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="success" @click="editUser()">修改</el-button>
                <el-button type="primary" @click="editUserDialog = false">取消</el-button>
            </span>
        </el-dialog>
        <!-- 编辑用户权限 -->
        <el-dialog title="编辑用户权限" :visible.sync="handRoleDialog" width="390px">
            <el-tree :props="props" :default-checked-keys="selectedNode" show-checkbox accordion ref="rootTree" node-key="id" :data="roleList">

            </el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button type="success" @click="handRole()">修改</el-button>
                <el-button type="primary" @click="handRoleDialog = false">取消</el-button>
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
                //存储展开项的信息
                expands:[],
                //修改用户权限弹框
                handRoleDialog:false,
                roleList:[],
                //修改用户信息弹框
                editUserDialog:false,
                //所编辑用户的信息
                editStaff:{
                    staffId:'',
                    staffName:'',
                    staffPhone:'',
                    staffPassword:'',
                    staffStatus:''
                },
                // 每行展开状态
                expandedStatus:0,
                //树形关系
                props: {
                    children: 'children',
                    label: 'label'
                },
                //存储选中的节点
                selectedNode:[]
            }
        },
        created() {
            this.getRoleList()
        },
        methods:{
            //展开事件日志列表
            // clickTable(row, column, cell, event){
            //     if(cell.cellIndex!=3 && cell.cellIndex!=10){
            //         this.$refs.refTable.toggleRowExpansion(row);
            //     }
            //     this.getnoTicketReason("",row.businessType);
            // },
            //默认展开一行
            expandSelect(row, expandedRows) {
                var that = this
                var temp=[]
                if (expandedRows.length == 1 && this.expandedStatus==0){
                    this.expandedStatus == 1
                    let data = {
                        staffId:row.staffId,
                        userId:window.sessionStorage.getItem('staffId')
                    }
                    // console.log(data)
                    this.$axios.post('/stafflistjurisdiction/jurisdictiondelete',this.$qs.stringify(data),{
                        headers:{
                            staffToken:window.sessionStorage.getItem('staffToken'),
                        }
                    }).then((res) => {
                        temp = res.data.primaryMenuTreeList
                        this.roleList = res.data.primaryMenuTreeList
                    })
                    .catch((err) => {
                        this.$message.error(err.errMsg)
                    })
                }
                if (expandedRows.length > 1) {
                    if(this.expandedStatus == 0) {
                        this.expandedStatus = 1
                    }
                    this.roleList = []
                    let data = {
                        staffId:row.staffId,
                        userId:window.sessionStorage.getItem('staffId')
                    }
                    this.$axios.post('/stafflistjurisdiction/jurisdictiondelete',this.$qs.stringify(data),{
                        headers:{
                            staffToken:window.sessionStorage.getItem('staffToken'),
                        }
                    }).then((res) => {
                        this.roleList = res.data.primaryMenuTreeList
                    })
                    .catch((err) => {
                        this.$message.error(err.errMsg)
                    })
                    if (this.roleList) {
                        this.roleList=[]
                    }
                    this.$refs.refTable.toggleRowExpansion(expandedRows[0])
                } else if (expandedRows.length == 0){
                    this.expandedStatus=0
                    this.roleList=[]
                } else {
                    this.roleList=[]
                }
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
                // console.log(rowInfo)
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
            editUserDialog1(Staff) {
                // console.log(Staff)
                this.editUserDialog=true
                this.editStaff.staffId = Staff.staffId
                this.editStaff.staffName = Staff.staffName
                this.editStaff.staffPhone = Staff.staffPhone
                this.editStaff.staffPassword = Staff.staffPassword
                if (Staff.staffPosition == null) {
                    this.editStaff.staffPosition = "无"
                }
                if (Staff.staffStatus == 1000) {
                    this.editStaff.staffStatus = "正常"
                } else if (Staff.staffStatus == 1001) {
                    this.editStaff.staffStatus = "刚注册"
                } else if (Staff.staffStatus == 0) {
                    this.editStaff.staffStatus = "无权限"
                } else {
                    this.editStaff.staffStatus = "离职"
                }
            },
            //修改用户
            editUser() {
                if (this.editStaff.staffStatus == "正常") {
                    this.editStaff.staffStatus = 1000
                } else if (this.editStaff.staffStatus == "刚注册") {
                    this.editStaff.staffStatus = 1001
                } else if (this.editStaff.staffStatus == "无权限") {
                    this.editStaff.staffStatus = 0
                } else if (this.editStaff.staffStatus == "离职") {
                    this.editStaff.staffStatus = -1
                }
                let staff = {
                    staffId: this.editStaff.staffId,
                    staffName: this.editStaff.staffName,
                    staffPassword: this.editStaff.staffPassword,
                    staffPhone: this.editStaff.staffPhone,
                    staffStatus: this.editStaff.staffStatus
                }
                let data = {
                    staffA: JSON.stringify(staff)
                } 
                // console.log(data)
                this.$axios.post('/stafflistjurisdiction/modifycommit', this.$qs.stringify(data), {
                    headers:{
                        staffToken: window.sessionStorage.getItem("staffToken")
                    }
                })
                .then((res) => {
                    if (res.data.success) {
                        this.$message.success("修改成功")
                        this.getRoleList()
                    } else {
                        this.$message.error(res.data.errMsg)
                    }
                })
                .catch((err) => {
                    this.$message.error(err.message)
                })
                this.editUserDialog = false
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
            async removeRoleById(staff,functionId, layer) {
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
                // console.log(this.roleList)

                const confirmResult =  await this.$confirm('此操作不可恢复，确认要删除该角色信息？','删除角色',{
                    confirmButtonText:'确认',
                    showCancelButton:true,
                    type: 'warning'
                })
                .catch(err => {
                    this.$message.info('已取消删除')
                })

                // console.log(confirmResult)
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
                                    // console.log(newRoleList)
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
            handRoleDialog1(rowInfo) {
                this.handRoleDialog = true

                //发送请求,获取用户的角色信息
                let data = {
                    staffId : rowInfo.staffId
                }
                // console.log(data)
                this.$axios.post('/stafflistjurisdiction/jurisdictiondistribution',this.$qs.stringify(data),{
                    headers:{
                        staffToken: window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    if (res.data.success) {
                        // console.log(res.data.primaryMenuTreeList)
                        this.roleList = res.data.primaryMenuTreeList
                        this.changeToTree()
                    }
                })
                .catch((err) => {
                    this.$message.error(err.message)
                })
            },
            //分配角色
            handRole() {
                console.log(this.$refs.rootTree.getCheckedNodes());
                //console.log(this.editRole.radio)
                // let staffPositionRelation = {
                //     staffId: this.editRole.staffId,
                //     staffPositionId: this.editRole.radio,
                //     staffPositionStatus: 1
                // }

                // let data = {
                //     staffPositionRelation: JSON.stringify(staffPositionRelation)
                // }
                // console.log(data)
                // this.$axios.post('/stafflistjurisdiction/jurisdictiondistributioncommit',this.$qs.stringify(data),{
                //     headers:{
                //         staffToken: window.sessionStorage.getItem('staffToken')
                //     }
                // })
                // .then((res) => {
                //     // console.log(res)
                //     if (res.data.success) {
                //          this.$message.success('角色分配成功')
                //         this.getUserList()
                //     }
                // })
                // .catch((err) => {
                //     this.$message.error(err.errMsg)
                // })
                this.handRoleDialog = false
            },
            //把权限信息转换成树
            changeToTree() {
                let third_arr = []
                let second_arr = []
                let first_arr = []
                this.selectedNode = []
                // console.log(this.roleList)
                for (let i = 0; i < this.roleList.length; i++) {
                    // console.log(this.roleList[i].primaryMenuName)
                    for (let j = 0; j < this.roleList[i].secondaryMenuTreeList.length; j++) {
                        // console.log(this.roleList[i].secondaryMenuTreeList[j].secondaryMenuName)
                        third_arr = []
                        for (let k = 0; k < this.roleList[i].secondaryMenuTreeList[j].functionTreeList.length; k++) {
                            let third = {
                                id:this.roleList[i].secondaryMenuTreeList[j].functionTreeList[k].functionId,
                                label:this.roleList[i].secondaryMenuTreeList[j].functionTreeList[k].functionName,
                            }
                            third_arr.push(third)
                            if (this.roleList[i].secondaryMenuTreeList[j].functionTreeList[k].isSelected == 1) {
                                this.selectedNode.push(this.roleList[i].secondaryMenuTreeList[j].functionTreeList[k].functionId)
                            }
                            // console.log(third)
                        }
                        let second = {
                            id:this.roleList[i].secondaryMenuTreeList[j].secondaryMenuId,
                            label:this.roleList[i].secondaryMenuTreeList[j].secondaryMenuName,
                            children: third_arr
                        }
                        second_arr.push(second)
                    }
                    let first = {
                            id:this.roleList[i].primaryMenuId,
                            label:this.roleList[i].primaryMenuName,
                            children: second_arr
                    }
                    first_arr.push(first)
                }
                // console.log(first_arr)
                this.roleList = first_arr
                //显示所有选中节点
                console.log(this.selectedNode)
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