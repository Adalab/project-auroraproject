'use strict';
var card = document.querySelector(".card");
userCall();
projectsCall();
setInterval(projectsCall, 1000);

function userCall() {
  var userRequest = new XMLHttpRequest();

  userRequest.open ('GET', 'https://api.taiga.io/api/v1/users/me', true);
  userRequest.setRequestHeader("Content-Type", "application/json");
  userRequest.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem('token')));
  userRequest.onload = function () {
    var greeting = document.querySelector(".greeting");
    var avatar = document.querySelector(".avatar");
    if (userRequest.status >= 200 && userRequest.status < 400) {
      var data = JSON.parse(userRequest.responseText);
      greeting.innerHTML = "Hello, " + data.full_name;
      console.log(data);
      if (data.photo === null) {
        avatar.innerHTML = '<img src="img/photo-null-project">';
      } else {
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

}

function projectsCall() {
  var projectsRequest = new XMLHttpRequest();
  var user = JSON.parse(sessionStorage.getItem('user'));
  projectsRequest.open ('GET', 'https://api.taiga.io/api/v1/projects?member=' + user.id + '&order_by= -total_activity', true);
  projectsRequest.setRequestHeader("Content-Type", "application/json");
  projectsRequest.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem('token')));
  projectsRequest.onload = function () {
    if (projectsRequest.status >= 200 && projectsRequest.status < 400) {
      var dataProject = JSON.parse(projectsRequest.responseText);
      for (var i = 0; i < dataProject.length; i++) {
        printProject(dataProject[i]);
      }
    } else {
      console.log("La respuesta del servidor ha devuelto un error");
    }
  };

  projectsRequest.onerror = function() {
    console.log("Error al tratar de conectarse con el servidor");
  };

  projectsRequest.send();
}

function printProject(project) {
  var divId = "d" + project.id + "_user";
  if (document.getElementById(divId) === null) {
    generateCardHtml(divId);
  }
  basicInfoUpdate(project, divId);
  modulesCall(project, divId);
  callProgressProject(project, divId);

}

function generateCardHtml(divId) {
  card.innerHTML +=
"<div id='" + divId + "' class= 'projects_user'>"+

  "<div class='project-info'>"+

    "<div class='img-project'>"+
      "<div class='project-img'>"+

      "</div>"+

      "<a href='#'<h4 class='project-title'></h4>></a>"+
    "</div>"+
    "<small class='description-project'>Descripcion del proyecto</small>"+
    "<div class='like-watch flex'>"+
      "<div class='like-div flex'>"+
        "<img src='img/heart.png' alt='logo likes'>"+
        "<small class='like'>Liked: </small>"+
      "</div>"+
      "<div class='watch-div'>"+
        "<img src='img/eye.png' alt='logo watching'>"+
        "<small class='watch'>Watching: </small>"+
      "</div>"+
    "</div>"+
    "</div>"+

    "<div class='timeline-project flex'>"+
      "<small class='modules'></small>"+
      "<a href='#'><small class='team'></small></a>"+
    "</div>"+

    "<div class='progress-project'>"+
      "<div class='stories-issues flex'>"+
        "<a href='#'><div class='progress-stories flex'>"+
        "<h2 class='number-stories'></h2>"+
        "<div class='progress flex'>"+
          "<h4>IN PROGRESS</h4>"+
          "<h5>user stories</h5>"+
        "</div>"+
        "</div></a>"+

        "<a href='#'><div class='number-progress flex'>"+
        "<h2 class='number-issues'></h2>"+
        "<div class='issues'>"+
          "<h4>NEW</h4>"+
          "<h5>issues</h5>"+
        "</div>"+
        "</div></a>"+
      "</div>"+

      "<div class='line-progress flex'>"+
        "<h5>Sprint</h5>"+
        "<p class= 'sprints'></p>" +
        "<p class= 'closed-points'></p>"+
        "<h5 >user stories closed</h5>"+
      "</div>"+
      "<div class='barra'>"+
        "<progress class='progress-bar' value='0' max='100'></progress>"+
        "<span class ='percentage-bar'></span>"+
      "</div>"+
    "</div>"+

  "</div>";
}

function basicInfoUpdate(project, divId) {
  var projectTitle = document.querySelector("#" + divId + " .project-title");
  var imgProject = document.querySelector("#" + divId + " .project-img");
  var descriptionProject = document.querySelector("#" + divId + " .description-project");
  var teamProject = document.querySelector("#" + divId + " .team");
  var likesProject = document.querySelector("#" + divId + " .like");
  var watchProject = document.querySelector("#" + divId + " .watch");

  if (projectTitle.innerHTML !== project.name) {
    projectTitle.innerHTML = project.name;
  }
  var imageHtml = '<img src="'+ project.logo_small_url +'">';
  if (project.logo_small_url === null) {
    imgProject.innerHTML = '<img src="img/photo-null-project.svg">';
  } else {
    imgProject.innerHTML= '<img src="'+ project.logo_small_url +'">';
  }
  if (imgProject.innerHTML !== imageHtml) {
    imgProject.innerHTML = imageHtml;
  }
  if (descriptionProject.innerHTML !== project.description) {
    descriptionProject.innerHTML = project.description;
  }
  if (teamProject.innerHTML !== "Team: " + project.members.length) {
    teamProject.innerHTML = "Team: " + project.members.length;
  }
  if (likesProject.innerHTML !== project.total_fans) {
    likesProject.innerHTML = project.total_fans;
  }
  if (watchProject.innerHTML !== project.total_watchers) {
    watchProject.innerHTML = project.total_watchers;
  }
}

