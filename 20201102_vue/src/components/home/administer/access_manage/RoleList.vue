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
                                <el-button :type="func.btnType" size="mini" :icon="func.btnIcon" @click="getButtonStatus(scope.row,func.functionWeight)"></el-button>
                            </el-tooltip>
                        </el-button-group>
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
            <el-tree :props="props" :default-checked-keys="selectedNode"  show-checkbox accordion ref="rootTree" node-key="id" :data="roleList">
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
                    pageIndex:1,
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
                selectedNode:[],
                //编辑权限的用户id
                editRoleId:''
            }
        },
        created() {
            this.getRoleList()
        },
        methods:{
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
                    this.$axios.post('/stafflistjurisdiction/jurisdictiondistribution',this.$qs.stringify(data),{
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

                for(var i = 0; i < this.secondaryMenuList.length; i++) {
                    if (this.secondaryMenuList[i].secondaryMenuUrl == this.$route.path) {
                        this.secondaryMenuId = this.secondaryMenuList[i].secondaryMenuId
                    }
                }

                let data = {
                    pageIndex:this.queryInfo.pageIndex-1,
                    pageSize:this.queryInfo.infoCount,
                    staffId:window.sessionStorage.getItem('staffId'),
                    secondaryMenuId:this.secondaryMenuId
                }
                this.$axios.post('/stafflistjurisdiction',this.$qs.stringify(data),{
                    headers:{
                        staffToken: window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    if (res.data.success) {
                        this.staffList = res.data.staffAList
                        this.queryInfo.total = res.data.recordSum
                        if (res.data.functionList != null) {
                            this.functionList = res.data.functionList
                        }
                        
                        //渲染功能按钮
                        if(!this.isDraw) {
                            for (let i = 0; i < this.functionList.length; i++) {
                                if (this.functionList[i].functionWeight == 1) {
                                    this.$set(this.functionList[i],"btnType","success")
                                    this.$set(this.functionList[i],"btnIcon","el-icon-edit")
                                    this.functionList_one.push(this.functionList[i])
                                } else if (this.functionList[i].functionWeight == 2) {
                                    this.$set(this.functionList[i],"btnType","danger")
                                    this.$set(this.functionList[i],"btnIcon","el-icon-delete")
                                    this.functionList_one.push(this.functionList[i])
                                } else if (this.functionList[i].functionWeight == 3) {
                                    this.$set(this.functionList[i],"btnType","warning")
                                    this.$set(this.functionList[i],"btnIcon","el-icon-setting")
                                    this.functionList_one.push(this.functionList[i])
                                } 
                                this.isDraw = true
                            }
                        }
                    }    
                })
                .catch((err) => {
                    this.$message.error(err.message)
                })
            },
            //获取指定权限列表的信息
            currentChange(currentPage){
                this.queryInfo.pageIndex = currentPage
                this.getRoleList()
            },
            //获取按钮功能
            getButtonStatus(rowInfo,functionWeight) {
                if (functionWeight == 1) {
                    this.editUserDialog1(rowInfo)
                } else if (functionWeight == 2) {
                    this.removeUserById(rowInfo)
                } else if (functionWeight == 3) {
                    this.handRoleDialog1(rowInfo)
                } else if (functionWeight == 4) {
                    this.handRole()
                }
            },
            // 编辑用户权限弹框
            editUserDialog1(Staff) {
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
                        if (res.data.success) {
                            this.$message.success('删除成功')
                            this.getRoleList()
                        } else {
                            this.$message.error(res.data.errMsg)
                        }
                    })
                    .catch((err) => {
                        this.$message.error(err.message)
                    })
                }
            },
            //删除用户权限
            removeRoleById(staff,functionId, layer) {
                // console.log(staff)
                // console.log(functionId)
                // console.log(layer)
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

                let newRoleList = []
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
                console.log(newRoleList)
                let data = {
                    staffJurisdictionList:JSON.stringify(newRoleList),
                    userId:window.sessionStorage.getItem('staffId')
                }
                
                this.$axios.post('/stafflistjurisdiction/jurisdictiondeletecommit',this.$qs.stringify(data),{
                    headers:{
                        staffToken: window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    if (res.data.success) {
                        this.$message.success('角色功能删除成功')
                    } else {
                        this.$message.error(res.data.errMsg)
                    }
                })
                .catch((err) => {
                    this.$message.error(err.message)
                })
                
            },
            //编辑用户角色分配弹窗
            handRoleDialog1(rowInfo) {
                this.handRoleDialog = true

                this.editRoleId = rowInfo.staffId
                //发送请求,获取用户的角色信息
                let data = {
                    staffId : rowInfo.staffId
                }
                this.$axios.post('/stafflistjurisdiction/jurisdictiondistribution',this.$qs.stringify(data),{
                    headers:{
                        staffToken: window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    if (res.data.success) {
                        this.roleList = res.data.primaryMenuTreeList
                        this.changeToTree(res.data.primaryMenuTreeList)
                    }
                })
                .catch((err) => {
                    this.$message.error(err.message)
                })
            },
            //分配角色
            handRole() {
                this.selectedNode = this.$refs.rootTree.getCheckedNodes()
                let selectedFunctionId = []
                for (let i = 0; i < this.selectedNode.length; i++) {
                    if (this.selectedNode[i].children == undefined) {
                        selectedFunctionId.push(this.selectedNode[i].id)
                    } 
                }
                let staffJurisdictionList = []
                for (let i = 0; i < selectedFunctionId.length; i++) {
                    let staffJurisdiction = {
                        staffId: this.editRoleId,
                        functionId: selectedFunctionId[i],
                        jurisdictionStatus: 1
                    }
                    staffJurisdictionList.push(staffJurisdiction)
                }

                let data = {
                    staffJurisdictionList: JSON.stringify(staffJurisdictionList),
                    userId:window.sessionStorage.getItem('staffId')
                }
                this.$axios.post('/stafflistjurisdiction/jurisdictiondistributioncommit',this.$qs.stringify(data),{
                    headers:{
                        staffToken: window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    if (res.data.success) {
                        this.$message.success('角色权限更改成功')
                        this.getRoleList()
                    } else {
                        this.$message.error(res.data.errMsg)
                    }
                })
                .catch((err) => {
                    this.$message.error(err.message)
                })
                this.handRoleDialog = false
            },
            //把权限信息转换成树
            changeToTree(data1) {
                let key = 0
                let third_arr = []
                let second_arr = []
                let first_arr = []
                let selecnode = []
                this.selectedNode = []
                for (let i = 0; i < data1.length; i++) {
                    second_arr = []
                    for (let j = 0; j < data1[i].secondaryMenuTreeList.length; j++) {
                        third_arr = []
                        for (let k = 0; k < data1[i].secondaryMenuTreeList[j].functionTreeList.length; k++) {
                            let third = {
                                id:key,
                                label:data1[i].secondaryMenuTreeList[j].functionTreeList[k].functionName,
                            }
                            
                            third_arr.push(third)
                            if (data1[i].secondaryMenuTreeList[j].functionTreeList[k].isSelected == 1) {
                                selecnode.push(key)
                            }
                            key = key + 1
                        }
                        let second = {
                            id:key,
                            label:data1[i].secondaryMenuTreeList[j].secondaryMenuName,
                            children: third_arr
                        }
                        key = key + 1
                        second_arr.push(second)
                    }
                    let first = {
                            id:key,
                            label:data1[i].primaryMenuName,
                            children: second_arr
                    }
                    key = key + 1
                    first_arr.push(first)
                }
                this.roleList = []
                this.roleList = first_arr
                this.selectedNode = []
                this.selectedNode = selecnode
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