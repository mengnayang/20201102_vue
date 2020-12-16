<template>
    <div class="return_wholesale_details">
        <!-- 面包屑导航 -->
        <el-breadcrumb>
            <el-breadcrumb-item :to="{path:'/welcome'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>退货管理</el-breadcrumb-item>
            <el-breadcrumb-item>零售退货</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <!-- 功能区域 -->
            <el-row :gutter="10">
                <el-col :span="8">
                    <span>订单编号</span>
                    <el-input class="input" type="text" v-model="selected.retailId" placeholder="请输入"  size="small" clearable ></el-input>
                    
                </el-col>
                <el-col :span="8">
                    <span>退款</span>
                    <el-select v-model="retailRefundStatus"  placeholder="请选择" size="small" clearable>
                        <el-option v-for="item in ['未退款','已退款']" :label="item" :key="item" :value="item"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" size="small" @click="searchGood()">查询</el-button>
                </el-col>
            </el-row>
            <!-- 列表区域 -->
            <el-table :data="retailReturnList" border>
                <el-table-column label="订单编号" prop="retailId"  width="200" align="center"></el-table-column>
                <el-table-column label="收款员工编号" prop="retailId"  width="200" align="center"></el-table-column>
                <el-table-column label="商品总价" prop="retailTotalPrice"  width="200" align="center"></el-table-column>
                <el-table-column label="付款时间" prop="retailTime"  width="200" align="center"></el-table-column>
                <el-table-column label="退款状态"  :formatter="stateFormat" prop="retailRefundStatus"  width="200" align="center"></el-table-column>

                <!-- <el-table-column label="订单编号" prop="retailId" fixed width="110" align="center"></el-table-column>
                <el-table-column label="商品编号" prop="retailStockGoodsId" fixed width="110" align="center"></el-table-column>
                <el-table-column label="商品名称" prop="goodsName" fixed width="110" align="center"></el-table-column>
                <el-table-column label="商品类别" prop="goodsCategoryIName" width="110" align="center"></el-table-column>
                <el-table-column label="品牌名称" prop="goodsBrand" width="110" align="center"></el-table-column>
                <el-table-column label="退货数量" prop="refundCustomerNum"  width="110" align="center"></el-table-column>
                <el-table-column label="退货日期" prop="refundCustomerTime" width="140" align="center"></el-table-column>
                <el-table-column label="售价/元" prop="refundCustomerPrice" width="100" align="center"></el-table-column>
                <el-table-column label="退货单价" prop="refundCustomerPrice" width="100" align="center"></el-table-column>
                <el-table-column label="退款状态" prop="refundCustomerStatus" width="100" align="center"></el-table-column> -->
                <el-table-column label="操作" fixed="right" width="200" align="center">
                     <template slot-scope="scope">
                        <el-button-group v-for="func in functionList_one" :key="func.functionId">
                            <el-tooltip effect="light" placement="top" :content="func.functionName" :enterable="false">
                                <el-button :type="func.btnType" size="mini" :icon="func.btnIcon" @click="getButtonStatus(scope.row,func.functionId)"></el-button>
                            </el-tooltip>
                        </el-button-group>
                    </template>
                </el-table-column>
            </el-table>
            <div style="float:left">
                <el-pagination
                    :current-page="queryInfo.pageIndex" :page-sizes="[queryInfo.infoCount]" 
                    :page-size="queryInfo.infoCount" :total="queryInfo.total"
                    @current-change="currentChange"
                    layout="total, sizes, prev, pager, next, jumper">
                </el-pagination>
            </div>
            <!-- 退货信息弹框 -->
            <!-- <el-dialog title="退货信息详情" :visible.sync="editGoodDialog" width="700px">
                <el-form label-width="80px">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="订单编号"> 
                                <el-input type="text"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="商品编号">
                                <el-input type="text"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="商品类别"> 
                                <el-input type="text"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="商品名称"> 
                                <el-input type="text"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="品牌类别"> 
                                <el-input type="text"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="规格"> 
                                <el-input type="text" ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="订货量"> 
                                <el-input type="text" ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="100">
                        <el-col :span="10">
                            <el-form-item label="申请时间"> 
                                <el-date-picker v-model="value3" type="datetime" placeholder="选择日期时间" default-time="12:00:00" size="small"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="退货原因"> 
                                <el-input type="text" ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dislog-footer">
                    <el-button type="success" @click="confirmDialog()">确定</el-button>
                </span>
            </el-dialog> -->
        </el-card>
    </div>
</template>

