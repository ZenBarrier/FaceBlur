angular.module('FBlurApp', [])
  .controller('PopupController', ['$scope', function ($scope) {
      var FaceList = this;
      FaceList.faces = [];

      var currentURL;
      var profile = "";

      var fbPaths = ['events', 'messages', 'lists', 'saved', 'groups', 'games',
          'onthisday', 'pages', 'developers', 'insights', 'friends', 'notifications',
          'settings', 'campaign', 'help', 'support', 'ads', ''];

      chrome.tabs.query({ 'active': true }, function (tabs) {
          var currentTab = tabs[0];
          currentURL = new URL(currentTab.url);
          FaceList.name = currentTab.title;
          if (currentURL.hostname == "www.facebook.com") {
              FaceList.formShow = true;
              var currentPath = currentURL.pathname.split('/')[1];
              if (currentPath == "profile.php") {
                  profile = currentURL.href.split('&')[0];
              } else if (fbPaths.indexOf(currentPath) == -1) {
                  profile = currentURL.href.split('?')[0];
              } else {
                  FaceList.formShow = false;
              }

          } else {
              FaceList.formShow = false;
          }
      });

      chrome.storage.sync.get({
          StoredBlockedFaces: []
      }, function (items) {
          FaceList.faces = items.StoredBlockedFaces;
          console.log(items.StoredBlockedFaces);
          $scope.$apply();

          if (FaceList.faces.some(function (e) { return e.profile === profile })) {
              FaceList.stored = true;
              console.log("it is stored");
              $scope.$apply();
          } else { FaceList.stored = false; }

      });

      FaceList.addFace = function () {
          FaceList.faces.push({ name: FaceList.name, done: false, blur: true, profile: profile });
          console.log(FaceList.faces);
          FaceList.stored = true;

          chrome.storage.sync.set({
              StoredBlockedFaces: FaceList.faces
          }, function (items) {
              console.log("stored");
          });
      };

      FaceList.removeFace = function () {
          FaceList.faces = FaceList.faces.filter(function (face, index, array) {
              return (face.profile != profile);
          });

          console.log(FaceList.faces);
          FaceList.stored = false;

          chrome.storage.sync.set({
              StoredBlockedFaces: FaceList.faces
          }, function (items) {
              console.log("stored");
          });
      };

      FaceList.remaining = function () {
          var count = 0;
          angular.forEach(FaceList.faces, function (face) {
              count += face.done ? 0 : 1;
          });
          return count;
      };

      FaceList.archive = function () {

          var oldfaces = FaceList.faces;
          FaceList.faces = [];

          angular.forEach(oldfaces, function (face) {
              if (!face.done) FaceList.faces.push(face);

              chrome.storage.sync.set({
                  StoredBlockedFaces: FaceList.faces
              }, function (items) {
                  console.log("archived");
                  $scope.$apply();
              });

          });


      };
  }]);