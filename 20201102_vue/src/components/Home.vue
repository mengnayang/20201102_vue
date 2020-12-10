<template>
    <div class="home_container">
        <div class="home_title">
            <div class="home_img" @click="return_welcome()">
                <i class="iconfont icon_title"></i>
                <span>超市商品管理系统</span>
            </div>
            <div class="home_info">
                <div>
                    <i class="el-icon-user"></i>
                    <span>{{staffName}}</span>
                </div>
                <div @click="logout()">
                    <i class="iconfont icon_logout"></i>
                    <span>退出</span>
                </div>
            </div>
        </div>
        <div class="home_content">
            <el-container>
                <!-- 左边区域 -->
                <el-aside :width="getWidth()">
                    <!-- 折叠面板 -->
                    <div class="toggle-button" @click="toggleCollapse">|||</div>
                    <!-- 菜单区域 -->
                    <el-menu :collapse="isCollapse" :collapse-transition="false" unique-opened active-text-color="#12aa9c" router>
                        <!-- 一级菜单 -->
                        <el-submenu :index="item.primaryMenuId + ''" v-for="item in primaryMenuList" :key="item.primaryMenuId">
                            <template slot="title">
                                <i class="el-icon-user"></i>
                                <span>{{item.primaryMenuName}}</span>
                            </template>
                            <el-menu-item :index="subItem.secondaryMenuUrl + ''" v-for="subItem in secondaryMenuList" :key="subItem.secondaryMenuId" v-if="item.primaryMenuId == subItem.primaryMenuId">
                                <template slot="title">
                                    <i class="el-icon-user"></i>
                                    <span>{{subItem.secondaryMenuName}}</span>
                                </template>
                            </el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <!-- 主体区域 -->
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </div>
    </div>
</template>

<script>
    export default{
        name:'Home',
        data() {
            return{
                //职工姓名
                staffName:'',
                //是否为正常职工
                isPower:'',
                //是否折叠
                isCollapse:false,
                //职位
                position:'',
                //一级功能菜单列表
                primaryMenuList:[],
                //二级功能菜单列表
                secondaryMenuList:[],
            }
        },
        created() {
            //获取用户的token、姓名和状态
            var staffToken = window.sessionStorage.getItem('staffToken')
            var staffId = window.sessionStorage.getItem('staffId')
            var staffStatus = window.sessionStorage.getItem('staffStatus')
            var staffName = window.sessionStorage.getItem('staffName')
            var staffPosition = window.sessionStorage.getItem('staffPosition')
            var staffStatus = window.sessionStorage.getItem('staffStatus')
            var primaryList = window.sessionStorage.getItem('primaryMenuList')
            var secondaryList = window.sessionStorage.getItem('secondaryMenuList')
            
            this.staffId = staffId
            this.staffName = staffName
            this.staffPosition = staffPosition
        
            this.primaryMenuList = JSON.parse(primaryList)
            this.secondaryMenuList = JSON.parse(secondaryList)

            // 一级菜单
            // console.log(this.primaryMenuList)
            // 二级菜单
            // console.log(this.secondaryMenuList)

            if (staffStatus == 1000) {
                this.isPower = true
            } else if (staffStatus == 1001) {
                this.isPower = false
            } else if (staffStatus == 0) {
                this.isPower = false
            } else if (staffStatus == -1) {
                this.isPower = false
            }

            //获取菜单功能点
            let staffInfo = {
                staffId: staffId,
                staffStatus: staffPosition
            }
        },
        methods:{
            //菜单折叠
            toggleCollapse() {
                this.isCollapse = !this.isCollapse
            },
            //退出
            logout() {
                let data = ''
                this.$axios.post('/logout', this.$qs.stringify(data), {
                    headers:{
                        staffToken: window.sessionStorage.getItem('staffToken')
                    }
                })
                .then((res) => {
                    this.$message.success('成功退出')
                    window.sessionStorage.clear()
                    this.$router.push('/login')
                })
                .catch((err) => {
                    this.$message.error(err.message)
                })
            },
            //获取折叠的宽度
            getWidth(){
                if (this.isPower) {
                    if (this.isCollapse) {
                        return "65px"
                    } else {
                        return "250px"
                    }
                } else {
                    return "0px"
                }
            },
            //回到主页
            return_welcome() {
                this.$router.push('/welcome')
            }
        }
    }
</script>

<style lang="less" scoped>
.home_container{
    width: 100%;
    height: 100%;
}
.home_title{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 80px;
    background-color: #2177b8;
    .home_img{
        cursor: pointer;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        width: 400px;
        i{
            font-size: 70px;
        }
        span{
            font-size: 30px;
        }
    }
    .home_info{
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        padding-right: 30px;
        width: 280px;
        div{
            cursor: pointer;
            i{
                font-size: 23px;
            }
            span{
                font-size: 23px;
            }
        }
    }
}
.toggle-button{
    cursor: pointer;
    background-color: #0F59A4;
    color: #fff;
    letter-spacing: 0.3em;
    opacity: 0.5;
    text-align: center;
    line-height: 30px;
}
.el-aside{
    height: 497px;
}
</style>