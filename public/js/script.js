const passwordShow = document.querySelector("#passwordShow");
password.addEventListener("click", function(){
    const passwordInput = document.getElementById("password");
    const type = passwordInput.getAttribute("type");
    if(type == "password"){
        passwordInput.setAttribute("type", "text");
        passwordShow.innerHTML = "Hide Password";
    }
    else{
        passwordInput.setAttribute("type", "password");
        passwordShow.innerHTML = "Show Password";
    }
});