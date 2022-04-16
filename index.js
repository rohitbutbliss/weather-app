let map = document.getElementById("gmap_canvas")

function searchCity(e) {
    e.preventDefault();
    opacityZero();
    let x = document.querySelector("#navbar > form > input").value.split(" ").join("+");
    if (x !== "") {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${x}&appid=e2a8b1a988b1d299deaf2163b348c86b&units=metric`).then(function (res) {
            map.src = null;
            return res.json();

        }).then(function (res) {
            putDataInCurrent(res);
        }).catch(function (err) {
            console.log(err);
        })

        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${x}&appid=e2a8b1a988b1d299deaf2163b348c86b&units=metric`).then(function (res) {
            return res.json();
        }).then(function (res) {
            pushDataInOther(res);
        }).catch(function (err) {
            console.log(err)
        })

    }
}


function pushDataInOther(res) {
    let otherContainer = document.querySelector("#forecast-data");
    otherContainer.innerHTML = "";
    res.list.map(function (elem, i, arr) {
        if (i % 8 == 0) {
            let max = -Infinity;
            let min = Infinity;
            for (let j = i; j < i + 8; j++) {
                if (max < arr[j].main.temp_max) {
                    max = arr[j].main.temp_max;
                }
                if (max > arr[j].main.temp_max) {
                    min = arr[j].main.temp_min;
                }
            }
            let x = [elem, max, min]
            return x;
        }
    }).map(function (ele, i, arr) {
        if (i % 8 == 0) {
            let newBox = document.createElement("div");
            let rhs = document.createElement("div");
            let lhs = document.createElement("div");
            let img = document.createElement("div");
            img.style.fontSize = "48px"
            img.style.height = "100%"
            img.style.width = "75px"
            switch (ele[0].weather[0].main) {
                case "Thunderstorm": img.innerHTML = "<i class='fa-solid fa-cloud-bolt'></i>";
                    break;
                case "Drizzle": img.innerHTML = "<i class='fa-solid fa-cloud-rain'></i>";
                    break;
                case "Rain": img.innerHTML = "<i class='fa-solid fa-cloud-showers-heavy'></i>";
                    break;
                case "Snow": img.innerHTML = "<i class='fa-solid fa-snowflake'></i>";
                    break;
                case "Clear": img.innerHTML = "<i class='fa-solid fa-sun'></i>"
                    break;
                case "Clouds": img.innerHTML = "<i class='fa-solid fa-cloud'></i>";
                    break;
                default: img.innerHTML = "<i class='fa-solid fa-smog'></i>";
                    break;
            }
            let div = document.createElement("div");
            let p2 = document.createElement("p");
            p2.style.fontSize = "14px"
            p2.style.color = "#fff"
            let date = new Date(ele[0].dt_txt);
            let day = date.getDay()
            switch (day) {
                case 0: p2.innerText = "Sunday";
                    break;
                case 1: p2.innerText = "Monday";
                    break;
                case 2: p2.innerText = "Tuesday";
                    break;
                case 3: p2.innerText = "Wednesday";
                    break;
                case 4: p2.innerText = "Thursday";
                    break;
                case 5: p2.innerText = "Friday";
                    break;
                case 6: p2.innerText = "Saturday";
                    break;
            }
            lhs.innerText = `${ele[1]}°C / ${(ele[2])}°C`;
            let weat = document.createElement("p");
            weat.innerText = capitalize(ele[0].weather[0].description)
            div.append(p2, weat);
            div.style.width = "fit-content";
            rhs.style.display = "flex";
            rhs.style.alignItems = "center";
            rhs.style.gap = "5px"
            rhs.append(img, div);
            lhs.style.whiteSpace = "nowrap"
            newBox.style.display = "flex";
            newBox.style.justifyContent = "space-between";
            newBox.style.alignItems = "center";
            newBox.append(rhs, lhs)
            otherContainer.append(newBox);
            opacityOne();

        }

    })
    document.querySelector("#forecast-data > div:nth-child(1) > div > div > p:nth-child(1)").innerText = "Today";
    document.querySelector("#forecast-data > div:nth-child(2) > div > div > p:nth-child(1)").innerText = "Tomorrow";
}

function currLocationData() {
    opacityZero();



    navigator.geolocation.getCurrentPosition(success);

    function success(pos) {
        let crd = pos.coords;

        getDataUsingLatAndLong(crd.latitude, crd.longitude);
    }
}

