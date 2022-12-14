$(document).ready(function () {
    checkAuth();

});


function checkAuth() {
    localStorage.getItem("token");
    fetch("https://food-delivery.kreosoft.ru/api/account/profile", {
        headers: new Headers({
            "Authorization": "Bearer " + localStorage.getItem("token")
        })
    })

        .then(async (response) => {
            if (response.ok) {
                console.log(localStorage.getItem("token"));
                let navbarLeft = $("#navbar-left");
                let navbarRight = $("#navbar-right");
                let template = $("#auth-user-navbar-template");
                let num = $("#numb-basket");

                let leftBlockOne = template.clone();
                leftBlockOne.find(".nav-link").text("Заказы");
                leftBlockOne.find(".nav-link").attr("id","dishesHistory");
                leftBlockOne.find(".nav-link").attr("href","html/ordersHistory.html");


                leftBlockOne.removeClass("d-none");
                navbarLeft.append(leftBlockOne);
                let leftBlockTwo = template.clone();

                leftBlockTwo.find(".nav-link").text("Корзина");
                leftBlockTwo.find(".nav-link").attr("id", "basket");
                if(window.location.href.split("http://localhost:63342/webProject/html/")[1] == "profile.html"){
                    leftBlockTwo.find(".nav-link").attr("href", "../html/basket.html");
                }
                else{
                    leftBlockTwo.find(".nav-link").attr("href", "html/basket.html");
                }


                let leftBlockThree = num.clone();
                leftBlockThree.find(".badge").attr("id", "basketNumb");

                leftBlockThree.removeClass("d-none");
                leftBlockTwo.removeClass("d-none");
                navbarLeft.append(leftBlockTwo);
                navbarLeft.append(leftBlockThree);
                navbarRight.empty();

                let rightBlockOne = template.clone();
                rightBlockOne.find(".nav-link").attr("id", 'add-nickname');
                rightBlockOne.removeClass("d-none");
                navbarRight.append(rightBlockOne);
                document.getElementById("add-nickname").style.color = "black";

                let rightBlockTwo = template.clone();
                rightBlockTwo.find(".nav-link").text("Выйти");
                rightBlockTwo.find(".nav-link").attr("id", 'add-button');

                rightBlockTwo.removeClass("d-none");
                rightBlockTwo.attr('onclick', 'logout()');

                navbarRight.append(rightBlockTwo);
                document.getElementById("add-button").style.color = "black";
                document.getElementById("add-button").style.background = "#efefef";

                document.getElementById("basket").style.color = "black";
                document.getElementById("dishesHistory").style.color = "black";


                let json = await response.json();
                $("#add-nickname").text(json.email);

                if(window.location.href.split("http://localhost:63342/webProject/html/")[1] == "basket.html"){
                    $("#add-nickname").attr('href', '../html/profile.html');
                }
                else{
                    $("#add-nickname").attr('href', 'html/profile.html');
                }

                if (window.location.href.split("http://localhost:63342/webProject/html/")[1] == "profile.html") {
                    $("#add-button").attr('href', '../index.html');
                } else {
                    $("#add-button").attr('href', 'index.html');
                }


            }
        })
}

function logout() {
    console.log("neeee teest");

    /*fetch("https://food-delivery.kreosoft.ru/api/account/logout"), {method: 'POST',
        headers: new Headers({
            "Authorization": "Bearer " + localStorage.getItem("token")
        })
            .then(async (response) => {
                if (response.ok) {
                    console.log("teeeest");
                    localStorage.removeItem("token");
                    window.location.href = "../index.html";
                }
                else{
                    console.log("text");
                }

            })
    }*/
    localStorage.removeItem("token");
}