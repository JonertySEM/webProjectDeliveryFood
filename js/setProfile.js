$(document).ready(function () {
    getUserInfo();
    $("#changeButton").on('click',changeUserData);
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

function changeUserData(){
    $("#wrongBirthDateAlert").addClass("d-none");
    $("#wrongNameAlert").addClass("d-none");

    if (!($("#FIO").val()))
    {
        console.log("зашли");
        $("#wrongNameAlert").removeClass("d-none");
        return;
    }
    let changeData = {
        fullName:$("#FIO").val(),
        birthDate:new Date($("#birthDate").val()).toISOString(),
        address: $("#adress").val(),
        phoneNumber: $("#phone").val()
    }
    fetch("https://food-delivery.kreosoft.ru/api/account/profile", {method: "PUT",
        headers: new Headers({"Content-Type": "application/json", "accept": "*/*", "Authorization" : "Bearer " + localStorage.getItem("token")}),
        body:JSON.stringify(changeData)
    })
        .then(async (response) => {
            if (!response.ok)
            {
                let json = await response.json();
                console.log(json);
                if (json.message == "Invalid birth date")
                {
                    $("#wrongBirthDateAlert").removeClass("d-none");
                }
            }
            else
            {
                window.location.href = "profile.html";
            }
        })
}

function convertGender(gender) {
    if (gender === "Male") {
        document.getElementById("sex").text = "мужчина"
    } else {
        document.getElementById("sex").text = "женщина"
    }

}