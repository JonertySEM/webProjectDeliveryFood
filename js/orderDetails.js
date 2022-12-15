$(document).ready(function () {
    countValueDishes();
    checkHistoryOrders();
});


function checkHistoryOrders() {
    fetch("https://food-delivery.kreosoft.ru/api/order", {
        method: 'GET',
        headers: new Headers({
            "Authorization": "Bearer " + localStorage.getItem("token")
        })
    })
        .then(async (response) => {
            if (response.ok) {
                console.log("hello")
                let jsonka = await response.json();
                checkOrderDetails(location.hash.substr(1));

            }

        })
}

function changeDataDelivery(data) {
    var date = data.split("T")[0];
    var time = data.split("T")[1];
    var dateChen = date.split("-")
    console.log(time);
    var timeChen = time.split(":");
    return dateChen[2].toString() + "." + dateChen[1].toString() + "." + dateChen[0].toString() + " " + timeChen[0] + ":" + timeChen[1];

}

function changeDataOrder(data) {
    var date = data.split("T")[0];
    var dateChen = date.split("-");
    return dateChen[2].toString() + "." + dateChen[1].toString() + "." + dateChen[0].toString();

}

function checkOrderDetails(id) {
    fetch("https://food-delivery.kreosoft.ru/api/order/" + id.toString(), {
        method: 'GET',
        headers: new Headers({
            "Authorization": "Bearer " + localStorage.getItem("token")
        })
    })
        .then(async (response) => {
            if (response.ok) {
                console.log("hello")
                let jsonka = await response.json();
                showOderDetails(jsonka);

            }

        })
}

function changeDataDelivery(data) {
    var date = data.split("T")[0];
    var time = data.split("T")[1];
    var dateChen = date.split("-")
    console.log(time);
    var timeChen = time.split(":");
    return dateChen[2].toString() + "." + dateChen[1].toString() + "." + dateChen[0].toString() + " " + timeChen[0] + ":" + timeChen[1];

}

function changeDataOrder(data) {
    var date = data.split("T")[0];
    var dateChen = date.split("-");
    return dateChen[2].toString() + "." + dateChen[1].toString() + "." + dateChen[0].toString();

}

function showOderDetails(json) {
    $("#allCardOrderDetails").empty();
    let card = $('#CardEat');
    let count = 1;
    let sumOfOrder = 0;
    $("#numberOrder").text(Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000);
    for (let dish of json.dishes) {
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

        $("#allCardOrderDetails").append(block);
    }

    $("#adressDelivery").text(json.address);
    $("#dataOrder").text(changeDataDelivery(json.orderTime));
    $("#statusDelivery").text(changeStatus(json.status));
    if ($("#statusDelivery") == "В обработке") {
        $(".confrimButton").removeClass("d-none");
    }

    $("#dataTimeDelivery").text(changeDataDelivery(json.deliveryTime));
    console.log(sumOfOrder);
    $("#totalOrderPrice").text(sumOfOrder.toString() + " руб.");
}


function changeStatus(status) {
    switch (status.toString()) {
        case "InProcess":
            return "В обработке";
        case "Delivered":
            return "Доставлен";
    }
}

function confrimUserOrder(id) {
    fetch("https://food-delivery.kreosoft.ru/api/order/" + id.toString() + "/status", {
        method: 'POST',
        headers: new Headers({
            "Authorization": "Bearer " + localStorage.getItem("token")
        })
    })
        .then(async (response) => {
            if (response.ok) {
                let jsonka = await response.json();
                checkHistoryOrders();
            }

        })
}

function changeStatus(status) {
    switch (status.toString()) {
        case "InProcess":
            return "В обработке";
        case "Delivered":
            return "Доставлен";
    }
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
                if (countValueDish(jsonka) != 0) {
                    $("#note").removeClass("d-none");
                }
            }

        })


}


function countValueDish(json) {
    let count = 0;
    for (let dish of json) {
        count += 1;
    }
    console.log(count);
    return count;
}