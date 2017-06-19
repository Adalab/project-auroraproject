'use strict';


var buttonLogin = document.getElementById("buttonLogin_js");
var request = new XMLHttpRequest();


function getUserAccountInfo() {
  var username = document.getElementById("username_js").value;
  var password = document.getElementById("password_js").value;
  var payload = {
    username: username ,
    password: password ,
    type:"normal"
  };

  return payload;
}

function login() {
  request.open('POST', 'https://api.taiga.io/api/v1/auth', true); // use true to make the request async
  request.setRequestHeader("Content-Type", "application/json");
  request.setRequestHeader("Accept", "application/json");
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      var data = JSON.parse(request.responseText);
      console.log(data);
      var value = data.auth_token;
      var userData = data;
      sessionStorage.setItem("token", value);
      sessionStorage.setItem("user", userData);
      window.location.href = "dashboard.html" ;
    } else {
      console.log("La respuesta del servidor ha devuelto un error");
    }
  };

  request.onerror = function() {
    console.log("Error al tratar de conectarse con el servidor");
  };

  var userInfo = getUserAccountInfo();
  request.send(JSON.stringify(userInfo));

}

buttonLogin.addEventListener("click", login);
