<template>
  <GmapMap :center="{lat:30, lng:-10}" :zoom="3" map-type-id="terrain" :options="mapOptions"></GmapMap>
</template>

<script>
export default {
  name: "ProjectMap",
  data() {
    return {
      mapOptions: {
        zoomControl: true,
        mapTypeControl: true,
        MapTypeControlOptions: {
          position: "BOTTOM_CENTER"
        },
        fullScreenControl: true,
        scaleControl: false,
        streetViewControl: true
      }
    };
  }
};
</script>

<style scoped>
.vue-map-container {
  position: absolute;
  width: 100%;
  bottom: 0;
  top: 60px;
}
</style>

