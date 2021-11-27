var first = document.getElementById("first")
var table = document.getElementById("myTable");
const lastNameInputForUp = document.getElementById("last-name-input-for-up")
const nameInputForUp = document.getElementById("name-input-for-up")
const passwordInputForUp = document.getElementById("password-input-for-up")
const alertTextForUp = document.querySelector("#alet-text-up")
const alertTextForAdd = document.querySelector("#alet-text-add")
var idInputForUp = 0;
let collapsed = false;
var userList;

// window.onload = onInit;
onInit();

async function onInit() {
    var token = localStorage.getItem("token");
    if (token) {
        await getUser();
        await chartGrid();
        await dataGrid();
        await pieCartGrid();
        await map();
    }
}

async function dataGrid() {
    $(() => {
        $('#gridContainer').dxDataGrid({
            dataSource: {
                store: {
                    type: 'odata',
                    url: 'http://localhost:56614/api/User/getall',
                    key: 'id',
                    // beforeSend(request) {
                    //     request.hr.startDate = '2020-05-10';
                    //     request.params.endDate = '2021-05-15';
                    // },
                },
            },
            paging: {
                pageSize: 10,
            },
            filterRow: {
                visible: true,
            },
            pager: {
                showPageSizeSelector: true,
                allowedPageSizes: [10, 12],
            },
            remoteOperations: false,
            groupPanel: { visible: true },
            grouping: {
                autoExpandAll: false,
            },
            allowColumnReordering: true,
            rowAlternationEnabled: true,
            showBorders: true,
            showColumnLines: true,
            showRowLines: true,
            rowAlternationEnabled: true,
            columns: [{
                    dataField: 'id',
                    caption: 'İd Numarası',
                    width: 100,
                },
                {
                    dataField: 'userFirstName',
                    caption: 'Ad',
                    dataType: 'string',
                },
                {
                    dataField: 'userLastName',
                    caption: 'Soyad',
                    dataType: 'string',
                },
                {
                    dataField: 'password',
                    caption: 'Şifre',
                },
                {
                    caption: 'Güncelle',
                    type: "buttons",
                    buttons: ["edit", "delete", {
                        text: "My Command",
                        icon: "/icons/edit-26.png",
                        hint: "My Command",
                        onClick: function(e) {
                            var user = e.row.data
                            console.log(user);
                            lastNameInputForUp.value = user.userLastName;
                            nameInputForUp.value = user.userFirstName;
                            passwordInputForUp.value = user.password;
                            idInputForUp = parseInt(user.id)
                            scrolldown(2);
                        }
                    }]
                }
            ],
            onContentReady(e) {
                if (!collapsed) {
                    collapsed = true;
                    e.component.expandRow(['EnviroCare']);
                }
            },
        });
    });
}

async function chartGrid() {
    $(() => {
        const chartDataSource = new DevExpress.data.DataSource({
            store: {
                type: 'odata',
                url: 'http://localhost:56614/api/User/getall',
            },
            postProcess(results) {
                return results;
            },
            expand: 'DayItems',
            filter: ['id', '=', 1],
            paginate: false,
        });

        const chartOptions = {
            dataSource: chartDataSource,
            title: 'Kullanıcı Rol Sayısı Grafiği',
            size: {
                height: 420,
            },
            series: {
                argumentField: 'userFirstName',
                valueField: 'id',
            },
            legend: {
                visible: false,
            },
            commonPaneSettings: {
                border: {
                    visible: true,
                    width: 2,
                    top: false,
                    right: false,
                },
            },
            export: {
                enabled: true,
            },
            tooltip: {
                enabled: true,
                customizeTooltip(arg) {
                    return {
                        text: `${arg.value}`,
                    };
                },
            },
            valueAxis: {
                valueType: 'numeric',
                grid: {
                    opacity: 0.2,
                },
                label: {
                    customizeText() {
                        return `${this.valueText}`;
                    },
                },
            },
            argumentAxis: {
                type: 'discrete',
                grid: {
                    visible: true,
                    opacity: 0.5,
                },
            },
            loadingIndicator: {
                enabled: true,
            },
        };

        $('#chart').dxChart(chartOptions);
    });
}

