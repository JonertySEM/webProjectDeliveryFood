$(document).ready(function () {
    checkBusket();

});


function checkBusket(){
    fetch("https://food-delivery.kreosoft.ru/api/basket", {
        method: 'GET',
        headers: new Headers({
            "Authorization": "Bearer " + localStorage.getItem("token")
        })
    })
        .then(async (response) => {
                if(response.ok){
                    console.log("hello")
                    let jsonka = await response.json();
                    let countDish = countValueDish(jsonka);
                    showAllCard(jsonka)
                    countValueDishes()
                }

        })

}
function countValueDishes(){

    fetch("https://food-delivery.kreosoft.ru/api/basket", {
        method: 'GET',
        headers: new Headers({
            "Authorization": "Bearer " + localStorage.getItem("token")
        })
    })
        .then(async (response) => {
            if(response.ok){
                console.log("hello")
                let jsonka = await response.json();
                $("#basketNumb").text(countValueDish(jsonka));
            }

        })


}

function delDish(id){
    fetch("https://food-delivery.kreosoft.ru/api/basket/dish/" + id.toString() + "?increase=false", {
        method: 'DELETE',
        headers: new Headers({
            "Authorization": "Bearer " + localStorage.getItem("token")
        })
    })
        .then(async (response) => {
            if (response.ok) {
                console.log("delete dish");
                checkBusket();
            }
        });
}

function countValueDish(json){
    let count = 0;
    for(let dish of json){
        count+=1;
    }
    return count;
}

function deleteDish(id, json){

}

function showAllCard(json){
    $("#cardsInBasket").empty();
    let card = $('#cardInBasket');
    let count = 1;
    for(let dish of json){
        let block = card.clone();
        block.find(".row").attr("id", "row_"+dish.id.toString());
        block.find("#nameDish").text(dish.name);
        block.find("#number").text(count.toString()+".");
        block.find(".btn-danger").attr("id", dish.id.toString() + "_del");
        block.find("#priceDish").text("Цена/шт:" + dish.price + " руб.");
        block.find("#dishImage").attr("src", dish.image);
        block.find("#dishImage").attr("id",dish.id);
        block.find("#countDish").attr("id", "countDish_" + dish.id.toString());
        block.find("#countDish_" + dish.id.toString()).val(dish.amount);

        block.find(".down").attr("id", dish.id.toString() + '_down');
        block.find(".up").attr("id", dish.id.toString() + '_up');


        console.log(dish)

        block.removeClass("d-none");

        $("#cardsInBasket").append(block);
        document.getElementById(dish.id.toString() + "_del").addEventListener("click", function () {
            delDish(dish.id);

        }, true);
        downUpSelecter(dish.id);
        document.getElementById(dish.id.toString() + '_up').addEventListener("click", function () {
            countValueDishes();
            addNewDishes(dish.id);
            dish.amount += 1;
            console.log("add this dish");
        }, false);

        document.getElementById(dish.id.toString() + '_down').addEventListener("click", function () {
            countValueDishes();
            if(document.getElementById("countDish_" + dish.id.toString()).value == 1){
                delDish(dish.id);
            }
            else{
                deleteNewDishes(dish.id);
            }

            console.log("dish has been deleted");

        }, false);
        count+=1;
    }
}
function addNewDishes(id) {
    fetch("https://food-delivery.kreosoft.ru/api/basket/dish/" + id.toString(), {
        method: 'POST',
        headers: new Headers({
            "Authorization": "Bearer " + localStorage.getItem("token")
        })
    })
        .then(async (response) => {
            if (response.ok) {
                countValueDishes();
            }
        });
}

function deleteNewDishes(id) {
    fetch("https://food-delivery.kreosoft.ru/api/basket/dish/" + id.toString() + "?increase=true", {
        method: 'DELETE',
        headers: new Headers({
            "Authorization": "Bearer " + localStorage.getItem("token")
        })
    })
        .then(async (response) => {
            if (response.ok) {
                countValueDishes();
                console.log("delete dish");
            }
        });
}


function downUpSelecter(id){
    $(document).ready(function() {
        $('#' + id.toString() + '_down').click(function () {
            var $input = $(this).parent().find('input');
            var count = parseInt($input.val()) - 1;
            count = count < 1 ? 1 : count;
            $input.val(count);
            $input.change();
            return false;
        });
        $('#' + id.toString() + '_up').click(function () {
            var $input = $(this).parent().find('input');
            $input.val(parseInt($input.val()) + 1);
            $input.change();
            return false;
        });
    });
}

