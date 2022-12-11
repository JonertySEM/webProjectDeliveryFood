const stableUrl = "https://food-delivery.kreosoft.ru/api/dish?categories=Wok&categories=Pizza&categories=Soup&categories=Dessert&categories=Drink&page=1"
include("/lib/star-rating.js");
$(document).ready(function () {
    $("#sendButton").on('click', LoadMainDishes);
    if (localStorage.getItem('current')) {
        LoadMainDishes(takeDishes(), swCheckVeg, takeSort(), localStorage.getItem('current'));
    } else {
        LoadMainDishes();

    }


});
let swCheckVeg = "";

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

function countValueDish(json) {
    let count = 0;
    for (let dish of json) {
        count += 1;
    }
    return count;
}

function downUpSelecter(id) {
    $(document).ready(function () {
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

function takeDishes() {
    let strDish = "";
    let massiveDish = $("#selectFoodValue").val();
    for (let position of massiveDish) {
        strDish += "categories=" + position + "&";
    }
    return strDish;


}

function takeSort() {
    let sortPosition = "&";
    sortPosition += "sorting=" + $("#selectSorting").val() + "&";
    return sortPosition;
}

function include(url) {
    var script = document.createElement('script');
    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
}


function LoadMainDishes(lsDishes = takeDishes(), vegetarian = swCheckVeg, sortDish = takeSort(), page = 1) {

    let actualUrl;
    $('#flexSwitchCheckDefault').on('change', function () {
        swCheckVeg = "vegetarian=" + $(this).is(':checked').toString();
    });

    if (lsDishes == "" && sortDish == "") {
        actualUrl = stableUrl;
    } else {
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
            let footerTemplate = $('#footer-card');
            let count = 0;
            for (let dish of json.dishes) {

                let block = template.clone();
                let footer = footerTemplate.clone();
                block.attr("id", dish.id);
                block.find("#dishes-name").text(dish.name);
                footer.find("#footer-text").text("Цена - " + dish.price.toString() + "р");
                block.find(".dishes-image").attr("src", dish.image);
                block.find(".dishes-image").attr("id", dish.id);
                block.find("#dishes-dicription").text(dish.description);
                block.find("#line").addClass(dish.id.toString());
                block.find(".my-rating").attr("id", count);
                block.find("#dishes-type").text("Категория блюда - " + takeTypeDishes(dish.category));

                footer.find("#pressBasket").attr("id", dish.id.toString() + "_button");
                footer.find("#pressCol").attr("id", dish.id.toString() + "_Col");

                footer.find(".down").attr("id", dish.id.toString() + '_down');
                footer.find(".up").attr("id", dish.id.toString() + '_up');
                footer.find("#countDish").attr("id", "countDish_" + dish.id.toString());
                footer.find("#countDish_" + dish.id.toString()).val(1);


                console.log(dish);
                block.removeClass("d-none");
                footer.removeClass("d-none");
                block.append(footer);
                $("#dishes-container").append(block);
                count += 1;

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
                    for (let dish of json.dishes) {
                        console.log(dish.rating);
                        createRating(dish.rating, dish.id);
                    }

                });
            fetch("https://food-delivery.kreosoft.ru/api/account/profile", {
                headers: new Headers({
                    "Authorization": "Bearer " + localStorage.getItem("token")
                })
            })
                .then(async (response) => {
                    if (response.ok) {
                        console.log(response);
                        countValueDishes();
                        takeBasket(actualUrl);
                        return response.json();

                    }
                });


        });


}

function giveInBasket(id, amount) {
    countValueDishes();
    fetch("https://food-delivery.kreosoft.ru/api/basket/dish/" + id.toString(), {
        method: 'POST',
        headers: new Headers({
            "Authorization": "Bearer " + localStorage.getItem("token")
        })
    })
        .then(async (response) => {
            if (response.ok) {
                countValueDishes();
                let countDish = amount;
                console.log("dish has been accept in your basket");
                $("#" + id.toString() + "_button").addClass("d-none");
                $("#" + id.toString() + "_Col").removeClass("d-none");

                downUpSelecter(id);
                document.getElementById(id.toString() + '_up').addEventListener("click", function () {
                    countValueDishes();
                    addNewDishes(id);
                    countDish += 1;
                    console.log("add this dish");
                }, false);

                document.getElementById(id.toString() + '_down').addEventListener("click", function () {
                    countValueDishes();
                    console.log("dish has been deleted");
                    deleteNewDishes(id);
                    countDish -= 1;
                    if (countDish == 0) {
                        $("#" + id.toString() + "_Col").addClass("d-none");
                        $("#" + id.toString() + "_button").removeClass("d-none");
                    }
                }, false);

            }
        });

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

function checkDataInBasket(id) {
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
                    if (dish.id == id) {
                        giveInBasket(dish.id, dish.amount);
                    }
                }
            }

        })
}

