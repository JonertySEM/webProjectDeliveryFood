$(document).ready(function (){
    LoadDishes();

});

function LoadDishes(categories ="Pizza", vegetarian ="false",page=1){
    fetch(`https://food-delivery.kreosoft.ru/api/dish?categories=${categories}&vegetarian=${vegetarian}&page=${page}`)
        .then((response) => {
            console.log(response);
            return response.json();
        })
        .then((json) => {
            console.log(json.dishes);
            $("#dishes-container").empty();
            let template = $('#dishes-card');

            for (let dish of json.dishes)
            {
                let block = template.clone();
                block.attr("id", dish.id);
                block.find("#dishes-name").text(dish.name);
                block.find("#dishes-image").attr("src", dish.image);
                block.find("#dishes-dicription").text(dish.description);
                console.log(dish);
                block.removeClass("d-none");
                $("#dishes-container").append(block);}

        });
}