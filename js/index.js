$(document).ready(function() {
    const bookApi = "http://localhost:8086/book/category/"
    //xem tất cả cuốn sách
    $(".category").click(function(){
        let category = $(this).attr("category_id");
        renderAllBooks(category)
    })
    function renderAllBooks(id) {
        $.ajax({
            type: "GET",
            url: bookApi+id,
            contentType: "application/json",
            dataType: "json", 
            success: function (data) {
                var html = "";
                $.each(data, function (i, value) {
                    let price = renderPrice(value.price);
                    html+=`
                        <div class="col-lg-3 mb-5">
                            <div class="product">
                                <div class="product-img">
                                    <img class="product-image"src="./image/${value.image}" alt="">
                                </div>
                                <div class="product-body">
                                    <h3 class="product-name"><a href="#">${value.title}</a></h3>
                                    <h4 class="product-price">${price}<span> vnđ</span></h4>
                                    <div class="product-rating">
                                        <i class="fa fa-star"></i>
                                        <i class="fa fa-star"></i>
                                        <i class="fa fa-star"></i>
                                        <i class="fa fa-star"></i>
                                        <i class="fa fa-star"></i>
                                    </div>
                                    <div class="product-btns">
                                        <button class="add-to-wishlist"><i class="fa fa-heart-o"></i><span class="tooltipp">add to wishlist</span></button>
                                        <button class="add-to-compare" onclick="addToCart(${value.id})" ><i class="fa fa-cart-arrow-down" aria-hidden="true"></i><span class="tooltipp">add to cart</span></button>
                                        <button class="quick-view" onclick="bookDetails(${value.id})"><i class="fa fa-eye"></i><span class="tooltipp">quick view</span></button>
                                    </div>
                                </div>
                            </div>
                         </div>
                    `
                })
                $(".book-container").html(html)
            }
        })
    }
    renderAllBooks(0)
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
    function renderUserName(){
        var user1 = JSON.parse(sessionStorage.getItem("user"))
        if(user1.id!=null){
            $("#username-container").html(
                `<span>Xin chào ${user1.userName}</span>`
            )
            $("#logout").html(
                `<button onclick="logout()" id="logout-link" ><i class="fa fa-user-o"></i>Đăng xuất</button>`
            )
        }
    }
    renderUserName()
})
function bookDetails(id){
    sessionStorage.setItem("currentBook", id);
    window.location.href = "http://localhost:5500/electro-master/product.html"
}
function logout(){
    sessionStorage.clear();
    window.location.href ="http://localhost:5500/electro-master/login.html"
}
function addToCart(id){
    var user = JSON.parse(sessionStorage.getItem("user"))
    if( user == null){
        window.location.href = "http://localhost:5500/electro-master/login.html"
    }
    let book_cart={
        "book_id": id,
        "cart_id": user.cart_id,
        "quantity": 1,
        "status": 1
    }
    $.ajax({
        type: "POST",
        url: "http://localhost:8086/cart/add",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(book_cart),
        success: function(data){
            if(data.id!=null){
                alert("Thêm vào giỏ hàng thành công!")
            }
            else {
                alert("Sản phẩm này đã có trong giỏ hàng của bạn")
            }
        }
    })
}
