<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb>
            <el-breadcrumb-item :to="{path : '/welcome'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>信息维护</el-breadcrumb-item>
            <el-breadcrumb-item>单位信息</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <el-table :data="unitList" border>
                <el-table-column label="单位编号" width="300px" prop="unitId" align="center"></el-table-column>
                <el-table-column label="单位名称" width="300px" prop="unitName" align="center"></el-table-column>
                <el-table-column label="操作"  fixed="right" align="center">
                    <template slot-scope="scope">
                        <el-button-group v-for="func in functionList" :key="func.functionId">
                            <el-tooltip effect="light" placement="top" :content="func.functionName" :enterable="false">
                                <el-button :type="func.btnType" size="mini" :icon="func.btnIcon" @click="getButtonStatus(scope.row,func.functionWeight)"></el-button>
                            </el-tooltip>
                        </el-button-group>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-pagination :current-page="queryInfo.pageIndex" :page-sizes="[queryInfo.infoCount]" :page-size="queryInfo.infoCount" 
            @current-change="currentChange"
            layout="total, sizes, prev, pager, next, jumper" :total="queryInfo.total">
        </el-pagination>
        <!-- 修改商品维护信息 -->
        <el-dialog title="商品单位维护-修改" :visible.sync="editProtectUnitDialog" width="600px">
            <el-form label-width="100px" >
                <el-row>
                    <el-col :span="15" :offset="3">
                        <el-form-item label="单位编号:">
                            <el-input v-model="currentUnit.unitId" auto-complete="off" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="15" :offset="3">
                        <el-form-item label="单位名称:">
                            <el-input v-model="currentUnit.unitName" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dislog-footer">
            <el-button type="success" size="small" @click="editProtectUnit()">修改</el-button>
            <el-button type="primary" size="small" @click="editProtectUnitDialog = false">取消</el-button>                </span>
        </el-dialog>
        <!-- 新增商品维护信息 -->
        <el-dialog title="商品单位维护-新增" :visible.sync="addProtectUnitDialog" width="600px">
            <el-form label-width="100px" >
                <el-row>
                    <el-col :span="15" :offset="3">
                        <el-form-item label="单位名称:">
                            <el-input v-model="currentUnit.unitName" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dislog-footer">
            <el-button type="danger" size="small" @click="addProtectUnit()">新增</el-button>
            <el-button type="primary" size="small" @click="addProtectUnitDialog = false">取消</el-button>                </span>
        </el-dialog>
    </div>
</template>

