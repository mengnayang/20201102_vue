<template>
    <div class="user_list_container">
        <!-- 面包屑导航 -->
        <el-breadcrumb>
            <el-breadcrumb-item :to="{path : '/welcome'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <!-- 功能区域 -->
            <el-row :gutter="20">
                <el-col :span="10">
                    <el-input placeholder="请输入你要查询的用户" v-model="selected.selectedStaffName" clearable @clear="getUserList()">
                        <el-button slot="append" icon="el-icon-search" @click="searchUserList()"></el-button>
                    </el-input>
                </el-col>    
                <el-col :span="4">
                    <el-button type="primary" @click="addUserDialog = true">添加用户</el-button>
                </el-col> 
            </el-row>
            <!-- 表单区域 -->
            <el-table :data="userList" border stripe>
                <el-table-column label="#" type="index" align="center"></el-table-column>
                <el-table-column label="姓名" prop="staffName" align="center" width="180px"></el-table-column>
                <el-table-column label="电话" width="170px" prop="staffPhone" align="center"></el-table-column>
                <el-table-column label="角色" width="170px" prop="staffPositionId" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.staffPositionId == 1">总经理</span>
                        <span v-else-if="scope.row.staffPositionId == 2">副经理</span>
                        <span v-else-if="scope.row.staffPositionId == 3">财务</span>
                        <span v-else-if="scope.row.staffPositionId == 4">库房管理员</span>
                        <span v-else-if="scope.row.staffPositionId == 5">职工</span>
                        <span v-else-if="scope.row.staffPositionId == 6">营业员</span>
                        <span v-else-if="scope.row.staffPositionId == 7">超级管理员</span>
                    </template>
                </el-table-column>
                <el-table-column label="状态" prop="staffStatus" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.staffStatus == 1000">正常</span>
                        <span v-else-if="scope.row.staffStatus == 1001">刚注册</span>
                        <span v-else-if="scope.row.staffStatus == 0">无权限</span>
                        <span v-else-if="scope.row.staffStatus == -1">离职</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="190px" align="center">
                    <template slot-scope="scope">
                        <el-button-group v-for="func in functionList_one" :key="func.functionId">
                            <el-tooltip effect="light" placement="top" :content="func.functionName" :enterable="false">
                                <el-button :type="func.btnType" size="mini" :icon="func.btnIcon" @click="getButtonStatus(scope.row,func.functionId)"></el-button>
                            </el-tooltip>
                        </el-button-group>
                        <!-- <el-tooltip effect="light" placement="top" content="编辑" :enterable="false">
                            <el-button type="success" size="mini" icon="el-icon-edit" @click="editUserDialog1(scope.row)"></el-button>
                        </el-tooltip>
                        <el-tooltip effect="light" placement="top" content="删除" :enterable="false">
                            <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeUserById(scope.row)"></el-button>
                        </el-tooltip>
                        <el-tooltip effect="light" placement="top" content="分配角色" :enterable="false">
                            <el-button type="warning" size="mini" icon="el-icon-setting" @click="handRoleDialog1(scope.row)"></el-button>
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
        <!-- 添加用户的信息弹框 -->
        <el-dialog title="添加用户" :visible.sync="addUserDialog" width="390px" @close="addUserReset()">
            <!-- 添加新用户的信息表单 -->
            <el-form :model="newStaff" label-width="100px" :rules="newStaffRules" ref="newStaffRef">
                <el-form-item label="用户名" required prop="staffName">
                    <el-input type="text" v-model="newStaff.staffName"></el-input>
                </el-form-item>
                <el-form-item label="联系方式" required prop="staffPhone">
                    <el-input type="text" v-model="newStaff.staffPhone"></el-input>
                </el-form-item>
                <el-form-item label="密码" required prop="staffPassword">
                    <el-input type="password" v-model="newStaff.staffPassword"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addUser()">添加</el-button>
                <el-button type="primary" @click="addUserReset()">取消</el-button>
            </span>
        </el-dialog>
        <!-- 修改用户信息的弹框 -->
        <el-dialog title="修改用户信息"  :visible.sync="editUserDialog" width="390px">
            <!-- 修改用户的信息表单 -->
            <el-form :model="editStaff" label-width="100px" :rules="newStaffRules">
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
        <!-- 分配角色的信息弹框 -->
        <el-dialog title="分配角色" :visible.sync="handRoleDialog" width="390px">
            <!-- 分配角色的单选框 -->
            <template>
                <el-radio-group v-model="editRole.radio">
                    <el-radio :label="1">总经理</el-radio>
                    <el-radio :label="2">副经理</el-radio>
                    <el-radio :label="3">财务</el-radio>
                    <el-radio :label="4">库房管理员</el-radio>
                    <el-radio :label="5">职工</el-radio>
                    <el-radio :label="6">营业员</el-radio>
                    <el-radio :label="7">超级管理员</el-radio>
                </el-radio-group>
            </template>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" v-show="isExistsHandRole" @click="handRole()">分配角色</el-button>
                <el-button type="primary" @click="handRoleDialog = false">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>


