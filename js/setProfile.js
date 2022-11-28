const emailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/

$(document).ready(function (){
    CheckforAuth();
    $("#changeButton").click(UpdateData);
});

function CheckforAuth(){
    fetch("https://food-delivery.kreosoft.ru/api/account/profile", {headers: new Headers({
            "Authorization" : "Bearer " + localStorage.getItem("token")
        })
    })
        .then(async (response) => {
            if (response.ok){
                let json = await response.json();
                console.log(json);
                $("#add-nickname").text("Авторизован как - " + json.nickName);
                FillCurrentData(json);
            }
            else
            {
                window.location.href = "/html/login.html";
            }
        })
}

function FillCurrentData(json)
{
    $("#nickname").text(json.nickName);
    $("#email").attr("value", json.email);
    if (json.gender == "Male")
    {
        $("#male").attr("selected", "true");
    }
    else
    {
        $("#female").attr("selected","true");
    }
    $("#nameSurname").attr('value', json.name);
    let dateandTime = json.birthDate.split('T');
    $("#birthDate").val(dateandTime[0]);
    localStorage.setItem("id", json.id);
}

function UpdateData()
{
    $("#wrongEmailAlert").addClass("d-none");
    $("#wrongLinkAlert").addClass("d-none");
    $("#wrongBirthDateAlert").addClass("d-none");
    $("#wrongNameAlert").addClass("d-none");
    let emailInput = $("#email").val();
    if (!emailRegex.test(emailInput))
    {
        $("#wrongEmailAlert").removeClass("d-none");
        return;
    }
    let avatarLinkInput = $("#avatarLink").val();
    if ((!(linkRegex.test(avatarLinkInput))) && (avatarLinkInput != ""))
    {
        $("#wrongLinkAlert").removeClass("d-none");
        return;
    }
    if (avatarLinkInput == "")
    {
        avatarLinkInput = null;
    }
    if (!($("#nameSurname").val()))
    {
        console.log("зашли");
        $("#wrongNameAlert").removeClass("d-none");
        return;
    }
    let changeData = {
        id:localStorage.getItem('id'),
        nickName:$("#nickname").text(),
        email:emailInput,
        avatarLink: avatarLinkInput,
        name:$("#nameSurname").val(),
        birthDate:new Date($("#birthDate").val()).toISOString(),
        gender: parseInt($("#sex").val())
    }
    fetch("https://react-midterm.kreosoft.space/api/account/profile", {method: "PUT",
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
                window.location.href = "/html/profile.html";
            }
        })
}

function Logout()
{
    localStorage.removeItem("token");
    window.location.href = "/index.html";
}