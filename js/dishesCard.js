$(document).ready(function () {
    loadDishesDetail();
})

function include(url) {
    var script = document.createElement('script');
    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
}

include("/lib/star-rating.js")


function createRating(rating, id) {

    let nm = ((("noLine " + id.toString()).split("noLine ")[1])).toString();
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

function loadDishesDetail() {
    fetch(`https://food-delivery.kreosoft.ru/api/dish/${localStorage.getItem("curDishes")}`)
        .then(async (response) => {
            let json = await response.json();
            $("#dishes-card").attr("id", json.id);
            $("#dishes-image").attr('src', json.image);
            $("#dishes-name").text(`${json.name}`);
            $("#dishes-description").text(json.description);
            $("#dishes-price").text("Цена: " + json.price.toString() + " руб./шт");
            $("#line").addClass(json.id.toString());
            $("#dishes-type").text("Категория блюда - " + json.category);
            if (json.vegetarian == false) {
                $('#dishes-vegetarian').text("Не вегетерианское");
            } else {
                $('#dishes-vegetarian').text("Вегетерианское");
            }
            $("#year").text(json.year);
            $("#country").text(json.country);
            let genres = "";
            for (i in json.genres) {
                genres += json.genres[i].name;
                if (i != json.genres.length - 1) {
                    genres += ", ";
                }
            }
            $("#genres").text(genres);
            $("#time").text(`${json.time} мин.`);
            $("#motto").text(json.tagline);
            $("#producer").text(json.director);
            if (json.budget != null) {
                $("#budget").text(`$${MoneySplit(String(json.budget))}`);
            } else {
                $("#budget").text("-");
            }
            if (json.fees != null) {
                $("#fees").text(`$${MoneySplit(String(json.fees))}`);
            } else {
                $("#fees").text("-");
            }
            $("#age").text(`${json.ageLimit}+`);
        })
    fetch(`https://food-delivery.kreosoft.ru/api/dish/${localStorage.getItem("curDishes")}`)
        .then(async (response) => {
            let json = await response.json();
            createRating(json.rating, json.id);

        })

}
