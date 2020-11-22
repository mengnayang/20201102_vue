<template>
    <div class="order_info_container">
        <!-- 面包屑导航 -->
        <el-breadcrumb>
            <el-breadcrumb-item :to="{path:'/welcome'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>库存管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单信息</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <!-- 功能区域 -->
            <el-row :gutter="10">
                <el-col :span="8">
                    <span>订单编号</span>
                    <el-select size="small" placeholder="请选择" filterable v-model="selected.selectedOrderId">
                        <el-option v-for="item in orderList" :key="item.orders_id" :value="item.orders_id" :label="item.orders_id"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="8">
                    <span>商品名称</span>
                    <el-select size="small" placeholder="请选择" filterable v-model="selected.selectedGoodName">
                        <el-option v-for="item in orderList" :key="item.orders_id" :value="item.orders_id" :label="item.goods_name"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="8">
                    <span>品牌名称</span>
                    <el-select size="small" placeholder="请选择" filterable v-model="selected.selectedBrandName">
                        <el-option v-for="item in orderList" :key="item.orders_id" :value="item.orders_id" :label="item.brand_name"></el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <span>订单状态</span>
                    <el-select size="small" placeholder="请选择" filterable v-model="selected.selectedGodownEntryStatu">
                        <el-option v-for="item in orderList" :key="item.goods_id" :value="item.godown_entry_status" :label="item.godown_entry_status">
                            <!-- <template slot-scope="scope">
                                <span v-if="scope.row.godown_entry_status==1">经理审核</span>
                                <span v-else-if="scope.row.godown_entry_status==2">财务审核付款</span>
                                <span v-else-if="scope.row.godown_entry_status==3">职工、库房管理员审核</span>
                                <span v-else-if="scope.row.godown_entry_status==4">数量质量不合格审核</span>
                                <span v-else-if="scope.row.godown_entry_status==5">已登记入库流水账</span>
                                <span v-else>失效</span>
                            </template> -->
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" size="small" @click="searchOrder()">查询</el-button>
                </el-col>
            </el-row>
            <!-- 表单区域 -->
            <el-table :data="orderList" border>
                <el-table-column label="订单编号" prop="orders_id" align="center" width="120px" fixed></el-table-column>
                <el-table-column label="商品编号" prop="goods_id" align="center" width="120px" fixed></el-table-column>
                <el-table-column label="商品名称" prop="goods_name" align="center" width="120px" fixed></el-table-column>
                <el-table-column label="商品类别" prop="goods_category" align="center"></el-table-column>
                <el-table-column label="品牌名称" prop="brand_name" align="center"></el-table-column>
                <el-table-column label="入库编号" prop="godown_entry_id" align="center" width="120px"></el-table-column>
                <el-table-column label="提交时间" prop="godown_entry_date" align="center" width="120px"></el-table-column>
                <el-table-column label="状态" prop="godown_entry_status" align="center" width="200px">
                    <template slot-scope="scope">
                        <span v-if="scope.row.godown_entry_status==1">经理审核</span>
                        <span v-else-if="scope.row.godown_entry_status==2">财务审核付款</span>
                        <span v-else-if="scope.row.godown_entry_status==3">职工、库房管理员审核</span>
                        <span v-else-if="scope.row.godown_entry_status==4">数量质量不合格审核</span>
                        <span v-else-if="scope.row.godown_entry_status==5">已登记入库流水账</span>
                        <span v-else>失效</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="80px" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="text" @click="getOrderInfo(scope.row)">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 选中的商品的信息弹框 -->
        <el-dialog title="商品信息详情" :visible.sync="lookOrderDialog" width="700px">
            <!-- 订单信息展示表单 -->
            <el-form label-width="80px">
                    <el-row>
                        <el-col :span="9">
                            <el-form-item label="商品图片"> 
                                <!-- eslint-disable-next-line -->
                                <template slot-scope="scope">
                                    <img :src="currentGood.goods_img" alt="图片">
                                </template>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="商品名称"> 
                                <el-input type="text" v-model="currentGood.goods_name" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="订单编号">
                                <el-input type="text" v-model="currentGood.orders_id" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="商品编号">
                                <el-input type="text" v-model="currentGood.goods_id" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="商品类别"> 
                                <el-input type="text" v-model="currentGood.goods_category" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="5">
                        <el-col :span="8">
                            <el-form-item label="品牌类别"> 
                                <el-input type="text" v-model="currentGood.brand_name" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="生产日期"> 
                                <el-date-picker v-model="currentGood.date_manufacture" type="date" placeholder="选择日期" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" disabled></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="入库编号"> 
                                <el-input type="text" v-model="currentGood.godown_entry_id" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="提交日期"> 
                                <el-date-picker v-model="currentGood.godown_entry_date" type="date" placeholder="选择日期" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" disabled></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="库存量"> 
                                <el-input type="text" v-model="currentGood.goods_store" :disabled="isEditOrder"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="订单状态"> 
                                <el-input type="text" v-model="currentGood.godown_entry_status" :disabled="isEditOrder">
                                    <!-- <template slot-scope="scope">
                                        <span v-if="scope.row.godown_entry_status==1">经理审核</span>
                                        <span v-else-if="scope.row.godown_entry_status==2">财务审核付款</span>
                                        <span v-else-if="scope.row.godown_entry_status==3">职工、库房管理员审核</span>
                                        <span v-else-if="scope.row.godown_entry_status==4">数量质量不合格审核</span>
                                        <span v-else-if="scope.row.godown_entry_status==5">已登记入库流水账</span>
                                        <span v-else>失效</span>
                                    </template> -->
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="单位"> 
                                <el-input type="text" v-model="currentGood.unit" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="保质期/天"> 
                                <el-input type="text" v-model="currentGood.shelf_life" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="售价/元"> 
                                <el-input type="text" v-model="currentGood.goods_price" :disabled="isEditOrder"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="规格"> 
                                <el-input type="text" v-model="currentGood.standards" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="shutDialog()">取消</el-button>
                <el-button type="success" @click="editDialog()">{{statusExchange}}</el-button>
            </span>
        </el-dialog>
        <el-pagination :current-page="queryInfo.pageIndex" :page-sizes="[queryInfo.infoCount]" :page-size="queryInfo.infoCount"
            @current-change="currentChange" :total="queryInfo.total"
            layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
    </div>
