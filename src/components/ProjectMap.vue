<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12" md="6" lg="4">
        <div id="search-panel">
          <p>
            This is an overview of all
            <a
              target="_blank"
              href="https://en.wikipedia.org/wiki/Organic_Rankine_cycle"
              >Organic Rankine Cycle</a
            >
            units installed in the world.
          </p>
          <p>Click for more information or read the analysis.</p>

          <h4>Applications</h4>
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
              <b-form-checkbox value="heat recovery"
                >Heat Recovery</b-form-checkbox
              >
            </b-form-checkbox-group>
          </b-form-group>

          <h4>Installed Capacity</h4>
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

          <h4>Commissionning Year</h4>
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
            id="showInConstruction"
            v-model="search.showInConstruction"
            name="showInConstruction"
            :value="true"
            :unchecked-value="false"
            v-on:change="filterProjects"
            >Show projects in construction</b-form-checkbox
          >
          <div class="button-section">
            <b-button variant="success">Search</b-button>
            <b-button variant="outline-secondary" @click="reset()"
              >Reset</b-button
            >
          </div>

          <b-alert variant="success" show
            >Found {{ nbProjectFound }} projects</b-alert
          >

          <div id="search-footer">
            <small>
              A project by
              <a href="https://ca.linkedin.com/in/thomastartiere"
                >Thomas Tartière</a
              >. Last update 09/20/2018
            </small>
          </div>
        </div>
      </b-col>
      <div id="googleMap"></div>
    </b-row>
  </b-container>
</template>

<script>
import gmapsInit from "../utils/gmaps";
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/default.css";

import projects from "../assets/data.json";

