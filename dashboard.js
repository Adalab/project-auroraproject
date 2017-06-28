'use strict';
var card = document.querySelector(".card");
userCall();
projectsCall();
setInterval(projectsCall, 10000);

// function showAvatarImage(photo) {
//   var avatar = document.querySelector(".avatar");
//   if (data.photo === null) {
//     avatar.innerHTML = '<img src="img/nonAvatar.svg">';
//   } else {
//     avatar.innerHTML = '<img src="'+ data.photo +'">';
//   }
// }

function userCall() {
  var userRequest = new XMLHttpRequest();

  userRequest.open ('GET', 'https://api.taiga.io/api/v1/users/me', true);
  userRequest.setRequestHeader("Content-Type", "application/json");
  userRequest.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem('token')));
  userRequest.onload = function () {
    var greeting = document.querySelector(".greeting");
    if (userRequest.status >= 200 && userRequest.status < 400) {
      var data = JSON.parse(userRequest.responseText);
      var avatar = document.querySelector(".avatar");
      greeting.innerHTML = "Hello, " + data.full_name;
      if (data.photo === null) {
        avatar.innerHTML = '<img src="img/nonAvatar.svg">';
      }else {
        avatar.innerHTML = '<img src="'+ data.photo +'">';
        // avatar.style.width = '50px';
      }
      console.log(data);

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
    generateCardHtml(divId, project.slug);
  }
  basicInfoUpdate(project, divId);
  modulesCall(project, divId, project.slug);
  callProgressProject(project, divId);

}

function generateCardHtml(divId, projectSlug){

  card.innerHTML +=

"<div id='" + divId + "' class= 'projects_user'>"+

"<div class='project-info'>"+
  "<div class='img-project flex'>"+
    "<div class='project-img'>"+
      "</div>"+
      "<a href='https://tree.taiga.io/project/" + projectSlug + "'><h5 class='project-title'></h5></a>"+
      "</div>"+
      "<small class='description-project truncate'>Descripcion del proyecto</small>"+
      "<div class='like-watch flex'>"+
        "<div class='like-div flex'>"+
          "<img class='logolike' src='img/heart.png' alt='logo likes'>"+
          "<small class='like'>Likes: </small>"+
          "</div>"+
          "<div class='watch-div'>"+
            "<img class='logowatch' src='img/eye.png' alt='logo watching'>"+
            "<small class='watch'>Views: </small>"+
            "</div>"+
            "</div>"+
            "</div>"+

    "<div class='timeline-project flex'>"+
      "<small>Modules: <small>" +
      "<small class='modules'></small>"+
      "<a href='https://tree.taiga.io/project/" + projectSlug + "/team'><small class='team'></small></a>"+
    "</div>"+

    "<div class='progress-project'>"+
      "<div class='stories-issues flex'>"+
        "<a href='https://tree.taiga.io/project/" + projectSlug + "/backlog'><div class='progress-stories flex'>"+
        "<p class='number-stories'></p>"+
        "<div class='progress flex'>"+
          "<p>IN PROGRESS</p>"+
          "<p>user stories</p>"+
        "</div>"+
        "</div></a>"+

        "<a href=' https://tree.taiga.io/project/" + projectSlug + "/issues'><div class='number-progress flex'>"+
        "<p class='number-issues'></p>"+
        "<div class='issues'>"+
          "<p>NEW</p>"+
          "<p>issues</p>"+
        "</div>"+
        "</div></a>"+
      "</div>"+

      "<div class='line-progress flex'>"+
        "<p>Sprint</p>"+
        "<p class= 'sprints'></p>" +
        "<p class= 'closed-points'></p>"+
        "<p >user stories closed</p>"+
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
  if (project.logo_small_url === null) {
    imgProject.innerHTML = '<img src="img/photo-null-project.svg">';

  } else {
    imgProject.innerHTML= '<img src="'+ project.logo_small_url +'">';
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

function modulesCall(project, divId, projectSlug) {
  var modulesProject = document.querySelector("#" + divId + " .modules");
  var modules = [
    {
      property: "is_backlog_activated",
      label: "backlog",
      link: "https://tree.taiga.io/project/" + projectSlug + "/backlog"
    },
    {
      property: "is_epics_activated",
      label: "epics",
      link: "https://tree.taiga.io/project/" + projectSlug + "/epics"
    },
    {
      property: "is_issues_activated",
      label: "issues",
      link: "https://tree.taiga.io/project/" + projectSlug + "/issues"
    },
    {
      property: "is_kanban_activated",
      label: "kanban",
      link: "https://tree.taiga.io/project/" + projectSlug + "/kanban"
    },
    {
      property: "is_wiki_activated",
      label: "wiki",
      link: "https://tree.taiga.io/project/" + projectSlug + "/wiki"
    },
    {
      property: "is_contact_activated",
      label: "contact",
      link: "#"
    },
  ];
  modulesProject.innerHTML = "";
  for (var i = 0; i < modules.length; i++) {
    var module = modules[i];

    if (project[module.property] === true) {
      modulesProject.innerHTML += '<a href="' + module.link + '">' + module.label + '</a>';
    } else {
      console.log("no found");
    }
    if (modulesProject.innerHTML !== project[module.property]) {
      modulesProject.innerHTML === project[module.property];
    }
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
