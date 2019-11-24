//0702280 Annemari Mustonen

//Loading homepage into the frame and setting button visibility
function loadHomePage() {
    document.querySelector('#btnAdd').style = "visibility:visible";
    document.querySelector('#btnDelete').style = "visibility:visible";
    loadframe('frame', 'home.html');
}

//Adding a user in table
function addUser() {
    var name = $("#txtUser").val();    
    var password = $("#txtPassword").val();            
    if (!name) {
        alert("Email is required");    
    }
    else {         
        var r = confirm("Username: " + name);        
        if (r == true) {
            userHandler.addUser(name, password);
            $("#txtUser").val("");
            $("#txtPassword").val("");
            location.href = "tabs.html"
            showInfo();
        }
    }
}

//Logging out user
function logoutUser() {
            location.href = "login.html"
            showInfo();    
}

//Adding dog info into the database table
function addInfo() {
    var name = $("#txtName").val();
    var breed = $("#txtBreed").val();
    var breeder = $("#txtBreeder").val();
    if (!name) {
        alert("Name is required");
    }
    else {
        var r = confirm("Dog name: " + name + ", Breed:" + breed + ", Breeder:" + breeder);
        if (r == true) {
            $("#txtName").val("");
            $("#txtBreed").val("");
            $("#txtBreeder").val("");
            infoHandler.addInfo(name, breed, breeder);
            parent.document.querySelector('#frame').src = 'home.html';

        }
    }
}

//Load content into iframe component
function loadframe(frame, uri) {
    document.querySelector('#' + frame).src = uri;
}
