<template>
  <q-item :class="{ done: todo.isDone }">
    <template v-if="isEditing">
      <q-item-section>
        <q-input
          :model-value="editedtaskName"
          @update:model-value="$emit('update:editedtaskName', $event)"
          @keyup.enter="$emit('save')"
          @keyup.esc="$emit('cancel')"
          dense
          autofocus
        />
        <q-input
          :model-value="editedDueDate"
          @update:model-value="$emit('update:editedDueDate', $event)"
          label="Due Date"
          placeholder="YYYY-MM-DD"
          dense
          class="q-mt-xs"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover>
                <q-date
                  :model-value="editedDueDate"
                  @update:model-value="$emit('update:editedDueDate', $event)"
                  placeholder="YYYY-MM-DD"
                >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
            <q-icon
              v-if="editedDueDate"
              name="cancel"
              class="cursor-pointer"
              @click="$emit('update:editedDueDate', null)"
            />
          </template>
        </q-input>
      </q-item-section>

      <q-item-section side>
        <div class="row q-gutter-sm">
          <q-btn square dense padding="sm" color="positive" icon="check" @click="$emit('save')" />
          <q-btn square dense padding="sm" color="warning" icon="close" @click="$emit('cancel')" />
        </div>
      </q-item-section>
    </template>

    <template v-else>
      <q-item-section avatar>
        <q-checkbox
          :model-value="todo.isDone"
          @update:model-value="$emit('toggle')"
          color="primary"
        />
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ todo.taskName }}</q-item-label>
        <q-item-label caption v-if="todo.dueDate" class="q-mt-xs">
          <q-badge color="grey-7">
            <q-icon name="event" size="14px" class="q-mr-xs" />
            {{ formattedDate }}
          </q-badge>
        </q-item-label>
      </q-item-section>

      <q-item-section side>
        <div class="row q-gutter-sm">
          <q-btn square dense padding="sm" color="primary" icon="edit" @click="$emit('edit')" />
          <q-btn
            square
            dense
            padding="sm"
            color="negative"
            icon="delete"
            @click="$emit('delete')"
          />
        </div>
      </q-item-section>
    </template>
  </q-item>
</template>

<style scoped>
@media (max-width: 600px) {
  .q-btn {
    font-size: 10px;
  }
}
</style>
<script>
import { date } from 'quasar'

export default {
  props: {
    todo: Object,
    isEditing: Boolean,
    editedtaskName: String,
    editedDueDate: String,
  },

  emits: [
    'toggle',
    'delete',
    'edit',
    'save',
    'cancel',
    'update:editedtaskName',
    'update:editedDueDate',
  ],

  computed: {
    formattedDate() {
      if (!this.todo.dueDate) {
        return ''
      }
      return date.formatDate(this.todo.dueDate, 'MMM D, YYYY')
    },
  },
}
</script>

<style>
.done .q-item__label {
  text-decoration: line-through;
  color: #777;
}
</style>
