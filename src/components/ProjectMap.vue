<template>
  <div class="google-map" id="googleMap"></div>
</template>

<script>
import projects from "../assets/data.json";

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
      projects: projects,
      map: null,
      markers: [],
      applicationColors: {
        geothermal: "#F00",
        biomass: "#9f9",
        solar: "#ff9",
        "heat recovery": "#99f"
      }
    };
  },
  methods: {
    displayProjects() {
      this.projects.forEach(project => {
        // build a marker for the project
        const coordinates = project["GPS Coordinates"].split(",");
        if (!coordinates) {
          return;
        }
        const position = new google.maps.LatLng(coordinates[0], coordinates[1]);
        const color = this.applicationColors[project.Application];

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
        // add the info window and open it when the user clicks
        // on the marker
        const infowindow = this.buildInfoWindow(project);
        marker.addListener("click", function() {
          infowindow.open(this.map, marker);
        });

        this.markers.push(marker);
      });
    },
    buildInfoWindow(project) {
      const contentString =
        '<div id="content">' +
        `<h1>${project["Project name"]}</h1>` +
        '<div id="bodyContent">' +
        "<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large " +
        "sandstone rock formation in the southern part of the " +
        "Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) " +
        "south west of the nearest large town, Alice Springs; 450&#160;km " +
        "(280&#160;mi) by road. Kata Tjuta and Uluru are the two major " +
        "features of the Uluru - Kata Tjuta National Park. Uluru is " +
        "sacred to the Pitjantjatjara and Yankunytjatjara, the " +
        "Aboriginal people of the area. It has many springs, waterholes, " +
        "rock caves and ancient paintings. Uluru is listed as a World " +
        "Heritage Site.</p>" +
        '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">' +
        "https://en.wikipedia.org/w/index.php?title=Uluru</a> " +
        "(last visited June 22, 2009).</p>" +
        "</div>" +
        "</div>";

      const infowindow = new google.maps.InfoWindow({
        content: contentString
      });
      return infowindow;
    }
  },
  mounted: function() {
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
