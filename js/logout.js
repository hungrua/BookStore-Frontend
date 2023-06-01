
    $("#logout-link").click(function(){
        alert("ok")
        sessionStorage.clear();
        window.location.href ="http://localhost:5500/electro-master/login.html"
    })