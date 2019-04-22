<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<style lang="scss" scoped>
  @import "assets/scss_mixin/mixins";
  #app{
    @include full;
    overflow: hidden;
  }
</style>
