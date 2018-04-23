<template>
<div class="footer">
      <ul class="footer-ul">
        <li class="current"><router-link to="/">首页</router-link></li>
        <li> <router-link to="/my">我的</router-link></li>
      </ul>
</div>
</template>
<script>
  export default {
    name: 'Footer'
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" lang="scss" scoped>
    .footer{
      width: 100%;
      height: 0.88rem;
      line-height: 0.88rem;
      border-top:1px solid #eeeeee;
      font-size: 0.28rem;
      position: fixed;
      bottom: 0;
      left:0;
      background: #fff;
      .footer-ul{
        display: flex;
        align-items: center;
        justify-content: center;
        list-style: none;
        li{
          flex: 1;
          text-align: center;
        }
        li.current{
          color:red;
        }
      }
    }


</style>
