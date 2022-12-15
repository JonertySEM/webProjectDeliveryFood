$(document).ready(function () {
    countValueDishes();
    checkDishesInBasket();

});

function checkDishesInBasket() {
    console.log(location.hash.substr(3));
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
                checkHistoryOrders();
            }

        })
}

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
                showHistoryOrders(jsonka);

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

function showHistoryOrders(json) {
    $("#history-container").empty();
    let card = $('#order_history_card');
    for (let orders of json) {
        let block = card.clone();
        block.find(".order_data").text(changeDataOrder(orders.orderTime));
        block.find(".order_status").text(changeStatus(orders.status));
        block.find(".order_data").attr("id", orders.id.toString());


        block.find(".confirm_order").attr("id", orders.id);
        block.find(".delivery_data").text(changeDataDelivery(orders.deliveryTime));
        block.find(".delivery_price").text(orders.price.toString());

        block.find("#" + orders.id.toString()).on("click", function () {
            location.href = '../html/orderDetails.html#' + orders.id.toString();
        })


        if (block.find(".order_status").text() == "В обработке") {
            block.find(".confirm_order").removeClass("d-none");
            block.find(".confirm_order").on("click", function () {
                confrimUserOrder(orders.id);
            })
        }


        block.removeClass("d-none");

        $("#history-container").append(block);

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