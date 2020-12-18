<template>
    <div class="search_store_container">
        <!-- 面包屑导航 -->
        <el-breadcrumb>
            <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>库存管理</el-breadcrumb-item>
            <el-breadcrumb-item>入库检查</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <!-- <el-form></el-form> -->
            <!-- 功能区域 -->
            <el-row :gutter="10">
                <el-col :span="8" >
                    <span>入库单编号</span>
                    <el-input class="input" type="text" v-model="selected.exportBillId" placeholder="请输入"  size="small" clearable ></el-input>
                    
                </el-col>
                <el-col :span="8">
                    <span>订单编号</span>
                    <el-input class="input" type="text" v-model="selected.exportBillCouponId" placeholder="请输入"  size="small" clearable ></el-input>
                </el-col>
                <el-col :span="8">
                    <span>商品批号</span>
                    <el-input class="input" type="text" v-model="selected.exportBillGoodsBatchNumber" placeholder="请输入"  size="small" clearable ></el-input>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="8">
                    <span>供货商编号</span>
                    <el-select v-model="selected.exportBillSupplierId" filterable placeholder="请选择" size="small" clearable>
                        <el-option :key="1000" :value="1000" label="全部"></el-option>
                        <el-option v-for="item in exportBillList" :label="item.exportBillSupplierId" :key="item.exportBillId" :value="item.exportBillSupplierId"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="8">
                    <span>入库状态</span>
                    <el-select v-model="checkStatus" filterable placeholder="请选择" size="small" clearable>
                        <el-option v-for="item in ['全部','待库管完善','库管已完善','已检查通过','检查未通过']"  :key="item" :value="item"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" size="small" @click="searchGood()">查询</el-button>
                </el-col>
            </el-row>
            <!-- 列表区域 -->
            <el-table :data="exportBillList" border>
                <el-table-column label="入库单编号" prop="exportBillId" fixed width="240" align="center"></el-table-column>
                <el-table-column label="订货单编号" prop="exportBillCouponId"  width="240" align="center"></el-table-column>
                <el-table-column label="供货商编号" prop="exportBillSupplierId"  width="240" align="center"></el-table-column>
                <el-table-column label="产品批号" prop="exportBillGoodsBatchNumber"  width="120" align="center"></el-table-column>
                <!-- <el-table-column label="产品名" prop="exportBillGoodsBatchName" fixed width="120" align="center"></el-table-column> -->
                <!-- <el-table-column label="入库量" prop="goods_store" width="120" align="center"></el-table-column> -->
                <el-table-column label="生产日期" prop="exportBillProductionDate" width="240" align="center"></el-table-column>
                <el-table-column label="保质期/天" prop="exportBillShelfLife" width="90" align="center"></el-table-column>
                <!-- <el-table-column label="规格" prop="unit" width="180" align="center"></el-table-column> -->
                <el-table-column label="供货价格" prop="exportBillPrice" width="100" align="center"></el-table-column>
                <el-table-column label="入库时间" prop="exportBillTime" width="240" align="center"></el-table-column>
                <el-table-column label="已付款项" prop="exportBillPaid"  width="100" align="center" ></el-table-column>
                <el-table-column label="入库状态" prop="exportBillStatus"  :formatter="BillStateFormat" width="100" align="center" ></el-table-column>
                <!-- 审核状态的变化暂未实现、 -->
                <el-table-column label="审核状态"  prop="exportBillStatus" :formatter="stateFormat" width="100" align="center"></el-table-column>
                <el-table-column label="操作" fixed="right" width="120" align="center">
                    <template slot-scope="scope">
                        <el-button-group v-for="func in functionList_one" :key="func.functionId">
                            <el-tooltip effect="light" placement="top" :content="func.functionName" :enterable="false">
                                <el-button :type="func.btnType" size="mini" :icon="func.btnIcon" @click="getButtonStatus(scope.row,func.functionId)"></el-button>
                            </el-tooltip>
                        </el-button-group>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 查看入库检查信息弹框 -->
            <el-dialog title="入库检查信息详情" :visible.sync="checkInboundBillDialog" width="900px">
                <el-form label-width="80px">
                    <el-row >
                        <el-col :span="8">
                            <el-form-item label="货品图片"> 
                                <!-- eslint-disable-next-line -->
                                <template slot-scope="scope">
                                    <img :src="currentInboundBill.goods.goodsPicture" alt="图片">
                                </template>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="入库单编号">
                                <el-input type="text" v-model="currentInboundBill.exportBill.exportBillId" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="订货单编号"> 
                                <el-input type="text" v-model="currentInboundBill.exportBill.exportBillCouponId" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="产品名">
                                <el-input type="text" v-model="currentInboundBill.goods.goodsName" disabled></el-input>
                            </el-form-item>
                        </el-col>
                         <el-col :span="8">
                            <el-form-item label="产品批号">
                                <el-input type="text" v-model="currentInboundBill.exportBill.exportBillGoodsBatchNumber" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="供货商编号"> 
                                <el-input type="text" v-model="currentInboundBill.exportBill.exportBillSupplierId" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row >
                        <el-col :span="8">
                            <el-form-item label="生产日期"> 
                                <el-input type="text" v-model="currentInboundBill.exportBill.exportBillProductionDate"  disabled></el-input>
                                <!-- <el-date-picker v-model="currentInboundBill.exportBill.exportBillProductionDate" type="date" placeholder="选择日期" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" disabled></el-date-picker> -->
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="保质期/天"> 
                                <el-input type="text" v-model="currentInboundBill.exportBill.exportBillShelfLife"  disabled></el-input>
                            </el-form-item>
                        </el-col>
                         <el-col :span="8">
                            <el-form-item label="供货价格/元"> 
                                <el-input type="text" v-model="currentInboundBill.exportBill.exportBillPrice" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="规格"> 
                                <el-input type="text" v-model="currentInboundBill.goods.goodsSpecifications" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="类别"> 
                                <el-input type="text" v-model="currentInboundBill.category.categoryName" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="入库量"> 
                                <el-input type="text" v-model="currentInboundBill.coupon.couponNum" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <!-- <el-col :span="6">
                            <el-form-item label="入库时间"> 
                                <el-date-picker v-model="currentInboundBill.date_manufacture" type="date" placeholder="选择日期" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" disabled></el-date-picker>
                            </el-form-item>
                        </el-col> -->
                        <el-col :span="16">
                            <el-form-item label="审核备注"> 
                                <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="currentInboundBill.exportBill.exportBillMark"></el-input>
                            </el-form-item>
                        </el-col>
                        <!-- <el-col :span="8">
                            <el-form-item >
                                <el-switch
                                    style="display: block"
                                    v-model="checkValue"
                                    active-color="#13ce66"
                                    inactive-color="#ff4949"
                                    active-text="审核通过"
                                    inactive-text="审核不通过">
                                </el-switch>
                            </el-form-item>
                        </el-col> -->
                        
                    </el-row>
                </el-form>
                <span slot="footer" class="dislog-footer">
                    <el-switch
                        v-model="checkValue"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        active-text="审核通过"
                        inactive-text="审核不通过">
                    </el-switch>
                    <span>

                    </span>
                    <span slot="footer" class="dislog-footer">
                        <el-button type="primary"  @click="checkInboundBillDialog=false" size="mini">取 消</el-button>
                        <el-button-group v-for="func in functionList_two" :key="func.functionId" >
                                <el-button :type="func.btnType"   @click="submitInboundBill()" size="mini">提 交</el-button>
                        </el-button-group>
                    </span>
                </span>
            </el-dialog>
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
        name:'CheckInbound',
        data() {
            return{
                //入库订单信息
                exportBillList:[],
                 //功能菜单
                functionList:[],
                //一级功能菜单
                functionList_one:[],
                //二级功能菜单
                functionList_two:[],
                //是否已经渲染功能按钮
                isDraw:false,
                //单选开关判断是否审核通过
                checkValue:true,
                //指定查询需求
                selected:{
                    exportBillId:null,
                    exportBillCouponId:null,
                    exportBillSupplierId:null,
                    exportBillGoodsBatchNumber:null,
                    exportBillProductionDate:null,
                    exportBillShelfLife:null,
                    exportBillPrice:null,
                    exportBillStatus:null,
                    exportBillPaid:null,
                    exportBillTime:null,
                },
                //状态
                checkStatus:null,

                //设置查看入库单信息的弹窗是否可见
                checkInboundBillDialog:false,
                //当前操作的入库单信息
                currentInboundBill:{
                    category:'',
                    coupon:'',
                    exportBill:'',
                    goods:''
                },
                //分页信息
                queryInfo:{
                    pageIndex:1,
                    infoCount:3,
                    total:50
                }
            }
        },
        created(){
            this.getInboundPart(),
            this.selected.exportBillSupplierId=1000,
            this.checkStatus='全部'

        },
        methods:{
            //初始获取部分信息
            getInboundPart() {
                // 获取当前二级菜单的id
                this.secondaryMenuList = window.sessionStorage.getItem('secondaryMenuList')
                this.secondaryMenuList = JSON.parse(this.secondaryMenuList)
                for(var i = 0; i < this.secondaryMenuList.length; i++) {
                    if (this.secondaryMenuList[i].secondaryMenuUrl == this.$route.path) {
                        this.secondaryMenuId = this.secondaryMenuList[i].secondaryMenuId
                    }
                }
                let staffToken = window.sessionStorage.getItem('staffToken')
                let data = {
                    staffId:window.sessionStorage.staffId,
                    pageIndex: this.queryInfo.pageIndex - 1,
                    pageSize: this.queryInfo.infoCount,
                    secondaryMenuId: this.secondaryMenuId,
                }
                this.$axios.post('/exportinspect', this.$qs.stringify(data),{
                    headers:{
                        staffToken: window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    // console.log(res.data)
                    if (res.data.functionList != undefined) {
                        this.functionList = res.data.functionList
                    }
                    //渲染功能按钮
                    if(!this.isDraw) {
                        for (let i = 0; i < this.functionList.length; i++) {
                            if (this.functionList[i].functionId == 32) {
                                this.$set(this.functionList[i],"btnType","success")
                                this.$set(this.functionList[i],"btnIcon","el-icon-edit")
                                this.functionList_one.push(this.functionList[i])
                            } else if (this.functionList[i].functionId == 33) {
                                this.$set(this.functionList[i],"btnType","success")
                                this.$set(this.functionList[i],"btnIcon","el-icon-edit")
                                this.functionList_two.push(this.functionList[i])
                                this.isExistsHandRole = true
                            }
                            this.isDraw = true
                        }
                    }
                    this.queryInfo.total = res.data.recordSum
                    this.exportBillList=res.data.exportBillList
                    this.exportBillList.map((item) => {
                            let data = new Date(item.exportBillProductionDate)
                            item.exportBillProductionDate = data.getFullYear() + "-" + (data.getMonth()+1) + "-" + data.getDate()
                    })
                    this.exportBillList.map((item) => {
                            let data = new Date(item.exportBillTime)
                            item.exportBillTime = data.getFullYear() + "-" + (data.getMonth()+1) + "-" + data.getDate()
                    })

                })
                .catch((err) => {
                    this.$message.error(err.message)
                })
            },
            //获取按钮功能
            getButtonStatus(rowInfo,functionId) {
                // console.log(rowInfo)
                if (functionId == 32) {
                    //审核弹窗
                    this.checkInboundBill(rowInfo)
                } else if (functionId == 33) {
                    //提交审核
                    this.submitInboundBill(rowInfo)
                }
            },
             //审核弹窗
            checkInboundBill(Store){
                this.checkInboundBillDialog=true
                // console.log(Store)
                let data={
                    exportBillId:Store.exportBillId
                }
                // console.log(this.functionList_two)
                this.$axios.post('/exportinspect/confirm',this.$qs.stringify(data),{
                    headers:{
                        staffToken: window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res)=>{
                    this.currentInboundBill=res.data
                    // console.log(this.currentInboundBill)
                    let data = new Date(this.currentInboundBill.exportBill.exportBillProductionDate)
                    this.currentInboundBill.exportBill.exportBillProductionDate = data.getFullYear() + "-" + (data.getMonth()+1) + "-" + data.getDate()
                    
                })
                .catch((err) => {
                    this.$message.error(err.message)
                })
            },
            //提交审核结果
            submitInboundBill(){
                //设置审核状态为已盘点
                //通过审核开关设置
                if(this.checkValue){
                    this.currentInboundBill.exportBill.exportBillStatus=2
                }else{
                    this.currentInboundBill.exportBill.exportBillStatus=-2
                }
                console.log(this.currentInboundBill.exportBill.exportBillStatus)
                this.checkValue=false
                let data={
                    exportBill:JSON.stringify(this.currentInboundBill.exportBill),
                    staffId: window.sessionStorage.staffId
                }
                // data.exportBill.exportBillRemark=exportBillRemark
                // console.log(data.exportBill)
                // data={
                //     exportBill:JSON.stringify(data.exportBill),
                //     staffId: window.sessionStorage.staffId
                // }
                console.log(data.exportBill)
                this.$axios.post('/exportinspect/submit',this.$qs.stringify(data),{
                    headers:{
                        staffToken: window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res)=>{
                    // console.log('111111111')
                    // console.log(res.data)
                    if (res.data.success) {
                        this.checkInboundBillDialog=false
                        this.$message.success('审核成功')
                    }else{
                        this.checkInboundBillDialog=false
                        this.$message.error('提交失败')
                    }   
                    
                })
                .catch((err) => {
                    this.checkInboundBillDialog=false
                    this.$message.error(err.message)
                })
                
            },
            //查询指定需求的商品
            searchGood(){
                let data={
                    staffId:window.sessionStorage.staffId,
                    pageIndex: this.queryInfo.pageIndex - 1,
                    pageSize: this.queryInfo.infoCount,
                    secondaryMenuId: this.secondaryMenuId,
                    exportBill: this.selected
                }
                // 入库状态
                if (this.checkStatus=='待库管完善'){
                    data.exportBill.exportBillStatus=0
                }else if(this.checkStatus=='库管已完善'){
                    data.exportBill.exportBillStatus=1
                }else if(this.checkStatus=='已检查通过'){
                    data.exportBill.exportBillStatus=2
                }else if(this.checkStatus=='检查未通过'){
                    data.exportBill.exportBillStatus=-2
                }else{
                    data.exportBill.exportBillStatus=null
                }
                if(data.exportBill.exportBillSupplierId==1000){
                    data.exportBill.exportBillSupplierId=null
                }
                //判断是否为空字符串
                if(data.exportBill.exportBillId==''){
                    data.exportBill.exportBillId=null
                }
                if(data.exportBill.exportBillCouponId==''){
                    data.exportBill.exportBillCouponId=null
                }
                if(data.exportBill.exportBillGoodsBatchNumber==''){
                    data.exportBill.exportBillGoodsBatchNumber=null
                }
                data.exportBill=JSON.stringify(data.exportBill)
                console.log(data.exportBill)

                this.$axios.post('/exportinspectByConditions', this.$qs.stringify(data),{
                    headers:{
                        staffToken:window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    // console.log(res.data)
                    if (res.data.functionList != undefined) {
                        this.functionList = res.data.functionList
                    }
                    // this.queryInfo.total = res.data.recordSum
                    // this.dataList=res.data
                    //渲染功能按钮
                    if(!this.isDraw) {
                        for (let i = 0; i < this.functionList.length; i++) {
                            if (this.functionList[i].functionId == 32) {
                                this.$set(this.functionList[i],"btnType","success")
                                this.$set(this.functionList[i],"btnIcon","el-icon-edit")
                                this.functionList_one.push(this.functionList[i])
                            } else if (this.functionList[i].functionId == 33) {
                                this.$set(this.functionList[i],"btnType","success")
                                this.$set(this.functionList[i],"btnIcon","el-icon-edit")
                                this.functionList_two.push(this.functionList[i])
                                this.isExistsHandRole = true
                            }
                            this.isDraw = true
                        }
                    }

                    this.queryInfo.total = res.data.recordSum
                    this.exportBillList=res.data.exportBillList
                    this.exportBillList.map((item) => {
                            let data = new Date(item.exportBillProductionDate)
                            item.exportBillProductionDate = data.getFullYear() + "-" + (data.getMonth()+1) + "-" + data.getDate()
                    })
                    this.exportBillList.map((item) => {
                            let data = new Date(item.exportBillTime)
                            item.exportBillTime = data.getFullYear() + "-" + (data.getMonth()+1) + "-" + data.getDate()
                    })

                })
                .catch((err) => {
                    this.$message.error(err.message)
                })
            },
            //根据指定页码获取相应的库存信息
            currentChange(currentPage) {
                this.queryInfo.pageIndex = currentPage
                this.getInboundPart()
            },
            //入库状态
            BillStateFormat(row,column){
                 if (row.exportBillStatus==0){
                    return '待库管完善'
                } else if(row.exportBillStatus==1){
                    return '库管已完善'
                } else if(row.exportBillStatus==2){
                    return '已检查通过'
                } else if(row.exportBillStatus==-2){
                    return '检查未通过'
                }
            },
            //根据传来的审核状态值显示
            stateFormat(row,column) {
                if (row.exportBillStatus==2) {
                    return '已检查通过'
                } else if(row.exportBillStatus==-2){
                    return '未检查通过'
                } else{
                    return'待检查'
                }
            },
            //提交盘点结果
            confirmCheck(){ 
                this.exportBillStatus=true
                this.lookGoodDialog = false
                // console.log("-----------------")
                // console.log(this.currentGood)
                //修改盘点状态
                // 修改了怎么传值？
                this.$message.success('盘点成功')

            }
        }
    }
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
.input{
    width: 203px;
}
</style>