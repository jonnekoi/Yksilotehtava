'use strict';

const map = L.map('map');
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

const loginButton = document.getElementById("loginButton");
const returnButtonLogin = document.getElementById("returnButtonLogin");
const registerButton = document.getElementById("registerButton");
const returnButtonRegister = document.getElementById("returnButtonRegister");
const lightButton = document.getElementById("lightButton");
const languageButton = document.getElementById("languageButton");
const logoutButton = document.getElementById("logoutButton");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const headerElement = document.querySelector("header");
const bodyElement = document.querySelector("body");
const htmlElement = document.querySelector("html");
const boxElement = document.querySelectorAll(".box");
const buttons = document.querySelectorAll(".button");
const weather = document.querySelector(".weather");
const headerText = document.querySelector(".headerText");
const menuHeader = document.querySelector(".menuHeader");
const logo = document.getElementById("logo");
const flag = document.getElementById("flag");
const info = document.getElementById('userInfo');
const lowerPhoto = document.querySelector('.lowerPhoto');
const dialog = document.querySelector('dialog');

let dayOrWeek = '';
let isLight = false;
let language = false;
let kieli = 'fi';
let imageIndex = 0;
let images = ['Resources/graph.png', 'Resources/graph(1).png', 'Resources/graph(2).png', 'Resources/cutlery.png'];

document.addEventListener('DOMContentLoaded', async function () {
    await getUserLocation();
    await getRestaurants();
    userCheck()
})
loginForm.addEventListener('submit', function (event) {
    login()
})

registerForm.addEventListener('submit', function (event) {
    register()
})

logoutButton.addEventListener('click', function () {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        loginButton.style.display = 'block';
        registerButton.style.display = 'block';
        logoutButton.style.display = 'none';
        info.textContent = '';
    }
)

lowerPhoto.addEventListener('click', function() {
    this.src = images[imageIndex];
    imageIndex = (imageIndex + 1) % images.length;
    if (imageIndex === 0){
        this.style.display = 'none';
        headerText.classList.add('rainbow-text');
    }
});

