const emailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/
const passwordRegex = /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{9,}/
const emailInput = $("#email");
const inputPassword = $("#inputPassword");
const adressInput = $("#adress");
const birtDate = $("#birthDate")
const numberPhone = $("#phone");
const userName = $("#inputLogin");
const gender = $("#sex");
const registerButton = $("#registerButton");

$(document).ready(function () {
    emailInput.on('input', emailValidation);
    inputPassword.on('input', validatePasswords);
    registerButton.on('click', Register);
});

function emailValidation() {
    if (emailRegex.test(emailInput.val())) {
        $("#wrongEmailAlert").addClass("d-none");
        registerButton.removeAttr('disabled');
    } else {
        $("#wrongEmailAlert").removeClass("d-none");
        registerButton.attr("disabled", 'true');
    }
}


function validatePasswords() {
    if (passwordRegex.test(inputPassword.val())) {
        $("#shortPasswordAlert").addClass("d-none");
        registerButton.removeAttr('disabled');
    } else {
        $("#shortPasswordAlert").removeClass("d-none");
        registerButton.attr("disabled", 'true');
    }
}

function Register() {
    if ($("#birthDate").val() == "") {
        $("#CommonAlert").text("Необходимо заполнить все поля");
        $("#CommonAlert").removeClass("d-none");
        return;
    }
    let userRegister = {
        fullName: $("#inputLogin").val(),
        password: inputPassword.val(),
        email: emailInput.val(),
        address: $("#adress").val(),
        birthDate: new Date($("#birthDate").val()).toISOString(),
        gender: $("#sex").val(),
        phoneNumber: $("#phone").val()
    }
    for (title in userRegister) {
        if (userRegister[title] == "") {
            $("#CommonAlert").text("Все поля обязательны к заполнению");
            $("#CommonAlert").removeClass("d-none");
            return;
        }
    }
    $("#CommonAlert").addClass("d-none");
    fetch("https://food-delivery.kreosoft.ru/api/account/register", {
        method: 'POST',
        headers: new Headers({"Content-Type": "application/json", "accept": "*/*"}),
        body: JSON.stringify(userRegister)
    })
        .then(async (response) => {
            if (response.ok) {
                let json = await response.json();
                console.log(json);
                localStorage.setItem('token', json.token);
                window.location.href = '../index.html';
            } else {
                let json = await response.json();
                console.log(json);
                if (json.message == 'Invalid birth date') {
                    $("#CommonUslesDateAlert").text("Введите корректную дату рождения");
                    $("#CommonUslesDateAlert").removeClass("d-none");
                }
                for (let error in json) {
                    switch (error) {
                        case 'DuplicateUserName':
                            console.log("hello");
                            $("#CommonUslesMailAlert").text("Данная почта уже занята");
                            $("#CommonUslesMailAlert").removeClass("d-none");
                    }
                    console.log(json.errors);
                }
            }
        })
}