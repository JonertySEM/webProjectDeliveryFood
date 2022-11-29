$(document).ready(function () {
    getUserInfo();
});

function getUserInfo() {
    fetch("https://food-delivery.kreosoft.ru/api/account/profile", {
        method: 'GET',
        headers: new Headers({
            "Authorization": "Bearer " + localStorage.getItem("token")
        })
    })
        .then(async (response) => {
            if (response.ok) {
                let json = await response.json();
                showUserInfo(json)
            } else {
                //Оформить ошибку при неудачном распозновании данных
            }

        })
}

function showUserInfo(json) {

    document.getElementById("FIO").value = json.fullName
    document.getElementById("email").text = json.email

    let dateandTime = json.birthDate.split('T');
    let onlDate = dateandTime[0].split('-');


    var day = ("0" + onlDate[2]).slice(-2);
    var month = ("0" + (onlDate[1] + 1)).slice(-2);
    var today = onlDate[0]+"-"+(month)+"-"+(day) ;
    $('#birthDate').val(today);

    convertGender(json.gender);

    document.getElementById("adress").value = json.address
    document.getElementById("phone").value = json.phoneNumber

}

function convertGender(gender) {
    if (gender === "Male") {
        document.getElementById("sex").text = "мужчина"
    } else {
        document.getElementById("sex").text = "женщина"
    }

}