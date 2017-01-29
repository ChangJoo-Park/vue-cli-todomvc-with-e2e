const STORAGE_KEY = 'todos-vuejs'
const localStorage = window.localStorage
const defaultTodo = [
  { completed: false, title: 'Make First Vue.js App' },
  { completed: true, title: 'Buy The Majesty of Vue 2' },
  { completed: false, title: 'Join the Vue.js Slack' },
  { completed: false, title: 'Join the Vue.js Facebook group' }
]
module.exports = {
  fetch () {
    let todos = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (!todos) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultTodo))
      todos = JSON.parse(localStorage.getItem(STORAGE_KEY))
    }
    return todos
  },
  save (todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }
}
