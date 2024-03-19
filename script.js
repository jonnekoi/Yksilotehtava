'use strict';

const map = L.map('map');
const loginButton = document.getElementById("loginButton");
const loginForm = document.getElementById("loginForm");
const registerButton = document.getElementById("registerButton");
const registerForm = document.getElementById("registerForm");
const returnButtonRegister = document.getElementById("returnButtonRegister");
const returnButtonLogin = document.getElementById("returnButtonLogin");
const lightButton = document.getElementById("lightButton");
const headerElement = document.querySelector("header");
const bodyElement = document.querySelector("body");
const htmlElement = document.querySelector("html");
const boxElement = document.querySelectorAll(".box");
const buttons = document.querySelectorAll(".button");
let isLight = false;

map.locate({setView: true, maxZoom: 16});
map.on('locationfound', function (e) {
    map.setView(e.latlng, 13);
    L.marker(e.latlng).addTo(map);
});
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright"></a>',
}).addTo(map);

document.addEventListener('DOMContentLoaded', function (){
    getUserLocation();
})

lightButton.onclick = function (){
    if(!isLight){
        headerElement.style.backgroundColor = '#EBE3D5';
        Array.from(boxElement).forEach(boxElement => {
            boxElement.style.backgroundColor = '#EBE3D5';
        })
        Array.from(buttons).forEach(buttons => {
            buttons.style.backgroundColor = '#B0A695';
        })
        lightButton.style.backgroundColor = '#B0A695';
        bodyElement.style.backgroundColor = '#B0A695';
        htmlElement.style.backgroundColor = '#B0A695';
        this.innerHTML = "&#9790;";
        isLight = true;
    }else{
        headerElement.style.backgroundColor = '#3F4E4F';
        Array.from(boxElement).forEach(boxElement => {
            boxElement.style.backgroundColor = '#3F4E4F';
        })
        Array.from(buttons).forEach(buttons => {
            buttons.style.backgroundColor = '#2C3639';
        })
        lightButton.style.backgroundColor = '#2C3639';
        bodyElement.style.backgroundColor = '#2C3639';
        htmlElement.style.backgroundColor = '#2C3639';
        this.innerHTML = "&#9728;";
        isLight = false;
    }
}

loginButton.onclick = function () {
    loginForm.style.display = 'block';
    loginButton.style.display = 'none';
    registerButton.style.display = 'none';
}

registerButton.onclick = function () {
    registerForm.style.display = 'block';
    loginButton.style.display = 'none';
    registerButton.style.display = 'none';
}

returnButtonRegister.onclick = function () {
    registerForm.style.display = 'none';
    loginButton.style.display = 'block';
    registerButton.style.display = 'block';
}

returnButtonLogin.onclick = function () {
    loginForm.style.display = 'none';
    loginButton.style.display = 'block';
    registerButton.style.display = 'block';
}

function getWeather(lat, lon){
    const api = "ce77882036e7ff2d906c8535496d7fd9";
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            showWeather(data)
        })
        .catch(error => {
            console.log(error);
        })
}

function showWeather(data){
    const weatherBox = document.querySelector(".weather");
    const temperature = data.main.temp;
    const city = data.name;

    const convert = temperature - 273.15;
    weatherBox.innerHTML = `<h3>${city}</h3>
                            <p>${convert.toFixed(1)}°C</p>`;
}

function getUserLocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            getWeather(lat, lon);
        });
    }
}