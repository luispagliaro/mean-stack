'use strict';

angular.module('userCtrl', ['userService'])
  .controller('userController', function(User) {
    var vm = this;

    vm.processing = true;

    User.getAll()
      .success(function(data) {
        vm.processing = false;
        vm.users = data;
      });

    vm.deleteUser = function(id) {
      vm.processing = true;

      User.delete(id)
        .success(function(data) {

          // get all users to update the table
          // you can also set up your api
          // to return the list of users with the delete call
          User.getAll()
            .success(function(data) {
              vm.processing = false;
              vm.users = data;
            });
        });
    };
  })

.controller('userCreateController', function(User) {
  var vm = this;

  // variable to hide/show elements of the view
  // differentiates between create or edit pages
  vm.type = 'create';

  // function to create a user
  vm.saveUser = function() {
    vm.processing = true;
    vm.message = '';

    // use the create function in the userService
    User.create(vm.userData)
      .success(function(data) {
        vm.processing = false;

        // clear the form
        vm.userData = {};
        vm.message = data.message;
      });
  };
})

// controller applied to user edit page
.controller('userEditController', function($routeParams, User) {
  var vm = this;

  // variable to hide/show elements of the view
  // differentiates between create or edit pages
  vm.type = 'edit';

  // get the user data for the user you want to edit
  // $routeParams is the way we grab data from the URL
  User.get($routeParams.user_id)
    .success(function(data) {
      vm.userData = data;
    });

  // function to save the user
  vm.saveUser = function() {
    vm.processing = true;
    vm.message = '';

    // call the userService function to update
    User.update($routeParams.user_id, vm.userData)
      .success(function(data) {
        vm.processing = false;

        // clear the form
        vm.userData = {};

        // bind the message from our API to vm.message
        vm.message = data.message;
      });
  };
});