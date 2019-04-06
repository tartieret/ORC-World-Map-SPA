<template>
  <div>
    <!-- page content -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "Content"
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.footer {
  background-color: #f5f5f5;
}

.footer > .container {
  padding-right: 15px;
  padding-left: 15px;
}
</style>
