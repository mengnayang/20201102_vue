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
                    <span>商品编号</span>
                    <el-input class="input" type="text" v-model="selected.stockGoodsId" placeholder="请输入"  size="small" clearable ></el-input>
                    
                </el-col>
                <el-col :span="8">
                    <span>商品名称</span>
                    <el-input class="input" type="text" v-model="selected.goodsName" placeholder="请输入"  size="small" clearable ></el-input>
                    
                </el-col>
                <!-- 列出货品类别 -->
                <!-- <el-col :span="8">
                    <span>货品类别</span>
                    <el-select v-model="selected.selectedGoodCategory" filterable placeholder="请选择" size="small">
                        <el-option v-for="item in dataList.stockingGoodsList" :label="item.categoryName" :key="item.stockGoodsId" :value="item.categoryName"></el-option>
                    </el-select>
                </el-col> -->
                <el-col :span="8">
                    <span>类别名称</span>
                    <el-select v-model="selected.goodsCategoryId"  placeholder="请选择" size="small" clearable>
                        <el-option :key="1000" :value="1000" label="全部"></el-option>
                        <el-option v-for="item in category" :label="item.categoryName" :key="item.categoryId" :value="item.categoryId"></el-option>

                    </el-select>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <!-- 盘点状态 -->
                <el-col :span="8">
                    <span>盘点状态</span>
                    <el-select v-model="status" filterable placeholder="请选择" size="small" clearable>
                        <!-- 暂时这样写 -->
                        <el-option v-for="item in ['全部','待盘点','已盘点','已提交更新','取消盘点']"  :key="item" :value="item"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" size="small" @click="getSearchGood()">查询</el-button>
                </el-col>
            </el-row>
            <!-- 列表区域 -->
            <el-table :data="dataList.stockingGoodsList" border>
                <el-table-column label="商品图片" fixed width="120" align="center">
                    <template slot-scope="scope">
                        <img :src="'http://localhost:8080'+scope.row.goodsPicture"  alt="图片" class="all_img">
                    </template>
                </el-table-column>
                <el-table-column label="商品编号" prop="stockGoodsId" fixed width="240" align="center"></el-table-column>
                <el-table-column label="产品批号" prop="stockGoodsBatchNumber" fixed width="240" align="center"></el-table-column>
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
                                <!-- eslint-disable-next-line -->
                                <template slot-scope="scope">
                                    <img :src="'http://localhost:8080'+currentStoreList.goods.goodsPicture" alt="图片" class="all_imag">
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
                                <el-input type="text" v-model="currentStoreList.stock.stockGoodsProductionDate" disabled ></el-input>
                                
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
                                <el-input type="text"  v-model.number="currentStoreList.stocktaking.stocktakingNum" @blur="onNumChange(currentStoreList.stocktaking.stocktakingNum)"></el-input>
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
                        <el-button type="primary" size="mini"  @click="checkStoreDialog=false" >取 消</el-button>
                        <el-button-group v-for="func in functionList_two" :key="func.functionId">
                                <el-button :type="func.btnType" size="mini"  @click="submitStore()">提 交</el-button>
                        </el-button-group>
                    <!-- </template> -->
                    <!-- <el-button type="button" @click="shutDialog()">取消</el-button>
                    <el-button type="button" @click="submitStore()">提交盘点</el-button> -->
                </span>
            </el-dialog>
        </el-card>
        <el-pagination v-if="!searchFlag"
        :current-page="queryInfo.pageIndex" :page-sizes="[queryInfo.infoCount]" 
        :page-size="queryInfo.infoCount" :total="queryInfo.total"
        @current-change="currentChange"
        layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
        <el-pagination v-if="searchFlag"
        :current-page="searchQueryInfo.pageIndex" :page-sizes="[searchQueryInfo.infoCount]" 
        :page-size="searchQueryInfo.infoCount" :total="searchQueryInfo.total"
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
                    goodsName:null,
                    goodsCategoryId:null,
                    stockGoodsId:null,
                    stocktakingStatus:null,
                },
                
                //查询列表的盘点状态
                status:null,
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
                //类别
                category:'',
                // currentStoreList:[],
                //分页信息
                queryInfo:{
                    pageIndex:1,
                    infoCount:5,
                    total:0
                },
                //模糊查询初始化页数
                searchQueryInfo:{
                    total:0,
                    pageIndex:1,
                    infoCount:5
                },
                //判断是否是模糊盘点
                searchFlag:false,
                //判断模糊查询 页数是否初始化
                init:true,
            }
        },
        created(){
            this.getStoreList(),
            this.selected.goodsCategoryId=1000,
            this.status='全部'
        },
        methods:{
             //初始获取部分用户信息
            getStoreList() {
                //将模糊查询设为false
                this.searchFlag=false
                 // 获取当前二级菜单的id
                this.secondaryMenuList = window.sessionStorage.getItem('secondaryMenuList')
                this.secondaryMenuList = JSON.parse(this.secondaryMenuList)
                for(var i = 0; i < this.secondaryMenuList.length; i++) {
                    if (this.secondaryMenuList[i].secondaryMenuUrl == this.$route.path) {
                        this.secondaryMenuId = this.secondaryMenuList[i].secondaryMenuId
                    }
                }
                let data = {
                    pageIndex: this.queryInfo.pageIndex-1,
                    pageSize: this.queryInfo.infoCount,
                    secondaryMenuId: this.secondaryMenuId,
                    userId: window.sessionStorage.staffId,
                    staffId:window.sessionStorage.staffId,
                }
                
                this.$axios.post('/stocktaking/viewStocktakingGoodsList', this.$qs.stringify(data),{
                    headers:{
                        staffToken: window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    console.log(res.data)
                    if (res.data.functionList != undefined) {
                        this.functionList = res.data.functionList
                    }
                    this.queryInfo.total = res.data.recordSum
                    this.dataList=res.data
                    this.category=res.data.categoryList
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
            //判断是否是数字
            isValueNumber(val){
                let value = val.replace('/(^\s*)|(\s*$)','')  //去除字符串前后空格
                let num = Number(value)  //将字符串转换为数字
                if(isNaN(num)){  //判断是否是非数字
                    return false
                }else if(value === ''|| value === null){  //空字符串和null都会被当做数字
                    return false
                }else{
                    return true
                }
            },
            //判断盘点数量合法性
            onNumChange(info){
                console.log(info)
                if(info==''||info==null){
                    this.$message.error("注意盘点数量为空")
                    return
                }
                if(isNaN(info)){
                    this.$message.error("请输入数字")
                    this.currentStoreList.stocktaking.stocktakingNum=this.currentStoreList.stocktaking.stockInventory
                }
            },
            getSearchGood(){
                //点击按钮的时候初始化请求查询页数
                this.init=true
                this.searchGood()
            },
            //查询指定需求的商品
            searchGood(){
                 this.searchFlag=true
                if(this.init){
                    this.searchQueryInfo.total=0
                    this.searchQueryInfo.pageIndex=1
                }
                this.init=false
                let data={
                    userId:window.sessionStorage.staffId,
                    staffId:window.sessionStorage.staffId,
                    pageIndex: this.searchQueryInfo.pageIndex - 1,
                    pageSize: this.searchQueryInfo.infoCount,
                    secondaryMenuId: this.secondaryMenuId,
                    stockingGoods: this.selected
                }
                // 入库状态
                if (this.status=='待盘点'){
                    data.stockingGoods.stocktakingStatus=0
                }else if(this.status=='已盘点'){
                    data.stockingGoods.stocktakingStatus=1
                }else if(this.status=='已提交更新'){
                    data.stockingGoods.stocktakingStatus=2
                }else if(this.status=='取消盘点'){
                    data.stockingGoods.stocktakingStatus=-1
                }else{
                    data.stockingGoods.stocktakingStatus=null
                }
                if(data.stockingGoods.goodsCategoryId==1000){
                    data.stockingGoods.goodsCategoryId=null
                }
                console.log(data)
                //判断是否为空字符串
                if(data.stockingGoods.stockGoodsId==''){
                    data.stockingGoods.stockGoodsId=null
                }
                if(data.stockingGoods.goodsName==''||data.stockingGoods.goodsName==null){
                    data.stockingGoods.goodsName=null
                    // this.$message.info('请填写商品名称')
                    // return

                }
                if(data.stockingGoods.categoryName==''){
                    data.stockingGoods.categoryName=null
                }
                if(data.stockingGoods.goodsCategoryId==''){
                    data.stockingGoods.goodsCategoryId=null
                }
                data.stockingGoods=JSON.stringify(data.stockingGoods)
                 this.$axios.post('/stocktaking/viewStocktakingGoodsListByConditions', this.$qs.stringify(data),{
                    headers:{
                        staffToken: window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    console.log(res.data)
                   if (res.data.functionList != undefined) {
                        this.functionList = res.data.functionList
                    }
                    this.searchQueryInfo.total = res.data.recordSum
                    this.dataList=res.data
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
                    this.currentStoreList=res.data
                    console.log(res.data)
                    let data = new Date(this.currentStoreList.stock.stockGoodsProductionDate)
                    this.currentStoreList.stock.stockGoodsProductionDate = data.getFullYear() + "-" + (data.getMonth()+1) + "-" + data.getDate()
                    
                })
            },
            //提交盘点结果
            submitStore(){
                //设置盘点状态为已盘点
                console.log(this.currentStoreList)
                this.currentStoreList.stocktaking.stocktakingStatus=1
                //未实时响应
                if(this.currentStoreList.stock.stockInventory>this.currentStoreList.stocktaking.stocktakingNum){
                    this.currentStoreList.stocktaking.stocktakingProfitLossStatus=-1
                }else if(this.currentStoreList.stock.stockInventory==this.currentStoreList.stocktaking.stocktakingNum){
                    this.currentStoreList.stocktaking.stocktakingProfitLossStatus=0
                }else{
                    this.currentStoreList.stocktaking.stocktakingProfitLossStatus=1
                }
                this.currentStoreList.stocktaking.stocktakingProfitLossStatus
                let data={
                    stocktaking:JSON.stringify(this.currentStoreList.stocktaking),
                    staffId: window.sessionStorage.staffId
                }
                console.log(data.stocktaking)
                this.$axios.post('/stocktaking/submitStocktakingGood',this.$qs.stringify(data),{
                    headers:{
                        staffToken: window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res)=>{
                    if (res.data.success) {
                        this.checkStoreDialog=false
                        this.$message.success('盘点成功')
                        location.reload()
                    }else{
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
                 if(this.searchFlag){
                    //得到模糊查询的分页
                    this.searchQueryInfo.pageIndex = currentPage
                    this.searchGood()
                }else{
                    this.queryInfo.pageIndex = currentPage
                    this.getStoreList()
                }
            },
            //根据传来的盘点状态值显示
            stateFormat(row, column) {
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
.all_img{
    width: 100px;
}
</style>    