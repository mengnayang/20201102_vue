<template>
    <div class="logging_error_container">
        <!-- 面包屑导航 -->
        <el-breadcrumb>
            <el-breadcrumb-item :to="{path:'/welcome'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>日志管理</el-breadcrumb-item>
            <el-breadcrumb-item>错误日志列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <!-- 功能区域 -->
            <el-form :gutter="10" :inline="true">
                <el-row>
                    <el-col :span="2">
                        <span>日志日期:</span>
                    </el-col>
                    <el-col :span="5">
                        <el-date-picker size="mini"
                            v-model="selected.selectedTimestmp"
                            type="date"
                            placeholder="选择日期时间">
                        </el-date-picker>
                    </el-col>
                    <el-col :span="2" :offset="1">
                        <span>错误信息</span>
                    </el-col>
                    <el-col :span="5">
                        <el-input v-model="selected.selectedErrorMessage" size="mini" placeholder="请输入查询的错误信息"></el-input>
                    </el-col>
                    <el-col :span="5" :offset="2">
                        <el-button type="primary" size="mini" @click="searchErrorLogging()">查询</el-button>
                    </el-col>
                </el-row>
            </el-form>

            <!-- 列表区域 -->
            <el-table :data="errorLoggingEventList" border>
                <el-table-column label="日志日期" prop="timestmp"  width="150" align="center"></el-table-column>
                <el-table-column label="错误信息" prop="check_url" align="center"></el-table-column>
                <el-table-column label="操作" fixed="right" width="100" align="center">
                    <template slot-scope="scope">
                        <el-button-group v-for="func in functionList_one" :key="func.functionId">
                            <el-tooltip effect="light" placement="top" :content="func.functionName" :enterable="false">
                                <el-button :type="func.btnType" size="small" :icon="func.btnIcon" @click="getButtonStatus(scope.row,func.functionWeight)"></el-button>
                            </el-tooltip>
                        </el-button-group>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination 
                :current-page="queryInfo.pageIndex" :page-sizes="[queryInfo.infoCount]" 
                :page-size="queryInfo.infoCount" :total="queryInfo.total"
                @current-change="currentChange"
                layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
    export default{
        name:'LoggingError',
        data() {
            return{
                //指定日志需求
                selected:{
                    selectedTimestmp:'',
                    selectedErrorMessage:''
                },
                //分页信息
                queryInfo:{
                    total:0,
                    pageIndex:1,
                    infoCount:50
                },
                //二级菜单列表
                secondaryMenuList:[],
                //当前二级菜单的id
                secondaryMenuId:'',
                //功能菜单
                functionList:[],
                functionList_one:[],
                errorLoggingEventList:[],
                isDraw:false,
            }
        },
        created() {
            this.getErrorLogging()
        },
        methods:{
            getErrorLogging() {
                //获取当前的二级菜单的id
                this.secondaryMenuList = JSON.parse(window.sessionStorage.getItem('secondaryMenuList'))
                for(var i = 0; i < this.secondaryMenuList.length; i++) {
                    if (this.secondaryMenuList[i].secondaryMenuUrl == this.$route.path) {
                        this.secondaryMenuId = this.secondaryMenuList[i].secondaryMenuId
                    }
                }
                
                // 时间处理（时间戳）
                let true_time = new Date(this.selected.selectedTimestmp)
                let time_test = true_time.getFullYear() + "-" + (true_time.getMonth()+1) + "-" + true_time.getDate()
                true_time = new Date(time_test).getTime()
                true_time = parseInt(new Date(time_test).getTime()/100000000)

                if (true_time == '' || true_time == null || true_time == 0) {
                    true_time = null
                } 


                // 存储需要模糊查询的选项
                let index = []
                if (this.selected.selectedFunction == 1) {
                    index.push('/staff/login')
                } else if (this.selected.selectedFunction == 2) {
                    index.push('/staff/logout')
                } else if (this.selected.selectedFunction == 3) {
                    index.push('/showinventory')
                } else if (this.selected.selectedFunction == 4) {
                    index.push('/orderInformation')
                } else if (this.selected.selectedFunction == 5) {
                    index.push('/purchaselist')
                } else if (this.selected.selectedFunction == 6) {
                    index.push('/wholesaledeliverylist')
                } else if (this.selected.selectedFunction == 7) {
                    index.push('/retaildeliverylist')
                } else if (this.selected.selectedFunction == 8) {
                    index.push('/stocktaking')
                } else if (this.selected.selectedFunction == 9) {
                    index.push('/stocktaking/viewStocktakingRules')
                } else if (this.selected.selectedFunction == 10) {
                    index.push('/deliverycashier')
                } else if (this.selected.selectedFunction == 11) {
                    index.push('/retailcashier')
                } else if (this.selected.selectedFunction == 12) {
                    index.push('/deliveryreturn')
                } else if (this.selected.selectedFunction == 13) {
                    index.push('/retailreturn')
                } else if (this.selected.selectedFunction == 14) {
                    index.push('/stocktaking/viewStocktakingGoodsList')
                } else if (this.selected.selectedFunction == 15) {
                    index.push('/exportinspect')
                } else if (this.selected.selectedFunction == 16) {
                    index.push('/stafflist')
                } else if (this.selected.selectedFunction == 17) {
                    index.push('/stafflistjurisdiction')
                } else if (this.selected.selectedFunction == 18) {
                    index.push('/goodsinformation')
                } else if (this.selected.selectedFunction == 19) {
                    index.push('/categoryinformation')
                } else if (this.selected.selectedFunction == 20) {
                    index.push('/unitinformation')
                } else if (this.selected.selectedFunction == 21) {
                    index.push('/logging')
                } else if (this.selected.selectedFunction == 22) {
                    index.push('/logging/findByConditions')
                }

                let message = ''
                if (index.length == 0) {
                    message = null
                } else {
                    message = "%" + index[0] + "%"
                }

                let loggingEvent = {
                    timestmp:true_time,
                    formattedMessage:message,
                    levelString:'ERROR'
                }

                let data = {
                    staffId:window.sessionStorage.getItem('staffId'),
                    pageIndex:this.queryInfo.pageIndex-1,
                    pageSize:this.queryInfo.infoCount,
                    loggingEvent:JSON.stringify(loggingEvent)
                }
                this.$axios.post('/logging/findByConditions',this.$qs.stringify(data),{
                    headers:{
                        staffToken:window.sessionStorage.getItem("staffToken")
                    }
                })
                .then((res) => {
                    if (res.data.success) {
                        this.loggingEventList = res.data.loggingEventList
                        this.queryInfo.total = res.data.recordSum,
                        this.staffAList = res.data.staffAList
                        this.loggingEventList.map((item) => {
                            let data = new Date(item.timestmp)
                            item.timestmp = data.getFullYear() + "-" + (data.getMonth()+1) + "-" + data.getDate()
                        })                  
                    } else {
                        this.$message.error(res.data.errMsg)
                    }
                })
                .catch((err) => {
                    this.$message.error(err.message)
                })
            },
            drawBtn() {
                //渲染功能按钮
                if(!this.isDraw) {
                    for (let i = 0; i < this.functionList.length; i++) {
                        if (this.functionList[i].functionWeight == 2) {
                            this.$set(this.functionList[i],"btnType","danger")
                            this.$set(this.functionList[i],"btnIcon","el-icon-delete")
                            this.functionList_one.push(this.functionList[i])
                        }  
                    }
                    this.isDraw = true
                }
            },
            //获取指定页面的信息
            currentChange(currentPage){
                this.queryInfo.pageIndex = currentPage
                if (this.isLazzy) {
                    this.searchLogging()
                } else {
                    this.getLoggingEvent()
                }
            },
            //获取按钮功能
            getButtonStatus(rowInfo, functionWeight) {
                if (functionWeight == 2) {
                    this.removeLogging(rowInfo)
                }
            },
            async removeLogging(logging) {
                const confirmResult = await this.$confirm('此操作不可恢复，确认要永久删除该日志？','删除日志',{
                    confirmButtonText:'确认',
                    showCancelButton:true,
                    type: 'warning'
                })
                .catch(err => {
                    this.$message.info('已取消删除')
                })

                if (confirmResult == 'confirm') {
                    let data = {
                        eventId: logging.eventId,
                        staffId: window.sessionStorage.getItem('staffId')
                    }
                    this.$axios.post('/logging/delete',this.$qs.stringify(data),{
                        headers:{
                            staffToken:window.sessionStorage.getItem('staffToken')
                        }
                    })
                    .then((res) => {
                        if (res.data.success) {
                            this.$message.success('删除成功')
                            this.getErrorLogging()
                        } else {
                            this.$message.error(res.data.errMsg)
                        }
                    })
                    .catch((err) => {
                        this.$message.error(err.message)
                    })
                }
            }
        }
    }
</script>

<style lang="less" scoped>

</style>