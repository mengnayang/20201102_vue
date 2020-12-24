<template>
    <div class="return_wholesale_details">
        <!-- 面包屑导航 -->
        <el-breadcrumb>
            <el-breadcrumb-item :to="{path:'/welcome'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>退货管理</el-breadcrumb-item>
            <el-breadcrumb-item>批发退货</el-breadcrumb-item>
            <el-breadcrumb-item>批发退货管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <!-- 功能区域 -->
            <!-- <el-form :gutter="20" :inline="true">
                <el-form-item :span="6">
                    <span>商品编号:</span>
                    <el-input class="sinput" v-model="selected.selecteddeliveryStockGoodsId" filterable placeholder="请输入" >
                    </el-input>
                </el-form-item>
                <el-form-item :span="6">
                    <span>商品名称:</span>
                        <el-input class="sinput"  v-model="selected.selectedgoodsName" filterable placeholder="请输入" >
                    </el-input>
                </el-form-item>
                <el-form-item :span="6">
                    <span>品牌名称:</span>
                    <el-select v-model="selected.selectedgoodsBrand" filterable placeholder="请选择" >
                    </el-select>
                </el-form-item>
                <el-form-item :span="6">
                    <span>收款员工编号:</span>
                    <el-input class="sinput"  v-model="selected.selecteddeliveryLaunchedStaffId" filterable placeholder="请输入" >
                    </el-input>
                </el-form-item>
                <el-form-item :span="4">
                    <el-button type="primary" size="small" @click="searchGood()">查询</el-button>
                </el-form-item>
            </el-form> -->
            <!-- 列表区域 -->
            <!-- 滚动条 -->
            <!-- <el-scrollbar style="height:100%;width: 1540px">  -->
            <el-table :data="deliveryGoodList" border>
                <el-table-column label="商品图片" fixed width="100" align="center">
                    <template slot-scope="scope">
                        <img :src="$store.state.imgBaseURL+scope.row.goodsPicture"  alt="图片" class="all_img">
                    </template>
                </el-table-column>
                <el-table-column label="商品编号" prop="retailStockGoodsId" fixed width="180" align="center"></el-table-column>
                <el-table-column label="商品名称" prop="goodsName"  width="160" align="center"></el-table-column>
                <!-- <el-table-column label="商品类别" prop="goodsCategoryName"  width="160" align="center"></el-table-column> -->
                <el-table-column label="品牌名称" prop="goodsBrand"  width="160" align="center"></el-table-column>
                <el-table-column label="零售单价" prop="retailPrice" width="140" align="center"></el-table-column>
                <el-table-column label="零售数量" prop="retailNum"  width="160" align="center"></el-table-column>
                <el-table-column label="零售单位" prop="unitName"  width="130" align="center"></el-table-column>
                <el-table-column  v-if="!flag" label="退货数量" prop="refundCustomerNum"  fixed="right" width="120" align="center">
                    <template slot-scope="scope">
                        <el-input v-model.number="scope.row.refundCustomerNum" placeholder="请输入内容" @blur="onNumChange(scope.row)"></el-input>
                    </template>
                </el-table-column>
                <el-table-column v-if="!flag" label="退货单价" prop="refundCustomerPrice" fixed="right" width="120" align="center">
                    <template slot-scope="scope">
                        <el-input v-model.number="scope.row.refundCustomerPrice" :placeholder="scope.row.retailPrice" @blur="onPriceChange(scope.row)"></el-input>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="商品总价" prop="refundCustomerStatus"  width="120" align="center"></el-table-column> -->
                <!-- <el-table-column label="已退款项" prop="refundStaffId" fixed='right' width="123" align="center"></el-table-column> -->
            </el-table>
            <!-- </el-scrollbar> -->
            <!-- <div style="float:left">
                <el-pagination
                    :current-page="queryInfo.pageIndex" :page-sizes="[queryInfo.infoCount]" 
                    :page-size="queryInfo.infoCount" :total="queryInfo.total"
                    @current-change="currentChange"
                    layout="total, sizes, prev, pager, next, jumper">
                </el-pagination>
            </div> -->
            <div style="float:right">
                <el-tooltip effect="light" placement="top" content="返回">
                    <el-button type="primary" icon="el-icon-back" @click="back" size="mini"></el-button>
                </el-tooltip>
                <el-tooltip effect="light" placement="top" content="提交退货">
                        <!-- 根据状态判断是否按钮可用 -->
                        <el-button :disabled='flag' type="success" icon="el-icon-check" @click="openDialog" size="mini"></el-button>
                        <!-- <el-button  type="success" icon="el-icon-check" @click="dialogVisible=true" ></el-button> -->

                </el-tooltip>
                <!-- <el-button type="primary" @click="deleteBy()">提交退货</el-button> -->
            </div>
        </el-card>
        <!-- 提交退货原因弹窗 -->
        <el-dialog
            title="退货原因"
            :visible.sync="dialogVisible"
            width="30%">
            <el-input type="textarea" maxlength="100" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="refundCustomerRecord.refundCustomerReason" clearable></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
                <el-button type="primary" @click="commitReturn" size="mini">提 交</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
  export default {
    name:'RetailDeliverydetails',
        data() {
            return{
                //批发出库单id
                retailId:'',
                //商品信息
                // deliveryGoodList:{
                //     deliveryStockGoodsId:'',
                //     goodsName:'',
                //     goodsCategoryName:'',
                //     goodsBrand:'',
                //     deliveryPrice:'',
                //     deliveryNum:'',
                //     unitName:'',
                //     refundCustomerNum:'',
                //     refundCustomerPrice:'',
                // },
                deliveryGoodList:[],
                //退货详情单对象
                refundCustomerRecord:{
                    //订单编号
                    refundCustomerOrderId:'',
                    //退货原因
                    refundCustomerReason:'',
                    //订单类型
                    orderType:'1',
                    //退货员工id
                    refundStaffId:''
                },
                //退货商品列表
                refundCustomerList:{
                    //商品数量
                    refundCustomerNum:'',
                    //货品单价
                    refundCustomerPrice:''
                },
                //判断是否有发生退款flag=true就是发生
                flag:false,
                //退货原因弹窗是否可见
                dialogVisible:false,
                //指定商品需求
                selected:{
                    selecteddeliveryStockGoodsId:'',
                    selectedgoodsName:'',
                    selectedgoodsBrand:'',
                    selecteddeliveryLaunchedStaffId:''
                },
                //当前操作的商品信息
                currentGood:'',
                //分页信息
                queryInfo:{
                    total:0,
                    pageIndex:1,
                    infoCount:5
                },
                //二级菜单列表
                secondaryMenuList:[],
                //当前二级菜单的id
                secondaryMenuId:'',
                //功能菜单
                functionList:[],
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
            this.getParams()
        },
        methods:{
            getParams(){
                // 取到路由带过来的参数
                const routerParams = this.$route.query.RowInfo
                // 将数据放在当前组件的数据内
                this.retailId= routerParams.retailId
                console.log(routerParams)
                // //订单编号
                this.refundCustomerRecord.refundCustomerOrderId=routerParams.retailId
                // //退货员工编号
                this.refundCustomerRecord.refundStaffId=window.sessionStorage.staffId
                //订单类型为批发1 零售2
                this.refundCustomerRecord.orderType=2
                // console.log(this.refundCustomerRecord)
                this.getDeliveryList()
            },
            // watch: {
            //     '$route': 'getParams'
            // },
            getDeliveryList() {
                let data = {
                    staffId:window.sessionStorage.staffId,
                    retailId:this.retailId
                }
                console.log(data)
                this.$axios.post('/retailreturn/retaildetails', this.$qs.stringify(data),{
                    headers:{
                        staffToken:window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    console.log(res.data)
                    if (res.data.success) {
                        // console.log(res)
                        if(res.data.retailGoodsReturnList!=undefined){
                            //返回的是deliveryGoodsReturnList
                            //发生退款
                            this.flag=true
                            this.deliveryGoodList=res.data.retailGoodsReturnList                        
                        }else if(res.data.retailGoodsList!=undefined){
                            //返回的是DeliveryGoodsList
                            this.flag=false
                            this.deliveryGoodList=res.data.retailGoodsList                        
                            this.deliveryGoodList.map((item) => {
                                // item.refundCustomerNum=0
                                // item.refundCustomerPrice=null
                                this.$set(item,"refundCustomerNum",0)
                                this.$set(item,"refundCustomerPrice",null)
                            
                            })
                       }
                    }   

                })
                .catch((err) => {
                    this.$message.error(err.message)
                })
            },
            openDialog(){
                let flag=false;
                let flag2=false;
                let num = 0;
                for(let i =0;i<this.deliveryGoodList.length;i++){

                    if(this.deliveryGoodList[i].refundCustomerNum>0&&(this.deliveryGoodList[i].refundCustomerPrice<=0||this.deliveryGoodList[i].refundCustomerPrice>this.deliveryGoodList[i].retailPrice)){
                        this.$message.info(this.deliveryGoodList[i].goodsName+"的退货价格有误")
                        flag2=true
                        break
                    }else if(this.deliveryGoodList[i].refundCustomerNum>0&&this.deliveryGoodList[i].refundCustomerPrice>0){
                        num++
                    }
                }
                if(num>0){
                    flag=true
                }else{
                    if(!flag2){
                        this.$message.info("退货商品为空")
                    }
                    
                }
                this.dialogVisible=flag
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
            //判断输入框合法性
            onPriceChange(info){

                
                if(info.refundCustomerPrice>info.retailPrice){
                    this.$message.error("退货单价不能大于零售单价")
                    // info.refundCustomerPrice=info.retailPrice
                    return
                }
                if(info.refundCustomerPrice<0){
                    this.$message.error("退货单价不能为负")
                    // info.refundCustomerPrice=info.retailPrice
                }
                if(!this.isValueNumber(info.refundCustomerPrice)){
                    this.$message.error("请输入数字")
                    // info.refundCustomerPrice=info.retailPrice
                    return
                }
                
            },
            onNumChange(info){
                if(info.refundCustomerNum>info.retailNum){
                    this.$message.error("退货数量不能大于零售数量")
                    // info.refundCustomerNum=info.retailNum
                    return
              }
                if(info.refundCustomerNum<0){
                    this.$message.error("退货数量不能为负")
                    // info.refundCustomerNum=info.retailNum
                    return
                }
               
                if(!this.isValueNumber(info.refundCustomerNum)){
                    this.$message.error("请输入数字")
                    // info.refundCustomerNum=info.retailNum
                }
            },
            //获取指定页面的信息
            currentChange(currentPage){
                console.log('更改页数')
                // this.queryInfo.pageIndex = currentPage
                // this.getPartGood()
            },
            
            //提交退货
            commitReturn(){
                this.dialogVisible=false
                // this.refundCustomerList.refundCustomerNum=this.deliveryGoodList.refundCustomerNum
                // this.refundCustomerList.refundCustomerPrice=this.deliveryGoodList.refundCustomerPrice
                // console.log(this.deliveryGoodList)
                // console.log(this.deliveryGoodList)
                let currentList=[]
                for(let i=0;i<this.deliveryGoodList.length;i++){
                    currentList.push({
                        refundCustomerStockGoodsId:parseFloat(this.deliveryGoodList[i].retailStockGoodsId),
                        refundCustomerNum:parseFloat(this.deliveryGoodList[i].refundCustomerNum),
                        refundCustomerPrice:parseFloat(this.deliveryGoodList[i].refundCustomerPrice)
                    })
                }
                let data = {
                    staffId:window.sessionStorage.staffId,
                    refundCustomerRecord:JSON.stringify(this.refundCustomerRecord),
                    refundCustomerList:JSON.stringify(currentList)
                }
                console.log(data)
                this.$axios.post('/retailreturn/commit', this.$qs.stringify(data),{
                    headers:{
                        staffToken:window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    if (res.data.success) {
                        this.$message.success('提交成功')
                    }else{
                        this.$message.info('提交失败')
                    }   
                    location.reload()
                    this.$router.go(-1)
                })
                .catch((err) => {
                    this.$message.error(err.message)
                })
            },
            back(){
                this.$router.go(-1)
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
.all_img{
    width: 100px;
}
</style>