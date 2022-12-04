$(document).ready(function() {
    loadDishesDetail();
})


function loadDishesDetail()
{
    fetch(`https://food-delivery.kreosoft.ru/api/dish/${localStorage.getItem("curDishes")}`)
        .then(async (response) =>{
            let json = await response.json();
            $("#dishes-card").attr("id", json.id);
            $("#dishes-image").attr('src', json.image);
            $("#dishes-name").text(`${json.name}`);
            $("#dishes-description").text(json.description);
            checkStars(json.rating);
            $("#dishes-price").text("Цена: " + json.price.toString() + " руб./шт");

            $("#dishes-type").text("Категория блюда - " + json.category);
            if(json.vegetarian == false){
                $('#dishes-vegetarian').text("Не вегетерианское");
            }
            else{
                $('#dishes-vegetarian').text("Вегетерианское");
            }
            $("#year").text(json.year);
            $("#country").text(json.country);
            let genres = "";
            for (i in json.genres)
            {
                genres += json.genres[i].name;
                if (i != json.genres.length-1)
                {
                    genres += ", ";
                }
            }
            $("#genres").text(genres);
            $("#time").text(`${json.time} мин.`);
            $("#motto").text(json.tagline);
            $("#producer").text(json.director);
            if (json.budget != null)
            {
                $("#budget").text(`$${MoneySplit(String(json.budget))}`);
            }
            else
            {
                $("#budget").text("-");
            }
            if (json.fees != null)
            {
                $("#fees").text(`$${MoneySplit(String(json.fees))}`);
            }
            else
            {
                $("#fees").text("-");
            }
            $("#age").text(`${json.ageLimit}+`);
        })
}

function checkStars(ratings){
    const starTotal = 5;

    const starPercentage = (ratings/ starTotal) * 100;
    const starPercentageRounded = `${(Math.round(starPercentage / 10) * 10)}%`;
    document.querySelector(`.stars-inner`).style.width = starPercentageRounded;
}
