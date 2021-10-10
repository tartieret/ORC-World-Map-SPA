<template>
    <b-container fluid>
        <div
            v-if="isLoading"
            class="loadingOverlay h-100 row align-items-center text-center"
        >
            <div class="col">
                <b-spinner label="Loading projects..."></b-spinner>
                <p class="mt-2">Loading projects...</p>
            </div>
        </div>
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
                            <b-form-checkbox value="geothermal"
                                >Geothermal</b-form-checkbox
                            >
                            <b-form-checkbox value="biomass"
                                >Biomass</b-form-checkbox
                            >
                            <b-form-checkbox value="solar"
                                >Solar</b-form-checkbox
                            >
                            <b-form-checkbox value="heat_recovery"
                                >Heat Recovery</b-form-checkbox
                            >
                            <b-form-checkbox value="waste_to_energy"
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
                            Original website by
                            <a href="https://ca.linkedin.com/in/thomastartiere"
                                >Thomas Tartière</a
                            >. Database update by
                            <a
                                href="https://www.linkedin.com/in/marco-astolfi-16a5781a/"
                                >Marco Astolfi</a
                            >. <br />Last update 10/09/2021
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
    data: function() {
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
                    "heat_recovery",
                    "waste_to_energy",
                ],
            },
            sliderRanges: {
                years: { min: 1970, max: 2021 },
                powers: { min: 0, max: 50000 },
            },
            map: null,
            markers: [],
            nbProjectFound: 0,
            // applicationColors: {
            //   geothermal: "#F00",
            //   biomass: "#9f9",
            //   solar: "#ff9",
            //   heat_recovery: "#99f",
            //   waste_to_energy: "#99f",
            // },
            icons: {
                geothermal: "/icons/geothermal.png",
                solar: "/icons/solar.png",
                biomass: "/icons/biomass.png",
                heat_recovery: "/icons/heat_recovery.png",
                waste_to_energy: "/icons/waste_to_energy.png",
            },
        };
    },
    async created() {
        this.isLoading = true;

        await this.loadProjects();
        this.initializeFilters();

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

        this.isLoading = false;
    },
    methods: {
        async loadProjects() {
            console.debug(
                "Loading projects: ",
                this.$store.getters["getProjects"]
            );
            // check if the store already contains the projects
            const loadedProjects = this.$store.getters["getProjects"];
            if (loadedProjects.length === 0) {
                console.debug("Load projects from Google Sheet");
                // if not reload them from google sheet
                await this.$store
                    .dispatch("loadProjects")
                    .then((projects) => {
                        this.projects = projects;
                    })
                    .catch((error) => {
                        console.error("Failed to load projects: ", error);
                    });
            } else {
                console.debug("Found projects in Vuex store", loadedProjects);
                this.projects = loadedProjects;
            }
        },
        initializeFilters() {
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
                "heat_recovery",
                "waste_to_energy",
            ];
            this.search.showInConstruction = true;

            this.filterProjects();
        },
        displayProjects() {
            this.projects.forEach((project) => {
                // build a marker for the project
                if (
                    !("latitude" in project) ||
                    !("longitude" in project) ||
                    !project["latitude"] ||
                    !project["longitude"] ||
                    project["application"] == "other"
                ) {
                    return;
                }

                const position = new this.google.maps.LatLng(
                    project["latitude"],
                    project["longitude"]
                );

                const marker = new this.google.maps.Marker({
                    position,
                    map: this.map,
                    title: project.name,
                    icon: this.getIconUrl(project.application),
                    properties: {
                        application: project.application,
                        power: project["total_installed_power_kwel"],
                        year: project["year_of_construction"],
                        manufacturer: project["manufacturer"],
                    },
                });
                // add the info window and open it when the user clicks
                // on the marker
                const infowindow = this.buildInfoWindow(project);
                marker.infowindow = infowindow;
                marker.addListener("click", function() {
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
                `<h3>${project["name"]}</h3>` +
                '<div id="bodyContent" style="text-align:left;line-height: 1.2rem;">' +
                `<b>Manufacturer: </b>${project["manufacturer"]}</br>`;
            if (project["City"]) {
                contentString += `<b>Location: </b>${project["city"]}, ${project["country"]}<br/>`;
            } else {
                contentString += `<b>Location: </b>${project["country"]}<br/>`;
            }

            contentString += `<b>Application: </b>${project["application"]}`;
            if (project["sub_application"]) {
                contentString += `- ${project["sub_application"]}</br>`;
            } else {
                contentString += "</br>";
            }

            if (project["year_of_construction"]) {
                contentString += `<b>Construction: </b>${project["year_of_construction"]}<br/>`;
            } else {
                contentString += `<b>Construction: </b>In construction<br/>`;
            }

            contentString += `<b>Total Installed Capacity: </b>${showValue(
                project["total_installed_power_kwel"]
            )} kWel<br/>`;
            contentString += `<b>Number of parallel units in the plant: </b>${showValue(
                project["number_of_parallel_units_in_the_plant"]
            )}<br/>`;

            if (project["Description"]) {
                contentString += `<br/><p>${project["description"]}</p>`;
            }
            if (project["Manufacturer website"]) {
                contentString += `<b>Manufacturer website: </b><a target="_blank" href="${project["manufacturer website"]}">${project["manufacturer website"]}</a></p>`;
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
            if (project.year === null || project.year === "") {
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
            return project;
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
            return this.search.applications.reduce(function(map, value) {
                map[value] = true;
                return map;
            }, {});
        },
        getMinMaxYears() {
            let minYear = 2000;
            let maxYear = 2001;
            this.projects.forEach((project) => {
                let year = project["year_of_construction"];
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
                let power = project["total_installed_power_kwel"];
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
.loadingOverlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    background-color: white;
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

#checkbox_geothermal:before {
    background-color: red;
}
#checkbox_geothermal
    #checkbox_geothermal_input:checked
    ~ .checkbox_geothermal_label::before {
    background-color: black;
}

.custom-control-input:checked ~ .custom-control-label::before {
    color: #fff;
    border-color: #f00;
    background-color: #f00;
}
</style>
