const stableUrl = "https://food-delivery.kreosoft.ru/api/dish?categories=Wok&categories=Pizza&categories=Soup&categories=Dessert&categories=Drink&page=1"

$(document).ready(function (){
    $("#sendButton").on('click', LoadMainDishes);

    if (localStorage.getItem('current'))
    {
        LoadMainDishes(takeDishes(), swCheckVeg, takeSort(),localStorage.getItem('current'));
    }
    else
    {
        LoadMainDishes();

    }
   /*CreatePagination(localStorage.getItem("count"), localStorage.getItem('current'));*/

});
let swCheckVeg = "";

function takeDishes(){
    /*console.log($("#selectFoodValue").val());*/
    let strDish = "";
    let massiveDish = $("#selectFoodValue").val();
    for(let position of massiveDish){
        strDish += "categories=" + position + "&";
    }
   return strDish;


}
function takeSort(){
    let sortPosition = "&";
    sortPosition += "sorting=" + $("#selectSorting").val() + "&";
    return sortPosition;
}
function include(url) {
    var script = document.createElement('script');
    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
}
include("/lib/star-rating.js")

function takeRating(page){
    let actualUrl;
    if(takeDishes().toString() == "" && takeSort().toString() ==""){
        actualUrl = stableUrl;
    }
    else{
        actualUrl = "https://food-delivery.kreosoft.ru/api/dish?" + takeDishes() + swCheckVeg.toString() + takeSort() + 'page=' + page.toString();
        console.log(takeDishes());
    }

    fetch(actualUrl)
        .then((response) => {
            console.log(response);
            return response.json();
        })
        .then((json) => {
            for (let dish of json.dishes)
            {
                console.log(dish.rating);
                document.getElementById("stars").id = dish.id.toString();

                    createRating(dish.rating);


            }

        });

}


function LoadMainDishes(lsDishes = takeDishes(), vegetarian = swCheckVeg, sortDish=takeSort(), page = 1){

    let actualUrl;
    $('#flexSwitchCheckDefault').on('change', function() {
        swCheckVeg = "vegetarian="+ $(this).is(':checked').toString();
    });

    if(lsDishes == "" && sortDish ==""){
        actualUrl = stableUrl;
    }
    else{
        actualUrl = "https://food-delivery.kreosoft.ru/api/dish?" + takeDishes() + vegetarian.toString() + sortDish + 'page=' + page.toString();
        console.log(takeDishes());
        console.log(vegetarian.toString());
        console.log(sortDish);
        console.log(actualUrl);
    }

    fetch(actualUrl)
        .then((response) => {
            console.log(response);
            return response.json();
        })
        .then((json) => {
            console.log(json.dishes);
            $("#dishes-container").empty();

            let template = $('#dishes-card');
            let count = 0;
            for (let dish of json.dishes)
            {

                let block = template.clone();
                block.attr("id", dish.id);
                block.find("#dishes-name").text(dish.name);
                block.find("#dishes-image").attr("src", dish.image);
                block.find("#dishes-dicription").text(dish.description);
                block.find("#line").addClass(dish.id.toString());
                block.find(".my-rating").attr("id", count);
                block.find("#dishes-type").text("Категория блюда - " + takeTypeDishes(dish.category));
                block.find("#footer-text").text("Цена - " + dish.price + "р");
                console.log(dish);
                block.removeClass("d-none");
                $("#dishes-container").append(block);
                count+=1;

            }
            curPage = json.pagination.current;
            ammountPage = json.pagination.count;
            localStorage.setItem("current", json.pagination.current);
            localStorage.setItem("count", json.pagination.count);

            CreatePagination(localStorage.getItem("count"), localStorage.getItem('current'));
            DishesClick();

            fetch(actualUrl)
                .then((response) => {
                    console.log(response);
                    return response.json();
                })
                .then((json) => {
                    for (let dish of json.dishes)
                    {
                        console.log(dish.rating);
                       createRating(dish.rating, dish.id);
                    }

                });

        });


}

function createRating(rating, id){

    let nm = ((("newLinee "+ id.toString()).split("newLinee ")[1])).toString();
    console.log(nm);
    $("."+nm).starRating({
            starSize: 20,
            totalStars: 10,
            readOnly: true,
            initialRating: rating,
            activeColor: "gold",
            ratedColor: "black",
            useGradient: false,
            emptyColor: "black",
            callback: function (currentRating, $el) {
            }
        });
}



