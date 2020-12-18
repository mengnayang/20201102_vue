<template>
    <div class="collect-monney_container">
        <!-- 面包屑导航 -->
        <el-breadcrumb>
            <el-breadcrumb-item :to="{path : '/welcome'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>收银管理</el-breadcrumb-item>
            <el-breadcrumb-item>批发收银</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <!-- 功能区域 -->
            <el-row :gutter="10">
                <el-col :span="8">
                    <span>商品编号</span>
                    <el-input class="input" type="text" v-model="selected.goodsId" placeholder="请输入"  size="small" clearable ></el-input>
                    
                </el-col>
                <el-col :span="8">
                    <span>商品名称</span>
                    <el-input class="input" type="text" v-model="selected.goodsName" placeholder="请输入"  size="small" clearable ></el-input>
                    
                </el-col>
                <el-col :span="8">
                    <span>类别编号</span>
                    <el-select v-model="selected.goodsCategoryId"  placeholder="请选择" size="small" clearable>
                        <el-option :key="1000" :value="1000" label="全部"></el-option>
                        <el-option v-for="item in allData.categoryList" :label="item.categoryId" :key="item.categoryId" :value="item.categoryId"></el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="8">
                    <span>品牌名称</span>
                    <el-input class="input" type="text" v-model="selected.goodsBrand" placeholder="请输入"  size="small" clearable ></el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" size="small" @click="searchGood()">查询</el-button>
                </el-col>
            </el-row>
            <!-- table表格区域 -->
            <el-table :data="goodList" border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="商品图片" prop="goodsPicture" width="162px" align="center"></el-table-column>
            <el-table-column label="商品编号" prop="goodsId" width="240" align="center"></el-table-column>
            <el-table-column label="库存编号" prop="stockGoodsId" width="240" align="center"></el-table-column>
            <el-table-column label="商品名称" prop="goodsName" width="140px" align="center"></el-table-column>
            <el-table-column label="商品类别" prop="goodsCategoryId" width="80px" align="center"> 
                <template slot-scope="scope">
                    <span v-if="scope.row.goodsCategoryId == 1">方便速食</span>
                    <span v-else-if="scope.row.goodsCategoryId == 2">生鲜水果</span>
                    <span v-else-if="scope.row.goodsCategoryId == 3">休闲零食</span>
                    <span v-else-if="scope.row.goodsCategoryId == 4">粮油米面</span>
                    <span v-else-if="scope.row.goodsCategoryId == 5">乳饮酒水</span>
                    <span v-else-if="scope.row.goodsCategoryId == 6">日用百货</span>
                    <span v-else-if="scope.row.goodsCategoryId == 7">母婴用品</span>
                    <span v-else-if="scope.row.goodsCategoryId == 8">个人护理</span>
                    <span v-else-if="scope.row.goodsCategoryId == 9">纸品家清</span>
                    <span v-else-if="scope.row.goodsCategoryId == 10">美容护肤</span>
                    <span v-else-if="scope.row.goodsCategoryId == 11">酒水饮料</span>
                    <span v-else-if="scope.row.goodsCategoryId == 12">童装童鞋</span>
                    <span v-else-if="scope.row.goodsCategoryId == 13">家纺内衣</span>
                    <span v-else-if="scope.row.goodsCategoryId == 14">宠物生活</span>
                    <span v-else-if="scope.row.goodsCategoryId == 15">电器数码</span>
                    <span v-else-if="scope.row.goodsCategoryId == 16">进口保健</span>
                    <span v-else-if="scope.row.goodsCategoryId == 17">医药保健</span>
                </template></el-table-column>
            <el-table-column label="品牌名称" prop="goodsBrand" width="85px" align="center"></el-table-column>
            <el-table-column label="库存量" prop="stockInventory" width="70px" align="center"></el-table-column>
            <el-table-column label="保质期/天" prop="stockGoodsShelfLife" width="85px" align="center"></el-table-column>
            <el-table-column label="售价/元" prop="stockGoodsPrice" width="75px" align="center"></el-table-column>
            <el-table-column label="生产日期" prop="stockGoodsProductionDate" width="120" align="center"></el-table-column>
            <el-table-column label="单位" prop="stockUnitId" width="70px" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.unitId == 1">盒</span>
                    <span v-else-if="scope.row.stockUnitId == 2">瓶</span>
                    <span v-else-if="scope.row.stockUnitId == 3">袋</span>
                    <span v-else-if="scope.row.stockUnitId == 4">杯</span>
                    <span v-else-if="scope.row.stockUnitId == 5">件</span>
                </template></el-table-column>
            <el-table-column label="规格" prop="goodsSpecifications" width="90px" align="center"></el-table-column>
            <el-table-column label="选择件数" width="200px" align="center" fixed="right">
                <template slot-scope="scope">
                    <el-input-number v-model.number="scope.row.num" :min="0" :max="scope.row.stockInventory" size="small" @change="(value) => handleChange(value, scope)"></el-input-number>
                </template>
            </el-table-column>
        </el-table>
                    <!-- <el-input-number v-model="num" @change="handleChange" :min="0"></el-input-number> -->
 
        <!-- 批发购物车信息弹框 -->
        <el-dialog title="批发购物车信息" :visible.sync="shoppingCartDialog" width="1000px" >
            <!-- 批发购物车信息表单 -->
            <el-table :data="cardListAll" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="商品图片" prop="goodsPicture"></el-table-column>
                <el-table-column label="商品编号" prop="stockGoodsId" width="240"></el-table-column>
                <el-table-column label="商品名称" prop="goodsName" width="140px"></el-table-column>
                <el-table-column label="商品类别" prop="goodsCategoryId" width="80px" align="center"> 
                <template slot-scope="scope">
                    <span v-if="scope.row.goodsCategoryId == 1">方便速食</span>
                    <span v-else-if="scope.row.goodsCategoryId == 2">生鲜水果</span>
                    <span v-else-if="scope.row.goodsCategoryId == 3">休闲零食</span>
                    <span v-else-if="scope.row.goodsCategoryId == 4">粮油米面</span>
                    <span v-else-if="scope.row.goodsCategoryId == 5">乳饮酒水</span>
                    <span v-else-if="scope.row.goodsCategoryId == 6">日用百货</span>
                    <span v-else-if="scope.row.goodsCategoryId == 7">母婴用品</span>
                    <span v-else-if="scope.row.goodsCategoryId == 8">个人护理</span>
                    <span v-else-if="scope.row.goodsCategoryId == 9">纸品家清</span>
                    <span v-else-if="scope.row.goodsCategoryId == 10">美容护肤</span>
                    <span v-else-if="scope.row.goodsCategoryId == 11">酒水饮料</span>
                    <span v-else-if="scope.row.goodsCategoryId == 12">童装童鞋</span>
                    <span v-else-if="scope.row.goodsCategoryId == 13">家纺内衣</span>
                    <span v-else-if="scope.row.goodsCategoryId == 14">宠物生活</span>
                    <span v-else-if="scope.row.goodsCategoryId == 15">电器数码</span>
                    <span v-else-if="scope.row.goodsCategoryId == 16">进口保健</span>
                    <span v-else-if="scope.row.goodsCategoryId == 17">医药保健</span>
                </template></el-table-column>
                <el-table-column label="品牌名称" prop="goodsBrand" width="85px"></el-table-column>
                <el-table-column label="商品单价/元" prop="stockGoodsPrice" width="120px"></el-table-column>
                <el-table-column label="批发单价/元" width="120px">
                    <template slot-scope="scope">
                        <el-input type="text" v-model.number="scope.row.pfPrice" @input="sum()" @blur="onPriceChange(scope.row)"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="件数" prop="num"></el-table-column>
            </el-table>
            <el-form :inline="true" class="jsb">
                <el-form-item :span="6" label="应付款：">
                    <el-input type="text" id="sumPrice" clearable width="70px" :disabled="true" v-model="newDeliveryRecord.deliveryTotalPrice"></el-input>
                </el-form-item>
                <el-form-item :span="6" label="已付款项：">
                    <el-input type="text" v-model.number="newDeliveryRecord.deliveryPaid" @blur="onTotalPriceChange(newDeliveryRecord.deliveryPaid)"></el-input>
                </el-form-item>
                <el-form-item style="float:right" >
                    <el-button type="primary" @click="shoppingCartDialog = false" size="mini">返回</el-button>
                    <el-button type="success" @click="confirm()" size="mini">确认</el-button>
                </el-form-item>
            </el-form>
            <!--span slot="footer" class="dialog-footer">
                <el-button type="primary">返回</el-button>
                <el-button type="primary" @click="confirm()">确认</el-button>
            </span-->
        </el-dialog>
        
        <el-pagination
        :current-page="queryInfo.pageIndex" :page-sizes="[queryInfo.infoCount]" 
        :page-size="queryInfo.infoCount" :total="queryInfo.total"
        @current-change="currentChange"
        layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
        <div class="shopping_cart_icon"  @click="showDialog()"></div>
        </el-card>
    </div>
