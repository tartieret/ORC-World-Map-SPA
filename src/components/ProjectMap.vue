<template>
  <b-container fluid>
    <b-row>
      <b-col sm="6" md="5" lg="auto">
        <div id="search-panel">
          <p>
            This is an overview of all
            <a
              href="https://en.wikipedia.org/wiki/Organic_Rankine_cycle"
            >Organic Rankine Cycle</a> units installed in the world.
          </p>
          <p>Click for more information or read the analysis. Last update : 09/20/2018</p>

          <h3>Applications</h3>
          <b-form-group>
            <b-form-checkbox-group
              id="applications"
              v-model="search.applications"
              name="applications"
              v-on:input="filterProjects"
            >
              <b-form-checkbox value="geothermal">Geothermal</b-form-checkbox>
              <b-form-checkbox value="biomass">Biomass</b-form-checkbox>
              <b-form-checkbox value="solar">Solar</b-form-checkbox>
              <b-form-checkbox value="heat recovery">Heat Recovery</b-form-checkbox>
            </b-form-checkbox-group>
          </b-form-group>

          <h3>Installed Capacity</h3>
          <vue-slider
            v-model="search.powers"
            :min="sliderRanges.powers.min"
            :max="sliderRanges.powers.max"
            :interval="10"
            :lazy="true"
            :enable-cross="false"
            :tooltip="'always'"
            :tooltip-placement="'bottom'"
            v-on:change="filterProjects"
          ></vue-slider>

          <h3>Commissionning Year</h3>
          <vue-slider
            v-model="search.years"
            :min="sliderRanges.years.min"
            :max="sliderRanges.years.max"
            :lazy="true"
            :enable-cross="false"
            :tooltip="'always'"
            :tooltip-placement="'bottom'"
            v-on:change="filterProjects"
          ></vue-slider>

          <b-form-checkbox
            id="showInContruction"
            v-model="search.showInContruction"
            name="showInContruction"
            value="true"
            unchecked-value="false"
          >Show projects in contruction</b-form-checkbox>
          <div class="button-section">
            <b-button variant="success">Search</b-button>
            <b-button variant="outline-secondary">Reset</b-button>
          </div>

          <b-alert variant="success" show>Found {{nbProjectFound}} projects</b-alert>

          <div id="search-footer">
            <small>
              A project by
              <a href="http://ca.linkedin.com/in/thomastartiere">Thomas Tartière</a>
            </small>
          </div>
        </div>
      </b-col>
      <div id="googleMap"></div>
    </b-row>
  </b-container>
</template>

<script>
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/default.css";

import projects from "../assets/data.json";

export default {
  name: "project-map",
  data: function() {
    return {
      search: {
        showInContruction: false,
        powers: [0.1, 50000],
        years: [1970, 2019],
        applications: ["geothermal", "biomass", "solar", "heat recovery"]
      },
      options: {
        zoom: 3,
        center: new google.maps.LatLng(30, -10),
        mapTypeControl: true,
        mapTypeControlOptions: {
          position: google.maps.ControlPosition.BOTTOM_CENTER
        }
      },
      projects: projects,
      sliderRanges: {
        years: { min: 1970, max: 2019 },
        powers: { min: 0.1, max: 50000 }
      },
      map: null,
      markers: [],
      nbProjectFound: 0,
      applicationColors: {
        geothermal: "#F00",
        biomass: "#9f9",
        solar: "#ff9",
        "heat recovery": "#99f"
      }
    };
  },
  created() {
    // adjust the year slider range based on the project data
    this.search.years = this.getMinMaxYears;
    this.sliderRanges.years.min = this.search.years[0];
    this.sliderRanges.years.max = this.search.years[1];
    // adjust the capacity slider range based on the project data
    this.search.powers = [0, this.getMaxCapacity];
    this.sliderRanges.powers.min = this.search.powers[0];
    this.sliderRanges.powers.max = this.search.powers[1];
  },
  mounted: function() {
    // add the projects to the map
    const element = document.getElementById("googleMap");
    this.map = new google.maps.Map(element, this.options);
    this.displayProjects(this.map);
    this.nbProjectFound = this.markers.length;
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
          },
          properties: {
            application: project.Application,
            power: project["Project total installed capacity (kW)"],
            year: project["Commissioning Year"],
            manufacturer: project["Manufacturer"]
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
        `<h3>${project["Commissioning Year"]}</h3>` +
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
    },
    filterProjects(event) {
      let nb_shown = 0;
      const filter = this.search;
      this.markers.forEach(marker => {
        const props = marker.properties;
        let show = false;
        if (
          props.year >= filter.years[0] &&
          props.year <= filter.years[1] &&
          filter.applications.indexOf(props.application) > -1 &&
          props.power >= filter.powers[0] &&
          props.power <= filter.powers[1]
        ) {
          show = true;
          nb_shown++;
        }
        marker.setVisible(show);
      });
      this.nbProjectFound = nb_shown;
    }
  },
  computed: {
    getMinMaxYears() {
      let minYear = null;
      let maxYear = null;
      this.projects.forEach(project => {
        let year = project["Commissioning Year"];
        if (year) {
          if (!minYear || year < minYear) {
            minYear = year;
          }
          if (!maxYear || (year > maxYear && year < 3000)) {
            maxYear = year;
          }
        }
      });
      return [minYear, maxYear];
    },
    getMaxCapacity() {
      let maxCapacity = 10000;
      this.projects.forEach(project => {
        let power = project["Project total installed capacity (kW)"];
        if (power) {
          if (power > maxCapacity) {
            maxCapacity = power;
          }
        }
      });
      return maxCapacity;
    }
  },

  components: {
    "vue-slider": VueSlider
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
  max-width: 500px;
}

.button-section {
  margin-top: 10px;
  margin-bottom: 10px;
}

.button-section > button {
  margin-right: 5px;
}

.vue-slider {
  margin-bottom: 40px;
  margin-left: 15px;
  margin-right: 15px;
}
</style>
