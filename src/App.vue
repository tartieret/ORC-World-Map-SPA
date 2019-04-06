<template>
  <div id="app">
    <NavBar></NavBar>
    <Content></Content>
  </div>
</template>

<script>
import Content from "./components/Content.vue";
import NavBar from "./components/NavBar.vue";

export default {
  name: "app",
  components: {
    NavBar,
    Content
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
