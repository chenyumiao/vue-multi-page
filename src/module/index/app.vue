<template>
  <div id="app">
    <transition :name="transitionName">
      <router-view class="view"></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'App',
  data(){
    return {
      transitionName:'slide'
    }
  },
  watch: {
    '$route': function (to, from) {
      const toDepth = to.path.split('/').length
      const fromDepth = from.path.split('/').length
      if(toDepth == fromDepth){
          this.transitionName = '';
      }else{
        this.transitionName = toDepth < fromDepth ? 'slide_back' : 'slide'
      }
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .view{
    transition: all 0.2s ease;
  }
  .slide-enter,
  .slide_back-enter {
    position: absolute;
    width: 100%;
  }
  .slide-leave,
  .slide_back-leave {
    position: absolute;
    width: 100%;
  }
  .slide-enter-active,
  .slide_back-enter-active {
    transition: all 0.3s linear;
  }
  .slide-leave-active {
    position: absolute;
    transition: all 0.3s linear;
    transform: translate(-100%);
  }
  .slide-enter{
    transform: translateX(100%);
  }
  .slide_back-leave-active {
    position: absolute;
    transition: all 0.3s linear;
    transform: translate(100%);
  }
  .slide_back-enter {
    transform: translateX(-100%);
  }
</style>