<script>
    export default{
        name:'UserList',
        data() {
            //校验姓名
            var checkName = (rule, value, callback) => {
                if (value == '') {
                    callback(new Error('姓名不能为空'))
                } 
                callback()
            } 
            //校验电话号码
            var checkPhone = (rule, value, callback) => {
                if (value == '') {
                    callback(new Error('联系方式不能为空'))
                } else {
                    let isNull = value.match(/^1(3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/)
                    if (isNull == null) {
                        callback(new Error('联系方式不合法'))
                    }
                    callback()
                }
            }
            //校验密码
            var checkPassword = (rule, value, callback) => {
                if (value == '') {
                    callback(new Error('新密码不能为空'))
                } else {
                    if (value.length < 8 || value.length > 16) {
                        callback(new Error('密码必须满足8~16位'))
                    }
                    callback()
                }
            }
            return{
                //用户列表
                userList:[],
                //功能菜单
                functionList:[],
                //一级功能菜单
                functionList_one:[],
                //二级功能菜单
                functionList_two:[],
                //是否已经渲染功能按钮
                isDraw:false,
                //是否存在角色分配
                isExistsHandRole:false,
                //获取部分用户信息的先决条件
                queryInfo:{
                    total:0,
                    pageIndex:0,
                    infoCount:4
                },
                //指定查询需求
                selected:{
                    selectedStaffName:''
                },
                //添加用户信息弹框
                addUserDialog:false,
                //存储新用户信息
                newStaff:{
                    staffName:'',
                    staffPhone:'',
                    staffPassword:''
                },
                //新用户的表单验证规则
                newStaffRules:{
                    staffName:[
                        {validator:checkName, trigger:'blur'}
                    ],
                    staffPhone:[
                        {validator:checkPhone, trigger:'blur'}
                    ],
                    staffPassword:[
                        {validator:checkPassword, trigger:"blur"}
                    ]
                },
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
                //修改用户信息弹框
                handRoleDialog:false,
                //修改用户角色的信息
                editRole:{
                    radio: 0,
                    staffId: '',
                    staffStatus:0
                },
            }
        },
        created(){
            this.getUserList()
        },
        methods:{
            //初始获取部分用户信息
            getUserList() {
                let staffToken = window.sessionStorage.getItem('staffToken')
                //console.log(staffToken)
                let data = {
                    pageIndex: this.queryInfo.pageIndex,
                    pageSize: this.queryInfo.infoCount
                }
                //console.log(data)
                this.$axios.post('/stafflist', this.$qs.stringify(data),{
                    headers:{
                        staffToken: window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    // console.log(res)
                    if (res.data.functionList != undefined) {
                        this.functionList = res.data.functionList
                    }
                    // console.log(this.functionList)
                    this.queryInfo.total = res.data.recordSum
                    this.userList = res.data.staffAList
                    // console.log(this.userList)
                    // console.log(this.functionList)

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
                })
                .catch((err) => {
                    this.$message.error(err.message)
                })
            },
            //查询指定需求的用户信息
            searchUserList() {
                this.$axios.post('/user/userList')
                .then((res) => {
                    this.userList = res.data.obj
                })
                .catch((res) => {
                    this.$message.error(err.message)
                })
            },
            //获取指定页面的信息
            currentChange(currentPage){
                this.queryInfo.pageIndex = currentPage
                this.getUserList()
            },
            //添加用户
            addUser() {
                this.$refs.newStaffRef.validate(valid => {
                    if (!valid) return

                    let data = {
                        staff : JSON.stringify(this.newStaff)
                    }
                    //console.log(data)
                    this.$axios.post('/staff/insert',this.$qs.stringify(data))
                    .then((res) => {
                        // console.log(res)
                        if (res.data.success) {
                            this.$message.success("添加成功")
                            this.getUserList()
                        }
                    })
                    .catch((err) => {
                        this.$refs.newStaffRef.resetFields()
                        this.$message.error(err.errMsg)
                    })
                    this.addUserDialog = false
                })
            },
            //重置添加用户表单
            addUserReset() {
                this.$refs.newStaffRef.resetFields()
                this.addUserDialog = false
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
            //编辑用户信息弹窗
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
                this.$axios.post('/stafflist/modifycommit', this.$qs.stringify(data), {
                    headers:{
                        staffToken: window.sessionStorage.getItem("staffToken")
                    }
                })
                .then((res) => {
                    // console.log(res)
                    if (res.data.success) {
                        this.$message.success("修改成功")
                        this.getUserList()
                    }
                })
                .catch((err) => {
                    this.$message.error(err.errMsg)
                })
                this.editUserDialog = false
            },
            //删除用户
            async removeUserById(staff) {
                const confirmResult = await this.$confirm('此操作不可恢复，确认要永久删除用户？','删除用户',{
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
                        staffId: staff.staffId
                    }
                    this.$axios.post('/stafflist/deletestaff',this.$qs.stringify(data),{
                        headers:{
                            staffToken:window.sessionStorage.getItem('staffToken')
                        }
                    })
                    .then((res) => {
                        //console.log(res)
                        if (res.data.success) {
                            this.$message.success('删除成功')
                            this.getUserList()
                        }
                    })
                    .catch((err) => {
                        this.$message.error(err.message)
                    })
                }
            },
            getEditStatus() {
                if (this.editStaff.staffStatus == 1001) {
                    this.editStaff.staffStatus = '刚注册'
                } else if (this.editStaff.staffStatus == 1000) {
                    this.editStaff.staffStatus = '正常'
                } else if (this.editStaff.staffStatus == 0) {
                    this.editStaff.staffStatus = '无权限'
                } else {
                    this.editStaff.staffStatus = '离职'
                }
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
</style>