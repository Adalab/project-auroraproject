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
var modulesProject = document.getElementById("modules");
var userStoriesProject = document.getElementById("number-stories");
var issuesProject = document.getElementById("number-issues");
var closedPoints = document.getElementById("closed-points");
var totalPoints = document.getElementById("total-points");

userRequest.open ('GET', 'https://api.taiga.io/api/v1/users/me', true);
userRequest.setRequestHeader("Content-Type", "application/json");
userRequest.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem('token')));
userRequest.onload = function () {
  if (userRequest.status >= 200 && userRequest.status < 400) {
    var data = JSON.parse(userRequest.responseText);
    greeting.innerHTML = "Hello, " + data.full_name;
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

var modulesRequest = new XMLHttpRequest();
modulesRequest.open ('GET', 'https://api.taiga.io/api/v1/projects?member=' + user.id, true);
modulesRequest.setRequestHeader("Content-Type", "application/json");
modulesRequest.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem('token')));
modulesRequest.setRequestHeader("x-disable-pagination", true);
modulesRequest.onload = function () {
  if (modulesRequest.status >= 200 && modulesRequest.status < 400) {
    var data = JSON.parse(modulesRequest.responseText);
    console.log(data[0].is_backlog_activated);
    if (data[0].is_backlog_activated === true) {
      modulesProject.innerHTML= "Modules: backlog, ";
    } else {
      console.log("no found");
    }
    if (data[0].is_epics_activated === true) {
      modulesProject.innerHTML+= "epics,";
    } else {
      console.log("no found");
    }
    if (data[0].is_issues_activated === true) {
      modulesProject.innerHTML+= "issues,";
    } else {
      console.log("no found");
    }
    if (data[0].is_kanban_activated === true) {
      modulesProject.innerHTML+= "kanban,";
    } else {
      console.log("no found");
    }
    if (data[0].is_wiki_activated === true) {
      modulesProject.innerHTML+= "wiki";
    } else {
      console.log("no found");
    }
  } else {
    console.log("La respuesta del servidor ha devuelto un error");
  }
};

modulesRequest.onerror = function() {
  console.log("Error al tratar de conectarse con el servidor");
};

modulesRequest.send();

var idProject = sessionStorage.getItem("projectID");
console.log(idProject);
var userStoriesRequest = new XMLHttpRequest();
userStoriesRequest.open ('GET', 'https://api.taiga.io/api/v1/userstories?project='+ idProject, true);
userStoriesRequest.setRequestHeader("Content-Type", "application/json");
userStoriesRequest.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem('token')));
userStoriesRequest.setRequestHeader("x-disable-pagination", true);
userStoriesRequest.onload = function () {
  if (userStoriesRequest.status >= 200 && userStoriesRequest.status < 400) {
    var data = JSON.parse(userStoriesRequest.responseText);
    userStoriesProject.innerHTML= data.length;
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

issuesRequest.open ('GET', 'https://api.taiga.io/api/v1/projects/' + idProject +'/issues_stats' , true);
issuesRequest.setRequestHeader("Content-Type", "application/json");
issuesRequest.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem('token')));
issuesRequest.setRequestHeader("x-disable-pagination", true);
issuesRequest.onload = function () {
  if (issuesRequest.status >= 200 && issuesRequest.status < 400) {
    var data = JSON.parse(issuesRequest.responseText);
    issuesProject.innerHTML = data.total_issues;
  } else {
    console.log("La respuesta del servidor ha devuelto un error");
  }
};

issuesRequest.onerror = function() {

  console.log("Error al tratar de conectarse con el servidor");

};

issuesRequest.send();

var pointRequest = new XMLHttpRequest();
pointRequest.open ('GET', 'https://api.taiga.io/api/v1/projects/'+ idProject +'/stats',true);
console.log(idProject);
pointRequest.setRequestHeader("Content-Type", "application/json");
pointRequest.setRequestHeader("x-disable-pagination", true);
pointRequest.onload = function () {
  if (pointRequest.status >= 200 && pointRequest.status < 400) {
    var data = JSON.parse(pointRequest.responseText);
    closedPoints.innerHTML = data.closed_points;
    totalPoints.innerHTML = data.defined_points;
  } else {
    console.log("La respuesta del servidor ha devuelto un error");
  }
};

pointRequest.onerror = function() {

  console.log("Error al tratar de conectarse con el servidor");

};

pointRequest.send();
