var first = document.getElementById("first")
var table = document.getElementById("myTable");
fetch("http://localhost:56614/api/user/getall").then(response =>
    response.json()
).then(veri =>
    console.log(veri)
)

var sayi = 1

function kullanicilariGetir() {

    fetch("http://localhost:56614/api/User/getall", {
        method: 'get',
        headers: new Headers({
            'Authorization': 'Bearer eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJGaXJzdE5hbWUiOiJCZXJhdCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6WyJhZG1pbiIsInlvbmV0aWNpIl0sIm5iZiI6MTYzNTcwNTk1OCwiZXhwIjoxNjM2NTY5OTU2LCJpc3MiOiJiZXJhdEBiZXJhdC5jb20iLCJhdWQiOiJiZXJhdEBiZXJhdC5jb20ifQ.2cR34o3ABsBL1iMp3NKoT8FMYUQ5DJUVJEVc80a9h6Y',
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
    var id = document.getElementById("Id").value;
    var firstName = document.getElementById("adInputForUpdate").value;
    var lastName = document.getElementById("soyadInputForUpdate").value;
    var userPassword = document.getElementById("sifreInputForUpdate").value;
    fetch("http://localhost:56614/api/user/update", {
            method: "POST",
            body: JSON.stringify({
                id: parseInt(id),
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

function myFunction() {
    var table = document.getElementById("myTable");
    var row = table.insertRow(0);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    cell1.innerHTML = "NEW CELL1";
    cell2.innerHTML = "NEW CELL2";
}