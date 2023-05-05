function validateForm() {
var username = document.getElementById("username").value;
var password = document.getElementById("password").value;

if (username === "" || password === "") {
    alert("Please enter a username and password.");
    return false;
}

if (username.length < 5 || password.length < 5) {
    alert("Username and password must be at least 5 characters long.");
    return false;
}

return true;
}