async function pieCartGrid() {

    var dataSource = await fetch("http://localhost:56614/api/Auth/GetUserAuthorities", {
            method: "GET",
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            },
        })
        .then(
            (response) => {
                return response.json();
            }).then(response => {
            console.log(response)
            return response.data;
        })
        .catch(function(err) {
            console.log("error" + err);
        });
    console.log(dataSource)
    $(() => {
        $('#pie').dxPieChart({
            type: 'doughnut',
            palette: 'Soft Pastel',
            title: 'Kullanıcıların Sahip Oldukları Rol Sayıları',
            dataSource,
            legend: {
                horizontalAlignment: 'center',
                verticalAlignment: 'bottom',
            },
            export: {
                enabled: true,
            },
            series: [{
                argumentField: 'authorityName',
                valueField: 'authorityCount',
                label: {
                    visible: true,
                    format: 'fixedPoint',
                    customizeText(point) {
                        var i = point.percentText.indexOf("%");
                        var a = point.percentText.slice(0, i);
                        return `${point.value}: %${a}`;
                    },
                    connector: {
                        visible: true,
                        width: 1,
                    },
                },
            }],
        });
    });

}

async function map() {
    const markerUrl = 'https://js.devexpress.com/Demos/RealtorApp/images/map-marker.png';
    const markersData = [{
        location: '40.899895,29.211745',
        tooltip: {
            text: 'Evim',
        },
    }, ];

    $(() => {
        const mapTypes = [{
            key: 'roadmap',
            name: 'Road Map',
        }, {
            key: 'satellite',
            name: 'Satellite (Photographic) Map',
        }, {
            key: 'hybrid',
            name: 'Hybrid Map',
        }];

        const map = $('#map').dxMap({

            center: '40.899895,29.211745',
            zoom: 15,
            height: 400,
            width: '100%',
            provider: 'bing',
            markerIconSrc: markerUrl,
            markers: markersData,
            apiKey: {
                // Specify your API keys for each map provider:
                // bing: "YOUR_BING_MAPS_API_KEY",
                // google: "AIzaSyA1cg9k2SFeDxNk_nOiETTnqHH3Xgy121s",
                // googleStatic: "YOUR_GOOGLE_STATIC_MAPS_API_KEY"
            },
            type: mapTypes[0].key,
        }).dxMap('instance');

        $('#choose-type').dxSelectBox({
            dataSource: mapTypes,
            displayExpr: 'name',
            valueExpr: 'key',
            value: mapTypes[0].key,
            onValueChanged(data) {
                map.option('type', data.value);
            },
        });
    });
}



var sayi = 1

async function scrolldown(params) {
    let pageHeight = window.innerHeight;
    window.scrollTo(0, params * pageHeight * 1.3);
}

async function add() {
    var firstName = document.getElementById("adInput").value;
    var lastName = document.getElementById("soyadInput").value;
    var userPassword = document.getElementById("sifreInput").value;
    fetch("http://localhost:56614/api/User/add", {
            method: "POST",
            body: JSON.stringify({
                password: userPassword,
                firstName: firstName,
                lastName: lastName
            }),
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            }
        })
        .then(res => {
            console.log(res)
            return res.json();
        }).then(data => {
            console.log(data)
            var alert = document.querySelector("#add-alert")
            if (!data.success) {
                alert.classList.remove('succes-alert')
                alert.classList.add('unsuccessful')
                alertTextForAdd.innerHTML = "<strong>Hata! </strong><br>" + data.message

            } else {
                alert.classList.remove('unsuccessful')
                alert.classList.add('succes-alert')
                alertTextForAdd.innerHTML = "<strong>Başarılı! </strong><br>" + data.message
            }
            alert.classList.remove('hidden')
            setTimeout(() => {
                document.querySelector("#add-alert").classList.add('hidden')
            }, 3000);
        })
}

function update() {
    var firstName = nameInputForUp.value;
    var lastName = lastNameInputForUp.value;
    var userPassword = passwordInputForUp.value;
    fetch("http://localhost:56614/api/user/update", {
            method: "POST",
            body: JSON.stringify({
                id: parseInt(idInputForUp),
                firstName: firstName,
                lastName: lastName,
                password: userPassword
            }),
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            }
        })
        .then(res => {
            return res.json();
        }).then(data => {
            console.log(data)
            var alert = document.querySelector("#update-alert")
            if (!data.success) {
                alert.classList.remove('succes-alert')
                alert.classList.add('unsuccessful')
                alertTextForUp.innerHTML = "<strong>Hata! </strong><br>" + data.message

            } else {
                alert.classList.remove('unsuccessful')
                alert.classList.add('succes-alert')
                alertTextForUp.innerHTML = "<strong>Başarılı! </strong><br>" + data.message
            }
            alert.classList.remove('hidden')
            setTimeout(() => {
                document.querySelector("#update-alert").classList.add('hidden')
            }, 3000);
        })
}

