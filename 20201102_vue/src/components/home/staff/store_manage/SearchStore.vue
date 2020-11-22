<template>
    <div class="search_store_container">
        <!-- 面包屑导航 -->
        <el-breadcrumb>
            <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>库存管理</el-breadcrumb-item>
            <el-breadcrumb-item>查库存</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <!-- 功能区域 -->
            <el-row :gutter="10">
                <el-col :span="8">
                    <span>商品编号</span>
                    <el-select v-model="selected.selectedGoodId" filterable placeholder="请选择" size="small">
                        <el-option v-for="item in goodList" :label="item.goods_id" :key="item.goods_id" :value="item.goods_id"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="8">
                    <span>商品名称</span>
                    <el-select v-model="selected.selectedGoodName" filterable placeholder="请选择" size="small">
                        <el-option v-for="item in goodList" :label="item.goods_name" :key="item.goods_id" :value="item.goods_name"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="8">
                    <span>商品类别</span>
                    <el-select v-model="selected.selectedGoodCategory" filterable placeholder="请选择" size="small">
                        <el-option v-for="item in goodList" :label="item.goods_category" :key="item.goods_id" :value="item.goods_category"></el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="8">
                    <span>品牌类别</span>
                    <el-select v-model="selected.selectedBrandName" filterable placeholder="请选择" size="small">
                        <el-option v-for="item in goodList" :label="item.brand_name" :key="item.goods_id" :value="item.brand_name"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" size="small" @click="searchGood()">查询</el-button>
                </el-col>
            </el-row>
            <!-- 列表区域 -->
            <el-table :data="goodList" border>
                <el-table-column label="商品图片" fixed width="100" align="center">
                    <template slot-scope="scope">
                        <img :src="scope.row.goods_img" width="30px" height="20px" alt="图片">
                    </template>
                </el-table-column>
                <el-table-column label="商品编号" prop="goods_id" fixed width="120" align="center"></el-table-column>
                <el-table-column label="商品名称" prop="goods_name" fixed width="120" align="center"></el-table-column>
                <el-table-column label="商品类别" prop="goods_category" width="120" align="center"></el-table-column>
                <el-table-column label="品牌类别" prop="brand_name" width="120" align="center"></el-table-column>
                <el-table-column label="库存量" prop="goods_store" width="80" align="center"></el-table-column>
                <el-table-column label="保质期/天" prop="shelf_life" width="90" align="center"></el-table-column>
                <el-table-column label="售价/元" prop="goods_price" width="80" align="center"></el-table-column>
                <el-table-column label="生产日期" prop="date_manufacture" width="180" align="center"></el-table-column>
                <el-table-column label="单位" prop="unit" width="80" align="center"></el-table-column>
                <el-table-column label="规格" prop="standards" width="80" align="center"></el-table-column>
                <el-table-column label="操作" fixed="right" width="120" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="getGoodInfo(scope.row)">查看</el-button>
                        <el-button type="text" @click="editGoodInfo(scope.row)">修改</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 查看商品信息弹框 -->
            <el-dialog title="商品信息详情" :visible.sync="lookGoodDialog" width="700px">
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
                                <el-input type="text" v-model="currentGood.goods_name"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="商品编号">
                                <el-input type="text" v-model="currentGood.goods_id"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="商品类别"> 
                                <el-input type="text" v-model="currentGood.goods_category"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="品牌类别"> 
                                <el-input type="text" v-model="currentGood.brand_name"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="100">
                        <el-col :span="10">
                            <el-form-item label="生产日期"> 
                                <el-date-picker v-model="currentGood.date_manufacture" type="date" placeholder="选择日期" format="yyyy年MM月dd日" value-format="yyyy-MM-dd"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="库存量"> 
                                <el-input type="text" v-model="currentGood.goods_store"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="5">
                            <el-form-item label="保质期/天"> 
                                <el-input type="text" v-model="currentGood.shelf_life"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="售价/元"> 
                                <el-input type="text" v-model="currentGood.goods_price"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="规格"> 
                                <el-input type="text" v-model="currentGood.standards"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="单位"> 
                                <el-input type="text" v-model="currentGood.unit"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dislog-footer">
                    <el-button type="primary" @click="shutDialog()">取消</el-button>
                </span>
            </el-dialog>
            <!-- 修改商品信息弹框 -->
            <el-dialog title="修改商品信息" :visible.sync="editGoodDialog" width="700px">
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
                                <el-input type="text" v-model="currentGood.goods_name"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="商品编号">
                                <el-input type="text" v-model="currentGood.goods_id"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="商品类别"> 
                                <el-input type="text" v-model="currentGood.goods_category"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="品牌类别"> 
                                <el-input type="text" v-model="currentGood.brand_name"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="100">
                        <el-col :span="10">
                            <el-form-item label="生产日期"> 
                                <el-date-picker v-model="currentGood.date_manufacture" type="date" placeholder="请选择日期" format="yyyy年MM月dd日" value-format="yyyy-MM-dd"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="库存量"> 
                                <el-input type="text" v-model="currentGood.goods_store"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="5">
                            <el-form-item label="保质期/天"> 
                                <el-input type="text" v-model="currentGood.shelf_life"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="售价/元"> 
                                <el-input type="text" v-model="currentGood.goods_price"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="规格"> 
                                <el-input type="text" v-model="currentGood.standards"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="单位"> 
                                <el-input type="text" v-model="currentGood.unit"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dislog-footer">
                    <el-button type="primary" @click="shutDialog()">取消</el-button>
                    <el-button type="success" @click="confirmDialog()">确认修改</el-button>
                </span>
            </el-dialog>
        </el-card>
        <el-pagination :current-page="queryInfo.pageIndex" :page-sizes="[3]" :page-size="3" 
            @current-change="currentChange"
            layout="total, sizes, prev, pager, next, jumper" :total="queryInfo.total">
        </el-pagination>
    </div>
