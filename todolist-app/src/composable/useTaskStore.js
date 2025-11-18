import axios from 'axios';
import { defineStore } from 'pinia';

const API_URL = 'http://localhost:3000/tbl_tasks';

export const useTaskStore = defineStore('taskStore', {
  state: () => ({
    taskCount: 0,
    completedTaskCount: 0
  }),

  actions:{
  async fetchTaskCount() {
  try {
    const response = await axios.get(`${API_URL}/count`);
    this.taskCount = response.data.count;
  } catch (error) {
    console.error('Error fetching task count:', error);
  }
},
incrementCount() {
  this.taskCount++;
},
decrementCount() {
  this.taskCount--;
},
async fetchCompletedTaskCounts() {
  try {
    const response = await axios.get(`${API_URL}/counts`);
    this.completedTaskCount = response.data.completed;
  } catch (error) {
    console.error('Error fetching task counts:', error);
  }
},
incrementCompletedCount() {
  this.completedTaskCount++;
},
decrementCompletedCount() {
  this.completedTaskCount--;
},
}

})

// export default {


//   methods: {
//   async fetchTaskCount() {
//   try {
//     const response = await axios.get(`${API_URL}/count`);
//     this.taskCount = response.data.count;
//   } catch (error) {
//     console.error('Error fetching task count:', error);
//   }
// },

// incrementCount() {
//   this.taskCount++;
// },
// decrementCount() {
//   this.taskCount--;
// },
// async fetchCompletedTaskCounts() {
//   try {
//     const response = await axios.get(`${API_URL}/counts`);
//     this.completedTaskCount = response.data.completed;
//   } catch (error) {
//     console.error('Error fetching task counts:', error);
//   }
// },
// incrementCompletedCount() {
//   this.completedTaskCount++;
// },
// decrementCompletedCount() {
//   this.completedTaskCount--;
// },
//   },
// }

