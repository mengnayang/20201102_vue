<template>
    <div class="stock_taking_container">
        <!-- 面包屑导航 -->
        <el-breadcrumb>
            <el-breadcrumb-item :to="{path : '/welcome'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>库存盘点</el-breadcrumb-item>
            <el-breadcrumb-item>盘点管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <!-- 功能区域 -->
            <!-- 一层 -->
            <el-row v-show="isFirst">
                <el-col :span="6">
                    <el-row>
                        <el-col :span="7">盘点时间:</el-col>
                        <el-col :span="5">
                            <el-date-picker style="width:150px" type="date" placeholder="请选择盘点时间" size="mini" v-model="selected.stocktakingCommitDate">
                            </el-date-picker>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="6">
                    <el-row>
                        <el-col :span="2">第</el-col>
                        <el-col :span="9">
                            <el-select size="mini" v-model="selected.stocktakingCount">
                                <el-option :key="1000" :value="1000" label="全部"></el-option>
                                <el-option :key="1" :value="1" labal="1"></el-option>
                                <el-option :key="2" :value="2" labal="2"></el-option>
                                <el-option :key="3" :value="3" labal="3"></el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="6">次盘点</el-col>
                    </el-row>
                </el-col>
                <el-col :span="7" :offset="4">
                    <el-button-group v-for="func in functionList_three" :key="func.functionId">
                        <el-button :type="func.btnType" size="mini" :icon="func.btnIcon" @click="getButtonStatus(null ,func.functionWeight)">{{func.functionName}}</el-button>
                    </el-button-group>            
                </el-col>
            </el-row>
            <el-row v-show="isFirst">
                <el-col :span="6">
                    <el-row>
                        <el-col :span="7">发起员工:</el-col>
                        <el-col :span="15">
                            <el-select size="mini" v-model="selected.stocktakingLaunchedStaffId">
                                <el-option :key="1000" :value="1000" label="全部"></el-option>
                                <el-option v-for="item in staffList" :value="item.staffId" :key="item.staffId" :label="item.staffName"></el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="6">
                    <el-row>
                        <el-col :span="7">提交员工:</el-col>
                        <el-col :span="15">
                            <el-select size="mini" v-model="selected.stocktakingSubmitStaffId">
                                <el-option :key="1000" :value="1000" label="全部"></el-option>
                                <el-option v-for="item in staffList" :value="item.staffId" :key="item.staffId" :label="item.staffName"></el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="6">
                    <el-row>
                        <el-col :span="7">盘点状态:</el-col>
                        <el-col :span="15">
                            <el-select size="mini"  v-model="selected.stocktakingAllStatus">
                                <el-option :key="1000" :value="1000" label="全部"></el-option>
                                <el-option :key="0" :value="0" label="初始状态待盘点"></el-option>
                                <el-option :key="1" :value="1" label="已盘点待提交"></el-option>
                                <el-option :key="2" :value="2" label="已仓库管理员已提交更新库存"></el-option>
                                <el-option :key="-1" :value="-1" label="已取消盘点"></el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="6">
                    <el-button type="primary" size="mini" @click="searchPartStock1()">查询</el-button>
                    <el-button type="primary" size="mini" @click="rollback()" :disabled="isFirst">返回上一层</el-button>
                </el-col>
            </el-row>
            <!-- 二层 -->
            <el-row v-show="isSecond">
                <el-col :span="2">商品编号:</el-col>
                <el-col :span="5">
                    <el-input v-model="value.goodsId" size="mini"></el-input>
                </el-col>
                <el-col :span="1" :offset="1">盈亏:</el-col>
                <el-col :span="5">
                    <el-select size="mini"  v-model="value.profitStatus">
                        <el-option :key="1000" :value="1000" label="全部"></el-option>
                        <el-option :key="0" :value="0" label="盘点无亏盈"></el-option>
                        <el-option :key="1" :value="1" label="盘盈"></el-option>
                        <el-option :key="-1" :value="-1" label="盘亏"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="2" :offset="1">盘点状态:</el-col>
                    <el-col :span="5">
                        <el-select size="mini"  v-model="value.stocktakingStatus">
                            <el-option :key="1000" :value="1000" label="全部"></el-option>
                            <el-option :key="-1" :value="-1" label="已取消盘点"></el-option>
                            <el-option :key="0" :value="0" label="初始状态待盘点"></el-option>
                            <el-option :key="1" :value="1" label="已盘点待提交"></el-option>
                            <el-option :key="2" :value="2" label="已仓库管理员已提交更新库存"></el-option>  
                        </el-select>
                    </el-col>
            </el-row>
            <el-row v-show="isSecond">
                <el-col :span="6">
                    <el-button type="primary" size="mini" @click="searchPartStock2()">查询</el-button>
                    <el-button type="primary" size="mini" @click="rollback()" :disabled="isFirst">返回上一层</el-button>
                </el-col>
            </el-row>
            <!-- 选取商品列表需求选择区 -->
            <el-row v-show="isThird">
                <el-col :span="2">商品类别:</el-col>
                <el-col :span="5">
                    <el-select size="mini" v-model="selected3.categoryId">
                        <el-option v-for="item in categoryList" :key="item.categoryId" :value="item.categoryId" :label="item.categoryName"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="6">
                    <el-button type="primary" size="mini" @click="searchPartStock3()">查询</el-button>
                    <el-button type="primary" size="mini" @click="rollbackFirst()">返回</el-button>
                </el-col>
            </el-row>
            <!-- 表单区域 -->
            <!-- 一级 -->
            <el-table :data="isLazzy1 ? stocktakingRecordList_lazzy : stocktakingRecordList" border stripe v-show="isFirst">
                <el-table-column label="盘点编号" prop="stocktakingId" fixed align="center" width="180px"></el-table-column>
                <el-table-column label="发起员工" width="170px" align="center">
                    <template slot-scope="scope">
                        <span v-for="item in staffList" :key="item.staffId">
                            <span v-if="item.staffId == scope.row.stocktakingLaunchedStaffId">{{item.staffName}}</span>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="提交员工" width="170px" align="center">
                    <template slot-scope="scope">
                        <span v-for="item in staffList" :key="item.staffId">
                            <span v-if="item.staffId == scope.row.stocktakingSubmitStaffId">{{item.staffName}}</span>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="盈亏状态" width="170px" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.stocktakingProfitLossPrice > 0">盘盈</span>
                        <span v-else-if="scope.row.stocktakingProfitLossPrice < 0">盘亏</span>
                        <span v-else>盘点无盈亏</span>
                    </template>
                </el-table-column>
                <el-table-column label="盈亏金额" width="170px" prop="stocktakingProfitLossPrice" align="center"></el-table-column>                
                <el-table-column label="盘点状态" width="220px" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.stocktakingAllStatus == 0">初始状态待盘点</span>
                        <span v-else-if="scope.row.stocktakingAllStatus == 1">已盘点待提交</span>
                        <span v-else-if="scope.row.stocktakingAllStatus == 2">已仓库管理员已提交更新库存</span>
                        <span v-else>已取消盘点</span>
                    </template>
                </el-table-column>
                <el-table-column label="盘点发起时间" width="170px" prop="stocktakingLaunchedDate" align="center"></el-table-column>                
                <el-table-column label="盘点提交时间" width="170px" prop="stocktakingCommitDate" align="center"></el-table-column>
                <el-table-column label="操作" fixed="right" width="180px" align="center">
                    <template slot-scope="scope">
                        <el-button-group v-for="func in functionList_one" :key="func.functionId">
                            <el-tooltip effect="light" placement="top" :content="func.functionName" :enterable="false">
                                <el-button :type="func.btnType" size="mini" :icon="func.btnIcon" @click="getButtonStatus(scope,func.functionWeight)"></el-button>
                            </el-tooltip>
                        </el-button-group>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 二级 -->
            <el-table :data="isLazzy2 ? stockingGoodsList_lazzy : stockingGoodsList" border stripe v-show="isSecond">
                <el-table-column label="商品图片" prop="goodsPicture" fixed align="center" width="120px"></el-table-column>
                <el-table-column label="盘点编号" prop="stocktakingId" fixed align="center" width="120px"></el-table-column>
                <el-table-column label="商品编号" prop="stocktakingStockGoodsId" align="center" width="150px"></el-table-column>
                <el-table-column label="商品名称" prop="goodsName" align="center" width="150px"></el-table-column>
                <el-table-column label="商品类别" width="120px" prop="categoryName" align="center"></el-table-column>
                <el-table-column label="品牌名称" width="120px" prop="goodsBrand" align="center"></el-table-column>
                <el-table-column label="实时库存量" width="120px" prop="stockNum" align="center"></el-table-column>
                <el-table-column label="盘点数量" width="120px" prop="stocktakingNum" align="center"></el-table-column>
                <el-table-column label="盘点状态" width="220px" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.stocktakingStatus == 0">初始状态待盘点</span>
                        <span v-else-if="scope.row.stocktakingStatus == 1">已盘点待提交</span>
                        <span v-else-if="scope.row.stocktakingStatus == 2">已仓库管理员已提交更新库存</span>
                        <span v-else>已取消盘点</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="240px" align="center">
                    <template slot-scope="scope">
                        <el-button-group v-for="func in functionList_two" :key="func.functionId">
                            <el-tooltip effect="light" placement="top" :content="func.functionName" :enterable="false">
                                <el-button :type="func.btnType" size="mini" :icon="func.btnIcon" @click="getButtonStatus(scope,func.functionWeight)"></el-button>
                            </el-tooltip>
                        </el-button-group>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 选取商品列表 -->
            <el-table :data="goodsStockAList" ref="multipleTable" border stripe v-show="isThird" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="60" align="center"></el-table-column>
                <el-table-column label="商品图片" prop="goodsPicture" fixed align="center" width="150px"></el-table-column>
                <el-table-column label="商品编号" prop="goodsId" fixed align="center" width="150px"></el-table-column>
                <el-table-column label="商品名称" prop="goodsName" align="center" width="150px"></el-table-column>
                <el-table-column label="商品类别" width="120px" prop="goodsCategoryId" align="center">
                    <template slot-scope="scope">
                        <span v-for="item in categoryList" :key="item.categoryId">
                            <span v-if="scope.row.goodsCategoryId == item.categoryId">{{item.categoryName}}</span>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="品牌名称" width="120px" prop="goodsBrand" align="center"></el-table-column>
                <el-table-column label="产品批号" width="120px" prop="stockGoodsBatchNumber" align="center"></el-table-column>
                <el-table-column label="生产日期" width="120px" prop="stockGoodsProductionDate" align="center"></el-table-column>
                <el-table-column label="实时库存量" width="120px" prop="stockInventory" align="center"></el-table-column>
                <el-table-column label="售价" width="120px" prop="stockGoodsPrice" align="center"></el-table-column>
                <el-table-column label="产品规格" width="120px" prop="goodsSpecifications" align="center"></el-table-column>
                <el-table-column label="盘点员工" width="120px" prop="goodsSpecifications" align="center">
                    <template slot-scope="scope">
                        <span v-for="item in categoryList" :key="item.categoryId">
                            <span v-if="scope.row.goodsCategoryId == item.categoryId">{{item.stocktakingStaffId}}</span>
                        </span>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 一层 -->
        <el-pagination v-show="isFirst"
        :current-page="queryInfo1.pageIndex" :page-sizes="[queryInfo1.infoCount]" 
        :page-size="queryInfo1.infoCount" :total="queryInfo1.total"
        @current-change="currentChange1"
        layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
        <!-- 二层 -->
        <el-pagination v-show="isSecond"
        :current-page="queryInfo2.pageIndex" :page-sizes="[queryInfo2.infoCount]" 
        :page-size="queryInfo2.infoCount" :total="queryInfo2.total"
        @current-change="currentChange2"
        layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
        <!-- 三层 -->
        <el-pagination v-show="isThird"
        :current-page="queryInfo3.pageIndex" :page-sizes="[queryInfo3.infoCount]" 
        :page-size="queryInfo3.infoCount" :total="queryInfo3.total"
        @current-change="currentChange3"
        layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
        <!-- 选取层 -->
        <el-row v-show="isThird">
            <el-col :span="2" :offset="19">
                <el-button type="primary" size="small" @click="toggleSelection()">取消</el-button>    
            </el-col>
            <el-col :span="2">
                <el-button type="warning" size="small" @click="requestRecord()">发起盘点</el-button>
            </el-col>
        </el-row>
        <!-- 查看详细信息列表 -->
        <el-dialog title="盘点商品信息" :visible.sync="lookDialog" width="500px">
            <el-form>
                <el-row>
                    <el-col :span="12" :offset="10" class="title">盘点信息</el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="盘点编号:">{{current.stocktaking.stocktakingId}}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="盘点时间:">{{current.stocktaking.stocktakingTime}}</el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="盘点盈亏状态:">{{current.stocktaking.stocktakingProfitLossStatus}}</el-form-item>
                    </el-col>  
                    <el-col :span="8">
                        <el-form-item label="盘点单价:">{{current.stocktaking.stocktakingPrice}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="盘点数量:">{{current.stocktaking.stocktakingNum}}</el-form-item>
                    </el-col>  
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="盘点状态:">
                            <template>
                                <span v-if="current.stocktaking.stocktakingStatus == 0">初始状态待盘点</span>
                                <span v-else-if="current.stocktaking.stocktakingStatuss == 1">已盘点待提交</span>
                                <span v-else-if="current.stocktaking.stocktakingStatus == 2">已仓库管理员已提交更新库存</span>
                                <span v-else>已取消盘点</span>
                            </template>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="盘点职工:">{{current.staff.staffName}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="盘点备注:">{{current.stocktaking.stocktakingRemarks}}</el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12" :offset="10" class="title">
                        商品信息
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="商品编号:">{{current.goods.goodsId}}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="商品名称:">{{current.goods.goodsName}}</el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="商品类别:">{{current.category.categoryName}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="品牌名称:">{{current.goods.goodsBrand}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="实时库存:">{{current.stock.stockInventory}}</el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="保质期:">{{current.stock.stockGoodsShelfLife}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="单位:">{{current.unit.unitName}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="规格:">{{current.goods.goodsSpecifications}}</el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="生产日期:">{{current.stock.stockGoodsProductionDate}}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="商品图片:">
                            <img :src="current.goods.goodsPicture" alt="图片">
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" size="small" @click="lookDialog = false">取消</el-button>
            </span>
        </el-dialog>
        <!-- 修改详细信息列表 -->
        <el-dialog title="盘点商品信息" :visible.sync="editDialog" width="500px">
            <el-form label-width="80px">
                <el-row>
                    <el-col :span="12" :offset="10" class="title">盘点信息</el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="盘点编号:">
                            <el-input v-model="current.stocktaking.stocktakingId" auto-complete="off" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="盘点时间:">
                            <el-input v-model="current.stocktaking.stocktakingTime" auto-complete="off" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="盈亏状态:">
                            <el-input v-model="current.stocktaking.stocktakingProfitLossStatus" auto-complete="off" disabled></el-input>
                        </el-form-item>
                    </el-col>  
                    <el-col :span="8">
                        <el-form-item label="盘点单价:">
                            <el-input v-model="current.stocktaking.stocktakingPrice" auto-complete="off" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="盘点数量:">
                            <el-input v-model.number="current.stocktaking.stocktakingNum" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>  
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="盘点状态:">
                            <el-input v-model="current.stocktaking.stocktakingStatus" auto-complete="off" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="盘点职工:">
                            <el-input v-model="current.staff.staffName" auto-complete="off" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="18">
                        <el-form-item label="盘点备注:">
                            <el-input type="textarea" v-model="current.stocktaking.stocktakingRemarks" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12" :offset="10" class="title">
                        商品信息
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="商品编号:">
                            <el-input v-model="current.goods.goodsId" auto-complete="off" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="商品名称:">
                            <el-input v-model="current.goods.goodsName" auto-complete="off" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="商品类别:">
                            <el-input v-model="current.category.categoryName" auto-complete="off" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="品牌名称:">
                            <el-input v-model="current.goods.goodsBrand" auto-complete="off" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="单位:">
                            <el-input v-model="current.unit.unitName" auto-complete="off" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="规格:">
                            <el-input v-model="current.goods.goodsSpecifications" auto-complete="off" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="保质期:">
                            <el-input v-model="current.stock.stockGoodsShelfLife" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="实时库存:">
                            <el-input v-model.number="current.stock.stockInventory" auto-complete="off" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="生产日期:">
                            <el-input v-model="current.stock.stockGoodsProductionDate" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="商品图片:">
                            <img :src="current.goods.goodsPicture" alt="图片">
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button-group>
                    <el-button type="success" size="small" @click="editDialog1()">确认修改</el-button>
                </el-button-group>
                <el-button type="primary" size="small" @click="editDialog = false">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default{
        name:'StockTaking',
        data() {
            return{
                //库存列表
                stockList:[],
                //查询条件
                queryInfo1:{
                    total:0,
                    pageIndex:1,
                    infoCount:3
                },
                queryInfo2:{
                    total:0,
                    pageIndex:1,
                    infoCount:3
                },
                queryInfo3:{
                    total:0,
                    pageIndex:1,
                    infoCount:3
                },
                //二级菜单列表
                secondaryMenuList:[],
                //二级功能id
                secondaryMenuId:'',
                //功能列表
                functionList:[],
                //一级功能按钮
                functionList_one:[],
                //一级功能按钮(下面)
                functionList_six:[],
                //二级功能按钮
                functionList_two:[],
                //总按钮(上方)
                functionList_three:[],
                //二级功能按钮下面
                functionList_four:[],
                //员工列表
                staffList:[],
                // 商品信息查询栏一层
                selected:{
                    stocktakingCount:'',
                    stocktakingLaunchedStaffId:'',
                    stocktakingSubmitStaffId:'',
                    stocktakingAllStatus:'',
                    stocktakingCommitDate:''
                },
                // 商品信息查询栏二层
                value:{
                    goodsId:"",
                    profitStatus:null,
                    stocktakingStatus:null
                },
                // 选取商品查询栏
                selected3:{
                    categoryId:''
                },
                // 选取商品列表的类别栏
                categoryList:[],
                //一层是否渲染
                isFirst:true,
                //二层是否渲染
                isSecond:false,
                //所有员工盘带商品总和
                stocktakingRecordList:[],
                // 员工盘点的商品类别信息
                stockingGoodsList:[],
                current:{
                    category: "",
                    goods: "",
                    staff: "",
                    stock: "",
                    stocktaking: "",
                    unit:""
                },
                //查看盘点商品信息详情弹框
                lookDialog:false,
                //修改盘点商品信息详情弹框
                editDialog:false,
                // 选取商品列表的信息栏
                goodsStockAList:[],
                //选取商品列表的查询需求是否渲染
                isThird:false,
                //选择的行数
                multipleSelection:[],
                // 当前盘点总记录的信息
                scope_local:'',
                // 是否模糊查询
                isLazzy1:false,
                // 模糊查询列表
                stocktakingRecordList_lazzy:[],
                // 是否模糊查询
                isLazzy2:false,
                // 模糊查询列表
                stockingGoodsList_lazzy:[]
            }
        },
        created() {
            this.getStockList()
        },
        methods:{
            //初始获取部分库存信息
            getStockList() {
                // 获取当前二级菜单的id
                this.secondaryMenuList = window.sessionStorage.getItem('secondaryMenuList')
                this.secondaryMenuList = JSON.parse(this.secondaryMenuList)

                for(var i = 0; i < this.secondaryMenuList.length; i++) {
                    if (this.secondaryMenuList[i].secondaryMenuUrl == this.$route.path) {
                        this.secondaryMenuId = this.secondaryMenuList[i].secondaryMenuId
                    }
                }

                let data = {
                    pageIndex: this.queryInfo1.pageIndex-1,
                    pageSize: this.queryInfo1.infoCount,
                    secondaryMenuId: this.secondaryMenuId,
                    staffId:window.sessionStorage.getItem('staffId')
                }   
                this.$axios.post('/stocktaking',this.$qs.stringify(data),{
                    headers:{
                        staffToken: window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    if (res.data.success) {
                        this.functionList = res.data.functionList
                        this.staffList = res.data.staffList
                        this.stocktakingRecordList = res.data.stocktakingRecordList
                        this.queryInfo1.total = res.data.recordSum
                        this.drawBtn()
                        this.stocktakingRecordList.map((item) => {
                            let date = new Date(item.stocktakingLaunchedDate)
                            item.stocktakingLaunchedDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
                            date = new Date(item.stocktakingCommitDate)
                            item.stocktakingCommitDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
                        })
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
                            if (this.functionList[i].functionWeight == 1) {
                                this.$set(this.functionList[i],"btnType","primary")
                                this.$set(this.functionList[i],"btnIcon","iconfont icon_look")
                                this.functionList_one.push(this.functionList[i])
                            } else if (this.functionList[i].functionWeight == 2) {
                                this.$set(this.functionList[i],"btnType","primary")
                                this.$set(this.functionList[i],"btnIcon","iconfont icon_look")
                                this.functionList_two.push(this.functionList[i])
                            } else if (this.functionList[i].functionWeight == 3) {
                                this.$set(this.functionList[i],"btnType","success")
                                this.$set(this.functionList[i],"btnIcon","iconfont icon_edit")
                                this.functionList_two.push(this.functionList[i])
                            } else if (this.functionList[i].functionWeight == 4) {
                                this.$set(this.functionList[i],"btnType","warning")
                                this.$set(this.functionList[i],"btnIcon","iconfont icon_alert")
                                this.functionList_two.push(this.functionList[i])
                            } else if (this.functionList[i].functionWeight == 5) {
                                this.$set(this.functionList[i],"btnType","warning")
                                this.$set(this.functionList[i],"btnIcon","iconfont icon_confirm")
                                this.functionList_one.push(this.functionList[i])
                            } else if (this.functionList[i].functionWeight == 6) {
                                this.$set(this.functionList[i],"btnType","warning")
                                this.functionList_three.push(this.functionList[i])
                            } else if (this.functionList[i].functionWeight == 7) {
                                this.$set(this.functionList[i],"btnType","warning")
                                this.functionList_four.push(this.functionList[i])
                            } else if (this.functionList[i].functionWeight == 8) {
                                this.$set(this.functionList[i],"btnType","warning")
                                this.functionList_three.push(this.functionList[i])
                            }
                            this.isDraw = true
                        }
                    }
            },
            //模糊查询部分库存信息
            searchPartStock1() {
                this.isLazzy1 = true

                if (this.selected.stocktakingCommitDate == "") {
                    this.$message.warning('请选择盘点时间')
                } else {
                    let date = new Date(this.selected.stocktakingCommitDate)
                    this.selected.stocktakingCommitDate = date.getFullYear() + '' + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1))
                    + '' + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
                    
                    this.selected.stocktakingCount = this.selected.stocktakingCount == 1000 ? "" : this.selected.stocktakingCount

                    let stocktakingId = this.selected.stocktakingCommitDate + this.selected.stocktakingCount

                    console.log(stocktakingId)

                    this.selected.stocktakingLaunchedStaffId = this.selected.stocktakingLaunchedStaffId == 1000 ? null : this.selected.stocktakingLaunchedStaffId
                    this.selected.stocktakingSubmitStaffId = this.selected.stocktakingSubmitStaffId == 1000 ? null : this.selected.stocktakingSubmitStaffId
                    this.selected.stocktakingLaunchedStaffId = this.selected.stocktakingLaunchedStaffId == "" ? null : this.selected.stocktakingLaunchedStaffId
                    this.selected.stocktakingSubmitStaffId = this.selected.stocktakingSubmitStaffId == "" ? null : this.selected.stocktakingSubmitStaffId
                    this.selected.stocktakingAllStatus = this.selected.stocktakingAllStatus == "" ? null : this.selected.stocktakingAllStatus
                    this.selected.stocktakingAllStatus = this.selected.stocktakingAllStatus == 1000 ? null : this.selected.stocktakingAllStatus

                    let stocktakingRecord = {
                        stocktakingId:stocktakingId,
                        stocktakingLaunchedStaffId:this.selected.stocktakingLaunchedStaffId,
                        stocktakingSubmitStaffId:this.selected.stocktakingSubmitStaffId,
                        stocktakingAllStatus:this.selected.stocktakingAllStatus
                    }
                    let data = {
                        stocktakingRecord : JSON.stringify(stocktakingRecord),
                        pageSize:this.queryInfo1.infoCount,
                        pageIndex:this.queryInfo1.pageIndex-1,
                        staffId:window.sessionStorage.getItem('staffId')
                    }
                    this.$axios.post('/stocktaking/findByConditions',this.$qs.stringify(data),{
                        headers:{
                            staffToken:window.sessionStorage.getItem('staffToken')
                        }
                    })
                    .then((res) => {
                        if (res.data.success) {
                            this.stocktakingRecordList_lazzy = res.data.stocktakingRecordList
                            this.queryInfo1.total = res.data.recordSum
                        } else {
                            this.$message.error(res.data.errMsg)
                        }
                    })
                    .catch((err) => {
                        this.$message.error(err.message)
                    })
                }
            },
            searchPartStock2() {
                this.isLazzy2 = true

                let stocktakingId = this.scope_local.row.stocktakingId
                this.value.goodsId = this.value.goodsId == "" ? null : this.value.goodsId
                this.value.stocktakingStatus = this.value.stocktakingStatus == 1000 ? null : this.value.stocktakingStatus
                this.value.profitStatus = this.value.profitStatus == 1000 ? null : this.value.profitStatus
                this.value.stocktakingStatus = this.value.stocktakingStatus == "" ? null : this.value.stocktakingStatus
                this.value.profitStatus = this.value.profitStatus == "" ? null : this.value.profitStatus

                let stocktaking = {
                    stocktakingId:stocktakingId,
                    stocktakingStockGoodsId:this.value.goodsId,
                    stocktakingStatus:this.value.stocktakingStatus,
                    stocktakingProfitLossStatus:this.value.profitStatus
                }
                console.log(stocktaking)
                let data = {
                    stocktaking : JSON.stringify(stocktaking),
                    pageSize:this.queryInfo2.infoCount,
                    pageIndex:this.queryInfo2.pageIndex-1,
                    staffId:window.sessionStorage.getItem('staffId')
                }
                this.$axios.post('/stocktaking/stocktakinggoodslistfindByConditions',this.$qs.stringify(data),{
                    headers:{
                        staffToken:window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    if (res.data.success) {
                        this.stockingGoodsList_lazzy = res.data.stocktakingGoodsList
                        this.queryInfo2.total = res.data.recordSum
                    } else {
                        this.$message.error(res.data.errMsg)
                    }
                })
                .catch((err) => {
                    this.$message.error(err.message)
                })
            },
            //根据指定页码获取相应的库存信息
            currentChange1(currentPage) {
                this.queryInfo1.pageIndex = currentPage
                this.getStockList()
            },
            currentChange2(currentPage) {
                this.queryInfo2.pageIndex = currentPage
                this.lookAllDialogInfo(this.scope_local)
            },
            currentChange3(currentPage) {
                this.queryInfo3.pageIndex = currentPage
                this.selectGoodList()
            },
            //层级转换
            rollback() {
                this.isSecond = false,
                this.isFirst = true,
                this.getStockList()
            },
            //选择需求列表转换至最初
            rollbackFirst() {
                this.isSecond = false,
                this.isFirst = true,
                this.isThird = false,
                this.getStockList()
            },
            //获取按钮功能
            getButtonStatus(scope,functionWeight) {
                if (functionWeight == 1) {
                    this.lookAllDialogInfo(scope)
                } else if (functionWeight == 2) {
                    this.lookDialogInfo(scope.row)
                } else if (functionWeight == 3) {
                    this.editDialogInfo(scope.row)
                } else if (functionWeight == 5) {
                    this.submitAllStocktaking(scope.row)
                } else if (functionWeight == 4) {
                    this.$message.success('成功发送提醒')
                } else if (functionWeight == 6) {
                    this.selectGoodList()
                } else if (functionWeight == 8) {
                    this.immediateStocktaking()
                }
            },
            //查看该用户所分配的所有商品
            lookAllDialogInfo(scope) {
                //放到本地，以便后面调用
                this.scope_local = scope

                let good = scope.row
                let data = {
                    stocktakingId:good.stocktakingId,
                    pageIndex:this.queryInfo2.pageIndex-1,
                    pageSize:this.queryInfo2.infoCount
                }
                this.$axios.post('/stocktaking/stocktakinggoodslist', this.$qs.stringify(data), {
                    headers:{
                        staffToken: window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    if (res.data.success) {
                        this.stockingGoodsList = res.data.stocktakingGoodsList
                        this.queryInfo2.total = res.data.recordSum
                        this.isFirst = false
                        this.isSecond = true          
                    } else {
                        this.$message.error(res.data.errMsg)
                    }
                })
                .catch((err) => {
                    this.$message.error(err.message)
                })
            },
            //查看该用户所分配的某商品的详细信息
            lookDialogInfo(good) {
                console.log(good)
                console.log(good.stocktakingStockGoodsId)
                let data = {
                    stocktakingId:good.stocktakingId,
                    stocktakingStockGoodsId:good.stocktakingStockGoodsId
                }
                this.$axios.post('/stocktaking/stocktakinggoodsdetails', this.$qs.stringify(data), {
                    headers:{
                        staffToken: window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    if (res.data.success) {
                        this.current.category = res.data.category
                        this.current.goods = res.data.goods
                        this.current.unit = res.data.unit
                        this.current.staff = res.data.staff
                        this.current.stock = res.data.stock
                        this.current.stocktaking = res.data.stocktaking
                        this.lookDialog = true
                        let data = new Date(this.current.stock.stockGoodsProductionDate)
                        this.current.stock.stockGoodsProductionDate = data.getFullYear() + "-" + (data.getMonth()+1) + "-" + data.getDate()
                        
                        data = new Date(this.current.stocktaking.stocktakingTime)
                        this.current.stocktaking.stocktakingTime = data.getFullYear() + "-" + (data.getMonth()+1) + "-" + data.getDate()
                    } else {
                        this.$message.error(res.data.errMsg)
                    }
                })
                .catch((err) => {
                    this.$message.error(err.message)
                })
            },
            //修改该用户所分配的某商品的详细弹框
            editDialogInfo(good) {
                let data = {
                    stocktakingId:good.stocktakingId,
                    stocktakingStockGoodsId:good.stocktakingStockGoodsId
                }
                this.$axios.post('/stocktaking/stocktakinggoodsdetails', this.$qs.stringify(data), {
                    headers:{
                        staffToken: window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    if (res.data.success) {
                        this.current.category = res.data.category
                        this.current.goods = res.data.goods
                        this.current.unit = res.data.unit
                        this.current.staff = res.data.staff
                        this.current.stock = res.data.stock
                        this.current.stocktaking = res.data.stocktaking
                        this.editDialog = true
                        let data = new Date(this.current.stock.stockGoodsProductionDate)
                        this.current.stock.stockGoodsProductionDate = data.getFullYear() + "-" + (data.getMonth()+1) + "-" + data.getDate()
                        
                        data = new Date(this.current.stocktaking.stocktakingTime)
                        this.current.stocktaking.stocktakingTime = data.getFullYear() + "-" + (data.getMonth()+1) + "-" + data.getDate()
                    } else {
                        this.$message.error(res.data.errMsg)
                    }
                })
                .catch((err) => {
                    this.$message.error(err.message)
                })
            },
            //修改该用户所分配的某商品的详细信息
            editDialog1() {
                let stocktaking = {
                    stocktakingId:this.current.stocktaking.stocktakingId,
                    stocktakingStockGoodsId:this.current.stocktaking.stocktakingStockGoodsId,
                    stockNum:this.current.stock.stockInventory,
                    stocktakingNum:this.current.stocktaking.stocktakingNum,
                    stocktakingStaffId:this.current.staff.staffId,
                    stocktakingStatus:this.current.stocktaking.stocktakingStatus,
                    stocktakingRemarks:this.current.stocktaking.stocktakingRemarks,
                    stocktakingTime:"",
                    stocktakingProfitLossStatus:this.current.stocktaking.stocktakingProfitLossStatus,
                    stocktakingPrice:this.current.stocktaking.stocktakingPrice
                }
                let data = {
                    stocktaking:JSON.stringify(stocktaking),
                    userId:window.sessionStorage.getItem('staffId')
                }
                this.$axios.post('/stocktaking/stocktakinggoodsremind', this.$qs.stringify(data), {
                    headers:{
                        staffToken: window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    if (res.data.success) {
                        this.$message.success('该员工盘点类别修改成功')
                        this.editDialog = false
                    } else {
                        this.$message.error(res.data.errMsg)
                    }
                })
                .catch((err) => {
                    this.$message.error(err.message)
                })
            },
            //立即盘点
            immediateStocktaking() {
                let data = {
                    staffId: window.sessionStorage.getItem('staffId')
                }
                this.$axios.post('/stocktaking/stocktakingImmediate',this.$qs.stringify(data),{
                    headers:{
                        staffToken: window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    if (res.data.success) {
                        console.log(res.data)
                        this.$message.success('盘点发起成功')
                    } else {
                        this.$message.error(res.data.errMsg)
                    }
                })
                .catch((err) => {
                    this.$message.error(err.message)
                })
            },
            //选取商品列表
            selectGoodList() {
                let data = {
                    pageIndex: this.queryInfo3.pageIndex-1,
                    pageSize:this.queryInfo3.infoCount
                }
                this.$axios.post('/stocktaking/selectStocktakingGoods', this.$qs.stringify(data), {
                    headers:{
                        staffToken:window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    if (res.data.success) {
                        this.categoryList = res.data.categoryList
                        this.goodsStockAList = res.data.goodsStockAList
                        this.queryInfo3.total = res.data.recordSum
                        this.isFirst = false
                        this.isSecond = false
                        this.isThird = true
                        this.goodsStockAList.map((item) => {
                            let date = new Date(item.stockGoodsProductionDate)
                            item.stockGoodsProductionDate = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate()
                        })
                    } else {
                        this.$message.error(res.data.errMsg)
                    }
                })
                .catch((err) => {
                    this.$message.error(err.message)
                })
            },
            //检测table的选项
            handleSelectionChange(selections) {
                this.multipleSelection = selections;
            },
            //取消所选
            toggleSelection(rows) {
                if (rows) {
                    rows.forEach(row => {
                        this.$refs.multipleTable.toggleRowSelection(row);
                    });
                } else {
                    this.$refs.multipleTable.clearSelection();
                }
            },
            //发起盘点
            requestRecord() {
                let stockGoodsIdListStr = []
                for (let i = 0; i < this.multipleSelection.length; i++) {
                    stockGoodsIdListStr.push(this.multipleSelection[i].stockGoodsId)
                }
                let data = {
                    staffId: window.sessionStorage.getItem('staffId'),
                    stockGoodsIdList: JSON.stringify(stockGoodsIdListStr)
                }
                this.$axios.post('/stocktaking/initiateStocktaking',this.$qs.stringify(data),{
                    headers:{
                        staffToken: window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    if (res.data.success) {
                        this.$message.success('成功发起盘点')
                    } else {
                        this.$message.error(res.data.errMsg)
                    }
                })
                .catch((err) => {
                    this.$message.error(err.message)
                })
            },
            // 提交总盘点
            submitAllStocktaking(rowInfo) { 
                let data = {
                    staffId:window.sessionStorage.getItem('staffId'),
                    stocktakingId:rowInfo.stocktakingId
                }
                this.$axios.post('/stocktaking/submitStocktaking', this.$qs.stringify(data),{
                    headers:{
                        staffToken:window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    if (res.data.success) {
                        this.$message.success('成功提交总盘点')
                        this.getStockList()
                    } else {
                        this.$message.error(res.data.errMsg)
                    }
                })
                .catch((err) => {
                    this.$message.error(err.message)
                })
            },
        }
    }
</script>

<style lang="less" scoped>
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
.el-button{
    margin: 0 5px;
}
.title{
    font-size: 20px;
    font-weight: 700;
    color: #000000;
}
.el-pagination{
    width: 50%;
    margin: 10px auto;
}
</style>