export default {
  name: "project-map",
  data: function () {
    return {
      search: {
        showInConstruction: true,
        powers: [0.1, 50000],
        years: [1970, 2019],
        applications: ["geothermal", "biomass", "solar", "heat recovery"],
      },
      /*mapOptions: {
        zoom: 3,
        center: new google.maps.LatLng(30, -10),
        draggable: true,
        mapTypeControl: true,
        mapTypeControlOptions: {
          position: google.maps.ControlPosition.BOTTOM_CENTER
        }
        //gestureHandling: "greedy"
      },*/
      projects: projects,
      sliderRanges: {
        years: { min: 1970, max: 2019 },
        powers: { min: 0.1, max: 50000 },
      },
      map: null,
      markers: [],
      nbProjectFound: 0,
      applicationColors: {
        geothermal: "#F00",
        biomass: "#9f9",
        solar: "#ff9",
        "heat recovery": "#99f",
      },
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
  async mounted() {
    try {
      // initialize google map
      this.google = await gmapsInit();
      const element = document.getElementById("googleMap");
      this.map = new this.google.maps.Map(element, {
        center: new this.google.maps.LatLng(30, -10),
        zoom: 3,
      });

      // add the projects to the map
      this.displayProjects();
      this.nbProjectFound = this.markers.length;
    } catch (error) {
      console.error(error);
    }
  },
  methods: {
    // Reset the filters
    reset() {
      this.search.years = [
        this.sliderRanges.years.min,
        this.sliderRanges.years.max,
      ];
      this.search.powers = [
        this.sliderRanges.powers.min,
        this.sliderRanges.powers.max,
      ];
      this.search.applications = [
        "geothermal",
        "biomass",
        "solar",
        "heat recovery",
      ];
      this.search.showInConstruction = true;

      this.filterProjects();
    },
    displayProjects() {
      this.projects.forEach((project) => {
        // build a marker for the project
        const coordinates = project["GPS Coordinates"].split(",");
        if (!coordinates) {
          return;
        }
        const position = new this.google.maps.LatLng(
          coordinates[0],
          coordinates[1]
        );
        const color = this.applicationColors[project.Application];

        const marker = new this.google.maps.Marker({
          position,
          map: this.map,
          title: project.name,
          icon: {
            path: this.google.maps.SymbolPath.CIRCLE,
            scale: 4,
            fillColor: color,
            fillOpacity: 1,
            strokeWeight: 1,
          },
          properties: {
            application: project.Application,
            power: project["Project total installed capacity (kW)"],
            year: project["Commissioning Year"],
            manufacturer: project["Manufacturer"],
          },
        });
        // add the info window and open it when the user clicks
        // on the marker
        const infowindow = this.buildInfoWindow(project);
        marker.infowindow = infowindow;
        marker.addListener("click", function () {
          infowindow.open(this.map, marker);
        });

        this.markers.push(marker);
      });
    },

    buildInfoWindow(project) {
      function showValue(value) {
        if (!value) {
          return "?";
        }
        return value;
      }
      let contentString =
        '<div id="content">' +
        `<h3>${project["Project name"]}</h3>` +
        '<div id="bodyContent" style="text-align:left;line-height: 1.2rem;">' +
        `<b>Manufacturer: </b>${project["Manufacturer"]}</br>` +
        `<b>Location: </b>${project["City"]}, ${project["Country"]}<br/>`;

      if (project["Commissioning Year"] != 3000) {
        contentString += `<b>Commissioning: </b>${project["Commissioning Year"]}<br/>`;
      } else {
        contentString += `<b>Commissioning: </b>In construction<br/>`;
      }

      contentString += `<b>Model: </b>${showValue(project["Model"])}<br/>`;
      contentString += `<b>Installed Capacity: </b>${showValue(
        project["Project total installed capacity (kW)"]
      )}<br/>`;
      contentString += `<b>Number of units: </b>${showValue(
        project["Number of units"]
      )}<br/>`;
      contentString += `<b>Working Fluid: </b>${showValue(
        project["Working Fluid"]
      )}</br>`;
      contentString += `<b>Turbine: </b>${showValue(project["Turbine"])}</br>`;

      if (project["Customer"]) {
        contentString += `<b>Customer: </b>${showValue(
          project["Customer"]
        )}</br>`;
      }
      if (project["Description"]) {
        contentString += `<br/><p>${project["Description"]}</p>`;
      }
      if (project["Image"]) {
        contentString += `<br/><img src="${project["Image"]}" style="max-width:400px;"/><br/><br/>`;
      }

      if (project["Manufacturer website"]) {
        contentString += `<b>Manufacturer website: </b><a target="_blank" href="${project["Manufacturer website"]}">${project["Manufacturer website"]}</a></p>`;
      }
      contentString += "</div>";

      const infowindow = new this.google.maps.InfoWindow({
        content: contentString,
      });
      return infowindow;
    },
    isProjectIncluded(project) {
      const filter = this.search;
      // filter by type of project
      if (
        !Object.prototype.hasOwnProperty.call(
          this.selectedApplicationMap,
          project.application
        )
      ) {
        return false;
      }

      // filter by date
      if (project.year == 3000) {
        if (!filter.showInConstruction) {
          return false;
        }
      } else if (
        project.year < filter.years[0] ||
        project.year > filter.years[1]
      ) {
        return false;
      }
      // filter by power
      if (
        project.power < filter.powers[0] ||
        project.power > filter.powers[1]
      ) {
        return false;
      }

      return true;
    },
    filterProjects() {
      let nb_shown = this.markers.length;
      this.markers.forEach((marker) => {
        let show = true;
        if (!this.isProjectIncluded(marker.properties)) {
          show = false;
          nb_shown--;
        }
        marker.setVisible(show);
      });
      this.nbProjectFound = nb_shown;
    },
  },
  computed: {
    selectedApplicationMap() {
      return this.search.applications.reduce(function (map, value) {
        map[value] = true;
        return map;
      }, {});
    },
    getMinMaxYears() {
      let minYear = 3000;
      let maxYear = 0;
      this.projects.forEach((project) => {
        let year = project["Commissioning Year"];
        if (year) {
          if (year < minYear) {
            minYear = year;
          }
          if (year < 3000 && year > maxYear) {
            maxYear = year;
          }
        }
      });
      return [minYear, maxYear];
    },
    getMaxCapacity() {
      let maxCapacity = 10000;
      this.projects.forEach((project) => {
        let power = project["Project total installed capacity (kW)"];
        if (power) {
          if (power > maxCapacity) {
            maxCapacity = power;
          }
        }
      });
      return maxCapacity;
    },
  },

  components: {
    "vue-slider": VueSlider,
  },
};
</script>

<style scoped>
#googleMap {
  position: absolute !important;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  width: 100vw;
  height: 100vh;
}

#search-panel {
  position: absolute;
  text-align: left;
  margin-top: 15px;
  padding: 15px;
  background-color: white;
  opacity: 0.9;
  max-width: 500px;
  z-index: 2;
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
