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
const weather = document.querySelector(".weather");
const headerText = document.querySelector(".headerText");
const menuHeader  = document.querySelector(".menuHeader");
const logo = document.getElementById("logo");
const languageButton = document.getElementById("languageButton");
const flag = document.getElementById("flag");
let isLight = false;
let language = false;
let kieli = 'fi';

map.locate({setView: true, maxZoom: 16});
map.on('locationfound', function (e) {
    map.setView(e.latlng, 10);
    const myIcon = L.icon({
        iconUrl: 'Resources/UserLocationIcon.png',
        iconSize: [41, 41],
        iconAnchor: [12, 41],
        popupAnchor: [8, -41]
    });
    L.marker(e.latlng, {icon: myIcon}).addTo(map).bindPopup("Your location");
});
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright"></a>',
}).addTo(map);

document.addEventListener('DOMContentLoaded', async function (){
    await getUserLocation();
    await getRestaurants();
})

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    login();
});

document.getElementById('registerForm').addEventListener('submit', function (event){
    event.preventDefault();
    register();
})


lightButton.onclick = function (){
    if(!isLight){
        headerElement.style.backgroundColor = '#EBE3D5';
        Array.from(boxElement).forEach(boxElement => {
            boxElement.style.backgroundColor = '#EBE3D5';
        })
        Array.from(buttons).forEach(buttons => {
            buttons.style.backgroundColor = '#B0A695';
            buttons.style.color = 'black';
        })
        logo.src = 'Resources/cutlery.png';
        lightButton.style.backgroundColor = '#B0A695';
        languageButton.style.backgroundColor = '#B0A695';
        lightButton.style.color = 'black';
        bodyElement.style.backgroundColor = '#B0A695';
        htmlElement.style.backgroundColor = '#B0A695';
        headerText.style.color = "black";
        weather.style.color = 'black';
        menuHeader.style.color = 'black';
        document.body.classList.add('light-mode');
        this.innerHTML = "&#9790;";
        isLight = true;
    }else{
        headerElement.style.backgroundColor = '#3F4E4F';
        Array.from(boxElement).forEach(boxElement => {
            boxElement.style.backgroundColor = '#3F4E4F';
        })
        Array.from(buttons).forEach(buttons => {
            buttons.style.backgroundColor = '#2C3639';
            buttons.style.color = 'white';
        })
        logo.src = 'Resources/cutlery_white.png';
        lightButton.style.backgroundColor = '#2C3639';
        lightButton.style.color = 'white';
        languageButton.style.backgroundColor = '#2C3639';
        bodyElement.style.backgroundColor = '#2C3639';
        htmlElement.style.backgroundColor = '#2C3639';
        headerText.style.color = "white";
        weather.style.color = 'white';
        menuHeader.style.color = 'white';
        document.body.classList.remove('light-mode');
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
    registerForm.reset();
}

returnButtonLogin.onclick = function () {
    loginForm.style.display = 'none';
    loginButton.style.display = 'block';
    registerButton.style.display = 'block';
    loginForm.reset();
}

languageButton.onclick = function (){
    if(!language){
        flag.src = 'Resources/fi.svg';
        language = true;
        kieli = 'en';
    }else{
        flag.src = 'Resources/gb-eng.svg';
        language = false;
        kieli = 'fi';
    }
    const popup = map._popup;
    if (popup) {
        const id = popup._source.options.restaurantId;
        getMenu(id, kieli);
    }
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

async function getUserLocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            getWeather(lat, lon);
        });
    }
}


async function getRestaurants() {
    const url = "https://10.120.32.94/restaurant/api/v1/restaurants/?name";
    fetch(url)
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                const coordinates = item.location.coordinates;
                const latitude = coordinates[0];
                const longitude = coordinates[1];
                const id = item._id;
                const marker = L.marker([longitude, latitude], {restaurantId: id}).addTo(map).bindPopup(item.name);
                marker.on('popupopen', ()=> {
                    getMenu(id, kieli);
                });
            })
        })
}

async function getMenu(id, kieli) {
    const urlMenu = `https://10.120.32.94/restaurant/api/v1/restaurants/daily/${id}/${kieli}`;
    fetch(urlMenu)
        .then(response => response.json())
        .then(data => {
            const menuDiv = document.getElementById("restaurantMenu");
            menuDiv.innerHTML = '';

            if (data.courses && Array.isArray(data.courses) && data.courses.length > 0) {
                data.courses.forEach(item => {
                    const menuItem = document.createElement('p');
                    const priceText = item.price ? `: ${item.price}` : '';
                    menuItem.textContent = `${item.name}${priceText}`;
                    if(!isLight){
                        menuItem.style.color = 'white';
                    }else {
                        menuItem.style.color = 'black';
                    }
                    menuDiv.appendChild(menuItem);
                });
            } else {
                const noMenuAvailable = document.createElement('p');
                noMenuAvailable.textContent = 'No menu available';
                if(!isLight){
                    noMenuAvailable.style.color = 'white';
                }else {
                    noMenuAvailable.style.color = 'black';
                }
                menuDiv.appendChild(noMenuAvailable);
            }
        })
        .catch(error => {
            console.log(error);
        });
}

function login(){
    const loginInput = document.getElementById("loginUsername");
    const loginValue = loginInput.value;
    const loginInputPassword = document.getElementById("loginPassword");
    const loginValuePassword = loginInputPassword.value;

    const userDetails = {
        username: loginValue,
        password: loginValuePassword,
    };

    fetch("https://10.120.32.94/restaurant/api/v1/auth/login", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userDetails)
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.log(error))
}

function register(){
    const registerInputUsername = document.getElementById("registerUsername");
    const registerValueUsername = registerInputUsername.value;
    const registerInputPassword = document.getElementById("registerPassword");
    const registerValuePassword = registerInputPassword.value;
    const registerInputEmail = document.getElementById("registerEmail");
    const registerValueEmail = registerInputEmail.value;

    const registerDetails = {
        username: registerValueUsername,
        password: registerValuePassword,
        email: registerValueEmail,
    };

    fetch("https://10.120.32.94/restaurant/api/v1/users", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(registerDetails)
    })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.log(error))
}
