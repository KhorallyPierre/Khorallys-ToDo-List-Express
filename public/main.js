//declare variables from the DOM
const list = document.querySelector('.list')
const button = document.querySelector('.create')
const input = document.querySelector('.input')
const clear = document.querySelector('.clear')
const clearCompleted = document.querySelector('.clearCompleted')
const countElement = document.querySelector('.countElement')
document.querySelector('.list').addEventListener('click', removeItem)



// create the function a function that adds an li to the ul
function createTodoItem(e) {

  // here we are updating the count total from its previous value
  fetch('tasks', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'task': input.value
      })
    })
    .then(function(response) {
      window.location.reload()
    })
}


// cross out a single item // work in progresss
function crossOutItem(e) {
  if (e.target.tagName ==='SPAN') {
    fetch('crossOut', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        task: e.target.innerText,
        completed: e.target.parentNode.classList.contains('done')
      })
    }).then(function(response) {
      window.location.reload()
    })
  }
}


// clear all items
function clearAll(e) {
  fetch('clearAll', {
    method: 'delete',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(function(response) {
    window.location.reload()
  })
};


//this works now
function removeItem(e) {
  if (e.target.className === 'remove') {
    fetch('singleTasks', {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          task: e.target.parentNode.childNodes[1].innerText
        })
      })
      .then(function(response) {
        window.location.reload()
      })
  }
}

// remove all completed items (they all have the class done)
function removeCompletedItems() {
  fetch('clearCompleted', {
    method: 'delete',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(function(response) {
    window.location.reload()
  })
}

// add event listeners
list.addEventListener('click', removeItem)
clear.addEventListener('click', clearAll)
button.addEventListener('click', createTodoItem)
list.addEventListener('click', crossOutItem)
clearCompleted.addEventListener('click', removeCompletedItems)
countElement.innerText = document.querySelectorAll('li').length - document.querySelectorAll('.done').length
