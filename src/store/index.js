const STORAGE_KEY = 'todos-vuejs'
const localStorage = window.localStorage

module.exports = {
  fetch () {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  },
  save (todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }
}
