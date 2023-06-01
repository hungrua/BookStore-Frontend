
$(document).ready(function(){
        /*==================================================================
    [ Validate ]*/
    function emailFormCheck(email){
        if(email.endsWith("@gmail.com")==false) alert("Vui lòng điền đúng định dạng email")
        else return true;
    }
    function passwordFormCheck(password){
        if(password.length<8) alert("Vui lòng nhập mật khẩu có ít nhất 8 ký tự") 
        else return true;
    }
    function specialCharactersCheck(test){
        var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;        
        if(format.test(test)) alert("Tên đăng nhập không được chứa ký tự đặc biệt")
        else return true
    }
    function check2Password(password1,password2){
        if(password1!==password2) alert("Mật khẩu xác nhận không trùng khớp!")
        else return true
    }
    /*==================================================================
    [ Effect chuyển đổi Login form và sign up form ]*/ 

    $("#login-btn").click(function(){
        login()
    })
    
    $("#signup-form").hide();
    $("#createAcc").on("click", function(){
        $("#login-form").hide();
        $("#signup-form").show()
    })
    $("#return-login").click(() => {
        $("#signup-form").hide();
        $("#login-form").show()
    })

    $("#signup-btn").click(function(){
        signUp()
    })
    /*==================================================================
    [ LoginApi ]*/
    function login(){
        let user ={
            "userName": $("#username").val(),
            "password": $("#password").val()
        }
        $.ajax({
            type: "POST",
            url:"http://localhost:8086/user/login",
            contentType : "application/json",
            dataType: "json",
            data: JSON.stringify(user),
            success: function(data){
                if(data.id == null)  alert("Sai tên đăng nhập hoặc mật khẩu")
                else{
                    let currentBook = sessionStorage.getItem("currentBook");
                    sessionStorage.setItem("user", JSON.stringify(data))
                    if(data.role_id==1) {
                        if(currentBook==null) window.location.href = "http://localhost:5500/electro-master/index.html"
                        else window.location.href = "http://localhost:5500/electro-master/product.html"
                    }
                    else  window.location.href = "http://localhost:5500/electro-master/admin.html"
                }
            }
        })
    }
    

    /*==================================================================
    [ SignupApi ]*/
    function signUp(){
        let username = $("#signup-username").val();
        let password = $("#signup-password").val();
        let email = $("#signup-email").val();
        let password2 = $("#signup-password-check").val();
        let role_id = $('input[name="role"]:checked').val()
        specialCharactersCheck(username)
        emailFormCheck(email)
        passwordFormCheck(password)
        if(password!==password2) alert("Mật khẩu xác nhận không trùng khớp!")
        if(specialCharactersCheck(username)&&emailFormCheck(email)&& passwordFormCheck(password)&&check2Password(password,password2)){
            var user ={
                "userName": username,
                "email": email,
                "password": password,
                "role_id": role_id
            }
            $.ajax({
                type: "POST",
                url: "http://localhost:8086/user/add",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify(user),
                success: function(data){
                    if(data.id==null){
                        alert("Tên đăng nhập này đã được sử dụng")
                    }
                    else {
                        alert("Tạo tài khoản thành công")
                        window.location.reload()
                    }
                }
            })
        }
    }
})

