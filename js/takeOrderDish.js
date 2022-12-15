$(document).ready(function () {
    countValueDishes();
    takeAllInfoAboutOrder()
    checkDishesInBasket();
    $("#confrimOrderButton").on('click', confrimOrder);
});

function checkDishesInBasket() {
    fetch("https://food-delivery.kreosoft.ru/api/basket", {
        method: 'GET',
        headers: new Headers({
            "Authorization": "Bearer " + localStorage.getItem("token")
        })
    })
        .then(async (response) => {
            if (response.ok) {
                console.log("hello")
                let jsonka = await response.json();
                showDishInOrder(jsonka);

            }

        })
}

function countValueDishes() {

    fetch("https://food-delivery.kreosoft.ru/api/basket", {
        method: 'GET',
        headers: new Headers({
            "Authorization": "Bearer " + localStorage.getItem("token")
        })
    })
        .then(async (response) => {
            if (response.ok) {
                console.log("hello")
                let jsonka = await response.json();
                $("#basketNumb").text(countValueDish(jsonka));
            }

        })


}

function takeAllInfoAboutOrder() {
    fetch("https://food-delivery.kreosoft.ru/api/account/profile", {
        method: 'GET',
        headers: new Headers({
            "Authorization": "Bearer " + localStorage.getItem("token")
        })
    })
        .then(async (response) => {
            if (response.ok) {
                let json = await response.json();
                document.getElementById("userPhoneNumberOrder").value = json.phoneNumber;
                document.getElementById("userAdressOrder").value = json.address;
                document.getElementById("userEmailOrder").value = json.email
            } else {
                //Оформить ошибку при неудачном распозновании данных
            }

        })
}


function showDishInOrder(json) {
    $("#allCardsInOrder").empty();
    let card = $('#cardInOrder');
    let count = 1;
    let sumOfOrder = 0;
    for (let dish of json) {
        let block = card.clone();
        block.find(".row").attr("id", "row_" + dish.id.toString());
        block.find("#dishInOrderTitle").text(dish.name);
        block.find("#dishImage").attr("src", dish.image);
        block.find("#dishImage").attr("id", dish.id);
        block.find("#dishPrice").text("Цена: " + dish.price.toString() + " руб.");
        block.find("#totalPriceDishInOrder").text(dish.totalPrice.toString() + " руб.");
        block.find("#dishAmount").text("Количество: " + dish.amount.toString() + " шт.");
        block.find(dish.amount);

        sumOfOrder += dish.totalPrice;

        console.log(dish)

        block.removeClass("d-none");

        $("#allCardsInOrder").append(block);
    }
    $("#totalSumOfOrder").text(sumOfOrder.toString() + " руб.");
}

function confrimOrder() {
    var today = new Date();
    console.log($("#userAdressOrder").val());
    if ($("#userAdressOrder").val() == "") {
        $("#adress_invalid").removeClass("d-none")
        console.log("nope");
        return;
    } else {
        $("#adress_invalid").addClass("d-none")
    }
    var second = $("#delivery-time").val().split("T")[1].split(":")[0] * 3600 + $("#delivery-time").val().split("T")[1].split(":")[1] * 60;
    var tmp = $("#delivery-time").val().split("T")[0].split("-");
    var dataOrder = tmp[2].toString() + "." + tmp[1].toString() + "." + tmp[0].toString();
    var todaySecond = today.toLocaleTimeString().split(":")[0] * 3600 + today.toLocaleTimeString().split(":")[1] * 60 + Number(today.toLocaleTimeString().split(":")[2]);
    console.log();


    /*if(second - todaySecond > 3600 && dataOrder == today.toLocaleDateString()){
        console.log("delivery time");
        $("#data_invalid").addClass("d-none")
    }
    else{
        $("#data_invalid").removeClass("d-none")
        return;
    }*/
    var userData = {
        deliveryTime: $("#delivery-time").val(),
        address: $("#userAdressOrder").val()
    }
    console.log("Heyy");

    fetch("https://food-delivery.kreosoft.ru/api/order", {
        method: 'POST',
        headers: new Headers(
            {
                "Authorization": "Bearer " + localStorage.getItem("token"),
                "Content-Type": "application/json", "accept": "application/json"
            }),
        body: JSON.stringify(userData)
    })
        .then(response => {
            if (response.ok) {
                window.location.href = '../html/ordersHistory.html';
            } else {
                throw Error(response.status.toString());
            }
        })
        .then(json => {
            console.log(json);
        })


}


function deleteAllDishesInBusket() {

    fetch("https://food-delivery.kreosoft.ru/api/basket", {
        method: 'GET',
        headers: new Headers({
            "Authorization": "Bearer " + localStorage.getItem("token")
        })
    })
        .then(async (response) => {
            if (response.ok) {
                console.log("hello")
                let jsonka = await response.json();
                for (let dish of jsonka) {
                    delDish(dish.id);
                }
            }

        })


}

function delDish(id) {
    fetch("https://food-delivery.kreosoft.ru/api/basket/dish/" + id.toString() + "?increase=false", {
        method: 'DELETE',
        headers: new Headers({
            "Authorization": "Bearer " + localStorage.getItem("token")
        })
    })
        .then(async (response) => {
            if (response.ok) {
                console.log("delete dish");
            }
        });
}


function countValueDish(json) {
    let count = 0;
    for (let dish of json) {
        count += 1;
    }
    console.log(count);
    return count;
}