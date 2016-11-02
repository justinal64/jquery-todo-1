"use strict";

  let apiKeys = {};
  let uid = "";

function putTodoInDOM (){
  FbAPI.getTodos(apiKeys, uid).then(function(items){
    //  console.log("items from FB", items );
      $('#completed-tasks').html("");
      $('#incomplete-tasks').html("");
      items.forEach(function(item){
      //  console.log(item);
        if(item.isCompleted === true){
        //  console.log("is true", item.task);
          // let newListItem = "<p>" + item.task + "</p>";

          // let newListItem = '<p>hello world</p>';
          let newListItem = `<li data-completed="${item.isCompleted}">`;
          newListItem+=`<div class="col-xs-8" data-fbid="${item.id}">`;
          newListItem+='<input class="checkboxStyle" type="checkbox" checked>';
          newListItem+=`<label class="inputLabel">${item.task}</label>`;
          newListItem+='</div>';
          newListItem+='</li>';
          //apend to list
          $('#completed-tasks').append(newListItem);
        } else {
          let newListItem = `<li data-completed="${item.isCompleted}">`;
          newListItem+=`<div class="col-xs-8" data-fbid="${item.id}">`;
          newListItem+='<input class="checkboxStyle" type="checkbox">';
          newListItem+=`<label class="inputLabel">${item.task}</label>`;
          newListItem+='<input type="text" class="inputTask">';
          newListItem+='</div>';
          newListItem+='<div class="col-xs-4">';
          newListItem+=`<button class="btn btn-default col-xs-6 edit" data-fbid=${item.id}>Edit</button>`;
          newListItem+=`<button class="btn btn-danger col-xs-6 delete" data-fbid=${item.id}>Delete</button> `;
          newListItem+='</div>';
          newListItem+='</li>';
          //apend to list
          $('#incomplete-tasks').append(newListItem);
        }

      });
    });
}

$(document).ready(function(){
  FbAPI.firebaseCredentials().then(function(keys){
  //  console.log("keys", keys);
    apiKeys = keys;
    firebase.initializeApp(apiKeys);

  });

$('#add-task-main').on('click', function(){
  let newItem = {
    "task": $('#add-task-main').val(),
    "isCompleted": false,
    "uid" : uid
  };
  FbAPI.addTodo(apiKeys, newItem).then(function () {
    putTodoInDOM();
  });
});

$("ul").on("click", ".delete", function() {
  let itemID = $(this).data("fbid");
  FbAPI.deleteTodo(apiKeys, itemID).then(function(){
    putTodoInDOM();
  });
});

$("ul").on("click", ".edit", function() {
  let parent = $(this).closest('li');
  if(!parent.hasClass("editMode")){
    parent.addClass("editMode");
  } else {
    let itemID = $(this).data("fbid");
    let editedItem = {
      "task": parent.find(".inputTask").val(),
      "isCompleted": false
    };
    FbAPI.editTodo(apiKeys, itemID, editedItem).then(function(response){
    parent.removeClass("editMode");
    putTodoInDOM();
    });
  }
});

$('ul').on('change', 'input[type="checkbox"]', function() {
  let updatedIsCompleted = $(this).closest("li").data("completed");
  let itemId = $(this).parent().data("fbid");
  let task = $(this).siblings(".inputLabel").html();

  let editedItem = {
    "task": task,
    "isCompleted": !updatedIsCompleted
  };
  FbAPI.editTodo(apiKeys, itemId, editedItem).then(function () {
    putTodoInDOM();
  });
});

$('#registerButton').on('click', function(){
  let email = $('#inputEmail').val();
  let password = $('#inputPassword').val();
  let user ={
    "email": email,
    "password": password
  };
  FbAPI.registerUser(user).then(function(response){
   console.log("register response", response);
   return FbAPI.loginUser(user);
  }).then(function (loginResponse){
   console.log("login response", loginResponse);
   uid = loginResponse.uid;
   putTodoInDOM();
   $('#login-container').addClass("hide");
   $('#todo-container').removeClass("hide");
  });
});

$('#loginButton').on("click", function(){
  let email = $('#inputEmail').val();
  let password = $('#inputPassword').val();
  let user ={
    "email": email,
    "password": password
  };
  FbAPI.loginUser(user).then(function(loginResponse){
   console.log("login response", loginResponse);
   uid = loginResponse.uid;
   putTodoInDOM();
   $('#login-container').addClass("hide");
   $('#todo-container').removeClass("hide");
  });
});





});



































