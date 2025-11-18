<template>
  <q-layout view="lHh lpR fFf">
    <q-header elevated class="bg-light-blue-10 text-white" height-hint="98">
      <q-toolbar>
        <!-- <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" /> -->
        <q-toolbar-title>
          <h4
            class="text-weight-bold row items-center justify-center q-pt-lg q-gutter-sm"
          >
            <q-icon name="list_alt" style="font-size: 50px" />
            <span class="q-ml-sm"> QUASAR TODO-LIST </span>
          </h4>
        </q-toolbar-title>
      </q-toolbar>

      <q-tabs class="row bg-blue-7">
        <q-route-tab to="/" class="col-6">
          <div class="row items-center q-gutter-x-sm text-subtitle1">
            <p class="q-ma-sm text-weight-medium">To Do</p>
            <q-badge vNext v-if="taskCount > 0" color="red" floating>
              {{ taskCount }}
            </q-badge>
            <q-icon name="list" style="font-size: 28px" />
          </div>
        </q-route-tab>
        <q-route-tab to="/completed" class="col-6">
          <div class="row items-center q-gutter-x-sm text-subtitle1">
            <p class="q-ma-sm text-weight-medium">Completed</p>
            <q-badge v-if="completedTaskCount > 0" color="green" floating>
              {{ completedTaskCount }}
            </q-badge>
            <q-icon name="done_all" style="font-size: 28px" />
          </div>
        </q-route-tab>
      </q-tabs>
    </q-header>

    <!-- <q-drawer show-if-above v-model="leftDrawerOpen" side="left" elevated>
    </q-drawer> -->

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapState, mapActions } from "pinia";
import { useTaskStore } from "src/composable/useTaskStore.js";

export default {
  data() {
    return {
      leftDrawerOpen: false,
    };
  },

  computed: {
    ...mapState(useTaskStore, ["taskCount", "completedTaskCount"]),
  },

  methods: {
    ...mapActions(useTaskStore, ["fetchTaskCount", "fetchCompletedTaskCounts"]),

    // toggleLeftDrawer() {
    //   this.leftDrawerOpen = !this.leftDrawerOpen;
    // },
  },

  mounted() {
    this.fetchTaskCount();
    this.fetchCompletedTaskCounts();
  },
};

// const leftDrawerOpen = ref(false);

// function toggleLeftDrawer() {
//   leftDrawerOpen.value = !leftDrawerOpen.value;
// }
</script>
