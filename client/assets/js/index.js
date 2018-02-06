var gui = require('nw.gui')

// Create an empty menu
var todoListMenu = new gui.Menu()
var delListMenu = new gui.Menu()
var compListMenu = new gui.Menu()

const defaultTaskName = 'New Task'
const defaultGreetName = 'guest'

new Vue({
  el: '#app',
  data: {
    status: TYPE_TODO, // TYPE_TODO, TYPE_COMPLETED, TYPE_DELETED
    taskList: [],
    mainContent: '',
    editing: false,
    taskId: null,
    namingNewTask: false,
    newTaskName: defaultTaskName,
    changedTaskName: '',
    renamingTask: false,
    greetName: defaultGreetName,
    username: '',
    password: '',
    logged: false,
    formShow: false,
    formAsLogin: false,
    formErrMsg: '',
    dialogShow: '',
    token: '',
  },
  mounted: function() {
    this.watchTaskList()
    if (ls.user) {
      var user = JSON.parse(ls.user)
      this.greetName = user.name
      this.token = user.token
      this.logged = true
      var self = this
      setTimeout(function() {
        self.taskList = getTaskList(self.status)
      }, 50)
    } else {
      this.taskList = getTaskList(this.status)
    }
    this.initListsMenus()
  },
  computed: {
    fieldsFilled: function() {
      if (this.username) {
        this.username = this.username.trim()
      }
      if (this.password) {
        this.password = this.password.trim()
      }
      if (!this.username || !this.password) {
        return false
      }
      return true
    },
  },
  watch: {
    logged: function(newVal, oldVal) {
      var self = this
      if (!newVal) {
        getTaskList = function (type) { // get taskList by type
          if (type === TYPE_TODO) {
            return JSON.parse(ls.taskList1)
          } else if (type === TYPE_COMPLETED) {
            return JSON.parse(ls.taskList2)
          } else if (type === TYPE_DELETED) {
            return JSON.parse(ls.taskList3)
          }
          return null
        }
        persistTaskList = function (taskList, type) {
          if (type === TYPE_TODO) {
            ls.taskList1 = JSON.stringify(taskList)
          } else if (type === TYPE_COMPLETED) {
            ls.taskList2 = JSON.stringify(taskList)
          } else if (type === TYPE_DELETED) {
            ls.taskList3 = JSON.stringify(taskList)
          }
        }
      } else {
        getTaskList = function (type) { // get taskList by type
          var param = {}
          if (self.token) {
            param['token'] = self.token
          }
          var data = fetchData('get', '/getTaskLists', param)
          if (type === TYPE_TODO) {
            return data.taskList1 || []
          } else if (type === TYPE_COMPLETED) {
            return data.taskList2 || []
          } else if (type === TYPE_DELETED) {
            return data.taskList3 || []
          }
          return []
        }
        persistTaskList = function (taskList, type) {
          var token = self.token
          fetchData('post', '/updateTaskList', {
            type: type,
            taskList: taskList,
            token: token,
          })
        }
      }
    }
  },
  methods: {
    getNum: function(type) {
      return getTaskList(type).length
    },
    logout: function() {
      this.logged = false
      this.greetName = defaultGreetName
      var self = this
      this.user = null
      ls.user = ''
      setTimeout(function() {
        self.taskList = getTaskList(self.status)
      }, 50)
    },
    hideDialog: function() {
      this.dialogShow = false
      this.username = ''
      this.password = ''
    },
    showDialog: function() {
      this.dialogShow = true
    },
    hideForm: function() {
      this.formShow = false
      this.username = ''
      this.password = ''
      this.formErrMsg = ''
    },
    showForm: function() {
      this.formShow = true
    },
    signinClick: function() {
      this.formAsLogin = true
      this.showForm()
    },
    signupClick: function() {
      this.formAsLogin = false
      this.showForm()
    },
    signin: function() {
      var res = fetchData('post', '/login', {
        name: this.username,
        password: this.password
      })
      if (res.code !== 0) {
        this.formErrMsg = res.msg
      } else {
        this.logged = true
        this.formErrMsg = ''
        this.token = res.data.token
        ls.user = JSON.stringify({
          name: res.data.name,
          token: res.data.token
        })
        this.hideForm()
        var self = this
        setTimeout(function() {
          self.greetName = res.data.name
          self.taskList = getTaskList(self.status)
        }, 50)
      }
    },
    signup: function() {
      var name = this.username
      var password = this.password
      var res = fetchData('post', '/register', {
        name: name,
        password: password
      })
      if (res.code !== 0) {
        this.formErrMsg = res.msg
      } else {
        this.hideForm()
        this.showDialog()
        this.username = name
        this.password = password
      }
    },
    signinConfirm: function() {
      this.signin(this.username, this.password)
      this.hideDialog()
    },
    onContentEditing: function(mainContent) {
      this.updateTaskContent(mainContent)
    },
    namingCompleted: function(newTaskName) {
      this.namingNewTask = false
      this.taskList.push({
        id: getMaxId() + 1,
        type: this.status,
        name: newTaskName,
        active: true,
        content: ''
      })
      persistTaskList(this.taskList, this.status)
      this.newTaskName = defaultTaskName
    },
    renamingCompleted: function(changedTaskName) {
      var task = getTask(this.taskId)
      task.name = changedTaskName
      updateTask(task)
      this.selectTaskList(task.type)
      this.renamingTask = false
    },
    onAddNewFocused: function(ev) {
      ev.target.select()
    },
    openMenu: function(ev) {
      ev.preventDefault()
      this.taskId = ev.target.getAttribute('data-taskid')
      var task = getTask(this.taskId)
      if (task.type === TYPE_TODO) {
        todoListMenu.popup(ev.x, ev.y)
      } else if (task.type === TYPE_COMPLETED) {
        compListMenu.popup(ev.x, ev.y)
      } else if (task.type === TYPE_DELETED) {
        delListMenu.popup(ev.x, ev.y)
      } else {
        throw new Error('can not open the menu of task type undefined!')
      }
      return false
    },
    // update task content
    updateTaskContent: function(content) {
      var activeTask = findActiveTask(this.taskList)
      activeTask.content = content
      persistTaskList(this.taskList, activeTask.type)
    },
    // select a taskList
    selectTaskList: function(status) {
      this.taskList = getTaskList(status)
      return this.taskList
    },
    // add a new task
    addNewTask: function() {
      this.namingNewTask = true
      inactiveAllTasks(this.taskList)
    },
    toggleStatus: function(status) {
      this.status = status
      var taskList = this.selectTaskList(status)
      if (taskList.length === 0) {
        this.refreshContent({
          content: ''
        })
      }
    },
    toggleTask: function(targetTask, cb)  {
      var taskList = this.taskList
      var len = taskList.length
      inactiveAllTasks(taskList)
      for (var i = 0; i < len; i++) {
        var task = taskList[i]
        if (task === targetTask) {
          task.active = true
          updateTask(task)
          this.refreshContent(task)
          if (cb) cb(task)
        } else {
          task.active = false
        }
      }
    },
    refreshContent: function(task) {
      this.mainContent = task ? task.content : ''
    },
    watchTaskList: function() {
      var self = this
      this.$watch('taskList', function(value, mutation) {
        var task = findActiveTask(value)
        self.refreshContent(task)
      })
    },
    // the style of system menu is unchangable. To customize the style of the menu, maybe should use 'frameless window'
    initListsMenus: function() {
      this.initTodoListMenu()
      this.initCompListMenu()
      this.initDelListMenu()
    },
    initTodoListMenu: function() {
      var self = this
      todoListMenu.append(new gui.MenuItem({ 
        label: 'rename', 
        click: function() {
          var task = getTask(self.taskId)
          inactiveAllTasks(getTaskList(task.type))
          task.active = true
          updateTask(task)
          self.selectTaskList(task.type)
          self.renamingTask = true
          self.changedTaskName = task.name
        }
      }))
      todoListMenu.append(new gui.MenuItem({ type: 'separator' }))
      todoListMenu.append(new gui.MenuItem({ 
        label: 'move to trash',
        click: function() {
          var task = getTask(self.taskId)
          mvTaskToList(task, TYPE_DELETED)
          self.selectTaskList(self.status)
        }
      }))
      todoListMenu.append(new gui.MenuItem({ type: 'separator' }))
      todoListMenu.append(new gui.MenuItem({ 
        label: 'move to completed',
        click: function() {
          var task = getTask(self.taskId)
          mvTaskToList(task, TYPE_COMPLETED)
          self.selectTaskList(self.status)
        }
      }))
    },
    initCompListMenu: function() {
      var self = this
      compListMenu.append(new gui.MenuItem({ 
        label: 'move to trash',
        click: function() {
          var task = getTask(self.taskId)
          mvTaskToList(task, TYPE_DELETED)
          self.selectTaskList(self.status)
        }
      }))
      compListMenu.append(new gui.MenuItem({ type: 'separator' }))
      compListMenu.append(new gui.MenuItem({ 
        label: 'move to todo',
        click: function() {
          var task = getTask(self.taskId)
          mvTaskToList(task, TYPE_TODO)
          self.selectTaskList(self.status)
        }
      }))
    },
    initDelListMenu: function() {
      var self = this
      delListMenu.append(new gui.MenuItem({ 
        label: 'move to todo',
        click: function() {
          var task = getTask(self.taskId)
          mvTaskToList(task, TYPE_TODO)
          self.selectTaskList(self.status)
        }
      }))
      delListMenu.append(new gui.MenuItem({ type: 'separator' }))
      delListMenu.append(new gui.MenuItem({ 
        label: 'move to completed',
        click: function() {
          var task = getTask(self.taskId)
          mvTaskToList(task, TYPE_COMPLETED)
          self.selectTaskList(self.status)
        }
      }))
      delListMenu.append(new gui.MenuItem({ type: 'separator' }))
      delListMenu.append(new gui.MenuItem({ 
        label: 'delete permanently',
        click: function() {
          var task = getTask(self.taskId)
          hardDeleteTask(task)
          self.selectTaskList(self.status)
        }
      }))
    },
  }
})