var first = document.getElementById("first")
var table = document.getElementById("myTable");
var token = localStorage.getItem("token");
const lastNameInputForUp = document.getElementById("last-name-input-for-up")
const nameInputForUp = document.getElementById("name-input-for-up")
const passwordInputForUp = document.getElementById("password-input-for-up")
const alertTextForUp = document.querySelector(".alert-text")
var idInputForUp = 0
window.onload = onInit;

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
                caption: 'İd numarası',
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

            // {
            //     dataField: 'Amount',
            //     caption: 'Sale Amount',
            //     dataType: 'number',
            //     format: 'currency',
            //     alignment: 'right',
            // },
            // {
            //     dataField: 'Discount',
            //     caption: 'Discount %',
            //     dataType: 'number',
            //     format: 'percent',
            //     alignment: 'right',
            //     allowGrouping: false,
            //     cellTemplate: discountCellTemplate,
            //     cssClass: 'bullet',
            // },

            // {
            //     dataField: 'Sector',
            //     dataType: 'string',
            // },
            // {
            //     dataField: 'Channel',
            //     dataType: 'string',
            // },
            // {
            //     dataField: 'Customer',
            //     dataType: 'string',
            //     width: 150,
            // },
        ],
        onContentReady(e) {
            if (!collapsed) {
                collapsed = true;
                e.component.expandRow(['EnviroCare']);
            }
        },
    });
});

let collapsed = false;

function onInit() {

    if (token) {
        fetch("http://localhost:56614/api/auth/decodetoken", {
            method: "POST",
            body: JSON.stringify({
                token: token
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
                document.getElementById("user-name").innerHTML = result.message;
            }
        });
        // kullanicilariGetir()
        // setPaginations(1);
    }
}

function setPaginations(event) {
    console.log(event)
    var a = 0
    switch (event) {
        case 1:
            var rows = document.getElementsByTagName("table")[0].rows;
            console.log(rows)
            var last = rows[rows.length - 1];
            console.log(last)
            rows.forEach(el => {
                var rowsLength = el.length
                console.log(rowsLength)
            })
            for (let i = 0; i < 24; i++) {
                a++
                console.log(a)
                if (i > 10) {

                    var last = rows[i - 1];
                    console.log(last)
                    last.style.display = "none"
                }
            }
            break;

        default:
            break;
    }
}

var sayi = 1

function scrolldown(params) {
    let pageHeight = window.innerHeight;
    window.scrollTo(0, params * pageHeight * 1.3);
}


function kullanicilariGetir() {

    fetch("http://localhost:56614/api/User/getall", {
        method: 'get',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
        }),
    }).then(response =>
        response.json()
    ).then(veri =>
        veri.forEach(element => {
            console.log(first.name)
            var row = table.insertRow(sayi)
            var cell0 = row.insertCell(0);
            var cell1 = row.insertCell(1);
            var cell2 = row.insertCell(2);
            var cell3 = row.insertCell(3);
            cell0.innerHTML = `<b>${sayi}</b>`;
            cell1.innerHTML = element.userFirstName;
            cell2.innerHTML = element.userLastName;
            cell3.innerHTML = element.password;
            sayi++
        })
    )
}

function add() {
    var firstName = document.getElementById("adInput").value;
    var lastName = document.getElementById("soyadInput").value;
    var userPassword = document.getElementById("sifreInput").value;
    fetch("http://localhost:56614/api/user/add", {
            method: "POST",
            body: JSON.stringify({
                userFirstName: firstName,
                userLastName: lastName,
                password: userPassword
            }),
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            }
        })
        .then(
            console.log("eklendi")
        )
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
            var alert = document.querySelector(".alert")
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
                document.querySelector(".alert").classList.add('hidden')
            }, 3000);
        })
}

function myFunction() {
    var table = document.getElementById("myTable");
    var row = table.insertRow(0);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    cell1.innerHTML = "NEW CELL1";
    cell2.innerHTML = "NEW CELL2";
}

function login() {
    var firstName = document.getElementById("login-name-input").value
    var password = document.getElementById("login-password-input").value
    fetch("http://localhost:56614/api/auth/login", {
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
            }
        })
        .catch(function(err) {
            console.log("error" + err);
        });
}

function loginVisibly(params) {
    if (params == "on")
        document.getElementById("login-id").style.display = "flex";

    else
        document.getElementById("login-id").style.display = "none";
}