lightButton.onclick = function () {
    const menuItems = document.querySelectorAll("#restaurantMenu p");
    const userInfo = document.querySelectorAll("#userInfo p")
    if (!isLight) {
        headerElement.style.backgroundColor = '#EBE3D5';
        Array.from(boxElement).forEach(boxElement => {
            boxElement.style.backgroundColor = '#EBE3D5';
        })
        Array.from(buttons).forEach(buttons => {
            buttons.style.backgroundColor = '#B0A695';
            buttons.style.color = 'black';
        })
        menuItems.forEach(item => {
            item.style.color = 'black';
        })
        userInfo.forEach(item => {
            item.style.color = 'black';
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
        dialog.style.backgroundColor = '#B0A695';
        dialog.style.color = 'black';
        document.body.classList.add('light-mode');
        this.innerHTML = "&#9790;";
        isLight = true;
    } else {
        headerElement.style.backgroundColor = '#3F4E4F';
        Array.from(boxElement).forEach(boxElement => {
            boxElement.style.backgroundColor = '#3F4E4F';
        })
        Array.from(buttons).forEach(buttons => {
            buttons.style.backgroundColor = '#2C3639';
            buttons.style.color = 'white';
        })
        menuItems.forEach(item => {
            item.style.color = 'white';
        })
        userInfo.forEach(item => {
            item.style.color = 'white';
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
        dialog.style.backgroundColor = '#2C3639';
        dialog.style.color = 'white';
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
    info.style.display = 'none';
    registerForm.reset();
}

returnButtonLogin.onclick = function () {
    loginForm.style.display = 'none';
    loginButton.style.display = 'block';
    registerButton.style.display = 'block';
    info.style.display = 'none';
    loginForm.reset();
}

languageButton.onclick = function () {
    if (!language) {
        flag.src = 'Resources/fi.svg';
        language = true;
        kieli = 'en';
    } else {
        flag.src = 'Resources/gb-eng.svg';
        language = false;
        kieli = 'fi';
    }
}


async function getWeather(lat, lon) {
    const api = "";
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api}`;

    try{
        const response = await fetch(url);
        const data = await response.json();
        const temp = data.main.temp;
        const city = data.name;
        const temperature = temp - 273.15;
        const weatherBox = document.querySelector(".weather");
        weatherBox.innerHTML = `<h3>${city}</h3>
                            <p>${temperature.toFixed(1)}°C</p>`;
    } catch(error){
        console.log(error);
    }
}

async function getUserLocation() {
    if ("geolocation" in navigator) {
        await navigator.geolocation.getCurrentPosition(function (position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            getWeather(lat, lon);
        });
    }
}


async function getRestaurants() {
    const url = "https://10.120.32.94/restaurant/api/v1/restaurants/";
    try {
        const response = await fetch(url);
        const data = await response.json();
        data.forEach(item => {
            const coordinates = item.location.coordinates;
            const latitude = coordinates[0];
            const longitude = coordinates[1];
            const id = item._id;
            const marker = L.marker([longitude, latitude], {restaurantId: id}).addTo(map);
            marker.on('click', () => markerClick(item, id, kieli));
        })
    } catch (error) {
        console.log(error);
    }
}

function markerClick(item, id, kieli) {
    dialog.innerHTML = `
    <h1>${item.name}</h1>
    <p>${item.address}, ${item.postalCode}, ${item.city}</p>
    <form method="dialog">
    <button class="button">Sulje</button>
    <button class="button" id="menuButtonDay">Päivän menu</button>
    <button class="button" id="menuButtonWeek">Viikon menu</button>
    </form>`;
    dialog.showModal();
    const menuButtonDay = document.querySelector('#menuButtonDay');
    const menuButtonWeek = document.querySelector('#menuButtonWeek');

    menuButtonDay.addEventListener('click', function (event){
        dayOrWeek = 'daily';
        getMenu(id, kieli, dayOrWeek);
    });

    menuButtonWeek.addEventListener('click', function (event){
        dayOrWeek = 'weekly';
        getMenu(id, kieli, dayOrWeek);
    });
}


async function getMenu(id, kieli, dayOrWeek) {
    const url = `https://10.120.32.94/restaurant/api/v1/restaurants/${dayOrWeek}/${id}/${kieli}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        const menuDiv = document.getElementById("restaurantMenu");
        menuDiv.innerHTML = '';
        if (data.days && Array.isArray(data.days) && data.days.length > 0) {
            data.days.forEach(day => {
                const dayElement = document.createElement('h3');
                dayElement.style.color = 'white';
                dayElement.style.fontWeight = 'bold';
                dayElement.style.textDecoration = 'underline';
                dayElement.textContent = day.date;
                menuDiv.appendChild(dayElement);
                day.courses.forEach(course => {
                    const courseElement = document.createElement('p');
                    const priceText = course.price ? `: ${course.price}` : '';
                    courseElement.textContent = `${course.name}${priceText}`;
                    if (!isLight) {
                        courseElement.style.color = 'white';
                    } else {
                        courseElement.style.color = 'black';
                    }
                    menuDiv.appendChild(courseElement);
                });
            });
        } else if (data.courses && Array.isArray(data.courses) && data.courses.length > 0) {
            data.courses.forEach(item => {
                const menuItem = document.createElement('p');
                const priceText = item.price ? `: ${item.price}` : '';
                menuItem.textContent = `${item.name}${priceText}`;
                if (!isLight) {
                    menuItem.style.color = 'white';
                } else {
                    menuItem.style.color = 'black';
                }
                menuDiv.appendChild(menuItem);
            });
        }
    } catch (error) {
        console.log(error);
    }
}

async function login() {
    const loginInput = document.getElementById("loginUsername");
    const loginInputPassword = document.getElementById("loginPassword");
    const loginValue = loginInput.value;
    const loginValuePassword = loginInputPassword.value;
    const userDetails = {
        username: loginValue,
        password: loginValuePassword,
    };

    try {
        const response = await fetch("https://10.120.32.94/restaurant/api/v1/auth/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userDetails)
        });

        if (!response.ok) {
            throw new Error('Unauthorized');
        }

        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.data));
        loginButton.style.display = 'none';
        registerButton.style.display = 'none';
        loginForm.style.display = 'none';
        logoutButton.style.display = 'block';
        const userDiv = document.getElementById("userInfo");
        const userData = document.createElement('p');
        if (data && data.data) {
            userData.textContent = `Tervetuloa, ${data.data.username}`;
            userData.style.color = 'white';
        }
        userDiv.textContent = '';
        userDiv.appendChild(userData);
    } catch (error) {
        const userDiv = document.getElementById("userInfo");
        const userData = document.createElement('p');
        userData.textContent = 'Virheellinen käyttäjänimi tai salasana!';
        userData.style.color = 'red';
        userDiv.textContent = '';
        userDiv.appendChild(userData);
    }
}

async function register() {
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

    try {
        const response = await fetch("https://10.120.32.94/restaurant/api/v1/users", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registerDetails)
        });

        if (!response.ok) {
            throw new Error('Registration failed');
        }

        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.data));
        loginButton.style.display = 'none';
        registerButton.style.display = 'none';
        registerForm.style.display = 'none';
        logoutButton.style.display = 'block';
        const userDiv = document.getElementById("userInfo");
        const userData = document.createElement('p');
        if (data && data.data) {
            userData.textContent = `Tervetuloa, ${registerValueUsername}`;
            userData.style.color = 'white';
        }
        userDiv.textContent = '';
        userDiv.appendChild(userData);
    } catch (error) {
        console.log(error);
        const userDiv = document.getElementById("userInfo");
        const userData = document.createElement('p');
        userData.textContent = 'Rekisteröityminen epäonnistui!';
        userData.style.color = 'red';
        userDiv.textContent = '';
        userDiv.appendChild(userData);
    }
}

function userCheck() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    if (token && user) {
        loginButton.style.display = 'none';
        registerButton.style.display = 'none';
        const userData = document.createElement('p');
        userData.textContent = `Tervetuloa, ${user.username}`;
        userData.style.color = 'white';
        info.appendChild(userData);
        logoutButton.style.display = 'block';
    }
}