<script>
    export default{
        name: 'UnitInfomation',
        data() {
            return{
                //请求商品维护列表的先决条件
                queryInfo:{
                    pageIndex:1,
                    total:0,
                    infoCount:4
                },
                //二级菜单列表
                secondaryMenuList:[],
                secondaryMenuId:'',
                // 商品列表
                unitList:[],
                // 功能列表
                functionList:[],
                //是否已经渲染功能按钮
                isDraw:false,
                // 修改商品维护弹框
                editProtectUnitDialog:false,
                // 添加商品维护弹框
                addProtectUnitDialog:false,
                // 存储当前新增的商品信息
                currentUnit:{
                    unitId:"",
                    unitName:""
                }
            }
        },
        created() {
            this.getProtectUnit()
        },
        methods:{
            getProtectUnit() {
                this.isDraw = false

                // 获取当前二级菜单的id
                this.secondaryMenuList = window.sessionStorage.getItem('secondaryMenuList')
                this.secondaryMenuList = JSON.parse(this.secondaryMenuList)

                for(var i = 0; i < this.secondaryMenuList.length; i++) {
                    if (this.secondaryMenuList[i].secondaryMenuUrl == this.$route.path) {
                        this.secondaryMenuId = this.secondaryMenuList[i].secondaryMenuId
                    }
                }

                let data = {
                    secondaryMenuId:this.secondaryMenuId,
                    staffId:window.sessionStorage.getItem('staffId'),
                    pageIndex:this.queryInfo.pageIndex-1,
                    pageSize:this.queryInfo.infoCount
                }
                this.$axios.post('/unitinformation',this.$qs.stringify(data),{
                    headers:{
                        staffToken:window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    if (res.data.success) {
                        this.unitList = res.data.unitList
                        this.functionList = res.data.functionList
                        this.queryInfo.total = res.data.recordSum
                        this.drawBtn()
                    } else {
                        this.$message.error(res.data.errMsg)
                    }
                })
                .catch((err) => {
                    this.$message.error(err.message)
                })
            },
            //动态渲染按钮
            drawBtn() {
                //渲染功能按钮
                if(!this.isDraw) {
                    for (let i = 0; i < this.functionList.length; i++) {
                        if (this.functionList[i].functionWeight == 1) {
                            this.$set(this.functionList[i],"btnType","success")
                            this.$set(this.functionList[i],"btnIcon","iconfont icon_edit")
                        } else if (this.functionList[i].functionWeight == 2) {
                            this.$set(this.functionList[i],"btnType","danger")
                            this.$set(this.functionList[i],"btnIcon","iconfont icon_add")
                        } 
                        this.isDraw = true
                    }
                }
            },
            //获取指定页面的信息
            currentChange(currentPage){
                this.queryInfo.pageIndex = currentPage
                this.getProtectUnit()
            },
            //获取按钮功能
            getButtonStatus(Unit,functionWeight) {
                if (functionWeight == 1) {
                    this.editProtectUnitInfo(Unit)
                } else if (functionWeight == 2) {
                    // 防止点击修改后点击这里，造成数据混乱
                    this.currentUnit = {}
                    this.addProtectUnitDialog = true
                } 
            },
            // 商品信息维护-增加
            addProtectUnit() {
                let flag = this.onNumChange('商品单位', this.currentUnit.unitName)
                if (flag == -1) {
                    return
                } else {
                    let unit = {
                        unitId:null,
                        unitName:this.currentUnit.unitName,
                    }
                    let data = {
                        staffId:window.sessionStorage.getItem('staffId'),
                        unit:JSON.stringify(unit)
                    }
                    this.$axios.post('/unitinformation/add',this.$qs.stringify(data),{
                        headers:{
                            staffToken:window.sessionStorage.getItem('staffToken')
                        }
                    })
                    .then((res) => {
                        if (res.data.success) {
                            this.addProtectUnitDialog = false
                            this.getProtectUnit()
                            this.$message.success('商品单位修改成功')
                        } else {
                            this.$message.error(res.data.errMsg)
                        }
                    })
                    .catch((err) => {
                        this.$message.error(err.message)
                    })
                }
            },
            // 商品信息维护弹框-修改
            editProtectUnitInfo(unit) {
                this.currentUnit.unitId = unit.unitId
                this.currentUnit.unitName = unit.unitName
                this.editProtectUnitDialog = true
            },
            // 商品信息维护-修改
            editProtectUnit() {
                let flag = this.onNumChange('商品单位', this.currentUnit.unitName)
                if (flag == -1) {
                    return
                } else {
                    let unit = {
                        unitId:this.currentUnit.unitId,
                        unitName:this.currentUnit.unitName,
                    }
                    let data = {
                        staffId:window.sessionStorage.getItem('staffId'),
                        unit:JSON.stringify(unit)
                    }
                    this.$axios.post('/unitinformation/modify', this.$qs.stringify(data),{
                        headers:{
                            staffToken:window.sessionStorage.getItem('staffToken')
                        }
                    })
                    .then((res) => {
                        if (res.data.success) {
                            this.editProtectUnitDialog = false
                            this.getProtectUnit()
                            this.$message.success('商品单位添加成功')
                        } else {
                            this.$message.error(res.data.errMsg)
                        }
                    })
                    .catch((err) => {
                        this.$message.error(err.message)
                    })
                }
            },
            //判断合法性
            onNumChange(name, text_number){
                if(text_number == '' || text_number == null){
                    this.$message.error(name + "不能为空")
                    return -1
                } else {
                    return  0
                }
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
.el-button-group{
    .el-button{
        margin: 0 3px;
    }
}
.el-pagination{
    width: 50%;
    margin: 10px auto;
}
</style>