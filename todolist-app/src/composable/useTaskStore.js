import { ref } from 'vue';
import axios from 'axios';

const taskCount = ref(0);
const completedTaskCount = ref(0);
const API_URL = 'http://localhost:3000/tbl_tasks';


async function fetchTaskCount() {
  try {
    const response = await axios.get(`${API_URL}/count`);
    taskCount.value = response.data.count;
  } catch (error) {
    console.error('Error fetching task count:', error);
  }
}

function incrementCount() {
  taskCount.value++;
}

function decrementCount() {
  taskCount.value--;

}

async function fetchCompletedTaskCounts() {
  try {
    const response = await axios.get(`${API_URL}/counts`);
    completedTaskCount.value = response.data.completed;
  } catch (error) {
    console.error('Error fetching task counts:', error);
  }
}

function incrementCompletedCount() {
  completedTaskCount.value++;
}

function decrementCompletedCount() {
  completedTaskCount.value--;
}

export function useTaskStore() {
  return {
    taskCount,
    fetchTaskCount,
    incrementCount,
    decrementCount,
    incrementCompletedCount,
    decrementCompletedCount,
    completedTaskCount,
    fetchCompletedTaskCounts,
  };
}
