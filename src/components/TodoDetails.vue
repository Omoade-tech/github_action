<script setup>
import {ref, computed, onMounted } from 'vue';
import { useTodoStore } from '@/stores/todo';
  

const todoStore = useTodoStore();

const userInput = ref("");
const searchInput = ref("");

//load saved todos when the commponent is mounted
onMounted(() => {
todoStore.loadTodosFromStorage();
});

const addItem = () => {
    if(userInput.value.trim() !=="") {
        const newItem = {
            id: Math.random(),
            value: userInput.value.trim(),
            completed: false,
        }
        todoStore.addTodo(newItem);
        userInput.value = "";
    }
};

const editItem = (index) => {
    // set input field with selected todo test
    userInput.value = todoStore.todos[index].value
    // Temporarily delete the item for re-adding `addItem()`
    todoStore.deleteTodo(index)
};

const deleteItem = (index) => {
    const deleteTodo = confirm("Are you sure you want to delete the todo?")
    if (deleteTodo) {
        todoStore.deleteTodo(index);
    }
};

const toggleCompleted = (index) => {
    todoStore.toggleCompleted(index);
};

const filteredList = computed(() =>{
    return todoStore.todos.filter((item) => item.value.toLowerCase().includes(searchInput.value.toLowerCase()))
})
</script>




<template>
    <div>
        <header>
            <nav class="navbar">
                <h1>Simple Todo crud</h1>
                <div class="logo">
                    <img src="" alt="">
                </div>
            </nav>
        </header>

        <div class="container">
            <h1 class="title">
                Todo List Application
            </h1>
            <hr />
            <div class="input-group">
                <input type="text" class="form-control" v-model="userInput" @keyup.enter="addItem" />

                <button class="btn-success" @click="addItem">
                    Add todo
                </button>
            </div>

            <div class="input-group">
                <input type="text" class="form-control" v-model="searchInput" @keyup.enter="searchInput" />

            </div>

            <div class="input-group"></div>

            <div class="todo-table">
                <div class="table-header">
                    <div class="table-cell">Tasks</div>
                    <div class="table-cell">Actions</div>
                </div>

                <div class="table-body">
                    <div class="table-row" v-for="(item, index) in filteredList" :key="index"
                        :class="{ 'even-row': index % 2 === 0, completed: item.completed }">
                        <div class="table-cell" :class="{ 'completed-cell': item.completed }">
                            {{ item.value }}
                        </div>

                        <div class="table-cell">
                            <button 
                            class="btn-primary btn" 
                            @click="toggleCompleted(index)">
                                {{ item.completed ? "Undo" : "Complete" }}
                            </button>
                            <button 
                            class="btn-info btn"
                            @click="editItem(index)">
                                Edit
                            </button>

                            <button class="btn-danger btn" @click="deleteItem(index)">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>




<style src="../assets/main.css">

</style>