async function login() {
    var firstName = document.getElementById("login-name-input").value
    var password = document.getElementById("login-password-input").value
    await fetch("http://localhost:56614/api/auth/login", {
            method: "POST",
            body: JSON.stringify({
                userFirstName: firstName,
                password: password
            }),
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            },
        })
        .then(
            (response) => {
                return response.json();
            }).then(response => {
            if (response.success != true) {
                alert(response.message)
            } else {
                console.log(response)
                document.getElementById("login-id").style.display = "none";
                document.querySelector(".user-login-off").style.display = "none";
                document.querySelector(".dropdown").style.display = "inline-block";
                document.getElementById("user-name").innerHTML = firstName;
                localStorage.setItem("token", response.data.token);
                onInit();
            }
        })
        .catch(function(err) {
            console.log("error" + err);
        });

}

async function loginVisibly(params) {
    if (params == "on")
        document.getElementById("login-id").style.display = "flex";

    else
        document.getElementById("login-id").style.display = "none";
}

async function getUser() {
    await fetch("http://localhost:56614/api/User/getall", {
        method: "GET",
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    }).then(response => {
        return response.json();
    }).then(result => {
        console.log(result);
        userList = result;
    });

    var avatarTitle = document.getElementById("avatar-title");
    var avatarText = document.getElementById("avatar-text");
    var id;
    await fetch("http://localhost:56614/api/auth/decodetoken", {
        method: "POST",
        body: JSON.stringify({
            token: localStorage.getItem("token")
        }),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    }).then(response => {
        return response.json();
    }).then(result => {
        console.log(result)
        if (result.success != true) {
            alert(result.message)
        } else {
            document.getElementById("login-id").style.display = "none";
            document.querySelector(".user-login-off").style.display = "none";
            document.querySelector(".dropdown").style.display = "inline-block";
            var name = result.message.substring(0, result.message.indexOf("&"))
            document.getElementById("user-name").innerHTML = name;
            avatarTitle.innerHTML = name;
            id = result.message.substring(result.message.indexOf("&") + 1);
        }
    });
    console.log(userList.filter(u => u.id == id));
    var user = userList.filter(u => u.id == id)

    await fetch("http://localhost:56614/api/user/getclaims", {
        method: "POST",
        body: JSON.stringify({
            id: Number(id),
            password: user[0].password,
            firstName: user[0].userFirstName,
            lastName: user[0].userLastName,
        }),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    }).then(response => {
        return response.json();
    }).then(result => {
        result.forEach(element => {
            console.log(element)
            switch (element.name) {
                case "admin":
                    document.querySelector(".rank-text1").classList.remove('hidden');
                    document.querySelector("#rank-text1").innerHTML = " " + element.name;

                    break;
                case "yonetici":
                    document.querySelector(".rank-text2").classList.remove('hidden');
                    document.querySelector("#rank-text2").innerHTML = " " + element.name;
                    break;
                case "uye":
                    document.querySelector(".rank-text3").classList.remove('hidden');
                    document.querySelector("#rank-text3").innerHTML = " " + element.name;
                    break;
            }
        });
    });

}

function logOut() {
    window.localStorage.clear();
    loginVisibly('on')
    document.getElementById("user-name").innerHTML = "Giriş Yap";
}

function navMenuOpen() {
    if (document.querySelector(".reponsive-nav-content").classList.contains("hidden")) {
        document.querySelector(".reponsive-nav-content").classList.remove("hidden");
        document.querySelector(".nav-container").classList.remove("visiblty11");
        document.querySelector(".menu-icons").classList.remove("rotate0");
        document.querySelector(".menu-icons").classList.add("rotate90");
        document.querySelector(".nav-container").style.display = "block";
    } else {
        document.querySelector(".reponsive-nav-content").classList.add("hidden");
        document.querySelector(".menu-icons").classList.remove("rotate90");
        document.querySelector(".menu-icons").classList.add("rotate0");
        document.querySelector(".nav-container").classList.add("visiblty11");
    }
}