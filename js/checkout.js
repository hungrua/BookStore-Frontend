const cartApi = "http://localhost:8086/cart/"
const billApi = "http://localhost:8086/bill/"
var user = JSON.parse(sessionStorage.getItem("user"))
$(document).ready(function () {
    function getBookCart(id) {
        $.ajax({
            type: "GET",
            url: cartApi + id,
            dataType: "json",
            success: function (data) {
                let total = 0;
                let html = ""
                $.each(data, function (i, value) {
                    total += value.price * value.quantity
                    html += `
                            <div class="order-col">
                                <div class="product-quantity">${value.quantity} x</div>
                                <div class="product-title">${value.name}</div>
                                <div class="product-total">${renderPrice(value.price * value.quantity)}</div>
                            </div>
                    `
                })
                $(".order-products").html(html)
                $(".order-total").text(renderPrice(total))
            }
        })
    }
    getBookCart(user.cart_id)

    function createBill() {
        let bill = {
            "cart_id": user.cart_id,
            "receiver": $("#receiver").val(),
            "address": $("#address").val(),
            "contact": $("#contact").val(),
            "notes": $("#notes").val()
        }
        if(bill.receiver==""?alert("Vui lòng điền tên người nhận"):true
            &&bill.address==""?alert("Vui lòng điền địa chỉ nhận hàng"):true
            &&bill.contact==""?alert("Vui lòng điền số điện thoại liên hệ"):true
        ){
            $.ajax({
                type: "POST",
                url: billApi + "add",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify(bill),
                success: function (data) {
                    alert("Tạo hóa đơn thành công")
                    window.location.href = "http://localhost:5500/electro-master/bill.html#"
                }
            })
        }

    }
    $(".order-submit").click(function () {
        createBill()
    })

    function autoFillInfo(id) {
        $.ajax({
            type: "GET",
            url: billApi + "previous/" + id,
            dataType: "json",
            success: function (data) {
                if(data.receiver ==null) {
                    alert("Bạn chưa từng đặt hàng trước đó, vui lòng điền thông tin")
                }
                else{
                    $("#receiver").val(data.receiver),
                    $("#address").val(data.address),
                    $("#contact").val(data.contact),
                    $("#notes").val(data.notes)
                }
            }
        })
    }
    $("#fillInfo").click(function(){
        autoFillInfo(user.cart_id)
    })
})
function renderPrice(price) {
    let tmp = price.toString()
    let result = ""
    let cnt = 0
    for (let i = tmp.length - 1; i >= 0; i -= 1) {
        result += tmp[i]
        cnt += 1
        if (cnt == 3 && i != 0) {
            result += "."
            cnt = 0
        }
    }
    return result.split("").reverse().join("")
}