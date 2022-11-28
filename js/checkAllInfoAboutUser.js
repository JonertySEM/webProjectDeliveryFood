$(document).ready(function (){
    checkAuth();

});



function checkAuth(){
    fetch("https://food-delivery.kreosoft.ru/api/account/profile", {headers: new Headers({
            "Authorization" : "Bearer " + localStorage.getItem("token")
        })
    })
        .then(async (response) => {
            if (response.ok){
                console.log("text");
                let navbarLeft = $("#navbar-left");
                let navbarRight = $("#navbar-right");
                let template = $("#auth-user-navbar-template");

                let leftBlockOne = template.clone();
                leftBlockOne.find(".nav-link").text("Заказы");
                leftBlockOne.find(".nav-link").addClass("text-muted");
                leftBlockOne.find(".nav-link    ").attr('href', "");

                leftBlockOne.removeClass("d-none");
                navbarLeft.append(leftBlockOne);
                let leftBlockTwo = template.clone();

                leftBlockTwo.find(".nav-link").text("Корзина");
                leftBlockTwo.find(".nav-link").attr("href","");
                leftBlockTwo.find(".nav-link").addClass("text-muted");

                leftBlockTwo.removeClass("d-none");
                navbarLeft.append(leftBlockTwo);
                navbarRight.empty();

                let rightBlockOne = template.clone();
                rightBlockOne.find(".nav-link").attr("id", 'add-nickname');
                rightBlockOne.removeClass("d-none");
                navbarRight.append(rightBlockOne);
                document.getElementById("add-nickname").style.color= "black";

                let rightBlockTwo = template.clone();
                rightBlockTwo.find(".nav-link").text("Выйти");
                rightBlockTwo.find(".nav-link").attr("id", 'add-button');

                rightBlockTwo.removeClass("d-none");
                rightBlockTwo.attr('onclick', 'logout()');
                navbarRight.append(rightBlockTwo);
                document.getElementById("add-button").style.color="black";
                document.getElementById("add-button").style.background="#efefef";

                let json = await response.json();
                $("#add-nickname").text(json.email);
                $("#add-nickname").attr('href', '');
            }
        })
}

function logout()
{
    localStorage.removeItem("token");
    window.location.href = "../index.html";
}