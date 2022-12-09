function checkBusket(){
    fetch("https://food-delivery.kreosoft.ru/api/basket/dish/" + id.toString(), {
        method: 'POST',
        headers: new Headers({
            "Authorization": "Bearer " + localStorage.getItem("token")
        })
    })
        .then(async (response) => {
            if (response.ok) {

            }
        });
}