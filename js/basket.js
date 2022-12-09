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
        block.find("#nameDish").text(dish.name);
        block.find("#number").text(count.toString()+".");
        block.find("countDish").val(dish.amount);
        block.find(".btn-danger").attr("id", dish.id.toString() + "_del");
        block.find("#priceDish").text("Цена/шт:" + dish.price + " руб.");
        block.find("#dishImage").attr("src", dish.image);
        block.find("#dishImage").attr("id",dish.id);
        console.log(dish)

        block.removeClass("d-none");

        $("#cardsInBasket").append(block);
        document.getElementById(dish.id.toString() + "_del").addEventListener("click", function () {
            delDish(dish.id);

        }, true);
        count+=1;
    }
}

