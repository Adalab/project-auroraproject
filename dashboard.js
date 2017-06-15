'use strict';
var nameRequest = new XMLHttpRequest();


nameRequest.open ("GET","https://api.taiga.io/api/v1/users");
nameRequest.setRequestHeader("Content-Type", "application/json");
nameRequest.setRequestHeader("Authorization", "Bearer "+ token);
nameRequest.onload = function () {
  if (nameRequest.status >= 200 && nameRequest.status < 400) {
    var data = JSON.parse(nameRequest.responseText);
    var value = data.auth_token;
      console.log("users");

  } else {
    console.log("La respuesta del servidor ha devuelto un error");
  }
};

nameRequest.onerror = function() {
  console.log("Error al tratar de conectarse con el servidor");
};
nameRequest.send(JSON.stringify(dat));
