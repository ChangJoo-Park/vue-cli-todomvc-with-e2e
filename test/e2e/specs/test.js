// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

module.exports = {
  'TodoMVC App exists': function (browser) {
    // automatically uses dev Server port from /config.index.js
    // default: http://localhost:8080
    // see nightwatch.conf.js
    const devServer = browser.globals.devServerURL
    browser
      .url(devServer)
      .assert.urlEquals('http://localhost:8080/')
    const expectElement = browser.expect.element
    expectElement('.todoapp').to.be.present
    expectElement('.todoapp .header').to.be.present
    expectElement('.todoapp .header h1').to.be.present
    expectElement('.todoapp .header h1').text.to.equal('TodoMVC')
    browser.elements('css selector', '.todo', function (result) {
      const todoLength = result.value.length
      this.assert.equal(todoLength, 4, '최초 항목 수는 4개')
    })
    // Check Default Todos
  },
  'Add New Todo': function (browser) {
    browser
      .click('.new-todo')
      .setValue('.new-todo', ['      ', browser.Keys.ENTER])
      .pause(500)
      .getValue('.new-todo', function (result) {
        this.assert.equal(result.value, '', '빈칸으로 입력하면 초기화')
      })
      .elements('css selector', '.todo', function (result) {
        const newTodoLength = result.value.length
        this.assert.equal(newTodoLength, 4, '빈칸으로 새 항목 추가 안됨')
      })
      .click('.new-todo')
      .setValue('.new-todo', ['Test NightWatch', browser.Keys.ENTER])
      .pause(500)
      .getValue('.new-todo', function (result) {
        this.assert.equal(result.value, '', '아이템 입력 후 초기화')
      })
      .elements('css selector', '.todo', function (result) {
        const newTodoLength = result.value.length
        this.assert.equal(newTodoLength, 5, '새 아이템이 추가되어 5개')
      })
  },
  'Update Todo [Change Title]': function (browser) {
    const oldTitle = 'Make First Vue.js App'
    const newTitle = 'Update First Vue.js App'
    browser.elements('css selector', '.todo:first-child', function (result) {
      const firstTodo = result.value[0]
      this.elementIdText(firstTodo.ELEMENT, function (result) {
        this.assert.equal(result.value, oldTitle, '현재 항목은 ', oldTitle)
      })
      this.elementIdClick(firstTodo.ELEMENT).doubleClick()
    })
      .pause(300)
    const targetTodo = '.todo:first-child input[type="text"]'
    browser.expect.element(targetTodo).to.be.present
    browser.expect.element(targetTodo).to.have.value.that.equals(oldTitle)
    browser.clearValue(targetTodo)
    browser.setValue(targetTodo, [newTitle, browser.Keys.ENTER])
      .expect.element(targetTodo).to.have.value.that.equals(newTitle)
  },
  'Update Todo [Change Completed]': function (browser) {
    const targetTodoCheckbox = '.todo:first-child input[type="checkbox"]'
    browser.expect.element(targetTodoCheckbox).to.not.be.selected
    browser.expect.element('.todo:nth-child(2) input[type="checkbox"]').to.be.selected
    browser.click(targetTodoCheckbox)
    browser.expect.element(targetTodoCheckbox).to.be.selected
    browser.click(targetTodoCheckbox)
    browser.expect.element(targetTodoCheckbox).to.not.be.selected
  },
  'Filter Active': function (browser) {
    const activeFilter = '.filters a[href="#/active"]'
    const allFilter = '.filters a[href="#/all"]'
    browser.click(activeFilter)
    browser
      .elements('css selector', '.todo', function (result) {
        const todoLength = result.value.length
        this.assert.equal(todoLength, 4, '미완료 항목은 4개이어야함')
      })
    browser.assert.urlContains('active', 'URL은 active 상태이어야 함')
    browser.click(allFilter)
    browser
      .elements('css selector', '.todo', function (result) {
        const todoLength = result.value.length
        this.assert.equal(todoLength, 5, '모든 항목은 5개이어야함')
      })
    browser.assert.urlContains('all', 'URL은 all 상태이어야 함')
  },
  'Filter Completed': function (browser) {
    const completedFilter = '.filters a[href="#/completed"]'
    const allFilter = '.filters a[href="#/all"]'
    browser.click(completedFilter)
    browser
      .elements('css selector', '.todo', function (result) {
        const todoLength = result.value.length
        this.assert.equal(todoLength, 1, '완료 항목은 1개이어야함')
      })
    browser.assert.urlContains('completed', 'URL은 completed 상태이어야 함')
    browser.click(allFilter)
    browser
      .elements('css selector', '.todo', function (result) {
        const todoLength = result.value.length
        this.assert.equal(todoLength, 5, '모든 항목은 5개이어야함')
      })
    browser.assert.urlContains('all', 'URL은 all 상태이어야 함')
  },
  'All Uncompleted': function (browser) {
    browser.click('.toggle-all').elements('css selector', '.todo.completed', function (result) {
      this.assert.equal(result.value.length, 5, '모두 완료한 개수는 5')
    }).click('.toggle-all').elements('css selector', '.todo.completed', function (result) {
      this.assert.equal(result.value.length, 0, '완료한 개수는 0')
    })
  },
  'Delete Todo': function (browser) {
    browser
      .elements('css selector', '.todo', function (result) {
        const todoLength = result.value.length
        this.assert.equal(todoLength, 5, '현재 아이템 수는 5개이어야함')
      }).pause(2000)
    const destroyButton = '.todo:first-child .view .destroy'
    browser
      .expect.element(destroyButton).to.be.present
    browser
      .expect.element('.todo:first-child .view label').text.to.equal('Update First Vue.js App')
    browser
      .moveToElement('.todo:first-child', 0, 0)
      .waitForElementVisible(destroyButton, 1000)
      .click(destroyButton)
      .elements('css selector', '.todo', function (result) {
        this.assert.equal(result.value.length, 4)
      })
  },
  'All Completed and Clear All Todos': function (browser) {
    browser.click('.toggle-all').elements('css selector', '.todo.completed', function (result) {
      this.assert.equal(result.value.length, 4, '모두 완료한 개수는 4')
    }).click('.clear-completed').elements('css selector', '.todo', function (result) {
      this.assert.equal(result.value.length, 0, '삭제 후 개수는 0')
    })
    browser.end()
  }
}
