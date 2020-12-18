<template>
    <div class="search_store_container">
        <!-- 面包屑导航 -->
        <el-breadcrumb>
            <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>库存信息</el-breadcrumb-item>
            <el-breadcrumb-item>查库存</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <!-- 功能区域 -->
            <el-row v-show="isFirst">
                <el-col :span="2">
                    <span>商品编号:</span>
                </el-col>
                <el-col :span="5">
                    <el-input v-model="selected.selectedGoodsId" size="mini"></el-input>
                </el-col>
                <el-col :span="2" :offset="1">
                    <span>商品名称:</span>
                </el-col>
                <el-col :span="5">
                    <el-input v-model="selected.selectedGoodsName" size="mini"></el-input>
                </el-col>
                <el-col :span="7" :offset="1">
                    <span>商品类别:</span>
                    <el-select v-model="selected.selectedCategoryId" placeholder="请选择" size="mini">
                        <el-option :key="1000" label="全部" :value="1000"></el-option>
                        <el-option v-for="item in categoryList" :label="item.categoryName" :key="item.categoryId" :value="item.categoryId"></el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row v-show="isFirst">
                <el-col :span="2">
                    <span>品牌类别:</span>
                </el-col>
                <el-col :span="5">
                    <el-input v-model="selected.selectedGoodsBrand" size="mini"></el-input>
                </el-col>
                <el-col :span="12" :offset="1">
                    <el-button type="primary" size="mini" @click="searchGood()">查询</el-button>
                    <el-button v-for="func in functionList_three" :key="func.functionId" :type="func.btnType" size="mini"  @click="addNewGoodInfo()">{{func.functionName}}</el-button>
                </el-col>
            </el-row>
            <el-row v-show="isSecond">
                <el-button type="primary" size="mini" @click="rollback()" :disabled="isFirst">返回上一层</el-button>
            </el-row>
            <!-- 列表区域 -->
            <!-- 一级 -->
            <el-table :data="isLazzy ? goodsStockNumList : goodList" border v-show="isFirst">
                <el-table-column label="商品图片" fixed width="220" align="center">
                    <template slot-scope="scope">
                        <img :src="'http://localhost:8080' + scope.row.goodsPicture" alt="图片" class="all_img">  
                    </template>
                </el-table-column>
                <el-table-column label="商品编号" prop="goodsId" fixed width="140" align="center"></el-table-column>
                <el-table-column label="商品名称" prop="goodsName" width="180" align="center"></el-table-column>
                <el-table-column label="商品类别" prop="goodsCategory" width="120" align="center">
                    <template slot-scope="scope">
                        <span v-for="item in categoryList" :key="item.categoryId">
                            <span v-if="scope.row.goodsCategoryId == item.categoryId">{{item.categoryName}}</span>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="品牌类别" prop="goodsBrand" width="120" align="center"></el-table-column>
                <el-table-column label="库存量" prop="stockInventoryNum" width="80" align="center"></el-table-column>
                <el-table-column label="规格" prop="goodsSpecifications" width="100" align="center"></el-table-column>
                <el-table-column label="操作" fixed="right" width="140" align="center">
                    <template slot-scope="scope">
                        <el-button-group v-for="func in functionList_one" :key="func.functionId">
                            <el-tooltip effect="light" placement="top" :content="func.functionName" :enterable="false">
                                <el-button :type="func.btnType" size="mini" :icon="func.btnIcon" @click="getButtonStatus(scope.row,func.functionWeight)"></el-button>
                            </el-tooltip>
                        </el-button-group>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 二级 -->
            <el-table :data="goodDetailList" border v-show="isSecond">
                <el-table-column label="超市商品编号" prop="stockGoodsId" fixed width="150" align="center"></el-table-column>
                <el-table-column label="仓库编号" prop="stockId" fixed width="80" align="center"></el-table-column>
                <el-table-column label="产品编号" prop="stockGoodsId" width="150" align="center"> </el-table-column>
                <el-table-column label="销售单位" prop="stockUnitId" width="90" align="center">
                    <template slot-scope="scope">
                        <span v-for="item in unitList" :key="item.unitId">
                            <span v-if="item.unitId == scope.row.stockUnitId">{{item.unitName}}</span>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="产品批号" prop="stockGoodsBatchNumber" width="100" align="center"></el-table-column>
                <el-table-column label="生产日期" prop="stockGoodsProductionDate" width="130" align="center"></el-table-column>
                <el-table-column label="保质期" prop="stockGoodsShelfLife" width="100" align="center"></el-table-column>
                <el-table-column label="售价" prop="stockGoodsPrice" width="100" align="center"></el-table-column>
                <el-table-column label="实时库存" prop="stockInventory" width="100" align="center"></el-table-column>
                <el-table-column label="操作" fixed="right" width="150" align="center">
                    <template slot-scope="scope">
                        <el-button-group v-for="func in functionList_two" :key="func.functionId">
                            <el-tooltip effect="light" placement="top" :content="func.functionName" :enterable="false">
                                <el-button :type="func.btnType" size="mini" :icon="func.btnIcon" @click="getButtonStatus(scope.row,func.functionWeight)"></el-button>
                            </el-tooltip>
                        </el-button-group>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 查看商品信息弹框 -->
            <el-dialog title="商品信息详情" :visible.sync="lookGoodDialog" width="800px">
                <el-form label-width="100px">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="商品图片"> 
                                <template>
                                    <img :src="'http://localhost:8080' + currentGood.goodsPicture" alt="图片" class="all_img">  
                                </template>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="7">
                            <el-form-item label="商品编号:"> 
                                <span>{{currentGood.goodsId}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" :offset="1">
                            <el-form-item label="超市商品编号:">
                                <span>{{currentGood.stockGoodsId}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7" :offset="1">
                            <el-form-item label="商品名称:"> 
                                <span>{{currentGood.goodsName}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="7">
                            <el-form-item label="生产日期:"> 
                                <span>{{currentGood.stockGoodsProductionDate}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" :offset="1">
                            <el-form-item label="商品类别:"> 
                                <template>
                                    <span v-for="item in categoryList" :key="item.categoryId">
                                        <span v-if="item.categoryId == currentGood.goodsCategoryId">{{item.categoryName}}</span>
                                    </span>
                                </template>
                            </el-form-item>   
                        </el-col>
                        <el-col :span="7" :offset="1">
                            <el-form-item label="品牌类别:"> 
                                <span>{{currentGood.goodsBrand}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="7">
                            <el-form-item label="售价/元:"> 
                                <span>{{currentGood.stockGoodsPrice}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" :offset="1">
                            <el-form-item label="实时库存:"> 
                                <span>{{currentGood.stockInventory}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7" :offset="1">
                            <el-form-item label="保质期/天:"> 
                                <span>{{currentGood.stockGoodsShelfLife}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="7">
                            <el-form-item label="单位:"> 
                                <template>
                                    <span v-for="item in unitList" :key="item.unitId">
                                        <span v-if="item.unitId == currentGood.stockUnitId">{{item.unitName}}</span>
                                    </span>
                                </template>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" :offset="1">
                            <el-form-item label="规格:"> 
                                <span>{{currentGood.goodsSpecifications}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dislog-footer">
                    <el-button type="primary" size="small" @click="shutDialog()">取消</el-button>
                </span>
            </el-dialog>
            <!-- 修改商品信息弹框 -->
            <el-dialog title="修改商品信息" :visible.sync="editGoodDialog" width="700px">
                <el-form label-width="100px">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="商品图片"> 
                                <template>
                                    <img :src="'http://localhost:8080' + currentGood.goodsPicture" alt="图片" class="all_img">  
                                </template>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="10">
                            <el-form-item label="商品编号:"> 
                                <el-input auto-complete="off" v-model="currentGood.goodsId" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10" :offset="1">
                            <el-form-item label="超市商品编号:">
                                <el-input auto-complete="off" v-model="currentGood.stockGoodsId" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="10">
                            <el-form-item label="商品名称:"> 
                                <el-input auto-complete="off" v-model="currentGood.goodsName" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10" :offset="1">
                            <el-form-item label="入库编号:"> 
                                <el-input auto-complete="off" v-model="currentGood.stockExportBillId" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="10">
                            <el-form-item label="品牌类别:"> 
                                <el-input auto-complete="off" v-model="currentGood.goodsBrand" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10" :offset="1">
                            <el-form-item label="商品类别:"> 
                                <el-select v-model="currentGood.goodsCategoryId" disabled>
                                    <el-option v-for="item in categoryList" :key="item.categoryId" :label="item.categoryName" :value="item.categoryId"></el-option>
                                </el-select>
                            </el-form-item>   
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="10">
                            <el-form-item label="生产日期:"> 
                                <el-input auto-complete="off" v-model="currentGood.stockGoodsProductionDate" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10" :offset="1">
                            <el-form-item label="实时库存:"> 
                                <el-input auto-complete="off" v-model="currentGood.stockInventory" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="10">
                            <el-form-item label="保质期/天:"> 
                                <el-input auto-complete="off" v-model="currentGood.stockGoodsShelfLife" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10" :offset="1">
                            <el-form-item label="售价/元:" prop="stockGoodsPrice"> 
                                <el-input type="number" auto-complete="off" v-model.number="currentGood.stockGoodsPrice"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="10">
                            <el-form-item label="规格:"> 
                                <el-input auto-complete="off" v-model="currentGood.goodsSpecifications" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10" :offset="1">
                            <el-form-item label="单位:"> 
                                <template>
                                    <el-select v-model="currentGood.stockUnitId" disabled>
                                        <el-option v-for="item in unitList" :key="item.unitId" :label="item.unitName" :value="item.unitId" ></el-option>
                                    </el-select>
                                </template>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dislog-footer">
                    <el-button type="success" size="small" @click="confirmDialog()">修改</el-button>
                    <el-button type="primary" size="small" @click="shutDialog()">取消</el-button>
                </span>
            </el-dialog>
            <!-- 补充新商品 -->
            <el-dialog title="新货补充" :visible.sync="addNewGoodDialog" width="600px">
                <el-form label-width="100px" ref="newGoodRef">
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="商品编号:" prop="goodsId">
                                <el-input v-model.number="currentGood.goodsId" auto-complete="off"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11" :offset="1">
                            <el-form-item label="商品名称:" prop="goodsName">
                                 <el-input v-model="currentGood.goodsName" auto-complete="off"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="品牌名称:" prop="goodsBrand">
                                <el-input v-model="currentGood.goodsBrand" auto-complete="off"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11" :offset="1">
                            <el-form-item label="商品类别:">
                                <template>
                                     <el-select v-model="currentGood.goodsCategoryId">
                                        <el-option v-for="item in categoryList" :key="item.categoryId" :label="item.categoryName" :value="item.categoryId" ></el-option>
                                    </el-select>
                                </template>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="单位:">
                                <template>
                                     <el-select v-model="currentGood.goodsUnit">
                                        <el-option v-for="item in unitList" :key="item.unitId" :label="item.unitName" :value="item.unitId" ></el-option>
                                    </el-select>
                                </template>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11" :offset="1">
                            <el-form-item label="规格:">
                                <el-input v-model="currentGood.goodsSpecifications" auto-complete="off"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="订货量:">
                                <el-input v-model="currentGood.stockOrderNum" auto-complete="off" :min="0"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11" :offset="1">
                            <el-form-item label="上传图片">
                                <input type="file" accept="image/*" multiple  @change="handImage">
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dislog-footer">
                    <el-button type="primary" size="small" @click="addNewGood()">新增</el-button>
                    <el-button type="primary" size="small" @click="addNewGoodDialog = false">取消</el-button>
                </span>
            </el-dialog>
            <!-- 补充旧商品 -->
            <el-dialog title="旧货补充" :visible.sync="addOldGoodDialog" width="600px">
                <el-form label-width="80px">
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="商品编号:">
                                <el-input v-model="currentGood.goodsId" auto-complete="off" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11" :offset="1">
                            <el-form-item label="商品名称:">
                                 <el-input v-model="currentGood.goodsName" auto-complete="off" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="品牌名称:">
                                <el-input v-model="currentGood.goodsBrand" auto-complete="off" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11" :offset="1">
                            <el-form-item label="商品类别:">
                                <template>
                                     <el-select v-model="currentGood.goodsCategoryId" disabled>
                                        <el-option v-for="item in categoryList" :key="item.categoryId" :label="item.categoryName" :value="item.categoryId" ></el-option>
                                    </el-select>
                                </template>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="单位:">
                                <template>
                                     <el-select v-model="currentGood.goodsUnit">
                                        <el-option v-for="item in unitList" :key="item.unitId" :label="item.unitName" :value="item.unitId"></el-option>
                                    </el-select>
                                </template>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11" :offset="1">
                            <el-form-item label="规格:">
                                <el-input v-model="currentGood.goodsSpecifications" auto-complete="off"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="库存量">
                                <el-input v-model="currentGood.stockInventoryNum" auto-complete="off" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11" :offset="1">
                            <el-form-item label="订货量" required>
                                <el-input type="number" v-model.number="currentGood.stockOrderNum" auto-complete="off"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dislog-footer">
                    <el-button type="success" size="small" @click="addOldGood()">补充</el-button>
                        <el-button type="primary" size="small" @click="addOldGoodDialog = false">取消</el-button>
                </span>
            </el-dialog>
        </el-card>
        <el-pagination :current-page="queryInfo.pageIndex" :page-sizes="[queryInfo.infoCount]" :page-size="queryInfo.infoCount" 
            @current-change="currentChange"
            layout="total, sizes, prev, pager, next, jumper" :total="queryInfo.total" v-if="isFirst">
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
                //详细商品信息
                goodDetailList:[],
                //单位列表
                unitList:[],
                //显示列表一
                isFirst:true,
                // 显示列表二
                isSecond:false,
                //指定商品需求
                selected:{
                    selectedGoodsId:"",
                    selectedGoodsName:"",
                    selectedCategoryId:"",
                    selectedGoodsBrand:""
                },
                //商品类别列表
                categoryList:[],
                //设置查看商品信息的弹窗是否可见
                lookGoodDialog:false,
                //设置修改商品信息的弹窗是否可见
                editGoodDialog:false,
                //设置旧货补充信息的弹窗是否可见
                addNewGoodDialog:false,
                //设置旧货补充信息的弹窗是否可见
                addOldGoodDialog:false,
                //当前操作的商品信息
                currentGood:'',
                //分页信息
                queryInfo:{
                    pageIndex:1,
                    infoCount:5,
                    total:0
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
                //三级功能菜单
                functionList_three:[],
                //绘制按钮
                isDraw:false,
                // 保留时间戳
                tempTime:'',
                // 保留第一条记录的stockId
                tempStockId:'',
                // 模糊查询的列表(查库存)
                goodsStockNumList:[],
                // 是否进行模糊查询
                isLazzy:false,
                // 存储第一层列表信息，便于第二层刷新
                tempGood:'',
                flag : 0
            }
        },
        created(){
            this.getPartGood(),
            this.selected.selectedCategoryId = 1000
        },
        methods:{
            //初始获取部分商品
            getPartGood() {
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
                this.$axios.post('/showinventory', this.$qs.stringify(data),{
                    headers:{
                        staffToken:window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    if (res.data.success) {
                        this.goodList = res.data.goodsStockNumList
                        this.queryInfo.total = res.data.recordSum
                        this.functionList = res.data.functionList
                        this.categoryList = res.data.categoryList
                        this.drawBtn()
                    } else {
                        this.$message.error(res.data.errMsg)
                    }
                })
                .catch((err) => {
                    this.$message.error(err.message)
                })
            },
            //动态渲染按钮
            drawBtn() {
                //渲染功能按钮
                    if(!this.isDraw) {
                        for (let i = 0; i < this.functionList.length; i++) {
                            if (this.functionList[i].functionWeight == 4) {
                                this.$set(this.functionList[i],"btnType","danger")
                                this.$set(this.functionList[i],"btnIcon","iconfont icon_add")
                                this.functionList_three.push(this.functionList[i])
                            } else if (this.functionList[i].functionWeight == 2) {
                                this.$set(this.functionList[i],"btnType","success")
                                this.$set(this.functionList[i],"btnIcon","iconfont icon_edit")
                                this.functionList_two.push(this.functionList[i])
                            } else if (this.functionList[i].functionWeight == 1) {
                                this.$set(this.functionList[i],"btnType","primary")
                                this.$set(this.functionList[i],"btnIcon","iconfont icon_look")
                                this.functionList_two.push(this.functionList[i])
                            } else if (this.functionList[i].functionWeight == 3) {
                                this.$set(this.functionList[i],"btnType","primary")
                                this.$set(this.functionList[i],"btnIcon","iconfont icon_look")
                                this.functionList_one.push(this.functionList[i])
                            } else if (this.functionList[i].functionWeight == 5) {
                                this.$set(this.functionList[i],"btnType","danger")
                                this.$set(this.functionList[i],"btnIcon","iconfont icon_add")
                                this.functionList_one.push(this.functionList[i])
                            }
                            this.isDraw = true
                        }
                    }
            },
            //返回上一层
            rollback() {
                this.isSecond = false,
                this.isFirst = true
            },
            //查询指定需求的商品
            searchGood(){
                this.selected.selectedGoodsId = this.selected.selectedGoodsId == "" ? null : this.selected.selectedGoodsId
                this.selected.selectedGoodsBrand = this.selected.selectedGoodsBrand == "" ? null : this.selected.selectedGoodsBrand
                this.selected.selectedCategoryId = this.selected.selectedCategoryId == 1000 ? null : this.selected.selectedCategoryId
                this.selected.selectedCategoryId = this.selected.selectedCategoryId == "" ? null : this.selected.selectedCategoryId
                this.selected.selectedGoodsName = this.selected.selectedGoodsName == "" ? null : this.selected.selectedGoodsName

                let goods = {
                    goodsId:this.selected.selectedGoodsId,
                    goodsBrand:this.selected.selectedGoodsBrand,
                    goodsCategoryId:this.selected.selectedCategoryId,
                    goodsName:this.selected.selectedGoodsName
                }
                let data = {
                    goods : JSON.stringify(goods),
                    staffId: window.sessionStorage.getItem('staffId'),
                    pageSize:this.queryInfo.infoCount,
                    pageIndex:this.queryInfo.pageIndex-1
                }
                this.$axios.post('/showinventory/findByConditions',this.$qs.stringify(data), {
                    headers:{
                        staffToken: window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    if (res.data.success) {
                        this.categoryList = res.data.categoryList
                        this.goodsStockNumList = res.data.goodsStockNumList
                        this.queryInfo.total = res.data.recordSum
                        this.isLazzy = true
                    } else {
                        this.$message.error(res.data.errMsg)
                    }
                })
                .catch((err) => {
                    this.$message.error(err.message)
                })
            },
            //获取按钮功能
            getButtonStatus(good,functionWeight) {
                if (functionWeight == 1) {
                    this.getGoodInfo(good)
                } else if (functionWeight == 2) {
                    this.editGoodInfo(good)
                } else if (functionWeight == 3) {
                    this.getAllGoodInfo(good)
                } else if (functionWeight == 5) {
                    this.addOldGoodInfo(good)
                }
            },
            //新货补充窗口
            addNewGoodInfo() {
                //将当前的商品信息置空，因多处用到，防止数据错乱
                this.currentGood = []
                let data = {}
                this.$axios.post('/showinventory/newgoods', this.$qs.stringify(data),{
                    headers:{
                        staffToken: window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    if (res.data.success) {
                        this.categoryList = res.data.categoryList
                        this.unitList = res.data.unitList
                    } else {
                        this.$message.error(res.data.errMsg)
                    }
                })
                .catch((err) => {
                    this.$message.error(err.message)
                })
                this.addNewGoodDialog = true
            },
            handImage(e) {
            //     let self = this;
            //     let reader = new FileReader();
            //     reader.readAsDataURL(e.target.files[0]);
            //     reader.onload = function (e) {
            //         self.headImg = e.target.result; 
            //         self.currentGood.goodsPicture = self.headImg
            //     }   
            console.log(e)
                console.log(e.target.files[0])
                this.currentGood.goodsPicture=e.target.files[0]
            },
            dataURItoBlob(dataURI) {
                var byteString = atob(dataURI.split(',')[1]);
                var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
                var ab = new ArrayBuffer(byteString.length);
                var ia = new Uint8Array(ab);
                for (var i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                return new Blob([ab], {type: mimeString});
            },
            //新货补充
            addNewGood() {
                let flag = this.onNumChange('商品编号',this.currentGood.goodsId)
                if (flag == -1) {
                    return
                }
                flag = this.onNumChange('商品名称',this.currentGood.goodsName)
                if (flag == -1) {
                    return
                }
                flag = this.onNumChange('品牌名称',this.currentGood.goodsBrand)
                if (flag == -1) {
                    return
                }
                flag = this.onNumChange('规格',this.currentGood.goodsSpecifications)
                if (flag == -1) {
                    return
                }
                flag = this.onNumChange('订货量',this.currentGood.stockOrderNum)
                if (flag == -1) {
                    return
                }
                // var fd = new FormData();
                // var blob = this.dataURItoBlob(this.currentGood.goodsPicture);
                
                let goods = {
                    goodsId: this.currentGood.goodsId,
                    goodsName: this.currentGood.goodsName,
                    goodsCategoryId:this.currentGood.goodsCategoryId,
                    goodsBrand:this.currentGood.goodsBrand,
                    goodsSpecifications:this.currentGood.goodsSpecifications,
                    // goodsPicture:blob
                    goodsPicture:null
                }
                let coupon = {
                    couponGoodsId:this.currentGood.goodsId,
                    couponUnitId:this.currentGood.goodsUnit,
                    couponNum:this.currentGood.stockOrderNum,
                    couponStaffId: window.sessionStorage.getItem("staffId")
                }
                let data = {
                    staffId: window.sessionStorage.getItem('staffId'),
                    goods: JSON.stringify(goods),
                    coupon: JSON.stringify(coupon)
                }
                let config = {
                    headers: {
                        staffToken: window.sessionStorage.getItem('staffToken'),
                        // processData : false,  //必须false才会避开jQuery对 formdata 的默认处理   
                        // contentType : false,  //必须false才会自动加上正确的Content-Type
                    }
                }
                var formData = new FormData();
                formData.append('image',this.currentGood.goodsPicture);
                console.log(this.currentGood.goodsPicture);
                formData.append('staffId', window.sessionStorage.getItem('staffId'));
                formData.append('goods', JSON.stringify(goods));
                formData.append('coupon', JSON.stringify(coupon));
                this.$axios.post(
                    '/showinventory/newgoodscommit',
                    formData,
                    config
                )
                // fd.append('goods',JSON.stringify(goods))
                // fd.append('coupon',JSON.stringify(coupon))
                // fd.append('staffId',window.sessionStorage.getItem('staffId'))
                // console.log(fd.get('goods'))
                //this.$axios.post('/showinventory/newgoodscommit',this.$qs.stringify(data),config)
                .then((res) => {
                    if (res.data.success) {
                        this.$message.success('添加成功')
                        this.getPartGood()
                    } else {
                        this.$message.error(res.data.errMsg)
                    }
                })
                .catch((err) => {
                    this.$message.error(err.message)
                })
                this.addNewGoodDialog = false
            },
            //获取指定商品的商品库存表
            getAllGoodInfo(good) {
                this.tempGood = good
                this.isFirst = false
                this.isSecond = true
                let data = {
                    goodsId: good.goodsId,
                    userId: window.sessionStorage.getItem('staffId'),
                    stockGoodsId:1
                }
                this.$axios.post('/showinventory/examine', this.$qs.stringify(data),{
                    headers:{
                        staffToken: window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    if (res.data.success) {
                        if (res.data.success) {
                            this.goodDetailList = res.data.stockList;
                            this.unitList = res.data.unitList;
                            this.goodDetailList.map(item=>{
                                var data = new Date(item.stockGoodsProductionDate);
                                item.stockGoodsProductionDate = data.getFullYear() + "-" + (data.getMonth() + 1) + "-" + data.getDate();
                            })
                        } else {
                            this.$message.error(res.data.errMsg)
                        }
                    } else {
                        this.$message.error(res.data.errMsg)
                    }
                })
                .catch((err) => {
                    this.$message.error(err.message)
                })
            },
            //获取指定商品的信息
            getGoodInfo(good) {
                let data = {
                    stockGoodsId:good.stockGoodsId
                }
                this.$axios.post('/showinventory/goodsdetails', this.$qs.stringify(data),{
                    headers:{
                        staffToken: window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    if (res.data.success) {
                        this.currentGood = res.data.goodsStockA
                        //时间转换
                        let data = new Date(this.currentGood.stockGoodsProductionDate);
                        this.currentGood.stockGoodsProductionDate = data.getFullYear() + "-" + (data.getMonth() + 1) + "-" + data.getDate();
                    } else {
                        this.$message.error(res.data.errMsg)
                    }
                })
                .catch((err) => {
                    this.$message.error(err.message)
                })
                this.lookGoodDialog = true
            },
            //修改指定商品信息
            editGoodInfo(good) {
                this.tempStockId = good.stockId
                let data = {
                    stockGoodsId:good.stockGoodsId
                }
                this.$axios.post('/showinventory/goodsdetails', this.$qs.stringify(data),{
                    headers:{
                        staffToken: window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    if (res.data.success) {
                        this.currentGood = res.data.goodsStockA
                        this.tempTime = this.currentGood.stockGoodsProductionDate
                        //时间转换
                        let data = new Date(this.currentGood.stockGoodsProductionDate);
                        this.currentGood.stockGoodsProductionDate = data.getFullYear() + "-" + (data.getMonth() + 1) + "-" + data.getDate();
                    } else {
                        this.$message.error(res.data.errMsg)
                    }
                })
                .catch((err) => {
                    this.$message.error(err.message)
                })
                this.editGoodDialog = true
            },
            //关闭修改商品信息弹窗
            shutDialog(){
                this.editGoodDialog = false
                this.lookGoodDialog = false
            },
            //确认修改商品信息弹窗
            confirmDialog() {
                this.flag = this.onNumChange('售价', this.currentGood.stockGoodsPrice)
                if (this.flag == -1) {
                    return 
                }
                this.editGoodDialog = false
                let stock = {
                    stockGoodsId:this.currentGood.stockGoodsId,
                    stockId:this.tempStockId,
                    goodsStockId:this.currentGood.goodsId,
                    stockUnitId:this.currentGood.stockUnitId,
                    stockGoodsBatchNumber:this.currentGood.stockGoodsBatchNumber,
                    stockGoodsProductionDate:this.tempTime,
                    stockGoodsShelfLife:this.currentGood.stockGoodsShelfLife,
                    stockGoodsPrice:this.currentGood.stockGoodsPrice,
                    stockInventory:this.currentGood.stockInventory,
                    stockExportBillId:this.currentGood.stockExportBillId
                }
                let data = {
                    stock: JSON.stringify(stock),
                    stockGoodsPrice: this.currentGood.stockGoodsPrice
                }
                this.$axios.post('/showinventory/modifygoods', this.$qs.stringify(data),{
                    headers:{
                        staffToken: window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    if(res.data.success) {
                        this.$message.success('修改成功')
                        this.getAllGoodInfo(this.tempGood)
                        this.flag = 0
                    } else {
                        this.$message.error(res.data.errMsg)
                    }
                })
                .catch((err) => {
                        this.$message.error(err.message)
                })
            },
            //旧货补充窗口
            addOldGoodInfo(good) {
                let data = {
                    goodsId: good.goodsId,
                    secondaryMenuId: this.secondaryMenuId
                }
                this.$axios.post('/showinventory/newgoods',this.$qs.stringify(data),{
                    headers:{
                        staffToken: window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    if (res.data.success) {
                        this.unitList = res.data.unitList
                        this.currentGood.goodsUnit = 1
                    } else {
                        this.$message.error(res.data.errMsg)
                    }
                })
                .catch((err) => {
                    this.$message.error(err.message)
                })
                this.currentGood = good
                this.addOldGoodDialog = true
            },
            //提交旧货补充
            addOldGood() {
                this.flag = this.onNumChange('订货量', this.currentGood.stockOrderNum)
                if (this.flag == -1) {
                    return 
                } else if (this.flag == 0) {
                    let coupon = {
                        couponGoodsId:this.currentGood.goodsId,
                        couponUnitId:this.currentGood.goodsUnit,
                        couponNum:this.currentGood.stockOrderNum,
                        couponStaffId: window.sessionStorage.getItem('staffId')
                    }
                    let data = {
                        staffId: window.sessionStorage.getItem('staffId'),
                        coupon: JSON.stringify(coupon)
                    }
                    this.$axios.post('/replenishmentapplication/replenishmentcommit', this.$qs.stringify(data), {
                        headers:{
                            staffToken: window.sessionStorage.getItem('staffToken')
                        }
                    })
                    .then((res) => {
                        if (res.data.success) {
                            this.$message.success('补货申请提交成功')
                            this.getPartGood()
                            this.flag = 0
                        } else {
                            this.$message.error(res.data.errMsg)
                        }
                    })
                    .catch((err) => {
                    this.$message.error(err.message)
                    })
                    this.addOldGoodDialog = false
                }
            },
            //获取指定页面的信息
            currentChange(currentPage){
                this.queryInfo.pageIndex = currentPage
                if (this.isLazzy) {
                    this.searchGood()
                } else {
                    this.getPartGood()
                }
            },
            //判断合法性
            onNumChange(name, text_number){
                if (name == '订货量') {
                    if(text_number == '' || text_number == null){
                        this.$message.error(name + "不能为空")
                        return -1
                    } else if(isNaN(text_number)) {
                        this.$message.error("请输入数字")
                        return -1
                    } else {
                        return  0
                    }
                } else {
                    if(text_number == '' || text_number == null){
                        this.$message.error(name + "不能为空")
                        return -1
                    } else {
                        return  0
                    }
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
.el-button-group{
    .el-button{
        margin: 0 3px;
    }
}
.el-pagination{
    width: 50%;
    margin: 10px auto;
}
.all_img{
    width: 100px;
}
</style>