// console.log("test in js connection");

// /////// grab user input text
// let $needToDo = $("#need-to-do");
// let $addToDoListMain = $("#add-task-main");
// let toDoListMain = [];
// let toDoListDeleted = [];
// let toDoListCompleted = [];
// let $mainToDoListDOM = $("#todo-list-main-div");
// let $completedTasks = $("#todo-list-done");

// //// get val from input field on add button click event
// $addToDoListMain.on("click", function() {
//   console.log("test this click");
// //// add input text to todo list array
//   arrayManipulation($needToDo.val(), "add");
//   // arrayManipulation($needToDo.val(), "remove");
//   // toDoListMain.push($needToDo.val());
//   console.log("toDoListMain", toDoListMain);
//   toDoListMaker();
// });

// function toDoListMaker() {
//   console.log("testing function");
//   $mainToDoListDOM.html("");
//   $mainToDoListDOM.html(`<h3 class="text-center">Things to Do</h3>`);
//   for (var i = 0; i < toDoListMain.length; i++) {
//     let newTask = $(`<div id='task-no-${i}'>
//       <p id='task-${i}' class='task'>${toDoListMain[i]}</p>
//       <button type='button' class='btn btn-default btn-xs editTodo' id='edit-button-${i}'>edit</button>
//       <button type='button' class='btn btn-default btn-xs deleteTodo' id='delete-button-${i}'>delete</button>
//       <button type='button' class='btn btn-default btn-xs completeTodo' id='complete-button-${i}'>complete</button>
//       <button type='button' class='btn btn-default btn-xs restoreTodo hidden' id='complete-button-${i}'>restore</button>
//       </div>`);
//   $mainToDoListDOM.append(newTask);
//   $needToDo.val("");
//   }
// }

// /////// edit button in todo list

// //// takes string and makes it live editable text
// $(document).on("click", ".editTodo", function() {
//   console.log("testing click", $(this));
//   let pTag = $(this).siblings("p");
//   let textToFix = pTag.text();
//   console.log("texttofix", textToFix);
//   let newText = window.prompt("Change Your Task", textToFix);
//   console.log("newText", newText);
//   if (newText !== null) {
//     pTag.text(newText);
//   }
// });

// ////// delete button in todo list
// //// deletes the item (and all its buttons) from the dom
// $(document).on("click", ".deleteTodo", function() {
//   console.log("testing click", $(this));
//   let divDelete = $(this).parent("div");
//   console.log("divDelete", divDelete);
//   divDelete.remove();

//   ///////// remove from toDoListMain array /////////
//   ///////// add to toDoListDeleted array /////////

// });

// ////// complete button in todo list
// //// removes from the todo array
// //// adds to the completed array
// //// displays in the completed section along with a delete button and a restore button
// $(document).on("click", ".completeTodo", function() {
//   console.log("testing click", $(this));
//   let divMove = $(this).parent("div");
//   console.log("divMove", divMove);
//   $completedTasks.append(divMove);

//   ///////// remove from toDoListMain array /////////
//   ///////// add to toDoListComplete array /////////

//   divMove.children(".editTodo").addClass("hidden");
//   divMove.children(".deleteTodo").addClass("hidden");
//   divMove.children(".completeTodo").addClass("hidden");
//   divMove.children(".restoreTodo").removeClass("hidden");
// });

// ////// restore button in the compeleted list
// //// removes from the completed array
// //// adds text to todo list array
// //// display that line item in the dom with an edit, delete, complete button
// $(document).on("click", ".restoreTodo", function() {
//   console.log("testing click", $(this));
//   let divRestore = $(this).parent("div");
//   console.log("divRestore", divRestore);
//   $mainToDoListDOM.append(divRestore);

//   ///////// remove from toDoListMain array /////////
//   ///////// add to toDoListComplete array //////////

//   divRestore.children(".editTodo").removeClass("hidden");
//   divRestore.children(".deleteTodo").removeClass("hidden");
//   divRestore.children(".completeTodo").removeClass("hidden");
//   divRestore.children(".restoreTodo").addClass("hidden");
// });

// function arrayManipulation(value, type) {
//   // This gets the position the the element is in on the array
//   var index = toDoListMain.indexOf(value);
//   if(type === "remove") {
//     // Remove from array
//     // This removes the item from the array
//     toDoListMain.splice(index, 1);
//   } else if(type === "add") {
//     // Add the item to the array
//     toDoListMain.push(value);
//   }
// }
