'use strict';

angular.module('authService', [])
  // ===================================================
  // auth factory to login and get information
  // inject $http for communicating with the API
  // inject $q to return promise objects
  // inject AuthToken to manage tokens
  // ===================================================
  .factory('Auth', function($http, $q, AuthToken) {
    let authFactory = {};

    authFactory.login = function(username, password) {
      return $http.post('/api/authenticate', {
          username: username,
          password: password
        })
        .success(function(data) {
          AuthToken.setToken(data.token);

          return data;
        });
    };

    authFactory.logout = function() {
      AuthToken.setToken();
    };

    authFactory.checkLogin = function() {
      return AuthToken.getToken() ? true : false;
    };

    authFactory.getUser = function() {
      return AuthToken.getToken() ? $http.get('/api/me', {cache: true}) : $q.reject({message: 'User has no token.'})
    }

    return authFactory;
  })

// ===================================================
// factory for handling tokens
// inject $window to store token client-side
// ===================================================
.factory('AuthToken', function($window) {
  let authTokenFactory = {},
    localStorage = $window.localStorage;

  // Gets the token out of local storage
  authTokenFactory.getToken = function() {
    return localStorage.getItem('token');
  };

  // function to set token or clear token
  // if a token is passed, set the token
  // if there is no token, clear it from local storage
  authTokenFactory.setToken = function(token) {
    token ? localStorage.setItem('token', token) : localStorage.removeItem('token');
  }

  return authTokenFactory;
})

// ===================================================
// application configuration to integrate token into requests
// ===================================================
.factory('AuthInterceptor', function($q, $location, AuthToken) {
  let interceptorFactory = {};

  interceptorFactory.request = function(config) {
    let token = AuthToken.getToken();

    if (token) {
      config.headers['x-access-token'] = token;
    }

    return config;
  };

  interceptorFactory.responseError = function(response) {
    if (response.status === 403) {
      AuthToken.setToken();

      $location.path('/login');
    }

    return $q.reject(response);
  };

  return interceptorFactory;
});