'use strict';
var userRequest = new XMLHttpRequest();
var greeting = document.getElementById("greeting");
var avatar = document.getElementById("avatar");
var projectTitle = document.getElementById("project-title");
var imgProject = document.getElementById("img-project");
var descriptionProject = document.getElementById("description-project");
var teamProject = document.getElementById("team");
var likesProject = document.getElementById("like");
var watchProject = document.getElementById("watch");
var userStoriesProject = document.getElementById("number-stories");

userRequest.open ('GET', 'https://api.taiga.io/api/v1/users/me', true);
userRequest.setRequestHeader("Content-Type", "application/json");
userRequest.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem('token')));
userRequest.onload = function () {
  if (userRequest.status >= 200 && userRequest.status < 400) {
    var data = JSON.parse(userRequest.responseText);
    greeting.innerHTML = "Hello, " + data.full_name;
    console.log(data);
    if (data.photo) {
      avatar.innerHTML = '<img src="'+ data.photo +'">';
    }

  } else {
    console.log("La respuesta del servidor ha devuelto un error");
  }
};

userRequest.onerror = function() {
  console.log("Error al tratar de conectarse con el servidor");
};

userRequest.send();


var projectsRequest = new XMLHttpRequest();
var user = JSON.parse(sessionStorage.getItem('user'));
projectsRequest.open ('GET', 'https://api.taiga.io/api/v1/projects?member=' + user.id, true);
projectsRequest.setRequestHeader("Content-Type", "application/json");
projectsRequest.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem('token')));
projectsRequest.onload = function () {
  if (projectsRequest.status >= 200 && projectsRequest.status < 400) {
    var dataProject = JSON.parse(projectsRequest.responseText);
    projectTitle.innerHTML = dataProject[0].name;
    imgProject.innerHTML = '<img src="'+ dataProject[0].logo_small_url +'">';
    descriptionProject.innerHTML = dataProject[0].description;
    teamProject.innerHTML = "Team: " + dataProject[0].members.length;
    likesProject.innerHTML = dataProject[0].total_fans;
    watchProject.innerHTML = dataProject[0].total_watchers;

  } else {
    console.log("La respuesta del servidor ha devuelto un error");
  }
};

projectsRequest.onerror = function() {
  console.log("Error al tratar de conectarse con el servidor");
};

projectsRequest.send();

console.log(JSON.parse(sessionStorage.getItem('user')));
var userStoriesRequest = new XMLHttpRequest();
userStoriesRequest.open ('GET', 'https://api.taiga.io/api/v1/userstories?projects=' + sessionStorage.getItem("user.projects"), true);
userStoriesRequest.setRequestHeader("Content-Type", "application/json");
userStoriesRequest.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem('token')));
userStoriesRequest.onload = function () {
  if (userStoriesRequest.status >= 200 && userStoriesRequest.status < 400) {
    var data = JSON.parse(userStoriesRequest.responseText);
    userStoriesProject.innerHTML= data.length;
    console.log(data);
  } else {
    console.log("La respuesta del servidor ha devuelto un error");
  }
};

userStoriesRequest.onerror = function() {
  console.log("Error al tratar de conectarse con el servidor");
};

userStoriesRequest.send();
