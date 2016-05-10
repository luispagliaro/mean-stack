'use strict';

angular.module('mainCtrl', [])
  .controller('mainController', function($rootScope, $location, Auth) {
    let vm = this;

    vm.loggedIn = Auth.checkLogin();
    vm.processing = false;

    // check to see if a user is logged in on every request
    $rootScope.$on('$routeChangeStart', function() {
      vm.loggedIn = Auth.checkLogin();

      // get user information on route change
      Auth.getUser()
        .then(function(data) {

          vm.user = data.data;
        });
    });

    vm.doLogin = function() {
      vm.loginData = vm.loginData || {};
      vm.processing = true;
      vm.error = '';

      Auth.login(vm.loginData.username, vm.loginData.password)
        .success(function(data) {
          vm.processing = false;

          data.success ? $location.path('/users') : vm.error = data.message;
        });
    };

    vm.doLogout = function() {
      Auth.logout();

      vm.user = '';

      $location.path('/login');
    };
  });