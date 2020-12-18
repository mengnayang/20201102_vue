<template>
    <div class="logging_container">
        <!-- 面包屑导航 -->
        <el-breadcrumb>
            <el-breadcrumb-item :to="{path:'/welcome'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>日志管理</el-breadcrumb-item>
            <el-breadcrumb-item>日志列表</el-breadcrumb-item>
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
                    <el-col :span="2" :offset="2">
                        <span>操作员工:</span>
                    </el-col>
                    <el-col :span="5">
                        <el-select v-model="selected.selectedStaffId" size="mini">
                            <el-option :key="1000" :value="1000" label="全部"></el-option>
                            <el-option v-for="item in staffAList" :key="item.staffId" :value="item.staffId" :label="item.staffName"></el-option>
                        </el-select>
                    </el-col>
                    <!-- <el-col :span="2" :offset="1">
                        <span>操作路径:</span>
                    </el-col>
                    <el-col :span="5">
                        <el-input v-model="selected.selectedCheckUrl" size="mini" placeholder="请输入查询的操作方法"></el-input>
                    </el-col> -->
                    <el-col :span="2" :offset="1">
                        <span>访问IP:</span>
                    </el-col>
                    <el-col :span="5">
                        <el-input v-model="selected.selectedCheckIP" size="mini" placeholder="请输入查询的用户IP"></el-input>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="2">
                        <span>操作功能:</span>
                    </el-col>
                    <el-col :span="5">
                        <el-select v-model="selected.selectedFunction" size="mini">
                            <el-option :key="1000" :value="1000" label="全部"></el-option>
                            <el-option :key="1" :value="1" label="登陆操作"></el-option>
                            <el-option :key="1" :value="1" label="退出操作"></el-option>
                            <el-option :key="3" :value="3" label="查库存操作"></el-option>
                            <el-option :key="4" :value="4" label="订单信息操作"></el-option>
                            <el-option :key="5" :value="5" label="采购入库单操作"></el-option>
                            <el-option :key="6" :value="6" label="批发出库单操作"></el-option>
                            <el-option :key="7" :value="7" label="零售出库单操作"></el-option>
                            <el-option :key="8" :value="8" label="盘点管理操作"></el-option>
                            <el-option :key="9" :value="9" label="盘点设置操作"></el-option>
                            <el-option :key="10" :value="10" label="批发收银操作"></el-option>
                            <el-option :key="11" :value="11" label="零售收银操作"></el-option>
                            <el-option :key="12" :value="12" label="批发退货操作"></el-option>
                            <el-option :key="13" :value="13" label="零售退货操作"></el-option>
                            <el-option :key="14" :value="14" label="货品盘点操作"></el-option>
                            <el-option :key="15" :value="15" label="入库检查操作"></el-option>
                            <el-option :key="16" :value="16" label="用户列表操作"></el-option>
                            <el-option :key="17" :value="17" label="用户权限列表操作"></el-option>
                            <el-option :key="18" :value="18" label="商品信息维护操作"></el-option>    
                            <el-option :key="19" :value="19" label="类别信息维护操作"></el-option>
                            <el-option :key="20" :value="20" label="单位信息维护操作"></el-option>
                            <el-option :key="21" :value="21" label="日志记录操作"></el-option>
                            <el-option :key="21" :value="21" label="错误日志操作"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="5" :offset="2">
                        <el-button type="primary" size="mini" @click="searchLogging()">查询</el-button>
                    </el-col>
                </el-row>
            </el-form>
            
            <!-- 列表区域 -->
            <el-table :data="isLazzy ? loggingEventList_lazzy :loggingEventList" border>
                <el-table-column label="日志日期" prop="timestmp"  width="150" align="center"></el-table-column>
                <el-table-column label="操作员工" width="150" align="center">
                    <template slot-scope="scope">
                        <span v-for="(item,index) in staffAList" :key="index">
                            <span v-if="item.staffId == scope.row.staffId">{{item.staffName}}</span>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="操作路径" prop="check_url" align="center"></el-table-column>
                <el-table-column label="访问ip" prop="check_ip" width="150" align="center"></el-table-column>
                <el-table-column label="日志级别" width="150" align="center">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.levelString == 'INFO'" type="success">INFO</el-tag>
                        <el-tag v-else-if="scope.row.levelString == 'WARN'" type="warning">WARN</el-tag>
                        <el-tag v-else-if="scope.row.levelString == 'ERROR'" type="danger">ERROR</el-tag>
                    </template>
                </el-table-column>
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
  export default {
    name:'Logging',
        data() {
            return{
                //指定日志需求
                selected:{
                    selectedTimestmp:'',
                    selectedFunction:'',
                    selectedCheckUrl:'',
                    selectedCheckIP:'',
                    selectedStaffId:1000
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
                loggingEventList:[],
                loggingEventList_lazzy:[],
                isLazzy:false,
                isDraw:false,
                staffAList:[]
            }       
        },
        created(){
            this.getLoggingEvent()
        },
        methods:{
            //初始获取部分商品
            getLoggingEvent() {
                //获取当前的二级菜单的id
                this.secondaryMenuList = JSON.parse(window.sessionStorage.getItem('secondaryMenuList'))
                for(var i = 0; i < this.secondaryMenuList.length; i++) {
                    if (this.secondaryMenuList[i].secondaryMenuUrl == this.$route.path) {
                        this.secondaryMenuId = this.secondaryMenuList[i].secondaryMenuId
                    }
                }

                let data = {
                    pageIndex: this.queryInfo.pageIndex-1,
                    pageSize: this.queryInfo.infoCount,
                    secondaryMenuId: this.secondaryMenuId,
                    staffId:window.sessionStorage.getItem('staffId')
                }
                this.$axios.post('/logging', this.$qs.stringify(data),{
                    headers:{
                        staffToken:window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    if (res.data.success) {
                        this.loggingEventList = res.data.loggingEventList

                        let temp = []
                        for (let i = 0; i < this.loggingEventList.length; i++) {
                            if (this.loggingEventList[i].formattedMessage.match('[\u4e00-\u9fa5]{4}ID.*')) {
                                temp.push(this.loggingEventList[i])
                            }
                        }
                        this.loggingEventList = temp

                        temp = []
                        let temp_staffList = []
                        let temp_url = []
                        let temp_ip = []
                        for (let i = 0; i < this.loggingEventList.length; i++) {
                            let array = this.loggingEventList[i].formattedMessage.split("||")
                            
                            this.$set(this.loggingEventList[i],"staffId",array[0].split("：")[1])
                            this.$set(this.loggingEventList[i],"check_url",array[1].split(",")[0].split(" : ")[1])
                            this.$set(this.loggingEventList[i],"check_ip",array[1].split(",")[2].split(" : ")[1])

                            temp_staffList = array[0].split("：")[1]
                            temp_url = array[1].split(",")[0].split(" : ")[1]
                            temp_ip = array[1].split(",")[2].split(" : ")[1]
                        }                       

                        this.staffAList = res.data.staffAList
                        this.queryInfo.total = res.data.recordSum
                        this.functionList = res.data.functionList
                        this.loggingEventList.map((item) => {
                            let data = new Date(item.timestmp)
                            item.timestmp = data.getFullYear() + "-" + (data.getMonth()+1) + "-" + data.getDate()
                        })   
                        this.drawBtn()               
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
            //查询指定需求的日志
            searchLogging(){
                this.isLazzy = true

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
                if (this.selected.selectedStaffId != "" && this.selected.selectedStaffId != 1000) {
                    index.push(this.selected.selectedStaffId)
                }
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

                // if (this.selected.selectedCheckUrl != "") {
                //     index.push(this.selected.selectedCheckUrl)
                // }
                if (this.selected.selectedCheckIP != "") {
                    index.push(this.selected.selectedCheckIP)
                }
                
                
                // 搭配模糊查询的条件
                let message = ''
                for (let i = 0; i < index.length; i++) {
                    message  = message + "%" + index[i]
                }
                message = message + "%"

                // 没有任何检索词
                if (message == "%") {
                    message = null
                }

                let temp_level = this.selected.selectedLevelString
                if (this.selected.selectedLevelString == "") {
                    temp_level = null
                }

                let loggingEvent = {
                    timestmp:true_time,
                    formattedMessage:message,
                    levelString:temp_level
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
                        this.loggingEventList_lazzy = res.data.loggingEventList
                        this.queryInfo.total = res.data.recordSum,
                        this.staffAList = res.data.staffAList
                        this.loggingEventList_lazzy.map((item) => {
                            let data = new Date(item.timestmp)
                            item.timestmp = data.getFullYear() + "-" + (data.getMonth()+1) + "-" + data.getDate()
                        })  

                        let temp = []
                        for (let i = 0; i < this.loggingEventList_lazzy.length; i++) {
                            if (this.loggingEventList_lazzy[i].formattedMessage.match('[\u4e00-\u9fa5]{4}ID.*')) {
                                temp.push(this.loggingEventList_lazzy[i])
                            }
                        }
                        this.loggingEventList_lazzy = temp

                        temp = []
                        let temp_staffList = []
                        let temp_url = []
                        let temp_ip = []
                        for (let i = 0; i < this.loggingEventList_lazzy.length; i++) {
                            let array = this.loggingEventList_lazzy[i].formattedMessage.split("||")

                            this.$set(this.loggingEventList_lazzy[i],"staffId",array[0].split("：")[1])
                            this.$set(this.loggingEventList_lazzy[i],"check_url",array[1].split(",")[0].split(" : ")[1])
                            this.$set(this.loggingEventList_lazzy[i],"check_ip",array[1].split(",")[2].split(" : ")[1])

                            temp_staffList = array[0].split("：")[1]
                            temp_url = array[1].split(",")[0].split(" : ")[1]
                            temp_ip = array[1].split(",")[2].split(" : ")[1]
                        }                       
                    } else {
                        this.$message.error(res.data.errMsg)
                    }
                })
                .catch((err) => {
                    this.$message.error(err.message)
                })
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
                        staffId:window.sessionStorage.getItem('staffId')
                    }
                    this.$axios.post('/logging/delete',this.$qs.stringify(data),{
                        headers:{
                            staffToken:window.sessionStorage.getItem('staffToken')
                        }
                    })
                    .then((res) => {
                        if (res.data.success) {
                            this.$message.success('删除成功')
                            this.getLoggingEvent()
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
  };
</script>

<style lang="less" scoped>
.el-card{
    margin-top: 10px;
    box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.15);
    .el-row {
        margin-bottom: 10px;
        &:last-child {
        margin-bottom: 0;
        }
    }
}
.el-table{
    margin-top: 10px;
}
.el-pagination{
    margin-top: 10px;
    padding-left: 120px;
}

</style>