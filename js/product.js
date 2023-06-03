const bookApi = "http://localhost:8086/book/"
const bookcartApi = "http://localhost:8086/cart/add"
const commentApi = "http://localhost:8086/comment/"
var tmpStringComment=""
$(document).ready(function() {
    var bookId = sessionStorage.getItem("currentBook")
    var user = JSON.parse(sessionStorage.getItem("user"))
    console.log(bookId)
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
        $.ajax({
            type: "POST",
            url : commentApi +"add",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(comment),
            success: function(value){
                let html=""
                html+=`
                    <li id="comment-${value.id}" rate="${value.rate}">
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
                            <button class="action" onclick="editMyComment(${value.id}) ">Chỉnh sửa</button>
                            <button class="action" onclick="deleteMyComment(${value.id})" >Xóa</button>
                        </div>
                        `
                    }
                    html+=`
                        </div>
                    </li>
                `
                $(".reviews").append(html)
                alert("Thêm comment thành công !")
                $("#commentContent").val("")
                $("#star"+value.rate).prop("checked",false)
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
                let reviews = data.length
                let totalRate =0;
                let star ={
                    "one": 0,
                    "two": 0,
                    "three": 0,
                    "four": 0,
                    "five": 0
                }
                $(".nbo-comment").text(reviews)
                console.log(reviews)
                let html=""
                $.each(data, function(i,value){
                    let rate = parseInt(value.rate)
                    totalRate+= rate
                    if(rate == 1) star.one+=1
                    else if(rate ==2) star.two+=1
                    else if(rate ==3) star.three+=1
                    else if(rate ==4) star.four+=1
                    else if(rate ==5) star.five+=1

                    html+=`
                    <li id="comment-${value.id}" rate="${value.rate}">
                        <div class="review-heading">
                            <h5 class="name">${value.user}</h5>
                            <p class="date">${value.commentDate}</p>
                            <div class="review-rating"   >
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
                            <button class="action" onclick="editMyComment(${value.id}) ">Chỉnh sửa</button>
                            <button class="action" onclick="deleteMyComment(${value.id})" >Xóa</button>
                        </div>
                        `
                    }
                    html+=`
                        </div>
                    </li>
                    `
                })
                let html2=""
                if(reviews==0){
                    for(let k =1 ;k<=5;k++){
                        html2+=`<i class="fa fa-star-o empty"></i>`
                    }
                    $("#overall-rating").text(0.0)
                }
                else{
                    let overallRate= (totalRate/reviews).toFixed(1)
                    let tmp =(Math.floor(totalRate/reviews))
                    let tmp2= overallRate - tmp
                    $("#overall-rating").text(overallRate)
                    if(tmp2>0){
                        tmp = parseInt(tmp)    
                        for(let k =1 ;k<=5;k++){
                            if(k<=tmp){
                                html2+=` <i class="fa fa-star"></i>`
                            }
                            else if(k==tmp+1){
                                console.log(k)
                                html2+=` <i class="fa fa-star-half-o"></i>`
                            }
                            else {
                                html2+=` <i class="fa fa-star-o empty"></i>`
                            }
                        }
                    }
                    else {
                        for(let k =1 ;k<=5;k++){
                            if(k<=tmp){
                                html2+=` <i class="fa fa-star"></i>`
                            }
                            else {
                                html2+=`<i class="fa fa-star-o empty"></i>`
                            }
                        }
                    }
                    renderPercentRate(star,reviews)
                }
                

                $(".rating-stars-render").html(html2)
                $(".reviews").html(html)
            }
        })
    }
    renderComment(bookId)
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
function editMyComment(id){
    let content= $("#content-"+id).val()
    let rate= parseInt($("#comment-"+id).attr("rate"))
    console.log(rate)
    $("#comment-btn").hide()
    $("#edit-btn").show()
    $("#commentContent").val(content)
    $("#star"+rate).prop("checked",true)
    console.log("ok")
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
            $("#star"+value.rate).prop("checked",false)
            $("#comment-"+id).attr("rate",rated)
            $("#edit-btn").off("click")
            $("#edit-btn").hide()
            $("#comment-btn").show()
        }
    })
}
function renderPercentRate(star,reviews){
    reviews = parseInt(reviews)
    let ratePercent = {
        "one":(star.one/reviews)*100 ,
        "two":(star.two/reviews)*100 ,
        "three":(star.three/reviews)*100 ,
        "four":(star.four/reviews)*100 ,
        "five":(star.five/reviews)*100
    }
    console.log(ratePercent)
    $("#five-stars").text(star.five)
    $("#four-stars").text(star.four)
    $("#three-stars").text(star.three)
    $("#two-stars").text(star.two)
    $("#one-star").text(star.one)
    $("#five-stars-percent").css("width",ratePercent.five+"%")
    $("#four-stars-percent").css("width",ratePercent.four+"%")
    $("#three-stars-percent").css("width",ratePercent.three+"%")
    $("#two-stars-percent").css("width",ratePercent.two+"%")
    $("#one-star-percent").css("width",ratePercent.one+"%")

}
