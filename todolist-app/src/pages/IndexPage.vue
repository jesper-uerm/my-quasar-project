<template>
  <q-page class="column items-center q-pa-md">
    <div class="q-pa-md q-mx-auto" style="width: 100%; max-width: 600px">
      <q-input v-model="newTodo" label="New Task" @keyup.enter="addTodo">
        <template v-slot:append>
          <q-btn @click="addTodo" round dense flat icon="add" />
        </template>
      </q-input>
      <q-input
        v-model="newTodoDueDate"
        label="Due Date (optional)"
        placeholder="YYYY-MM-DD"
        filled
        dense
        class="q-mt-sm"
      >
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy cover>
              <q-date
                v-model="newTodoDueDate"
                placeholder="YYYY-MM-DD"
                @update:model-value="alert('Date changed: ' + $event)"
              >
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>

          <q-icon
            v-if="newTodoDueDate"
            name="cancel"
            class="cursor-pointer"
            @click="newTodoDueDate = null"
          />
        </template>
      </q-input>
    </div>
    <q-card class="q-pa-md" style="width: 100%; max-width: 900px">
      <p class="text-center text-weight-bold text-h5">TASKS LIST</p>
      <q-list bordered separator class="q-px-xl text-subtitle2 text-weight-light">
        <TodoItem
          v-for="todo in todos"
          :key="todo.id"
          :todo="todo"
          :is-editing="todo.id === editingTodoId"
          :editedtaskName="editingTodotaskName"
          @update:editedtaskName="editingTodotaskName = $event"
          :edited-due-date="editingTodoDueDate"
          @update:edited-due-date="editingTodoDueDate = $event"
          @toggle="toggleTodoStatus(todo.id)"
          @delete="deleteTodo(todo.id)"
          @edit="startEdit(todo)"
          @save="saveEdit"
          @cancel="cancelEdit"
        />
      </q-list>
    </q-card>
  </q-page>
</template>

<style scoped>
@media (max-width: 600px) {
  .q-list {
    font-size: 15px;
    font-weight: 400;
    padding: 0;
  }
}
</style>

<script>
import axios from "axios";
import { mapState, mapActions } from "pinia";
import TodoItem from "components/TodoItem.vue";
import { useTaskStore } from "src/composable/useTaskStore.js";

const API_URL = "http://localhost:3000/tbl_tasks";

export default {
  components: {
    TodoItem,
  },

  data() {
    return {
      newTodo: "",
      newTodoDueDate: "",
      todos: [],
      editingTodoId: null,
      editingTodotaskName: "",
      editingTodoDueDate: "",
    };
  },

  computed: {
    ...mapState(useTaskStore, ["taskCount", "completedTaskCount"]),
  },

  methods: {
    ...mapActions(useTaskStore, [
      "fetchTaskCount",
      "incrementCount",
      "decrementCount",
      "incrementCompletedCount",
      "decrementCompletedCount",
    ]),

    async fetchTodos() {
      try {
        const response = await axios.get(API_URL);
        this.todos = response.data.filter((task) => task && task.id);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    },

    async addTodo() {
      if (this.newTodo.trim() !== "") {
        try {
          const response = await axios.post(API_URL, {
            taskName: this.newTodo,
            dueDate: this.newTodoDueDate,
          });
          if (response.data && response.data.id) {
            this.$q.notify({
              message: "New task added successfully!",
              color: "positive",
              icon: "check_circle",
              position: "top",
            });
            this.todos.unshift(response.data);
            this.incrementCount();
            this.newTodo = "";
            this.newTodoDueDate = null;
          } else {
            throw new Error("Invalid response from server");
          }
        } catch (error) {
          console.error("Error adding todo:", error);
        }
      } else {
        this.$q.notify({
          message: "Please fill task field.",
          color: "negative",
          icon: "warning",
          position: "top",
        });
      }
    },

    async updateTodo(todo) {
      try {
        await axios.put(`${API_URL}/${todo.id}`, todo);
      } catch (error) {
        console.error("Error updating todo:", error);
      }
    },

    toggleTodoStatus(id) {
      const todo = this.todos.find((t) => t.id === id);
      if (todo) {
        todo.is_done = !todo.is_done;

        if (todo.is_done) {
          todo.date_completed = new Date().toISOString;
          this.decrementCount();
          this.incrementCompletedCount();
        } else {
          todo.date_completed = null;
          this.incrementCount();
          this.decrementCompletedCount();
        }
        this.updateTodo(todo);
      }
    },

    startEdit(todo) {
      this.editingTodoId = todo.id;
      this.editingTodotaskName = todo.taskName;
      this.editingTodoDueDate = todo.dueDate;
    },

    saveEdit() {
      if (this.editingTodoId === null) return;
      const todo = this.todos.find((t) => t.id === this.editingTodoId);

      if (todo && this.editingTodotaskName.trim()) {
        todo.taskName = this.editingTodotaskName.trim();
        todo.dueDate = this.editingTodoDueDate;
        this.updateTodo(todo);
      }
      this.cancelEdit();
    },

    cancelEdit() {
      this.editingTodoId = null;
      this.editingTodotaskName = "";
      this.editingTodoDueDate = null;
    },

    async deleteTodo(id) {
      this.$q
        .dialog({
          title: "Confirm Delete",
          message: "Are you sure you want to permanently delete this task?",
          ok: {
            label: "YES",
            color: "negative",
            flat: false,
          },
          cancel: {
            label: "NO",
            color: "white",
            textColor: "black",
            flat: false,
          },
        })
        .onOk(async () => {
          try {
            await axios.delete(`${API_URL}/${id}`);
            const index = this.todos.findIndex((t) => t.id === id);

            if (index !== -1) {
              this.todos.splice(index, 1);
              this.decrementCount();
              this.decrementCompletedCount();
            }
          } catch (error) {
            console.error("Error deleting todo:", error);
          }
        });
    },
  },

  mounted() {
    this.fetchTodos();
    this.fetchTaskCount();
  },
};
</script>
<style scoped></style>