</template>

<script>
    export default{
        name:'OrderInfo',
        data() {
            return{
                //获取部分订单的先决条件
                queryInfo:{
                    total:50,
                    pageIndex:1,
                    infoCount:3
                },
                //部分订单列表
                orderList:[],
                //当前查看的商品信息
                currentGood:'',
                //设置是否显示订单的详情弹框
                lookOrderDialog:false,
                //指定订单查询需求
                selected:{
                    selectedOrderId:'',
                    selectedGoodName:'',
                    selectedBrandName:'',
                    selectedGodownEntryStatu:''
                },
                //是否允许编辑订单
                isEditOrder:true,
                //编辑状态下的字体转换
                statusExchange:'编辑',
                flag: 0
            }  
        },
        mounted() {
            this.getPartOrder()
        },
        methods:{
            //初始获取部分订单
            getPartOrder() {
                this.$axios.post('/orders/ordersInfo',this.selected)
                .then((res) => {
                    this.orderList = res.data.obj
                    //console.log(this.orderList)
                })
                .catch((err) => {
                    this.$message.error(err)
                })
            },
            //查询指定需求的订单
            searchOrder() {
                this.$axios.post('/orders/searchOrder',this.selected)
                .then((res) => {
                    this.orderList = res.data.obj
                })
                .catch((err) => {
                    this.$message.error(err)
                })
            },
            //获取指定订单的信息
            getOrderInfo(good) {
                //console.log(this.currentGood)
                this.currentGood = good
                this.lookOrderDialog = true
            },
            //关闭订单信息弹框
            shutDialog() {
                this.lookOrderDialog = false
                this.flag = 0
                this.statusExchange = '编辑'
                this.isEditOrder = true
            },
            //编辑订单
            editDialog() {
                if (this.flag == 0) {
                    this.isEditOrder = false
                    this.statusExchange = '确认'
                    this.flag += 1
                } else {
                    this.$message.success('订单信息修改成功')
                    this.flag = 0
                    this.lookOrderDialog = false
                    this.isEditOrder = true
                }
            },
            // 获取指定页面的信息
            currentChange(currentPage) {
                this.queryInfo.pageIndex = currentPage
                this.getPartOrder()
            }
        }
    }
</script>

<style lang="less" scoped>
.el-card{
    margin-top: 10px;
    box-shadow: 0 1px 1px  rgba(0, 0, 0, 0.15);
    .el-row{
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