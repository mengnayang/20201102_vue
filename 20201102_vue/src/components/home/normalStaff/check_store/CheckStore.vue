<template>
    <div class="search_store_container">
        <!-- 面包屑导航 -->
        <el-breadcrumb>
            <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>库存管理</el-breadcrumb-item>
            <el-breadcrumb-item>库存盘点</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <!-- 功能区域 -->
            <el-row :gutter="10">
                <el-col :span="8">
                    <span>货品编号</span>
                    <el-select v-model="selected.selectedGoodId" filterable placeholder="请选择" size="small">
                        <el-option v-for="item in dataList.stockingGoodsList" :label="item.stockGoodsId" :key="item.stockGoodsId" :value="item.stockGoodsId"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="8">
                    <span>货品名称</span>
                    <el-select v-model="selected.selectedGoodName" filterable placeholder="请选择" size="small">
                        <el-option v-for="item in dataList.stockingGoodsList" :label="item.goodsName" :key="item.stockGoodsId" :value="item.goodsName"></el-option>
                    </el-select>
                </el-col>
                <!-- 列出货品类别 -->
                <!-- <el-col :span="8">
                    <span>货品类别</span>
                    <el-select v-model="selected.selectedGoodCategory" filterable placeholder="请选择" size="small">
                        <el-option v-for="item in dataList.stockingGoodsList" :label="item.categoryName" :key="item.stockGoodsId" :value="item.categoryName"></el-option>
                    </el-select>
                </el-col> -->
                <el-col :span="8">
                    <span>品牌类别</span>
                    <el-select v-model="selected.selectedBrandName" filterable placeholder="请选择" size="small">
                        <el-option v-for="item in dataList.stockingGoodsList" :label="item.goodsBrand" :key="item.stockGoodsId" :value="item.goodsBrand"></el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <!-- <el-col :span="8">
                    <span>品牌类别</span>
                    <el-select v-model="selected.selectedBrandName" filterable placeholder="请选择" size="small">
                        <el-option v-for="item in dataList.stockingGoodsList" :label="item.goodsBrand" :key="item.stockGoodsId" :value="item.goodsBrand"></el-option>
                    </el-select>
                </el-col> -->
                <!-- 盘点状态 -->
                <el-col :span="8">
                    <span>盘点状态</span>
                    <el-select v-model="selected.selectedCheckStatus" filterable placeholder="请选择" size="small">
                        <!-- 暂时这样写 -->
                        <el-option v-for="item in dataList.stockingGoodsList"  :key="item.stocktakingStatus" :value="getStocktakingStatus(item.stocktakingStatus)"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" size="small" @click="searchGood()">查询</el-button>
                </el-col>
            </el-row>
            <!-- 列表区域 -->
            <el-table :data="dataList.stockingGoodsList" border>
                <el-table-column label="商品图片" fixed width="100" align="center">
                    <template slot-scope="scope">
                        <img :src="scope.row.goodsPicture" width="30px" height="20px" alt="图片">
                    </template>
                </el-table-column>
                <el-table-column label="商品编号" prop="stockGoodsId" fixed width="120" align="center"></el-table-column>
                <el-table-column label="产品批号" prop="stockGoodsBatchNumber" fixed width="120" align="center"></el-table-column>
                <el-table-column label="商品名称" prop="goodsName" fixed width="140" align="center"></el-table-column>
                <el-table-column label="商品类别" prop="goodsCategoryId" width="140" align="center">
                    <template slot-scope="scope">
                        <span v-for="item in dataList.categoryList" :key="item.categoryId" >
                            <span v-if="scope.row.goodsCategoryId==item.categoryId">
                                {{item.categoryName}}
                            </span>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="品牌类别" prop="goodsBrand" width="120" align="center"></el-table-column>
                <!-- 库存量显示问题待解决 -->
                <el-table-column label="库存量" prop="stockInventory" width="80" align="center"></el-table-column>
                <el-table-column label="盘点量" prop="stocktakingNum"  width="80" align="center" ></el-table-column>
                <!-- 根据true或者false选择 -->
                <el-table-column label="盘点状态"  prop="stocktakingStatus"  :formatter="stateFormat" width="100" align="center"></el-table-column>
                <el-table-column label="盘点盈亏" :formatter="numStateFormat"   width="100" align="center"></el-table-column>
                <el-table-column label="操作" fixed="right" width="80" align="center">
                    <template slot-scope="scope">
                        <el-button-group v-for="func in functionList_one" :key="func.functionId">
                            <el-tooltip effect="light" placement="top" :content="func.functionName" :enterable="false">
                                <el-button :type="func.btnType" size="mini" :icon="func.btnIcon" @click="getButtonStatus(scope.row,func.functionId)"></el-button>
                            </el-tooltip>
                        </el-button-group>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 查看盘点信息弹框 -->
            <el-dialog title="盘点信息详情" :visible.sync="checkStoreDialog" width="700px">
                <el-form label-width="80px">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="货品图片"> 
                                eslint-disable-next-line
                                <template slot-scope="scope">
                                    <img :src="currentStoreList.goods.goodsPicture" alt="图片">
                                </template>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="货品名称"> 
                                <el-input type="text" v-model="currentStoreList.goods.goodsName" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="货品编号">
                                <el-input type="text" v-model="currentStoreList.goods.goodsId" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        
                        <el-col :span="8">
                            <el-form-item label="货品类别"> 
                                <el-input type="text" v-model="currentStoreList.category.categoryName" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="品牌类别"> 
                                <el-input type="text" v-model="currentStoreList.goods.goodsBrand" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="售价/元"> 
                                <el-input type="text" v-model="currentStoreList.stock.stockGoodsPrice" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row >
                        <el-col :span="8">
                            <!-- 渲染不上 -->
                            <el-form-item label="生产日期"> 
                                <el-input type="date" v-model="currentStoreList.stock.stockGoodsProductionDate" disabled></el-input>
                                
                                <!-- <el-date-picker v-model="currentStoreList.stock.stockGoodsProductionDate" type="date" placeholder="选择日期" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" disabled></el-date-picker> -->
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="保质期/天"> 
                                <el-input type="text" v-model="currentStoreList.stock.stockGoodsShelfLife" disabled></el-input>
                            </el-form-item>
                        </el-col>
                         <el-col :span="8">
                            <el-form-item label="库存量"> 
                                <el-input type="text" v-model="currentStoreList.stock.stockInventory" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="规格"> 
                                <el-input type="text" v-model="currentStoreList.goods.goodsSpecifications" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="单位"> 
                                <el-input type="text" v-model="currentStoreList.unit.unitName" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="盘点数量"> 
                                <el-input type="text"  v-model="currentStoreList.stocktaking.stocktakingNum"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="15">
                            <el-form-item label="盘点备注"> 
                                <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="currentStoreList.stocktaking.stocktakingRemarks"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dislog-footer">
                    <!-- <template slot-scope="scope"> -->
                        <el-tooltip effect="light" placement="top" content="取消">
                        <el-button type="primary" icon="el-icon-delete" @click="checkStoreDialog=false"></el-button>
                        </el-tooltip>
                        <el-button-group v-for="func in functionList_two" :key="func.functionId">
                            <el-tooltip effect="light" placement="top" :content="func.functionName" :enterable="false">
                                <el-button :type="func.btnType"  :icon="func.btnIcon" @click="submitStore()"></el-button>
                            </el-tooltip>
                        </el-button-group>
                    <!-- </template> -->
                    <!-- <el-button type="button" @click="shutDialog()">取消</el-button>
                    <el-button type="button" @click="submitStore()">提交盘点</el-button> -->
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
        name:'CheckStore',
        data() {
            return{
                //库存信息
                dataList:'',
                //功能菜单
                functionList:[],
                //一级功能菜单
                functionList_one:[],
                //二级功能菜单
                functionList_two:[],
                //是否已经渲染功能按钮
                isDraw:false,
                //指定商品需求
                selected:{
                    selectedGoodId:'',
                    selectedGoodName:'',
                    selectedGoodCategory:'',
                    selectedBrandName:'',
                    selectedCheckStatus:''
                },
                //设置查看商品信息的弹窗是否可见
                checkStoreDialog:false,
                //当前操作的库存信息
                currentStoreList:{
                  category:{
                      categoryId:'',
                      categoryName:'',
                      stocktakingStaffId:''
                  },
                  goods:{
                      goodsBrand:'',
                      goodsCategoryId:'',
                      goodsId:'',
                      goodsName:'',
                      goodsPicture:'',
                      goodsSpecifications:''
                  },
                  stock:{
                      goodsStockId:'',
                      stockExportBillId:'',
                      stockGoodsBatchNumber:'',
                      stockGoodsId:'',
                      stockGoodsPrice:'',
                      stockGoodsProductionDate:'',
                      stockGoodsShelfLife:'',
                      stockId:'',
                      stockInventory:'',
                      stockUnitId:''
                  },
                  stocktaking:{
                      stockNum:'',
                      stocktakingId:'',
                      stocktakingNum:'',
                      stocktakingPrice:'',
                      stocktakingProfitLossStatus:'',
                      stocktakingRemarks:'',
                      stocktakingStaffId:'',
                      stocktakingStatus:'',
                      stocktakingStockGoodsId:'',
                      stocktakingTime:''
                  },
                  unit:{
                      unitId:'',
                      unitName:''
                  }
                },
                // currentStoreList:[],
                //分页信息
                queryInfo:{
                    pageIndex:1,
                    infoCount:4,
                    total:0
                }
            }
        },
        created(){
            this.getStoreList()
        },
        methods:{
             //初始获取部分用户信息
            getStoreList() {
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
                    secondaryMenuId: this.secondaryMenuId,
                    userId: window.sessionStorage.staffId
                }
                
                this.$axios.post('/stocktaking/viewStocktakingGoodsList', this.$qs.stringify(data),{
                    headers:{
                        staffToken: window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    console.log(res)
                    if (res.data.functionList != undefined) {
                        this.functionList = res.data.functionList
                    }
                    this.queryInfo.total = res.data.recordSum
                    this.dataList=res.data
                    // for(i=0;i<res.data.stockingGoodsList.length;i++){
                    //     // console.log(i)
                    //     // console.log(res.data.stockingGoodsList[i].stockInventory)
                    //     this.dataList.stockingGoodsList[i].stockInventory=res.data.stockingGoodsList[i].stockInventory
                    //     // console.log(this.dataList.stockingGoodsList[i].stockInventory)
                    // }      
                    // console.log(this.dataList.stockingGoodsList[0].stockInventory)
                    // console.log('------------')
                    // console.log(this.dataList.stockingGoodsList)
                    //渲染功能按钮
                    if(!this.isDraw) {
                        for (var i = 0; i < this.functionList.length; i++) {
                            if (this.functionList[i].functionId == 30) {
                                this.$set(this.functionList[i],"btnType","success")
                                this.$set(this.functionList[i],"btnIcon","el-icon-edit")
                                this.functionList_one.push(this.functionList[i])
                            } else if (this.functionList[i].functionId == 31) {
                                this.$set(this.functionList[i],"btnType","success")
                                this.$set(this.functionList[i],"btnIcon","el-icon-edit")
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
            //查询指定需求的商品
            searchGood(){
                this.$axios.post('/stocktaking/viewStocktakingGoodsList',this.selected)
                .then((res) => {
                    this.storeList = res.data.obj
                    //console.log(res)
                })
                .catch((err) => {
                    this.$message.error(err)
                })
            },
            // //获取指定商品的信息
            // checkStatus(good) {
            //     //console.log(good)
            //     this.lookGoodDialog = true
            //     this.currentGood = good
            // },
            //获取按钮功能
            getButtonStatus(rowInfo,functionId) {
                // console.log(rowInfo)
                if (functionId == 30) {
                    //盘点弹窗
                    this.checkStore(rowInfo)
                } else if (functionId == 31) {
                    //提交盘点
                    this.submitStore(rowInfo)
                }
            },
            //盘点弹窗
            checkStore(Store){
                // console.log(Store)
                this.checkStoreDialog=true
                let data={
                    stocktakingId:Store.stocktakingId,
                    stockGoodsId:Store.stockGoodsId
                }
                this.$axios.post('/stocktaking/stocktaking',this.$qs.stringify(data),{
                    headers:{
                        staffToken: window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res)=>{
                    //  console.log('Store====res=====')
                    //  console.log(res.data)
                    // if (res.data.success) {
                        // this.currentStoreList=[res.data.Stocktaking,res.data.StocktakingRecord,res.data.Stock,res.data.Goods,res.data.Category,res.data.Unit,res.data.success,res.data.message]
                    this.currentStoreList=res.data
                    // console.log("midddddd")
                    // console.log(this.currentStoreList)
                    // console.log('currentStoreList')
                    // console.log(this.currentStoreList.stock.stockGoodsShelfLife)
                    // }   
                })
            },
            //提交盘点结果
            submitStore(){
                //设置盘点状态为已盘点
                this.currentStoreList.stocktaking.stocktakingStatus=1
                // console.log(this.currentStoreList)
                //未实时响应

                // this.currentStoreList.stocktaking.stocktakingNum=999
                let data={
                    stocktaking:JSON.stringify(this.currentStoreList.stocktaking),
                    staffId: window.sessionStorage.staffId
                }
                // console.log("end")
                this.$axios.post('/stocktaking/submitStocktakingGood',this.$qs.stringify(data),{
                    headers:{
                        staffToken: window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res)=>{
                    // console.log(res.data)
                    if (res.data.success) {
                        this.checkStoreDialog=false
                        this.$message.success('盘点成功')
                    }else{
                        this.checkStoreDialog=false
                        this.$message.error('提交失败')
                    }   
                    
                })
                .catch((err) => {
                    this.checkStoreDialog=false
                    this.$message.error(err.message)
                })
                
            },
            //关闭盘点信息弹窗
            shutDialog(){
                this.checkStoreDialog = false
            },
           //根据指定页码获取相应的库存信息
            currentChange(currentPage) {
                this.queryInfo.pageIndex = currentPage
                this.getStoreList()
            },
            // //判断盘点数量
            // checkNum(row, column) {
            //     // console.log("数量！！！！！"+row.check_goods_num)
            //     if (row.check_status) {
            //     return row.check_goods_store
            //     } else  {
            //     return 0
            //     } 
            // },
            //根据传来的盘点状态值显示
            stateFormat(row, column) {
                // console.log("状态！！！！！"+row.check_status)
                if (row.stocktakingStatus==1) {
                return '已盘点'
                } else if(row.stocktakingStatus==0){
                return '待盘点'
                } else if(row.stocktakingStatus==2){
                    return '已提交更新'
                }else if(row.stocktakingStatus==-1){
                    return '取消盘点'
                }
            },
            //盘存状态
            numStateFormat(row,column){
                if(row.stocktakingStatus!=0){
                    //已盘点过
                    if (row.stockInventory>row.stocktakingNum) {
                    return '盘亏'
                    } else if(row.stockInventory=row.stocktakingNum){
                    return '正常'
                    } else if(row.stockInventory<row.stocktakingNum){
                        return '盘盈'
                    }
                }else{
                    return'待盘点'
                }
            },
            getStocktakingStatus(value){
                if (value==1) {
                return '已盘点'
                } else if(value==0){
                return '待盘点'
                } else if(value==2){
                    return '已提交更新'
                }else if(value==-1){
                    return '取消盘点'
                }

            }
            // //显示盘点盈亏昨天
            // check_goods_status(row,column){
            //      if (row.check_goods_store>row.goods_store) {
            //     return '盘盈'
            //     } else if (row.check_goods_store>row.goods_store) {
            //     return '正常'
            //     } else{
            //         return'盘亏'
            //     }
            // },
            //格式化输出时间
            // dataFormat(time){
            //     return `${time.getFullYear()}-${time.getMonth() + 1 >= 10 ? (time.getMonth() + 1) : '0' + (time.getMonth() + 1)}-${time.getDate() >= 10 ? time.getDate() : '0' + time.getDate()}
            //          ${time.getHours() >= 10 ? time.getHours() : '0' + time.getHours()} : ${time.getMinutes()>=10?time.getMinutes():'0'+time.getMinutes()} : ${time.getSeconds() >= 10 ? time.getSeconds() : '0' + time.getSeconds()}`;
            //  }
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
</style>