function modulesCall(project, divId) {
  var modulesProject = document.querySelector("#" + divId + " .modules");
  console.log(project.is_backlog_activated);
  if (project.is_backlog_activated === true &&
    project.is_backlog_activated.innerHTML !== project.is_backlog_activated) {
    modulesProject.innerHTML= "<a href='#'>backlog</>";
  } else {
    console.log("no found");
  }
  if (project.is_epics_activated === true &&
    project.is_epics_activated.innerHTML !== project.is_epics_activated) {
    modulesProject.innerHTML+= "<a href='#'>epics</>";
  } else {
    console.log("no found");
  }
  if (project.is_issues_activated === true) {
    modulesProject.innerHTML+= "<a href='#'>issues</>";
  } else {
    console.log("no found");
  }
  if (project.is_kanban_activated === true) {
    modulesProject.innerHTML+= "<a href='#'>kanban</>";
  } else {
    console.log("no found");
  }
  if (project.is_wiki_activated === true) {
    modulesProject.innerHTML+= "<a href='#'>wiki</>";
  } else {
    console.log("no found");
  }
  if (project.is_contact_activated === true) {
    modulesProject.innerHTML+= "<a href='#'>meet-up</>";
  } else {
    console.log("no found");
  }

}

function callProgressProject(project, divId) {
  var idProject = project.id;
  var userStoriesRequest = new XMLHttpRequest();
  userStoriesRequest.open ('GET', 'https://api.taiga.io/api/v1/userstories?project='+ idProject, true);
  userStoriesRequest.setRequestHeader("Content-Type", "application/json");
  userStoriesRequest.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem('token')));
  userStoriesRequest.setRequestHeader("x-disable-pagination", true);
  userStoriesRequest.onload = function () {
    if (userStoriesRequest.status >= 200 && userStoriesRequest.status < 400) {
      var userStoriesProject = document.querySelector("#" + divId + " .number-stories");
      var data = JSON.parse(userStoriesRequest.responseText);
      if (userStoriesProject.innerHTML !== data.length) {
        userStoriesProject.innerHTML = data.length;
      }
    } else {
      console.log("La respuesta del servidor ha devuelto un error");
    }
  };
  userStoriesRequest.onerror = function() {
    console.log("Error al tratar de conectarse con el servidor");
  };
  userStoriesRequest.send();
  var issuesRequest = new XMLHttpRequest();
  issuesRequest.open ('GET', 'https://api.taiga.io/api/v1/projects/' + idProject +'/issues_stats' , true);
  issuesRequest.setRequestHeader("Content-Type", "application/json");
  issuesRequest.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem('token')));
  issuesRequest.setRequestHeader("x-disable-pagination", true);
  issuesRequest.onload = function () {
    if (issuesRequest.status >= 200 && issuesRequest.status < 400) {
      var issuesProject = document.querySelector("#" + divId + " .number-issues");
      var data = JSON.parse(issuesRequest.responseText);
      if (issuesProject.innerHTML !== data.total_issues) {
        issuesProject.innerHTML = data.total_issues;
      }
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
      var closedPoints = document.querySelector("#" + divId + " .closed-points");
      var percentageBar = document.querySelector("#" + divId + " .percentage-bar");
      var progressBar = document.querySelector("#" + divId + " .progress-bar");
      var sprintProject = document.querySelector("#" + divId + " .sprints");
      var data = JSON.parse(pointRequest.responseText);
      var number;
      if (closedPoints.innerHTML !== data.closed_points + "/" + data.defined_points) {
        closedPoints.innerHTML = data.closed_points + "/" + data.defined_points;
      }
      if (sprintProject.innerHTML !== data.total_milestones) {
        sprintProject.innerHTML = data.total_milestones;
      }
      if (data.defined_points === 0) {
        number = 0;
      } else {
        number = Math.ceil(data.closed_points * 100/data.defined_points);
      }
      if (percentageBar.innerHTML !== number + "%") {
        percentageBar.innerHTML = number + "%";
      }
      progressBar.value = number;
      if (progressBar.innerHTML !== number) {
        progressBar.innerHTML = number;
      }
    } else {
      console.log("La respuesta del servidor ha devuelto un error");
    }
  };
  pointRequest.onerror = function() {
    console.log("Error al tratar de conectarse con el servidor");
  };
  pointRequest.send();
}