</template>

<script>
export default {
    name:'DeliveryCashier',
    data() {
        return{
            newDeliveryRecord:{
                deliveryPaid:'',
                deliveryLaunchedStaffId:window.sessionStorage.getItem('staffId'),
                deliveryTotalPrice:'',
                deliveryCheckOutStatus:''
            },
            newDelivery:{
                deliveryStockGoodsId:'',
                deliveryPrice:'',
                deliveryNum:''
            },
            yPrice:'',
            //购物车弹框列表
            cartList:[],
            //是否已经渲染功能按钮
            isDraw:false,
            //购物车弹框
            shoppingCartDialog:false,
            options: [{
                value: '选项1',
                label: '方便速食'
            }, {
            value: '选项2',
            label: '生鲜水果'
            }, {
            value: '选项3',
            label: '休闲零食'
            }, {
            value: '选项4',
            label: '粮油米面'
            }, {
            value: '选项5',
            label: '乳饮酒水'
            },{
            value: '选项6',
            label: '日用百货'
            },{
            value: '选项7',
            label: '母婴用品'
            },{
            value: '选项8',
            label: '个人护理'
            },{
            value: '选项9',
            label: '纸品家清'
            },{
            value: '选项10',
            label: '美容护肤'
            },{
            value: '选项11',
            label: '酒水饮料'
            },{
            value: '选项12',
            label: '童装童鞋'
            },{
            value: '选项13',
            label: '家纺内衣'
            },{
            value: '选项14',
            label: '宠物生活'
            },{
            value: '选项15',
            label: '电器数码'
            },{
            value: '选项16',
            label: '进口保健'
            },{
            value: '选项17',
            label: '医药保健'
            }],
            value: '',
            num: 0,
            goodList:[],
            allData:[],
            functionList:[],
            functionList_one:[],
            functionList_two:[],
            //查询
            selected:{
                goodsId:null,
                goodsName:null,
                goodsCategoryId:null,
                goodsBrand:null
            },
            //获取部分用户信息的先决条件
            queryInfo:{
                total:0,
                pageIndex:1,
                infoCount:4
            },
            secondaryMenuList:[],
            secondaryMenuId:'',
            cardListAll:[]
        }
    },
    created(){
        this.getGoodList(),
        this.selected.goodsCategoryId=1000
    },
    methods:{
        //计算总价
        sum:function(){
            //console.log(this.newDeliveryRecord.deliveryTotalPrice)
            //console.log(this.cardListAll)
            this.newDeliveryRecord.deliveryTotalPrice = 0
            for (let i = 0; i < this.cardListAll.length; i++) {
                this.newDeliveryRecord.deliveryTotalPrice += this.cardListAll[i].pfPrice * this.cardListAll[i].num;
            };
            // console.log(this.pay);
        },
        handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        },
        handleChange(num,scope) {
            console.log(scope)
            // console.log(num);
            this.addToCart(scope)
        },
        //点击+-数量，刷新购物车
        addToCart(scope){
            let flag = false
            for(let i = 0;i < this.cardListAll.length;i++){
                if (scope.row.stockGoodsId == this.cardListAll[i].stockGoodsId) {
                    this.cardListAll[i].num = scope.row.num
                    flag = true
                }
            }
            if (!flag) {
                this.cardListAll.push(scope.row)
            }
            //console.log(this.cardListAll)
        },
        //判断批发单价输入框合法性
        onPriceChange(info){
            if(info.pfPrice>info.stockGoodsPrice){
                this.$message.error("批发单价不能大于商品单价")
                info.pfPrice=info.stockGoodsPrice
                return
            }
            if(info.pfPrice<0){
                this.$message.error("批发单价不能为负")
                info.pfPrice=0
                return
            }
            if(!this.isValueNumber(info.pfPrice)){
                // console.log('输入错误')
                this.$message.error("输入错误")
                info.pfPrice=0
            }
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
        //判断已付款输入框合法性
        onTotalPriceChange(info){
            if(info>this.newDeliveryRecord.deliveryTotalPrice){
                this.$message.error("已付款项输入错误")
                this.newDeliveryRecord.deliveryPaid=this.newDeliveryRecord.deliveryTotalPrice
                return 
            }
            if(info<0){
                this.$message.error("已付款项不能为负")
                this.newDeliveryRecord.deliveryPaid=0
                return
            }
            if(!this.isValueNumber(info)){
                // console.log('输入错误')
                this.$message.error("已付款项输入错误")
                this.newDeliveryRecord.deliveryPaid=0
            }
        },
        //获取指定页面的信息
        currentChange(currentPage){
            this.queryInfo.pageIndex = currentPage
            this.getGoodList()
        },
        //连接多页商品的购物车
        getCartList(){
            this.cartList = []
            for(var i = 0;i < this.goodList.length; i++){
                if(this.goodList[i].num > 0){
                    this.cartList.push(this.goodList[i])
                }
            }
            this.cardListAll = this.cardListAll.concat(this.cartList)
            // console.log(this.cardListAll)
            this.sum()
        },
        showDialog(){
            this.shoppingCartDialog = true
            //this.sum()
            // this.getCartList()
            // console.log(this.cartList)
        },
        //查找商品，刷新商品栏
        searchExistGoods(){
            for(let i = 0;i < this.cardListAll.length;i++){
                if(this.cardListAll[i].num > 0){
                    for (let j = 0; j < this.goodList.length; j++) {
                        if (this.goodList[j].stockGoodsId == this.cardListAll[i].stockGoodsId) {
                            this.goodList[j].num = this.cardListAll[i].num
                        }
                    }
                }
            }
        },
        getGoodList(){
            // console.log(window.sessionStorage.getItem('staffId'))
            // 获取当前二级菜单的id
            this.secondaryMenuList = window.sessionStorage.getItem('secondaryMenuList')
            this.secondaryMenuList = JSON.parse(this.secondaryMenuList)
            // console.log(this.secondaryMenuList)
            for(var i = 0; i < this.secondaryMenuList.length; i++) {
                if (this.secondaryMenuList[i].secondaryMenuUrl == this.$route.path) {
                    // console.log(this.secondaryMenuList[i].secondaryMenuId)
                    this.secondaryMenuId = this.secondaryMenuList[i].secondaryMenuId
                }
            }

            let data = {
                pageIndex:this.queryInfo.pageIndex-1,
                pageSize:this.queryInfo.infoCount,
                secondaryMenuId:this.secondaryMenuId
            }
            this.$axios.post('/deliverycashier',this.$qs.stringify(data),{
                headers:{
                    staffToken: window.sessionStorage.getItem('staffToken')
                }
            })
            .then((res) => {
                console.log(res.data)
                this.goodList = res.data.goodsStockAList
                this.allData = res.data
                this.functionList = res.data.functionList
                // console.log(res)

                this.goodList.map((item) => {
                    let data = new Date(item.stockGoodsProductionDate)
                    item.stockGoodsProductionDate = data.getFullYear() + "-" + (data.getMonth() + 1) + "-" + data.getDate()
                    // console.log(this.goodList.stockGoodsProductionDate)
                    this.$set(item,"num",0)
                    this.$set(item,"pfPrice",0)
                })
                this.searchExistGoods()
                this.queryInfo.total = res.data.recordSum
                //渲染功能按钮
                if(!this.isDraw) {
                    for (let i = 0; i < this.functionList.length; i++) {
                        if (this.functionList[i].functionId == 24) {
                            this.$set(this.functionList[i],"btnType","success")
                            this.$set(this.functionList[i],"btnIcon","el-icon-edit")
                            this.functionList_one.push(this.functionList[i])
                        } 
                        this.isDraw = true                        
                    }
                }
            })
            .catch((err) => {
                this.$message.error(err.message)
            })
        },
        confirm() {
            let deliveryRecord = {
                deliveryPaid:this.newDeliveryRecord.deliveryPaid,
                deliveryLaunchedStaffId:this.newDeliveryRecord.deliveryLaunchedStaffId,
                deliveryTotalPrice:this.newDeliveryRecord.deliveryTotalPrice,
                deliveryCheckOutStatus:this.newDeliveryRecord.deliveryCheckOutStatus
            }
            if(deliveryRecord.deliveryPaid!=null){
                deliveryRecord.deliveryCheckOutStatus=1
            }else{
                deliveryRecord.deliveryCheckOutStatus=0
            }
            let deliveryList = []

            for(let i = 0;i < this.cardListAll.length ; i++){
                deliveryList.push({
                    deliveryStockGoodsId:this.cardListAll[i].stockGoodsId,
                    deliveryPrice:this.cardListAll[i].pfPrice,
                    deliveryNum:this.cardListAll[i].num})
                // console.log(deliveryList)
            }

            let data = {
                deliveryRecord: JSON.stringify(deliveryRecord),
                deliveryList: JSON.stringify(deliveryList),
                staffId:window.sessionStorage.getItem('staffId')
            }
            this.$axios.post('/deliverycashier/commit',this.$qs.stringify(data),{
                headers:{
                    staffToken:window.sessionStorage.getItem('staffToken')
                }
            })
            .then((res) => {
                if (res.data.success) {
                    this.$message.success("下单成功!")
                } else {
                    this.$message.error(res.data.errMsg)
                }
                location.reload()
                this.shoppingCartDialog = false
            })
            .catch((err) => {
                this.$message.error(err.message)
                this.shoppingCartDialog = false
            })
        },
        searchGood(){
            this.queryInfo.total=0
            this.queryInfo.pageIndex=1
            let data={
                staffId:window.sessionStorage.staffId,
                goods:this.selected,
                pageIndex: this.queryInfo.pageIndex - 1,
                pageSize: this.queryInfo.infoCount,
                secondaryMenuId: this.secondaryMenuId,
            }
            if(data.goods.goodsId==''){
                data.goods.goodsId=null
            }
            if(data.goods.goodsName==''){
                data.goods.goodsName=null
            }
            if(data.goods.goodsCategoryId==''){
                data.goods.goodsCategoryId=null
            }
            if(data.goods.goodsBrand==''){
                data.goods.goodsBrand=null
            }
            if(data.goods.goodsCategoryId==1000){
                data.goods.goodsCategoryId=null
            }
           data.goods=JSON.stringify(data.goods)
           this.$axios.post('/deliverycashier/findByConditions', this.$qs.stringify(data),{
                    headers:{
                        staffToken: window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    console.log(res.data)
                    this.goodList = res.data.goodsStockAList
                    this.allData = res.data
                    // this.functionList = res.data.functionList
                    this.goodList.map((item) => {
                        let data = new Date(item.stockGoodsProductionDate)
                        item.stockGoodsProductionDate = data.getFullYear() + "-" + (data.getMonth() + 1) + "-" + data.getDate()
                        this.$set(item,"num",0)
                        this.$set(item,"pfPrice",0)
                    })
                    this.searchExistGoods()
                    this.queryInfo.total = res.data.recordSum
                })
                .catch((err) => {
                    this.$message.error(err.message)
                })
        }
        
    }
}
</script>

<style lang="less" scoped>
.jsb{
    margin-top: 10px;
}
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
.shopping_cart_icon{
    width:60px;
    height: 60px;
    background-image: url('../../../assets/image/shopBox.jpg');
    background-size: 100% 100%;
    background-color:white;
    margin: 1px 2px auto auto;
}
.input{
    width: 203px;
}
</style>