<template>
  <b-container fluid>
    <b-row>
      <b-col sm="3">
        <div id="search-panel">
          <p>This is an overview of all Organic Rankine Cycle units installed in the world.</p>
          <p>Click for more information or read the analysis. Last update : 09/20/2018</p>
          <h2>Application</h2>
          <h2>Installed Capacity</h2>
          <h2>Commissionning Year</h2>
        </div>
      </b-col>
      <div id="googleMap"></div>
    </b-row>
  </b-container>
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
#googleMap {
  position: absolute !important;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

#search-panel {
  text-align: left;
  margin-top: 15px;
  padding: 15px;
  background-color: white;
  opacity: 0.9;
}
</style>
