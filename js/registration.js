const emailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/
const emailInput = $("#email");
const inputPassword = $("#inputPassword");
const adressInput=$("#adress")
const registerButton = $("#registerButton");

$(document).ready(function (){
    emailInput.on('input', emailValidation);
    inputPassword.on('input', validatePasswords);
    registerButton.on('click', Register);
});

function emailValidation()
{
    console.log(emailInput.val());
    if (emailRegex.test(emailInput.val()))
    {
        $("#wrongEmailAlert").addClass("d-none");
        registerButton.removeAttr('disabled');
    }
    else
    {
        $("#wrongEmailAlert").removeClass("d-none");
        registerButton.attr("disabled",'true');
    }
}



function validatePasswords()
{
    if (inputPassword.val().length < 8)
    {
        $("#shortPasswordAlert").removeClass("d-none");
        registerButton.attr("disabled",'true');
    }
    else
    {
        $("#shortPasswordAlert").addClass("d-none");
        registerButton.removeAttr("disabled");

    }
}

function Register()
{
    if ($("#birthDate").val() == "")
    {
        $("#CommonAlert").text("Все поля обязательны к заполнению");
        $("#CommonAlert").removeClass("d-none");
        return;
    }
    let userRegister = {
        fullName: $("#inputLogin").val(),
        password: inputPassword.val(),
        email: emailInput.val(),
        adress: $("#adress").val(),
        birthDate: new Date($("#birthDate").val()).toISOString(),
        gender: $("#sex").val(),
        phoneNumber: $("#phoneNumber").val()
    }
    for(title in userRegister)
    {
        if (userRegister[title] == "")
        {
            $("#CommonAlert").text("Все поля обязательны к заполнению");
            $("#CommonAlert").removeClass("d-none");
            return;
        }
    }
    $("#CommonAlert").addClass("d-none");
    fetch("https://food-delivery.kreosoft.ru/api/account/register", {method: 'POST',
        headers: new Headers({"Content-Type": "application/json",    "accept": "*/*"}),
        body:JSON.stringify(userRegister)})
        .then(async (response) => {
            if (response.ok)
            {
                let json = await response.json();
                console.log(json);
                localStorage.setItem('token',json.token);
                window.location.href = '/index.html';
            }
            else
            {
                let json = await response.json();
                if (json.message == 'Invalid birth date')
                {
                    $("#CommonAlert").text("Введите корректную дату рождения");
                    $("#CommonAlert").removeClass("d-none");
                }
                for (let error in json.errors)
                {
                    switch(error)
                    {
                        case 'DuplicateUserName':
                            $("#CommonAlert").text("Логин уже занят");
                            $("#CommonAlert").removeClass("d-none");
                    }
                }
            }
        })
}