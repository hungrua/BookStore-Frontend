const bookApi = "http://localhost:8086/book/"
const bookcartApi = "http://localhost:8086/cart/add"
const commentApi = "http://localhost:8086/comment/"
var tmpStringComment=""
$(document).ready(function() {
    var bookId = sessionStorage.getItem("currentBook")
    var user = JSON.parse(sessionStorage.getItem("user"))
    console.log(bookId)
    //Hiển thị thông tin sách
    renderBookById(bookId)
    function renderBookById(id) {
        $.ajax({
            type : "GET",
            url: bookApi + id,
            dataType : "json",
            success: function (data) {
                $(".product-name").text(data.title)
                $(".product-author span").text(data.author)
                $("#price").text(renderPrice(data.price))
                $(".product-description").text(data.description)
                var textarea = document.querySelector("#description");
                textarea.style.height = 'auto';
                textarea.style.height = textarea.scrollHeight + 'px';
                let imageUrl = "/electro-master/image/"+data.image
                $("#product-img").attr("src",imageUrl)
                $("#category").text(data.category_code)
                $("#category").attr("category_id",data.category)
            }
        })
    }
    $(".product-preview-image").height($(".product-details").height())
    //Hiển thị người dùng
    function renderUserName(){
        if(user!=null){
            $("#username-container").html(
                `<span>Xin chào ${user.userName}</span>`
            )
            $("#logout").html(
                `<button onclick="logout()" id="logout-link"><i class="fa fa-user-o"></i>Đăng xuất</button>`
            )
        }
    }

    renderUserName()

    //Thêm sách vào giỏ hàng
    function addToCart(){
        if( user == null){
            window.location.href = "http://localhost:5500/electro-master/login.html"
        }
        let book_cart={
            "book_id": bookId,
            "cart_id": user.cart_id,
            "quantity": $("#quantity").val(),
            "status": 1
        }
        if(book_cart.quantity ==null) {
            alert("Vui lòng nhập số lượng sách muốn đặt")
        }
        else{
            $.ajax({
                type: "POST",
                url: bookcartApi,
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify(book_cart),
                success: function(data){
                    if(data.id!=null){
                        alert("Thêm vào giỏ hàng thành công!")
                        window.location.href="http://localhost:5500/electro-master/cart.html#"
                    }
                    else {
                        alert("Sản phẩm này đã có trong giỏ hàng của bạn")
                    }
                }
            })
        }
    }

    $("#add-book-to-cart-btn").click(function(){
        addToCart();
    })

    // Thêm comment đánh giá
    function addComment(){
        let comment={
            "content": $("#commentContent").val(),
            "rate": parseInt($("input[name=rating]:checked").val()),
            "user_id": user.id,
            "book_id": parseInt(bookId)
        }
        console.log(comment)
        $.ajax({
            type: "POST",
            url : commentApi +"add",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(comment),
            success: function(value){
                let html=""
                html+=`
                    <li id="comment-${value.id}">
                        <div class="review-heading">
                            <h5 class="name">${value.user}</h5>
                            <p class="date">${value.commentDate}</p>
                            <div class="review-rating">
                    `
                    for(let k=1;k<=parseInt(value.rate);k++){
                        html+=` <i class="fa fa-star"></i>`
                    }
                    for(let k=1;k<=5-parseInt(value.rate);k++){
                        html+=` <i class="fa fa-star-o empty"></i>`
                    }
                    html+=   `
                            </div>
                        </div>
                        <div class="review-body">
                            <textarea class="render-textarea" name="" id="content-${value.id}" disabled="true" >${value.content}</textarea>
                    `
                    if(value.user_id == user.id){
                        html+=`
                        <div class="action-container">
                            <button class="action" onclick="editMyComment(${value.id}  ,${value.rate}) ">Chỉnh sửa</button>
                            <button class="action" onclick="deleteMyComment(${value.id})" >Xóa</button>
                        </div>
                        `
                    }
                    html+=`
                        </div>
                    </li>
                `
                alert("Thêm comment thành công !")
            }
        })
    }
    $("#comment-btn").click(function(){
        addComment()
    })

    // Hiển thị comment đánh giá
    function renderComment(id){
        $.ajax({
            type: "GET",
            url: commentApi +"book/"+id,
            dataType: "json",
            success: function(data){
                let html=""
                $.each(data, function(i,value){
                    // console.log(value.rate)
                    html+=`
                    <li id="comment-${value.id}">
                        <div class="review-heading">
                            <h5 class="name">${value.user}</h5>
                            <p class="date">${value.commentDate}</p>
                            <div class="review-rating">
                    `
                    for(let k=1;k<=parseInt(value.rate);k++){
                        html+=` <i class="fa fa-star"></i>`
                    }
                    for(let k=1;k<=5-parseInt(value.rate);k++){
                        html+=` <i class="fa fa-star-o empty"></i>`
                    }
                    html+=   `
                            </div>
                        </div>
                        <div class="review-body">
                            <textarea class="render-textarea" name="" id="content-${value.id}" disabled="true" >${value.content}</textarea>
                    `
                    if(value.user_id == user.id){
                        html+=`
                        <div class="action-container">
                            <button class="action" onclick="editMyComment(${value.id}  ,${value.rate}) ">Chỉnh sửa</button>
                            <button class="action" onclick="deleteMyComment(${value.id})" >Xóa</button>
                        </div>
                        `
                    }
                    html+=`
                        </div>
                    </li>
                    `
                })
                $(".reviews").html(html)
            }
        })
    }
    renderComment(bookId)

})
function renderPrice(price){
    let tmp = price.toString()
    let result=""
    let cnt=0
    for (let i = tmp.length-1; i >=0; i-=1){
        result+= tmp[i]
        cnt+=1
        if(cnt==3 && i!=0){
            result+="."
            cnt=0
        }
    }
    return result.split("").reverse().join("")
}
function logout(){
    sessionStorage.clear();
    window.location.href ="http://localhost:5500/electro-master/login.html"
}

