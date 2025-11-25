<template>
  <q-page class="q-pa-md">
    <q-card
      class="q-mt-md relative-position q-pa-sm q-mx-auto"
      style="width: 100%; max-width: 900px"
    >
      <q-card-section>
        <p class="text-center text-weight-bold text-h5 q-pt-md">COMPLETED TASKS</p>
        <div class="q-pa-md">
          <q-table
            flat
            bordered
            :rows="rows"
            :columns="columns"
            row-key="name"
            class="completedTasks-table"
          />
        </div>
      </q-card-section>
      <q-inner-loading :showing="isLoading">
        <q-spinner-gears size="60px" color="primary" />
      </q-inner-loading>
    </q-card>
  </q-page>
</template>
<style scoped>
.completedTasks-table ::v-deep(td) {
  font-size: 13px;
}
.completedTasks-table ::v-deep(th) {
  font-size: 16px;
  font-weight: bold;
}
</style>
<script>
import axios from 'axios'

const API_URL = 'http://localhost:3000/tbl_tasks'

export default {
  data() {
    return {
      allTasks: [],
      isLoading: true,
      columns: [
        {
          name: 'taskName',
          label: 'Task',
          field: 'taskName',
          align: 'center',
          sortable: true,
        },
        {
          name: 'dateCompleted',
          label: 'Date Completed',
          field: 'dateCompleted',
          align: 'center',
          sortable: true,
          format: (val) => new Date(val).toLocaleDateString(),
        },
      ],
    }
  },

  computed: {
    rows() {
      return this.allTasks.filter((task) => task.isDone === true)
    },
  },

  methods: {
    async fetchTodos() {
      try {
        const response = await axios.get(API_URL)
        this.allTasks = response.data
      } catch (error) {
        console.error('Error fetching todos:', error)
      } finally {
        this.isLoading = false
      }
    },
  },

  mounted() {
    this.fetchTodos()
  },
}
</script>
