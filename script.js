'use strict';
const map = L.map('map');

map.locate({setView: true, maxZoom: 16});
map.on('locationfound', function(e) {
    map.setView(e.latlng, 13);
    L.marker(e.latlng).addTo(map);
});
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright"></a>',
}).addTo(map);

const loginButton = document.getElementById("loginButton");
const loginForm = document.getElementById("loginForm");
const registerButton = document.getElementById("registerButton");
const registerForm = document.getElementById("registerForm");
const returnButtonRegister = document.getElementById("returnButton");
const returnButtonLogin = document.getElementById("returnButtonLogin");

loginButton.onclick = function (){
    console.log("login button clicked!")
    loginForm.style.display = 'block';
    loginButton.style.display = 'none';
    registerButton.style.display = 'none';
}

registerButton.onclick = function (){
    console.log("register button clicked!")
    registerForm.style.display = 'block';
    loginButton.style.display = 'none';
    registerButton.style.display = 'none';
}

returnButtonRegister.onclick = function (){
    console.log("Return button clicked.")
    registerForm.style.display = 'none';
    loginButton.style.display = 'block';
    registerButton.style.display = 'block';
}

returnButtonLogin.onclick = function () {
    console.log("Return button clicked.")
    loginForm.style.display = 'none';
    loginButton.style.display = 'block';
    registerButton.style.display = 'block';
}