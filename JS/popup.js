angular.module('FBlurApp', [])
  .controller('TodoListController', ['$scope', function ($scope) {
      var todoList = this;
      todoList.todos = [
        { text: 'learn angular', done: true },
        { text: 'build an angular app', done: false }];

      chrome.storage.sync.get({
          storedTodos: []
      }, function (items) {
          todoList.todos = items.storedTodos;
          console.log(items.storedTodos);
          $scope.$apply();
      });

      todoList.addTodo = function () {
          todoList.todos.push({ text: todoList.todoText, done: false });
          todoList.todoText = '';
          console.log(todoList.todos);

          chrome.storage.sync.set({
              storedTodos: todoList.todos
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
                  storedTodos: todoList.todos
              }, function (items) {
                  console.log("stored");
                  $scope.$apply();
              });

          });


      };
  }]);