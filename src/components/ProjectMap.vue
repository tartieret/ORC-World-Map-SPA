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
              <b-form-checkbox value="Waste to Energy"
                >Waste to Energy</b-form-checkbox
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

          <h4>Construction year</h4>
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

// import projects from "../assets/data_all.json";

export default {
  name: "project-map",
  data: function () {
    return {
      isLoading: false,
      projects: [],
      search: {
        showInConstruction: true,
        powers: [0, 50000],
        years: [1970, 2021],
        applications: [
          "geothermal",
          "biomass",
          "solar",
          "heat recovery",
          "Waste to Energy",
        ],
      },
      sliderRanges: {
        years: { min: 1970, max: 2021 },
        powers: { min: 0, max: 50000 },
      },
      map: null,
      markers: [],
      nbProjectFound: 0,
      applicationColors: {
        geothermal: "#F00",
        biomass: "#9f9",
        solar: "#ff9",
        "heat recovery": "#99f",
        "Waste to Energy": "#99f",
      },
      icons: {
        geothermal: "/icons/geothermal.png",
        solar: "/icons/solar.png",
        biomass: "/icons/biomass.png",
        "heat recovery": "/icons/heat_recovery.png",
        "Waste to Energy": "/icons/heat_recovery.png",
      },
    };
  },
  async created() {
    await this.loadProjects();

    // this.initializeFilters();

    try {
      // initialize google map
      this.google = await gmapsInit();
      const element = document.getElementById("googleMap");
      this.map = new this.google.maps.Map(element, {
        center: new this.google.maps.LatLng(30, -10),
        zoom: 3,
        mapTypeControl: true,
        mapTypeControlOptions: {
          style: this.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          position: this.google.maps.ControlPosition.BOTTOM_CENTER,
        },
      });

      // add the projects to the map
      this.displayProjects();
      this.nbProjectFound = this.markers.length;
    } catch (error) {
      console.error(error);
    }
  },
  methods: {
    async loadProjects() {
      this.isLoading = true;
      console.log("Load projects");
      await this.$store
        .dispatch("loadProjects")
        .then((projects) => {
          this.projects = projects;
          console.debug(projects);
        })
        .catch(() => {})
        .finally(() => {
          this.isLoading = false;
        });
    },
    initializeFilters() {
      console.debug(this.projects);
      // adjust the year slider range based on the project data
      this.search.years = this.getMinMaxYears;
      this.sliderRanges.years.min = this.search.years[0];
      this.sliderRanges.years.max = this.search.years[1];
      // adjust the capacity slider range based on the project data
      this.search.powers = [0, this.getMaxCapacity];
      this.sliderRanges.powers.min = this.search.powers[0];
      this.sliderRanges.powers.max = this.search.powers[1];
    },
    getIconUrl(application) {
      let baseUrl = "https://orc-world-map.org";
      if (process.env.NODE_ENV == "development") {
        baseUrl = "http://localhost:8080";
      }
      return baseUrl + this.icons[application];
    },
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
        if (
          !("Latitude" in project) ||
          !("Longitude" in project) ||
          !project["Latitude"] ||
          !project["Longitude"] ||
          project["Application"] == "other"
        ) {
          return;
        }

        const position = new this.google.maps.LatLng(
          project["Latitude"],
          project["Longitude"]
        );

        const marker = new this.google.maps.Marker({
          position,
          map: this.map,
          title: project.Name,
          icon: this.getIconUrl(project.Application),
          properties: {
            application: project.Application,
            power: project["Total_installed_power_kWel"],
            year: project["Year_of_construction"],
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
        `<h3>${project["Name"]}</h3>` +
        '<div id="bodyContent" style="text-align:left;line-height: 1.2rem;">' +
        `<b>Manufacturer: </b>${project["Manufacturer"]}</br>`;
      if (project["City"]) {
        contentString += `<b>Location: </b>${project["City"]}, ${project["Country"]}<br/>`;
      } else {
        contentString += `<b>Location: </b>${project["Country"]}<br/>`;
      }

      contentString += `<b>Application: </b>${project["Application"]}`;
      if (project["Sub_application"]) {
        contentString += `- ${project["Sub_application"]}</br>`;
      } else {
        contentString += "</br>";
      }

      if (project["Year_of_construction"]) {
        contentString += `<b>Construction: </b>${project["Year_of_construction"]}<br/>`;
      } else {
        contentString += `<b>Construction: </b>In construction<br/>`;
      }

      contentString += `<b>Total Installed Capacity: </b>${showValue(
        project["Total_installed_power_kWel"]
      )} kWel<br/>`;
      contentString += `<b>Number of parallel units in the plant: </b>${showValue(
        project["Number_of_parallel_units_in_the_plant"]
      )}<br/>`;

      if (project["Description"]) {
        contentString += `<br/><p>${project["Description"]}</p>`;
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
      if (!project.year === null) {
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
        if (!this.isProjectIncluded(marker.properties)) {
          marker.setMap(null);
          nb_shown--;
        } else {
          marker.setMap(this.map);
        }
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
        let year = project["Year_of_construction"];
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
        let power = project["Total_installed_power_kWel"];
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
.loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
}
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
