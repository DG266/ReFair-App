<template>
  <div class="container" style="width: 100%; height: 100%">
    <v-layout justify-center align-center>
      <div class="row">
        <div>
          <h1>ReFair App</h1>

          <hr />

          <div class="alert alert-info fade show" role="alert">
            <strong>Info!</strong> To properly run the <b>ReFair</b> analysis,
            you should upload an xlsx file called "stories.xlsx".
            <hr />
            The spreadhsheet must contain only a single column called 'User
            Story' with all user stories to be analysed.
            <ul>
              <li>
                The <strong> Load </strong> Button allows you to upload the user
                stories spreadsheet;
              </li>
              <li>
                The <strong> Report </strong> Button allows you to download a
                structured JSON report with the user stories analysed by ReFair;
              </li>
              <li>
                After the stories uploading, the
                <strong> Analyze </strong> Button allows you to visualize the
                ReFair analysis with respect to a single user story.
              </li>
            </ul>
          </div>

          <div
            class="btn-toolbar mb-3 justify-content-between"
            role="toolbar"
            aria-label="Toolbar with button groups"
          >
            <div>
              <input
                type="file"
                class="form-control"
                @change="handleStoriesUpload($event)"
              />
            </div>
            <div>
              <button
                v-on:click="submitFile()"
                type="button"
                class="button load"
                style="margin-right: 20px"
              >
                <span class="button__text">Load</span>
                <span class="button__icon"
                  ><ion-icon name="cloud-upload-outline"></ion-icon
                ></span>
              </button>
              <button
                v-on:click="reportStories()"
                type="button"
                class="button report"
                id="report"
              >
                <span class="button__text">Report</span>
                <span class="button__icon"
                  ><ion-icon name="code-slash-outline"></ion-icon
                ></span>
              </button>
            </div>
          </div>
          <hr />

          <table class="table table-hover">
            <thead>
              <tr>
                <th scope="col">User Stories</th>

                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(story, index) in stories" :key="index">
                <td>{{ story }}</td>

                <td>
                  <div>
                    <button
                      type="button"
                      class="button analyze"
                      @click="toggleAnalyzeStoryModal(story)"
                    >
                      <span class="button__text">Analyze</span>
                      <span class="button__icon"
                        ><ion-icon name="analytics-outline"></ion-icon
                      ></span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </v-layout>
    <!-- analyze Story Modal -->
    <div
      ref="analyzeStoryModal"
      class="modal fade"
      :class="{
        show: activeAnalyzeStoryModal,
        'd-block': activeAnalyzeStoryModal,
      }"
      tabindex="-1"
      role="dialog"
    >
      <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Story Details</h5>
            <div>
              <button
                type="button"
                class="btn btn-danger"
                data-dismiss="modal"
                @click="closeAnalyzeStoryModal"
                style="margin-right: 10px"
              >
                Close
              </button>
              <button
                v-on:click="reportStory()"
                type="button"
                class="btn btn-success btn-md"
                id="report"
              >
                Report
              </button>
            </div>
          </div>
          <div class="modal-body">
            <p class="pt-3 mx-4"><b>User Story: </b> {{ story }}</p>
            <p class="pt-3 mx-4"><b>Story Domain: </b> {{ story_domain }}</p>
            <div class="pt-3 mx-4">
              <b>Story Tasks</b>
              <hr />
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th scope="col">Task</th>

                    <th scope="col">Sensitive Features</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(features, task) in story_tasks" :key="task">
                    <td>{{ task }}</td>
                    <td>{{ features.toString().replaceAll(",", " - ") }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div
              v-if="
                series[0]['data'].length != null &&
                series[0]['data'].length > 0 != []
              "
              class="pt-3 mx-4"
            >
              <apexchart
                width="1000"
                type="bar"
                :options="options"
                :series="series"
              ></apexchart>
            </div>
            <div v-else class="pt-3 mx-4">No sensitive features suggested</div>
          </div>
          <div class="modal-footer"></div>
        </div>
      </div>
    </div>

    <div v-if="activeAnalyzeStoryModal" class="modal-backdrop fade show"></div>
  </div>
</template>

<script>
import axios from "axios";
import dowloadjs from "downloadjs";

import VueApexCharts from "vue-apexcharts";

const server = "http://localhost:5001";

export default {
  data() {
    return {
      activeAnalyzeStoryModal: false,
      story: "",
      story_domain: "",
      story_tasks: [],
      stories: [],
      file: "",
      options: {
        chart: {
          id: "vuechart-example",
        },
        xaxis: {
          categories: [],
        },
      },
      series: [
        {
          name: "series-1",
          data: [],
        },
      ],
    };
  },
  methods: {
    handleStoriesUpload() {
      this.file = event.target.files[0];
    },

    reportStories() {
      let formData = new FormData();
      console.log(this.stories);
      formData.append("stories", JSON.stringify(this.stories));

      axios
        .post(server + "/reportStories", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log(res.data);
          dowloadjs(
            ("" + res.data).replaceAll("'", '"'),
            "report.json",
            "application/json"
          );
        })
        .catch((error) => {
          console.log(error);
        });
    },

    reportStory() {
      let formData = new FormData();
      console.log(this.story);
      formData.append("story", JSON.stringify(this.story));

      axios
        .post(server + "/reportStory", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log(res.data);
          dowloadjs(
            ("" + res.data).replaceAll("'", '"'),
            "report-" + this.story + ".json",
            "application/json"
          );
        })
        .catch((error) => {
          console.log(error);
        });
    },

    submitFile() {
      let formData = new FormData();
      formData.append("stories", this.file);

      axios
        .post(server + "/storiesload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          if (typeof res.data.stories === "undefined") {
            alert(res.data.motivation);
            this.stories = [];
          } else {
            const reportBtn = document.querySelector("#report");
            reportBtn.classList.remove("disabled");
            this.stories = res.data.stories;
          }
        })
        .catch(() => {
          this.stories = [];
        });
    },

    toggleAnalyzeStoryModal(story) {
      if (story) {
        this.story = story;
        let formData = new FormData();
        formData.append("story", this.story);

        axios
          .post(server + "/analyzeStory", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            this.story_domain = res.data.domain;
            this.story_tasks = res.data.tasks_features;

            console.log(this.story_tasks);
            const body = document.querySelector("body");
            this.activeAnalyzeStoryModal = !this.activeAnalyzeStoryModal;

            var data = [];

            Object.keys(res.data.features_counts).forEach(function (key) {
              data.push({
                x: key,
                y: [res.data.features_counts[key]],
              });
            });

            if (this.activeAnalyzeStoryModal) {
              this.series = [
                {
                  name: "occurrencies",
                  data: data,
                },
              ];
              console.log(this.series[0]["data"]);
              body.classList.add("modal-open");
            } else {
              body.classList.remove("modal-open");
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    },

    closeAnalyzeStoryModal() {
      const body = document.querySelector("body");
      this.activeAnalyzeStoryModal = !this.activeAnalyzeStoryModal;
      body.classList.remove("modal-open");
    },
  },
};
</script>