function LoadDishes(lsDishes = takeDishes(), vegetarian = swCheckVeg, sortDish=takeSort(), page = 1){

    let actualUrl;
    $('#flexSwitchCheckDefault').on('change', function() {
        swCheckVeg = "vegetarian="+ $(this).is(':checked').toString();
    });

    if(lsDishes == "" && sortDish ==""){
        actualUrl = stableUrl;
    }
    else{
        actualUrl = "https://food-delivery.kreosoft.ru/api/dish?" + takeDishes() + vegetarian.toString() + sortDish + 'page=' + page.toString();
        console.log(takeDishes());
        console.log(vegetarian.toString());
        console.log(sortDish);
        console.log(actualUrl);
    }

    fetch(actualUrl)
        .then((response) => {
            console.log(response);
            return response.json();
        })
        .then((json) => {
            console.log(json.dishes);
            $("#dishes-container").empty();

            let template = $('#dishes-card');
            let count = 0;
            for (let dish of json.dishes)
            {
                let block = template.clone();
                block.attr("id", dish.id);
                block.find("#dishes-name").text(dish.name);
                block.find("#dishes-image").attr("src", dish.image);
                block.find("#dishes-dicription").text(dish.description);
                block.find(".my-rating").attr("id", count);
                block.find("#line").addClass(dish.id.toString());
                block.find("#dishes-type").text("Категория блюда - " + takeTypeDishes(dish.category));
                block.find("#footer-text").text("Цена - " + dish.price + "р");
                console.log(dish);
                block.removeClass("d-none");
                $("#dishes-container").append(block);
                count+=1;

            }/*
            curPage = json.pagination.current;
            ammountPage = json.pagination.count;*/
            localStorage.setItem("current", json.pagination.current);
            localStorage.setItem("count", json.pagination.count);
            DishesClick();

            fetch(actualUrl)
                .then((response) => {
                    console.log(response);
                    return response.json();
                })
                .then((json) => {
                    for (let dish of json.dishes)
                    {
                        console.log(dish.rating);
                        createRating(dish.rating, dish.id);


                    }

                });
        });


}


function CreatePagination(pagesAmount, currentPage)
{
    console.log(curPage);
    console.log(ammountPage);
    console.log(pagesAmount);
    console.log(currentPage);
    document.querySelectorAll('.new').forEach(function(a){
        a.remove()
    })
    $(".page-number-template").addClass('d-none');
    let template = $(".page-number-template");
    let classTemplate = document.querySelector('#page-number-template');



    for (let i = 1; i <= pagesAmount; i++)
    {
        console.log("test");
        let block = template.clone();
        console.log("testoo");
        block.find(".page-link").text(i);
        block.removeClass('d-none');
        block.attr('page'+i.toString(), i);
        block.find(".page-link").addClass("new");
        if (i == currentPage)
        {
            block.addClass('active');
        }
        block.insertBefore($(".pagination #next-sign"));
    }
    // Трабл с созданием карточек страниц


   PageChangeEvent();

}

function PageChangeEvent()
{
    $(".page-number-template").click(function() {
        $(".page-number-template").removeClass('active');
        $(this).addClass('active');
        LoadDishes(takeDishes(), swCheckVeg, takeSort(),$(this).text());
    })
    $("#next-sign").click(function(){
        let currentPage = $(`[page=${localStorage.getItem('current')}]`).attr("page");
        let nextPage = Number(currentPage)+1;
            if (nextPage <= localStorage.getItem('count'))
        {
            $(`[page=${localStorage.getItem('current')}]`).removeClass("active");
            $(`[page=${nextPage}]`).addClass("active");
            LoadDishes(takeDishes(), swCheckVeg, takeSort(),nextPage);
        }
    })
    $("#previous-sign").click(function(){
        let currentPage = $(`[page=${localStorage.getItem('current')}]`).attr("page");
        let previousPage = Number(currentPage)-1;
        if (previousPage > 0)
        {
            $(`[page=${localStorage.getItem('current')}]`).removeClass("active");
            $(`[page=${previousPage}]`).addClass("active");
            LoadDishes(takeDishes(), swCheckVeg, takeSort(),previousPage);
        }
    })
}

function DishesClick()
{
    $(".dishes-template").click(function(){
        localStorage.setItem('curDishes', $(this).attr('id'));
        window.location.href = ("html/dishesCard.html");
    })
}



function takeTypeDishes(typeDishes){
    switch (typeDishes){
        case "Pizza":
           return "Пицца";
        case "Dessert":
            return "Десерт";
        case "Soup":
            return "Суп";
        case "Drink":
            return "Напиток";
        case "Wok":
            return "Вок";
    }


}