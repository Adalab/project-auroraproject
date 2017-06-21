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
var issuesProject = document.getElementById("number-issues");

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
    console.log(dataProject[0].id);
    var projectId = dataProject[0].id;
    sessionStorage.setItem("projectID", JSON.stringify(dataProject[0].id));
  } else {
    console.log("La respuesta del servidor ha devuelto un error");
  }
};

projectsRequest.onerror = function() {
  console.log("Error al tratar de conectarse con el servidor");
};

projectsRequest.send();

console.log(JSON.parse(sessionStorage.getItem('user')));
var idProject = JSON.parse(sessionStorage.getItem('projectId'));
var userStoriesRequest = new XMLHttpRequest();
userStoriesRequest.open ('GET', 'https://api.taiga.io/api/v1/epics/201914/related_userstories', true);
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

var issuesRequest = new XMLHttpRequest();
var idProject = sessionStorage.getItem("projectID");
console.log("Proyecto");
console.log(idProject);

issuesRequest.open ('GET', 'https://api.taiga.io/api/v1/projects/' + idProject +'/issues_stats' , true);
issuesRequest.setRequestHeader("Content-Type", "application/json");
issuesRequest.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem('token')));
issuesRequest.onload = function () {
  if (issuesRequest.status >= 200 && issuesRequest.status < 400) {
    console.log(issuesRequest.responseText);
    var data = JSON.parse(issuesRequest.responseText);
    issuesProject.innerHTML = data.total_issues;
    console.log(data.total_issues);
  } else {
    console.log("La respuesta del servidor ha devuelto un error");
  }
};

issuesRequest.onerror = function() {

  console.log("Error al tratar de conectarse con el servidor");

};

issuesRequest.send();
