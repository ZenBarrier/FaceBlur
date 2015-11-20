angular.module('FBlurApp', [])
  .controller('PopupController', ['$scope', function ($scope) {
      var todoList = this;
      todoList.todos = [];

      var currentURL;
      var profile = "";

      var fbPaths = ['events', 'messages', 'lists', 'saved', 'groups', 'games',
          'onthisday', 'pages', 'developers', 'insights', 'friends', 'notifications',
          'settings', 'campaign', 'help', 'support', 'ads', ''];

      chrome.tabs.query({ 'active': true }, function (tabs) {
          var currentTab = tabs[0];
          currentURL = new URL(currentTab.url);
          todoList.name = currentTab.title;
          if (currentURL.hostname == "www.facebook.com") {
              todoList.formShow = true;
              var currentPath = currentURL.pathname.split('/')[1];
              if (currentPath == "profile.php") {
                  profile = currentURL.href.split('&')[0];
              } else if (fbPaths.indexOf(currentPath) == -1) {
                  profile = currentURL.href.split('?')[0];
              } else {
                  todoList.formShow = false;
              }

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

          if (todoList.todos.some(function (e) { return e.profile === profile })) {
              todoList.stored = true;
              console.log("it is stored");
              $scope.$apply();
          } else { todoList.stored = false; }

      });

      todoList.addTodo = function () {
          todoList.todos.push({ name: todoList.name, done: false, blur: true, profile: profile });
          console.log(todoList.todos);
          todoList.stored = true;

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