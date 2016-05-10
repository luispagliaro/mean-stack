'use strict';

angular.module('userService', [])

.factory('User', function($http) {
  let userFactory = {};

  // Gets a single user
  userFactory.get = function(id) {
    return $http.get('/api/users/' + id);
  }

  // Gets all users
  userFactory.getAll = function() {
    return $http.get('/api/users/');
  };

  // Creates a user
  userFactory.create = function(userData) {
    return $http.post('/api/users/', userData);
  };

  // updates a user
  userFactory.update = function(id, userData) {
    return $http.put('/api/users/' + id, userData);
  };

  // Deletes a user
  userFactory.delete = function(id, userData) {
    return $http.delete('/api/users/' + id, userData);
  };

  return userFactory;
});