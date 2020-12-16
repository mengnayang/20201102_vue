<template>
    <div class="return_wholesale_container">
        <!-- 面包屑导航 -->
        <el-breadcrumb>
            <el-breadcrumb-item :to="{path:'/welcome'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>退货管理</el-breadcrumb-item>
            <el-breadcrumb-item>批发退货</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            
            <!-- 功能区域 -->
            <el-row :gutter="10">
                <el-col :span="8">
                    <span>出库单编号</span>
                    <el-input class="input" type="text" v-model="selected.deliveryId" placeholder="请输入"  size="small" clearable ></el-input>
                    
                </el-col>
                <el-col :span="8">
                    <span>出库状态</span>
                    <el-select v-model="deliveryStatus"  placeholder="请选择" size="small" clearable>
                        <el-option v-for="item in ['待确认出库','已确认出库','已驳回请求']" :label="item" :key="item" :value="item"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" size="small" @click="searchGood()">查询</el-button>
                </el-col>
            </el-row>
            <!-- 列表区域 -->
            <el-table :data="deliveryRecordList" border>
                <el-table-column label="出库单编号" prop="deliveryId" fixed width="150" align="center"></el-table-column>
                <el-table-column label="入库日期" prop="deliveryCreateDate" fixed width="150" align="center"></el-table-column>
                <el-table-column label="已付款项" prop="deliveryPaid" fixed width="150" align="center"></el-table-column>
                <el-table-column label="退货总价" prop="deliveryTotalPrice" width="120" align="center"></el-table-column>
                <el-table-column label="退款状态" prop="deliveryStatus" :formatter="deliveryRefundStatusFormat" width="120" align="center"></el-table-column>
                <el-table-column label="结款状态" prop="deliveryCheckOutStatus" :formatter="deliveryCheckOutStatusFormat" width="120" align="center"></el-table-column>
                <el-table-column label="出库状态" prop="deliverySatus" :formatter="deliverySatusFormat" width="120" align="center"></el-table-column>
                <el-table-column label="发起职工编号" prop="deliveryLaunchedStaffId"  width="150" align="center"></el-table-column>
                <el-table-column label="收款员工编号" prop="deliveryLaunchedStaffId" width="150" align="center"></el-table-column>
                <el-table-column label="操作" fixed="right" width="150" align="center">
                   <template slot-scope="scope">
                        <el-button-group v-for="func in functionList_one" :key="func.functionId">
                            <el-tooltip effect="light" placement="top" :content="func.functionName" :enterable="false">
                                <el-button :type="func.btnType" size="mini" :icon="func.btnIcon" @click="getButtonStatus(scope.row,func.functionId)"></el-button>
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
    name:'Deliveryreturn',
        data() {
            return{
                //批发出库单列表信息
                deliveryRecordList:[],
                //指定商品需求
                selected:{
                    deliveryId:'',
                    deliveryStatus:'',
                },
                //功能列表状态
                deliveryStatus:'',
                //当前操作的商品信息
                currentGood:'',
                //分页信息
                queryInfo:{
                    total:0,
                    pageIndex:1,
                    infoCount:4
                },
                //二级菜单列表
                secondaryMenuList:[],
                //当前二级菜单的id
                secondaryMenuId:'',
                //功能菜单
                functionList:[],
                 //一级功能菜单
                functionList_one:[],
                //二级功能菜单
                functionList_two:[],
                //是否已经渲染功能按钮
                isDraw:false,
                pickerOptions: {
                shortcuts: [{
                    text: '今天',
                    onClick(picker) {
                    picker.$emit('pick', new Date());
                    }
                }, {
                    text: '昨天',
                    onClick(picker) {
                    const date = new Date();
                    date.setTime(date.getTime() - 3600 * 1000 * 24);
                    picker.$emit('pick', date);
                    }
                }, {
                    text: '一周前',
                    onClick(picker) {
                    const date = new Date();
                    date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', date);
                    }
                }]
                },
            };
        },
        created(){
            this.getDeliveryRecordList()
        },
        methods:{
            //初始获取部分商品
            getDeliveryRecordList() {
                //获取当前的二级菜单的id
                this.secondaryMenuList = window.sessionStorage.getItem('secondaryMenuList')
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
                    staffId:window.sessionStorage.staffId
                }
                this.$axios.post('/deliveryreturn', this.$qs.stringify(data),{
                    headers:{
                        staffToken:window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    if (res.data.success) {
                       if (res.data.functionList != undefined) {
                        this.functionList = res.data.functionList
                    }
                    this.queryInfo.total = res.data.recordSum
                    this.deliveryRecordList=res.data.deliveryRecordList
                    //渲染功能按钮
                    if(!this.isDraw) {
                        for (var i = 0; i < this.functionList.length; i++) {
                            if (this.functionList[i].functionId == 26) {
                                this.$set(this.functionList[i],"btnType","success")
                                this.$set(this.functionList[i],"btnIcon","el-icon-edit")
                                this.functionList_one.push(this.functionList[i])
                            } else if (this.functionList[i].functionId == 27) {
                                this.$set(this.functionList[i],"btnType","success")
                                this.$set(this.functionList[i],"btnIcon","el-icon-edit")
                                this.functionList_two.push(this.functionList[i])
                                this.isExistsHandRole = true
                            }
                            this.isDraw = true
                        }
                    }
                }
                    this.deliveryRecordList.map((item) => {
                            let data = new Date(item.deliveryCreateDate)
                            item.deliveryCreateDate = data.getFullYear() + "-" + (data.getMonth()+1) + "-" + data.getDate()
                    })
                })
                .catch((err) => {
                    this.$message.error(err.message)
                })
            },
            // //查询指定需求的商品
            searchGood(){
                let data={
                    staffId:window.sessionStorage.staffId,
                    deliveryRecord:this.selected
                }
                if(this.deliveryStatus=='待确认出库'){
                    data.deliveryRecord.deliveryStatus=0
                }else if(this.deliveryStatus=='已确认出库'){
                    data.deliveryRecord.deliveryStatus=1
                }else if(this.deliveryStatus=='已驳回请求'){
                    data.deliveryRecord.deliveryStatus=-1
                }else{
                    // this.$message.info('状态选择错误')
                    // return
                }
                if(data.deliveryRecord.deliveryId==''){
                    data.deliveryRecord.deliveryId=null
                }
                data.deliveryRecord=JSON.stringify(data.deliveryRecord)
                this.$axios.post('/deliveryreturn/findByConditions', this.$qs.stringify(data),{
                    headers:{
                        staffToken: window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                   console.log(res.data)
                    if (res.data.success) {
                       if (res.data.functionList != undefined) {
                        this.functionList = res.data.functionList
                    }
                    this.queryInfo.total = res.data.recordSum
                    this.deliveryRecordList=res.data.deliveryRecordList
                    //渲染功能按钮
                    if(!this.isDraw) {
                        for (var i = 0; i < this.functionList.length; i++) {
                            if (this.functionList[i].functionId == 26) {
                                this.$set(this.functionList[i],"btnType","success")
                                this.$set(this.functionList[i],"btnIcon","el-icon-edit")
                                this.functionList_one.push(this.functionList[i])
                            } else if (this.functionList[i].functionId == 27) {
                                this.$set(this.functionList[i],"btnType","success")
                                this.$set(this.functionList[i],"btnIcon","el-icon-edit")
                                this.functionList_two.push(this.functionList[i])
                                this.isExistsHandRole = true
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
            //获取按钮功能
            getButtonStatus(rowInfo,functionId) {
                // console.log(rowInfo)
                if (functionId == 26) {
                    //跳转到详情页面
                    this.gotoDeliveryDetailsDialog(rowInfo)
                } else if (functionId == 31) {
                    //提交盘点
                    this.submitStore(rowInfo)
                }
            },
            //跳转到详情页面
            gotoDeliveryDetailsDialog(rowInfo){
                console.log(rowInfo)
                this.$router.push({
                    path: '/deliveryreturn/deliverydetails',
                    query: {
                        RowInfo:rowInfo,
                        // staffToken:window.sessionStorage
                    }
                })

            },
            //获取指定商品的信息
            getGoodInfo(good) {
                //console.log(good)
                this.lookGoodDialog = true
                this.currentGood = good
            },
            //获取指定页面的信息
            currentChange(currentPage){
                this.queryInfo.pageIndex = currentPage
                this.getDeliveryRecordList()
            },
            //状态显示
            deliveryRefundStatusFormat(row,column){
                if(row.deliveryRefundStatus==1){
                    return '已退款'
                }else return'未退款'
            },
            deliveryCheckOutStatusFormat(row,column){
                if(row.deliveryCheckOutStatus==1){
                    return '已付款'
                }else return'未付款'
            },
            deliverySatusFormat(row,column){
                if(row.deliveryStatus==0){
                    return '待确认'
                }else if (row.deliveryStatus==1){
                    return'已确认'
                }else if(row.deliveryStatus==-1){
                    return'已驳回'
                }
            },
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
.el-pagination{
    margin-top: 10px;
    padding-left: 120px;
}

.sinput{
    width: 180px;
}
.input{
    width: 203px;
}
</style>