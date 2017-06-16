'use strict';

var nameRequest = new XMLHttpRequest();
var greeting = document.getElementById("greeting");
var avatar = document.getElementById("avatar");


nameRequest.open ('GET', 'https://api.taiga.io/api/v1/users/me', true);
nameRequest.setRequestHeader("Content-Type", "application/json");
nameRequest.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('token'));
nameRequest.onload = function () {
  if (nameRequest.status >= 200 && nameRequest.status < 400) {
    var data = JSON.parse(nameRequest.responseText);
    greeting.innerHTML = "Hello, " + data.full_name;
    console.log(data);
    avatar.innerHTML = data.photo;
  } else {
    console.log("La respuesta del servidor ha devuelto un error");
  }
};

nameRequest.onerror = function() {
  console.log("Error al tratar de conectarse con el servidor");
};

nameRequest.send();
