'use strict';

var userRequest = new XMLHttpRequest();
var greeting = document.getElementById("greeting");
var avatar = document.getElementById("avatar");

userRequest.open ('GET', 'https://api.taiga.io/api/v1/users/me', true);
userRequest.setRequestHeader("Content-Type", "application/json");
userRequest.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('token'));
userRequest.onload = function () {
  if (userRequest.status >= 200 && userRequest.status < 400) {
    var data = JSON.parse(userRequest.responseText);
    greeting.innerHTML = "Hello, " + data.full_name;
    console.log(data);
    avatar.innerHTML = '<img src="'+ data.photo +'">';
  } else {
    console.log("La respuesta del servidor ha devuelto un error");
  }
};

userRequest.onerror = function() {
  console.log("Error al tratar de conectarse con el servidor");
};

userRequest.send();

var projectsRequest = new XMLHttpRequest();

projectsRequest.open ('GET', 'https://api.taiga.io/api/v1/users/me', true);
projectsRequest.setRequestHeader("Content-Type", "application/json");
projectsRequest.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('token'));
projectsRequest.onload = function () {
  if (projectsRequest.status >= 200 && projectsRequest.status < 400) {
    var data = JSON.parse(projectsRequest.responseText);
    console.log(data.projects);
  } else {
    console.log("La respuesta del servidor ha devuelto un error");
  }
};

projectsRequest.onerror = function() {
  console.log("Error al tratar de conectarse con el servidor");
};

projectsRequest.send();
