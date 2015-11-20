angular.module('FBlurApp', [])
  .controller('TodoListController', ['$scope', function ($scope) {
      var todoList = this;
      todoList.todos = [];

      chrome.tabs.query({ 'active': true }, function (tabs) {
          var currentTab = tabs[0];
          var url = new URL(currentTab.url);
          var name = currentTab.title;
          if (url.hostname == "www.facebook.com") {
              todoList.formShow = true;
              todoList.todoText = name;
          } else {
              todoList.formShow = false;
          }
      });

      chrome.storage.sync.get({
          StoredBlockedFaces: []
      }, function (items) {
          todoList.todos = items.StoredBlockedFaces;
          console.log(items.StoredBlockedFaces);
          $scope.$apply();

      });

      todoList.addTodo = function () {
          todoList.todos.push({ text: todoList.todoText, done: false });
          todoList.todoText = '';
          console.log(todoList.todos);

          chrome.storage.sync.set({
              StoredBlockedFaces: todoList.todos
          }, function (items) {
              console.log("stored");
          });
      };

      todoList.remaining = function () {
          var count = 0;
          angular.forEach(todoList.todos, function (todo) {
              count += todo.done ? 0 : 1;
          });
          return count;
      };

      todoList.archive = function () {

          var oldTodos = todoList.todos;
          todoList.todos = [];

          angular.forEach(oldTodos, function (todo) {
              if (!todo.done) todoList.todos.push(todo);

              chrome.storage.sync.set({
                  StoredBlockedFaces: todoList.todos
              }, function (items) {
                  console.log("archived");
                  $scope.$apply();
              });

          });


      };
  }]);