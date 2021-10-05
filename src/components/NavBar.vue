<template>
  <div class="navbar">
    <b-navbar toggleable="lg" type="light" fixed="top">
      <b-navbar-brand href="#">
        <img alt="logo" src="../assets/logo.png" id="logo" />
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item to="/">Map</b-nav-item>
          <!-- <b-nav-item to="/dashboard">Dashboard</b-nav-item> -->
          <b-nav-item to="/analysis">Analysis</b-nav-item>
          <b-nav-item to="/about">About</b-nav-item>
          <b-nav-item to="/contact">Contact</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
export default {
  name: "NavBar",
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.navbar {
  background-color: white;
}
#logo {
  height: 50px;
}
</style>