function putDataInCurrent(res) {
    let current = document.querySelector("#current-data");
    current.innerHTML = "";
    let div1 = document.createElement("div");
    let div2 = document.createElement("div");
    let div3 = document.createElement("div");
    let div4 = document.createElement("div");
    let div5 = document.createElement("div");

    let wethCondi = document.createElement("p");
    wethCondi.style.gridArea = "w";
    let wethcon = capitalize(res.weather[0].description)
    wethCondi.style.width = "100%";
    wethCondi.style.height = "100%";
    wethCondi.style.display = "flex";
    wethCondi.style.alignItems = "flex-end";
    wethCondi.style.justifyContent = "center";
    wethCondi.style.fontSize = "30px"

    let img = document.createElement("div");
    img.style.fontSize = "125px"
    img.style.height = "100%"
    img.style.margin = "auto";
    switch (res.weather[0].main) {
        case "Thunderstorm": img.innerHTML = "<i class='fa-solid fa-cloud-bolt'></i>";
            break;
        case "Drizzle": img.innerHTML = "<i class='fa-solid fa-cloud-rain'></i>";
            break;
        case "Rain": img.innerHTML = "<i class='fa-solid fa-cloud-showers-heavy'></i>";
            break;
        case "Snow": img.innerHTML = "<i class='fa-solid fa-snowflake'></i>";
            break;
        case "Clear": img.innerHTML = "<i class='fa-solid fa-sun'></i>"
            break;
        case "Clouds": img.innerHTML = "<i class='fa-solid fa-cloud'></i>";
            break;
        default: img.innerHTML = "<i class='fa-solid fa-smog'></i>";
            break;
    }

    // console.log(res);

    let d = new Date()
    let localTime = d.getTime()
    let localOffset = d.getTimezoneOffset() * 60000;
    let utc = localTime + localOffset;


    var currTime = utc + (1000 * res.timezone)
    let date = new Date(currTime)
    let hours = date.getHours();
    let minutes = "0" + date.getMinutes();
    var formattedTime = hours + ':' + minutes.substr(-2);

    wethCondi.innerText = `${wethcon} | ${formattedTime}`;
    div1.append(img, wethCondi);

    div2.style.gridArea = "r";
    let tempIcon = document.createElement("span");
    tempIcon.innerHTML = "<i class='fa-solid fa-temperature-half'></i>";
    tempIcon.style.fontSize = "38px"
    let p3 = document.createElement("p");
    let tempText = document.createElement("div");
    p3.innerText = `${res.main.temp}°C`;
    p3.style.fontSize = "32px";
    p3.style.lineHeight = "32px";

    let p4 = document.createElement("p");
    p4.innerText = "Temperature";
    p4.style.fontSize = "12px";
    tempText.append(p3, p4)

    div2.append(tempIcon, tempText);

    div3.style.gridArea = "t";
    let windIcon = document.createElement("span");
    windIcon.innerHTML = "<i class='fa-solid fa-wind'></i>";
    windIcon.style.fontSize = "38px"
    let p5 = document.createElement("p");
    let windText = document.createElement("div");
    p5.innerText = `${res.wind.speed} km/h`;
    p5.style.fontSize = "32px";
    p5.style.lineHeight = "32px";

    let p6 = document.createElement("p");
    p6.innerText = "Wind Speed";
    p6.style.fontSize = "12px";
    windText.append(p5, p6)

    div3.append(windIcon, windText);


    div4.style.gridArea = "u";
    let humIcon = document.createElement("span");
    humIcon.innerHTML = "<i class='fa-solid fa-droplet'></i>";
    humIcon.style.fontSize = "38px"
    let p7 = document.createElement("p");
    let humText = document.createElement("div");
    p7.innerText = `${res.main.humidity}%`;
    p7.style.fontSize = "32px";
    p7.style.lineHeight = "32px";


    let p8 = document.createElement("p");
    p8.innerText = "Humidity";
    p8.style.fontSize = "12px";
    humText.append(p7, p8);

    div4.append(humIcon, humText);


    div5.style.gridArea = "s";
    let tempIcon2 = document.createElement("span");
    tempIcon2.innerHTML = "<i class='fa-solid fa-temperature-half'></i>";
    tempIcon2.style.fontSize = "38px"
    let p9 = document.createElement("p");
    let tempText2 = document.createElement("div");
    p9.innerText = `${res.main.feels_like}°C`;
    p9.style.fontSize = "32px";
    p9.style.lineHeight = "32px";


    let p10 = document.createElement("p");
    p10.innerText = "Feels Like";
    p10.style.fontSize = "12px";
    tempText2.append(p9, p10);

    div5.append(tempIcon2, tempText2);


    current.append(div1, div2, div3, div4, div5)

    map.src = `https://maps.google.com/maps?q=${res.name}&t=k&z=13&ie=UTF8&iwloc=&output=embed`
    opacityOne();
}

function getDataUsingLatAndLong(lat, long) {
    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=e2a8b1a988b1d299deaf2163b348c86b&units=metric`;
    let url2 = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=e2a8b1a988b1d299deaf2163b348c86b&units=metric`
    fetch(url2).then(function (res) {
        return res.json();
    }).then(function (res) {

        pushDataInOther(res);

    }).catch(function (err) {
        console.log(err)
    })
    fetch(url).then(function (res) {
        map.src = null;
        return res.json();

    }).then(function (res) {
        document.querySelector("#navbar > form > input").value = res.name;
        putDataInCurrent(res);
    }).catch(function (err) {
        console.log(err);
    })
}

function capitalize(input) {
    var words = input.split(' ');
    var CapitalizedWords = [];
    words.forEach(element => {
        CapitalizedWords.push(element[0].toUpperCase() + element.slice(1, element.length));
    });
    return CapitalizedWords.join(' ');
}

function opacityZero() {
    let x = document.querySelectorAll("#navbar ~ *");
    for (let i = 0; i < x.length; i++) {
        x[i].style.opacity = "0";
    }
}
function opacityOne() {
    let x = document.querySelectorAll("#navbar ~ *");
    for (let i = 0; i < x.length; i++) {
        x[i].style.opacity = "1";
    }
}