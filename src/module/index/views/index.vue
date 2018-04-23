<template>
  <div class="container">
    <div class="content">
      <ul class="cont_ul" >
        <li class="sec_li" v-for="item in items">
          <a href="#" class="lp_li_a">
            <div class="lp_li_imgWrap">
              <img :src="item.img" alt="">
            </div>
            <p class="lp_li_name">{{ item.title }}</p>
            <p class="lp_li_price">￥{{ item.price }}元</p>
          </a>
        </li>
      </ul>
    </div>

    <Footer></Footer>
  </div>
</template>

<script>
  import qs from 'qs'
  import Lib from '../../../assets/lib'
  Lib.common.window_font_size()
  import Footer from '../../../components/footer.vue'
  export default {
  name: 'Index',
  data(){
    return {
    items: []
   }
  },
  components:{
    Footer
  },
  // 在组件创建完成时，执行的钩子函数
  created (){
 /*  Lib.http.get('../../../../static/data.json').then((data) =>{
       console.log(data);
     this.items = data.data.books
   })*/
  var params = {pn:1,pageSize:10,openId:"ormVDwWR8MJqlJt2FrcqLAQIg0gk",publishState:"PUBLISH"};
  Lib.http.get(Lib.env.baseUrl+'policy/manager/v1/policys/h5?params='+params).then((data) =>{
        console.log('跨域返回的数据------'+data);
        console.log('dddd');
      }).catch((err)=>{
      console.log(err);
  })
  },
  mounted(){
    console.log('jquery$----'+Lib.$('.cont_ul').attr('class'))
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .container {
    max-width: 640px;
    margin: 0 auto;
    overflow-x: hidden;
    position: relative;
    padding-bottom: 0.88rem;
    .cont_ul {
      padding-top: 0.05rem;
      margin: 0 -0.12rem;
    .sec_li {
        float: left;
        width: 50%;
        margin-bottom: 0.1rem;
        .lp_li_a {
          display: block;
          padding: 0.3rem 0;
          margin: 0 0.05rem;
          text-align: center;
          background: #fff;
          .lp_li_imgWrap {
            padding: 0.24rem 0;
          }
          .lp_li_imgWrap > img {
            width: auto;
            height: 2.3rem;
          }
          .lp_li_name {
            height: 0.5rem;
            line-height: 0.5rem;
            font-size: 16px;
            color: #333;
          }
          .lp_li_price {
            height: 0.5rem;
            line-height: 0.5rem;
            font-size: 16px;
            color: #fb3b3b;
          }
        }
      }
    }
  }
  .cont_ul:after {
    content: "";
    display: block;
    width: 0;
    height: 0;
    clear: both;
  }
</style>
