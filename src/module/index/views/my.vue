<template>
  <div>

    <div class="my " id="my">
      <router-link to="/my/account">
        <button class="btn">点击进入二级目录</button>
      </router-link>
    </div>
    <Footer></Footer>

  </div>

</template>

<script>
  import Footer from '../../../components/footer.vue'
export default {
  name: 'My',
  data(){
    return {

    }
  },
  components:{
      Footer
  },
  // 在组件创建完成时，执行的钩子函数
  created (){

  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .my {
    max-width: 640px;
    margin: 0 auto;
    overflow-x: hidden;
    font-size: 0.28rem;
    height: 100%;
  }

</style>
