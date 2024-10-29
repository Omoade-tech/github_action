import { mount } from "@vue/test-utils";

import { createPinia, setActivePinia } from "pinia";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

import TodoDetails from "../TodoDetails.vue";
import { useTodoStore } from "@/stores/todo";


// describe is used to group a related tests
describe('TodoDetails component', () => {
    let wrapper, todoStore;

    // beforeEach and afterEach set up before and after each test
    beforeEach(() =>{
        setActivePinia(createPinia())
        todoStore = useTodoStore()
        wrapper = mount(TodoDetails, {
            global: {
                plugins: [createPinia()]
            }
        })
    } )

    afterEach(() =>{
        wrapper.unmount()
    })

    it('adds a new todo item when addItem is called', async() =>{
        todoStore.addTodo({
            id: 1,
            value: 'New Task',
            completed: false
        })

        // verfy todo was added to the store
        expect(todoStore.todos).toHaveLength(1)      // expect is ude for assertions i.e checking if condition are met
        expect(todoStore.todos[0].value).toBe('New Task')
    })

    it('does not add an empty todo items', async () =>{
        wrapper.vm.userInput = "";  // vm allows us to have access to the components instance
        await wrapper.find('.btn-success').trigger('click')
        expect(todoStore.todos.length).toBe(0)
    })
    
    it('editing an existing todos item', async() =>{
        todoStore.addTodo({
            id: 1,
            value: 'Edit Task',
            completed: false
        })
        
        wrapper.vm.editItem(0)
        await wrapper.vm.$nextTick()

        expect(todoStore.todos[0].value).toBe('Edit Task')
    })

    it('delete a todo item when deleteItem is called', async () =>{
        // vi is a vitest object for mocking function, which is useful for simulating behaviour (e.g, confirmation).

        window.confirm = vi.fn(() => true)  // mock conform dialog
        wrapper.vm.deleteItem(0)

        expect(todoStore.todos.length).toBe(0)
    })

    it('toggles the completed status of a todo item when toggleCompleted is called', async () => {
    
        todoStore.addTodo({
            id: 1,
            value: 'Toggle Task',
            completed: false
        });
    
        expect(todoStore.todos[0].completed).toBe(false);
    
        await todoStore.toggleCompleted(0);
        expect(todoStore.todos[0].completed).toBe(true);
    
    
        await todoStore.toggleCompleted(0);
        expect(todoStore.todos[0].completed).toBe(false);
    });
    

    it('loads todos from localStorage when loadTodosFromStorage is called', async () => {
    
        localStorage.setItem('todos', JSON.stringify([{
         id: 1, 
         value: 'Test Todo',
          completed: false
         }]));
    
        
        await todoStore.loadTodosFromStorage();
    
        expect(todoStore.todos.length).toBe(1);
        expect(todoStore.todos[0].value).toBe('Test Todo');
        expect(todoStore.todos[0].completed).toBe(false);
    });
    
    
    
});