//Xóa comment
function deleteMyComment(id){
    if(confirm("Bạn có chắc chắn muốn xóa comment này ?")){
        $.ajax({
            type: "DELETE",
            url: "http://localhost:8086/comment/delete/"+id,
            success: function(){
                alert("Đã xóa comment này")
                $("#comment-"+id).hide()

            }
        })
    }
}
// Chỉnh sửa comment
function editMyComment(id,rate){
    let content= $("#content-"+id).val()
    $("#comment-btn").hide()
    $("#edit-btn").show()
    $("#commentContent").val(content)
    $("#star"+rate).attr("checked", true)
    $("#edit-btn").click(function(){
        editComment(id,rate)
    }) 
}
function editComment(id) {
    let rated  = parseInt($("input[name=rating]:checked").val())
    let newComment ={
        "id": id,
        "content": $("#commentContent").val(),
        "rate": rated
    }
    $.ajax({
        type: "PUT",
        url : commentApi +"edit",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(newComment),
        success: function(value){
            $("#comment-"+id+" .render-textarea").val(value.content)
            $("#comment-"+id+" .date").val(value.commentDate)
            let html=""
            for(let k=1;k<=parseInt(value.rate);k++){
                html+=` <i class="fa fa-star"></i>`
            }
            for(let k=1;k<=5-parseInt(value.rate);k++){
                html+=` <i class="fa fa-star-o empty"></i>`
            }
            $("#comment-"+id+" .review-rating").html(html)
            alert("Sửa comment thành công !")
            $("#commentContent").val("")
            $("#star"+value.rate).attr("checked", false)
            $("#edit-btn").off("click")
            $("#edit-btn").hide()
            $("#comment-btn").show()
        }
    })
}
