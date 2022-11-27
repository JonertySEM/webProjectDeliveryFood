const loginButton = $("#loginButton");


$(document).ready(function (){
    loginButton.on('click', login);
});


function login()
{
    let user = {
        email: $("#inputEmail").val(),
        password: $("#inputPassword").val()
    }
    for (title in user)
    {
        if (user[title] == "")
        {
            $("#CommonAlert").text("Не все поля заполнены");
            $("#CommonAlert").removeClass("d-none");
            return;
        }
    }
    console.log("test");
    fetch("https://food-delivery.kreosoft.ru/api/account/login", {method: 'POST',
        body:JSON.stringify(user),
        headers: new Headers({"Content-Type": "application/json"})
    })
        .then(async (response) => {
            if (response.ok)
            {

                let json = await response.json();
                localStorage.setItem('token',json.token);
                window.location.href = '../index.html';
            }
            else
            {
                $("#CommonAlert").text("Ошибка аутентификации");
                $("#CommonAlert").removeClass("d-none");
            }
        })
}