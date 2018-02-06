var ls = localStorage

// constants
var TYPE_TODO = 'TODO'
var TYPE_COMPLETED = 'COMPLETED'
var TYPE_DELETED = 'DELETED'

// get taskList by type
var getTaskList = function (type) { // get taskList by a task
  if (type === TYPE_TODO) {
    return JSON.parse(ls.taskList1)
  } else if (type === TYPE_COMPLETED) {
    return JSON.parse(ls.taskList2)
  } else if (type === TYPE_DELETED) {
    return JSON.parse(ls.taskList3)
  }
  return null
}
// set taskList by type
var persistTaskList = function (taskList, type) {
  if (type === TYPE_TODO) {
    ls.taskList1 = JSON.stringify(taskList)
  } else if (type === TYPE_COMPLETED) {
    ls.taskList2 = JSON.stringify(taskList)
  } else if (type === TYPE_DELETED) {
    ls.taskList3 = JSON.stringify(taskList)
  }
}

// initialize all taskLists
var initStorage = function() {
  ls.taskList1 = ls.taskList1 || '[]'
  ls.taskList2 = ls.taskList2 || '[]'
  ls.taskList3 = ls.taskList3 || '[]'
}

// clear all taskLists
var clearStorage = function() {
  ls.taskList1 = '[]'
  ls.taskList3 = '[]'
  ls.taskList2 = '[]'
}

// move a task to the specified list
var mvTaskToList = function (targetTask, typeOfTargetList) {
  if (!targetTask) {
    throw new Error('targetTask is undefined!')
  }
  if (!targetTask.id && targetTask.id !== 0) {
    throw new Error('trying to move a task of undefined type!')
  }

  var type = targetTask.type
  var taskList = getTaskList(type)
  var len = taskList.length

  for (var i = 0; i < len; i++) {
    if (taskList[i].id === targetTask.id) {
      taskList.splice(i, 1)
      resetActiveTaskOfList(taskList)
      persistTaskList(taskList, type)

      addTaskToList(targetTask, typeOfTargetList)
      resetActiveTaskOfList(getTaskList(typeOfTargetList))
      return
    }
  }
}

// set an active task of a list
var resetActiveTaskOfList = function(taskList) {
  if (!taskList || taskList.length === 0) {
    return
  }
  var hasActive = false
  var len = taskList.length
  for (var i = 0; i < len; i++) {
    if (taskList[i].active && !hasActive) {
      hasActive = true
    } else if (taskList[i].active) {
      taskList[i].active = false
    }
  }
  if (!hasActive) {
    taskList[0].active = true
  }
  persistTaskList(taskList, taskList[0].type)
}

// add a task to the completedList
var addTaskToList = function(task, typeOfTargetList) {
  var list = getTaskList(typeOfTargetList)
  task.type = typeOfTargetList
  list.push(task)
  persistTaskList(list, typeOfTargetList)
}

// find the active task
var findActiveTask = function(taskList) {
  if (!taskList) {
    return null
  }
  var len = taskList.length
  for (var i = 0; i < len; i++) {
    var task = taskList[i]
    if (task.active) {
      return task
    }
  }
  return null
}

// if there is no active task in the list, then set the first task as active
var setFirstTaskActiveIfNone = function(taskList) {
  if (!taskList || taskList.length === 0) {
    return
  }
  if (findActiveTask(taskList)) {
    return
  }
  taskList[0].active = true
  persistTaskList(taskList, taskList[0].type)
}

// delete a task permanently
var hardDeleteTask = function (task) {
  var type = task.type
  var tempList = getTaskList(type)

  var taskList = tempList.filter(function(element) {
    return element.id !== task.id
  })
  persistTaskList(taskList, type)
}

// get maximum id of all lists
var getMaxId = function() {
  var list = getTaskList(TYPE_TODO)
  .concat(getTaskList(TYPE_COMPLETED))
  .concat(getTaskList(TYPE_DELETED))

  if (!list || list.length === 0) {
    return 0
  }
  return list.reduce(function(total, crtTask, currentIndex, arr) {
    return Math.max(total, crtTask.id)
  }, 0)
}

// get task total counts
var getTaskCounts = function() {
  return getTaskList(TYPE_TODO).length 
  + getTaskList(TYPE_COMPLETED).length
  + getTaskList(TYPE_DELETED).length
}

// get a task
var getTask = function(id) {
  var taskList1 = getTaskList(TYPE_TODO)
  var taskList2 = getTaskList(TYPE_COMPLETED)
  var taskList3 = getTaskList(TYPE_DELETED)
  var taskList = taskList1.concat(taskList2).concat(taskList3)
  var len = taskList.length
  for (var i = 0; i < len; i++) {
    var task = taskList[i]
    if  (task.id == id) {
      return task
    }
  }
  return null
}

// update a task
var updateTask = function(task) {
  var taskList = getTaskList(task.type)
  var len = taskList.length
  for (var i = 0; i < len; i++) {
    if (taskList[i].id === task.id) {
      taskList[i] = task
      persistTaskList(taskList, task.type)
      return
    }
  }
}

var inactiveAllTasks = function(taskList) {
  if (!taskList || taskList.length === 0) {
    return
  }
  var len = taskList.length
  for (var i = 0; i < len; i++) {
    taskList[i].active = false
  }
  persistTaskList(taskList, taskList[0].type)
}





