<template>
  <div class="google-map" id="googleMap"></div>
</template>

<script>
export default {
  name: "project-map",
  data: function() {
    return {
      options: {
        zoom: 3,
        center: new google.maps.LatLng(30, -10),
        mapTypeControl: true,
        mapTypeControlOptions: {
          position: google.maps.ControlPosition.BOTTOM_CENTER
        }
      },
      projects: [],
      map: null,
      markers: [],
      applicationColors: {
        geothermal: "#F00",
        biomass: "#9f9",
        solar: "#ff9",
        heat_recovery: "#99f"
      }
    };
  },
  methods: {
    // load the projects
    loadProjects() {
      this.projects = [
        { name: "P1", latitude: 30, longitude: -10, application: "geothermal" },
        { name: "P2", latitude: 40, longitude: -10, application: "biomass" },
        {
          name: "P3",
          latitude: -20,
          longitude: -10,
          application: "heat_recovery"
        },
        { name: "P4", latitude: -10, longitude: -10, application: "solar" }
      ];
    },
    displayProjects() {
      this.projects.forEach(project => {
        const position = new google.maps.LatLng(
          project.latitude,
          project.longitude
        );
        const color = this.applicationColors[project.application];
        const marker = new google.maps.Marker({
          position,
          map: this.map,
          title: project.name,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 4,
            fillColor: color,
            fillOpacity: 1,
            strokeWeight: 1
          }
        });
        this.markers.push(marker);
      });
    }
  },
  mounted: function() {
    this.loadProjects();
    const element = document.getElementById("googleMap");
    this.map = new google.maps.Map(element, this.options);
    this.displayProjects(this.map);
  }
};
</script>

<style scoped>
.google-map {
  position: absolute;
  width: 100%;
  top: 76px;
  bottom: 0;
  margin: 0 auto;
  background: gray;
}
</style>