<script>
  export default {
    name:'Retailreturn',
        data() {
            return{
                //零售退货商品信息
                retailReturnList:[],
                //指定商品需求
                selected:{
                    retailId:'',
                    retailRefundStatus:'',
                },
                //功能列表的退款状态
                retailRefundStatus:'',
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
            this.getRetailReturnList()
        },
        methods:{
            //初始获取部分信息
            getRetailReturnList() {
                 // 获取当前二级菜单的id
                this.secondaryMenuList = window.sessionStorage.getItem('secondaryMenuList')
                this.secondaryMenuList = JSON.parse(this.secondaryMenuList)
                for(var i = 0; i < this.secondaryMenuList.length; i++) {
                    if (this.secondaryMenuList[i].secondaryMenuUrl == this.$route.path) {
                        this.secondaryMenuId = this.secondaryMenuList[i].secondaryMenuId
                    }
                }
                // let staffToken = window.sessionStorage.getItem('staffToken')
                let data = {
                    pageIndex: this.queryInfo.pageIndex-1,
                    pageSize: this.queryInfo.infoCount,
                    staffId:window.sessionStorage.staffId,
                    secondaryMenuId: this.secondaryMenuId
                }
                this.$axios.post('/retailreturn', this.$qs.stringify(data),{
                    headers:{
                        staffToken:window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    console.log(res.data)
                    if (res.data.success) {
                        if (res.data.functionList != undefined) {
                            this.functionList = res.data.functionList
                        }
                        this.queryInfo.total = res.data.recordSum
                        this.retailReturnList=res.data.retailRecordList   
                        if(!this.isDraw) {
                            for (var i = 0; i < this.functionList.length; i++) {
                                if (this.functionList[i].functionId == 28) {
                                    this.$set(this.functionList[i],"btnType","primary")
                                    this.$set(this.functionList[i],"btnIcon","el-icon-edit")
                                    this.functionList_one.push(this.functionList[i])
                                } else if (this.functionList[i].functionId == 29) {
                                    this.$set(this.functionList[i],"btnType","success")
                                    this.$set(this.functionList[i],"btnIcon","el-icon-check")
                                    this.functionList_two.push(this.functionList[i])
                                    this.isExistsHandRole = true
                                }
                                this.isDraw = true
                            }
                        }
                        this.retailReturnList.map((item) => {
                            let data = new Date(item.retailTime)
                            item.retailTime = data.getFullYear() + "-" + (data.getMonth()+1) + "-" + data.getDate()
                        })
                    }  
                })
                .catch((err) => {
                    this.$message.error(err.message)
                })
            },
            //退款状态
            stateFormat(row,column){
                if(row.retailRefundStatus==0){
                    return '未退款'
                }else if(row.retailRefundStatus==1){
                    return'已退款'
                }
            },
            //查询指定需求的商品
            searchGood(){
                let data={
                    staffId:window.sessionStorage.staffId,
                    retailRecord:this.selected
                }
                console.log(this.retailRefundStatus)
                if(this.retailRefundStatus=='未退款'){
                    data.retailRecord.retailRefundStatus=0
                }else if(this.retailRefundStatus=='已退款'){
                    data.retailRecord.retailRefundStatus=1
                }else{
                    // this.$message.info('状态选择错误')
                    // return
                }
                if(data.retailRecord.retailId==''){
                    data.retailRecord.retailId=null
                }
                data.retailRecord=JSON.stringify(data.retailRecord)
                console.log(data)
                this.$axios.post('/retailreturn/findByConditions', this.$qs.stringify(data),{
                    headers:{
                        staffToken: window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    console.log(res.data)
                    if (res.data.success) {
                        this.queryInfo.total = res.data.recordSum
                        this.retailReturnList=res.data.retailRecordList   
                        this.retailReturnList.map((item) => {
                            let data = new Date(item.retailTime)
                            item.retailTime = data.getFullYear() + "-" + (data.getMonth()+1) + "-" + data.getDate()
                        })
                    }  
                })
                .catch((err) => {
                    this.$message.error(err.message)
                })
            },
            //获取按钮功能
            getButtonStatus(rowInfo,functionId) {
                // console.log(rowInfo)
                if (functionId == 28) {
                    //查看详情
                    this.gotoRetailDeliveryDetailsDialog(rowInfo)
                } else if (functionId == 29) {
                    //提交
                    // this.editGoodInfo(good)
                }
            },
            //跳转到详情页面
            gotoRetailDeliveryDetailsDialog(rowInfo){
                console.log(rowInfo)
                this.$router.push({
                    path: '/retailreturn/retaildetails',
                    query: {
                        RowInfo:rowInfo,
                        // staffToken:window.sessionStorage
                    }
                })
                
            },
            //获取指定页面的信息
            currentChange(currentPage){
                this.queryInfo.pageIndex = currentPage
                this.getRetailReturnList()
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