</template>

<script>
    export default{
        name:'SearchStore',
        data() {
            return{
                //商品信息
                goodList:[],
                //指定商品需求
                selected:{
                    selectedGoodId:'',
                    selectedGoodName:'',
                    selectedGoodCategory:'',
                    selectedBrandName:''
                },
                //设置查看商品信息的弹窗是否可见
                lookGoodDialog:false,
                //设置修改商品信息的弹窗是否可见
                editGoodDialog:false,
                //当前操作的商品信息
                currentGood:'',
                //分页信息
                queryInfo:{
                    pageIndex:1,
                    infoCount:3,
                    total:50
                }
            }
        },
        mounted(){
            this.getPartGood()
        },
        methods:{
            //初始获取部分商品
            getPartGood() {
                console.log(this.queryInfo.pageIndex)
                console.log(this.queryInfo.infoCount)
                this.$axios.post('/goods/goodsInfo', this.queryInfo)
                .then((res) => {
                    //console.log(res.data.obj)
                    this.goodList = res.data.obj
                })
                .catch((res) => {
                    this.$message.error(err)
                })
            },
            //查询指定需求的商品
            searchGood(){
                this.$axios.post('/goods/searchGood',this.selected)
                .then((res) => {
                    this.goodList = res.data.obj
                    //console.log(res)
                })
                .catch((err) => {
                    this.$message.error(err)
                })
            },
            //获取指定商品的信息
            getGoodInfo(good) {
                //console.log(good)
                this.lookGoodDialog = true
                this.currentGood = good
            },
            //修改指定商品信息
            editGoodInfo(good) {
                this.editGoodDialog = true,
                this.currentGood = good
                //console.log(this.currentGood)
            },
            //关闭修改商品信息弹窗
            shutDialog(){
                this.editGoodDialog = false
                this.lookGoodDialog = false
            },
            //确认修改商品信息弹窗
            confirmDialog() {
                this.editGoodDialog = false
                console.log(this.currentGood)
                this.$message.success('修改成功')
            },
            //获取指定页面的信息
            currentChange(currentPage){
                this.queryInfo.pageIndex = currentPage
                this.getPartGood()
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
</style>