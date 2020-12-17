<template>
  <div>
  <!--动态将图片轮播图的容器高度设置成与图片一致-->
    <el-carousel :interval="4000" type="card" height="300px" >
      <el-carousel-item v-for="item in imagebox" :key="item.id">
        <img :src="item.idView" class="image">
      </el-carousel-item>
    </el-carousel>

    <el-card class="box-card" style="float:left">
      <div slot="header" class="clearfix">
        <span style="color:green"><i class="el-icon-bell"></i>  通知公告</span>
        <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
      </div>
      <el-collapse class="collapse1" v-model="activeName1" accordion  >
        <el-collapse-item title="超市关于加强新冠肺炎疫情防控工作的救急通知" name="1">
          <div><span><i class="el-icon-caret-right"></i></span>近日，成都市新增新型冠状病毒感染肺炎本地病例。为贯彻落实12月8日省委应对新冠肺炎疫情工作领导小组会议精神、省教育厅《关于加强今冬明春疫情防控工作的通知》精神、疫情防控工作领导小组2020年冬季疫情防控工作布置会精神，按照属地疫情防控部门的要求，毫不放松地抓好疫情防控工作，维护正常的教学生活秩序，现将有关事项通知如下。</div>
          <div>一、深刻认识疫情防控的严峻性和艰巨性</div>
          <div>二、根据疫情形势做好信息排查、建立信息台账</div>
          <div>三、启动疫情防控联防联控机制和全体员工日报平安机制</div>
          <div>四、继续执行超市信息零报告日报告制度</div>

        </el-collapse-item>
        <el-collapse-item title="关于超市普通职工聘选工作员工的公告" name="2">
          <div><span><i class="el-icon-caret-right"></i></span>因疫情防控工作需要，现面向社会选聘工作人员1名，主要职责是疫情防控把控工作。现将有关事宜通知如下。</div>
          <div>选聘对象要求及范围:</div>
          <div>一、遵纪守法，品行端正，有良好的职业道德，爱岗敬业，事业心和责任感强。</div>
          <div>二、身体健康，能正常履行招聘岗位职责。</div>
          <div>三、1985年1月1日以后出生具有本科及以上学历学位。有类似工作经历者可适当放宽条件。</div>

        </el-collapse-item>
        <el-collapse-item title="关于本年度最佳职工评选规定相关公告" name="3">
          <div><span><i class="el-icon-caret-right"></i></span>2020年度最佳员工评选规定先公布如下</div>
          <div>一、年度营业额排名前十。</div>
          <div>二、无偷懒、迟到、请假等记录。</div>
          <div>三、工作高度负责、爱岗敬业。</div>
        </el-collapse-item>
        <el-collapse-item title="关于2021年元旦节放假安排有关通知" name="4">
          <div><span><i class="el-icon-caret-right"></i></span>元旦节放假安排的通知</div>
          <div>一、根据国务院办公厅节假日放假安排，本超市2021年元旦节放假时间为2021年1月1日（星期三），共1天。</div>
          <div>节日期间，各单位要妥善安排好值班和安全、保卫等工作，如遇重大突发事件，要按规定及时报告并妥善处置，确保全体员工平安祥和地度过节日。</div>
          <div>特此通知。</div>
        </el-collapse-item>
      </el-collapse>
      <!-- <div v-for="o in 4" :key="o" class="text item">
        {{'列表内容 ' + o }}
      </div> -->
    </el-card>  
    <el-card class="box-card" style="float:right">
      <div slot="header" class="clearfix">
        <span style="color:green"><i class="el-icon-chat-dot-round"></i>  员工须知</span>
        <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
      </div>
      <el-collapse class="collapse2" v-model="activeName2" accordion >
        <el-collapse-item title="规定一" name="1">
          <div>服务员在工作时间必须穿由本超市统一订制的工服。不能妆容夸张；不能衣冠不整；不能披肩散发；上班时间必须佩戴工作牌，下班时间没到不得提前脱工作服或摘工作牌。</div>
        </el-collapse-item>
        <el-collapse-item title="规定二" name="2">
          <div>爱惜本超市的所有物品，发现损坏根据产品的价值赔偿；不能乱写乱涂，尤其不能在产品和标价签上、货架等处乱写乱画，听从管理人员的统一安排。</div>
        </el-collapse-item>
        <el-collapse-item title="规定三" name="3">
          <div>临期产品提前下架问题：保质期 2-3 年的产品提前 6 个月下架；保质期 12 个月的产品提前 2 个月下架；保质期 18 个月的产品提前 3 个月下架；保质期 6-10 个月的产品提前 40 天下架，不按规定下架临期产品，发现过期导致货物不能及时退换出去，该区域服务员承担全部责任，自己将过期产品买走。</div>
        </el-collapse-item>
        <el-collapse-item title="规定四" name="4">
          <div>货物的摆设要整齐 , 产品要干净 , 日期要新鲜，摆货规则：新日期在里，老日期在外；同等价位，同等类别摆在一起，纵向摆货，新货破损或包装漏气，日期临近不新鲜等问题，应及时报告店长，产品销售后要及时向移动和补加货架上库存的货。</div>
        </el-collapse-item>
      </el-collapse>
      <!-- <div v-for="o in 4" :key="o" class="text item">
        {{'列表内容 ' + o }}
      </div> -->
    </el-card>  

    
  </div>
</template>

<script>
  export default{
    name:'home',
    data(){
      return {
        imagebox:[{id:0,idView:require('../../assets/image/imagebox/1.png')},
        {id:1,idView:require('../../assets/image/imagebox/2.png')},
        {id:2,idView:require('../../assets/image/imagebox/3.png')},
        {id:3,idView:require('../../assets/image/imagebox/4.png')}
        ],
        activeName1: '1',
        activeName2: '1',
        // 浏览器宽度
        screenWidth :0,
        notice1:{}
      }
    },
     methods:{
              setSize:function () {
                // 通过浏览器宽度(图片宽度)计算高度
                this.bannerHeight = 400 / 1920 * this.screenWidth;
              },
            },
          mounted() {
              // 首次加载时,需要调用一次
              this.screenWidth =  window.innerWidth;
              this.setSize();
              // 窗口大小发生改变时,调用一次
              window.onresize = () =>{
              this.screenWidth =  window.innerWidth;
              this.setSize();
            }
          }
  }
</script>

<style>
   .el-carousel__item h3 {
      color: #475669;
      font-size: 14px;
      opacity: 0.75;
      line-height: 200px;
      margin: 0;
    }

    .el-carousel__item:nth-child(2n) {
      background-color: #99a9bf;
    }

    .el-carousel__item:nth-child(2n+1) {
      background-color: #d3dce6;
    }
    img{
     /*设置图片宽度和浏览器宽度一致*/
      width:100%;
      height:inherit;
    }
    .box-card {
      margin-top: 15px;
      width: 45%;
    }
    .collapse1{
      width: 100%;
      /* display: inline-block; */
      float: left;
    }
    .collapse2{
      width: 100%;
      /* display: inline-block; */
      float: right;
    }
    
</style>