function takeBasket(url) {
    fetch(url)
        .then((response) => {
            console.log(response);
            return response.json();
        })
        .then((json) => {
            console.log(json);
            for (let dish of json.dishes) {
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
                                if (dish.id == id) {
                                    giveInBasket(dish.id, dish.amount);
                                }
                            }
                        }

                    })
                $("#" + dish.id.toString() + "_button").removeClass("d-none");
                document.getElementById(dish.id.toString() + "_button").addEventListener("click", function () {
                    giveInBasket(dish.id, 1);

                }, true);


            }
            console.log("user is auth");
        });
}


function createRating(rating, id) {

    let nm = ((("newLinee " + id.toString()).split("newLinee ")[1])).toString();
    console.log(nm);
    $("." + nm).starRating({
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


function LoadDishes(lsDishes = takeDishes(), vegetarian = swCheckVeg, sortDish = takeSort(), page = 1) {

    let actualUrl;
    $('#flexSwitchCheckDefault').on('change', function () {
        swCheckVeg = "vegetarian=" + $(this).is(':checked').toString();
    });

    if (lsDishes == "" && sortDish == "") {
        actualUrl = stableUrl;
    } else {
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
            let footerTemplate = $('#footer-card');
            let count = 0;
            for (let dish of json.dishes) {

                let block = template.clone();
                let footer = footerTemplate.clone();
                block.attr("id", dish.id);
                block.find("#dishes-name").text(dish.name);
                footer.find("#footer-text").text("Цена - " + dish.price.toString() + "р");
                block.find(".dishes-image").attr("src", dish.image);
                block.find(".dishes-image").attr("id", dish.id);
                block.find("#dishes-dicription").text(dish.description);
                block.find("#line").addClass(dish.id.toString());
                block.find(".my-rating").attr("id", count);
                block.find("#dishes-type").text("Категория блюда - " + takeTypeDishes(dish.category));

                footer.find("#pressBasket").attr("id", dish.id.toString() + "_button");
                footer.find("#pressCol").attr("id", dish.id.toString() + "_Col");

                footer.find(".down").attr("id", dish.id.toString() + '_down');
                footer.find(".up").attr("id", dish.id.toString() + '_up');


                console.log(dish);
                block.removeClass("d-none");
                footer.removeClass("d-none");
                block.append(footer);
                $("#dishes-container").append(block);
                count += 1;

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
                    for (let dish of json.dishes) {
                        console.log(dish.rating);
                        createRating(dish.rating, dish.id);


                    }

                });
            fetch("https://food-delivery.kreosoft.ru/api/account/profile", {
                headers: new Headers({
                    "Authorization": "Bearer " + localStorage.getItem("token")
                })
            })
                .then(async (response) => {
                    if (response.ok) {
                        console.log(response);
                        takeBasket(actualUrl);
                        return response.json();

                    }
                });
        });


}


function CreatePagination(pagesAmount, currentPage) {
    console.log(curPage);
    console.log(ammountPage);
    console.log(pagesAmount);
    console.log(currentPage);
    document.querySelectorAll('.new').forEach(function (a) {
        a.remove()
    })
    $(".page-number-template").addClass('d-none');
    let template = $(".page-number-template");
    let classTemplate = document.querySelector('#page-number-template');


    for (let i = 1; i <= pagesAmount; i++) {
        console.log("test");
        let block = template.clone();
        console.log("testoo");
        block.find(".page-link").text(i);
        block.removeClass('d-none');
        block.attr('page' + i.toString(), i);
        block.find(".page-link").addClass("new");
        if (i == currentPage) {
            block.addClass('active');
        }
        block.insertBefore($(".pagination #next-sign"));
    }
    // Трабл с созданием карточек страниц


    PageChangeEvent();

}

function PageChangeEvent() {
    $(".page-number-template").click(function () {
        $(".page-number-template").removeClass('active');
        $(this).addClass('active');
        LoadDishes(takeDishes(), swCheckVeg, takeSort(), $(this).text());
    })
    $("#next-sign").click(function () {
        let currentPage = $(`[page=${localStorage.getItem('current')}]`).attr("page");
        let nextPage = Number(currentPage) + 1;
        if (nextPage <= localStorage.getItem('count')) {
            $(`[page=${localStorage.getItem('current')}]`).removeClass("active");
            $(`[page=${nextPage}]`).addClass("active");
            LoadDishes(takeDishes(), swCheckVeg, takeSort(), nextPage);
        }
    })
    $("#previous-sign").click(function () {
        let currentPage = $(`[page=${localStorage.getItem('current')}]`).attr("page");
        let previousPage = Number(currentPage) - 1;
        if (previousPage > 0) {
            $(`[page=${localStorage.getItem('current')}]`).removeClass("active");
            $(`[page=${previousPage}]`).addClass("active");
            LoadDishes(takeDishes(), swCheckVeg, takeSort(), previousPage);
        }
    })
}

function DishesClick(id) {
    $(".dishes-image").click(function () {
        localStorage.setItem('curDishes', $(this).attr('id'));
        window.location.href = ("html/dishesCard.html");
    })
}


function takeTypeDishes(typeDishes) {
    switch (typeDishes) {
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