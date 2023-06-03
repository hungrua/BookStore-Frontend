const billApi = "http://localhost:8086/bill/"
var user = JSON.parse(sessionStorage.getItem("user"))
$(document).ready(function() {
    function getBillByCart(id) {
        $.ajax({
            type: "GET",
            url: billApi + id,
            dataType: "json",
            success: function (data) {
                let html = ""
                data.reverse()
                $.each(data, function (i, value) {
                    html += `
                        <div class="bill-container col-12 " id="bill-${value.id}">
                            <div class="d-flex justify-content-between infoContainer">
                                <h4 >Mã đơn hàng : ${value.id} </h4>
                                <button onclick="deleteBill(${value.id},'${value.orderDate}')" > Hủy đặt hàng </button>
                            </div>
                            <div class="d-flex infoContainer">
                                <div class="receiver">Người nhận : ${value.receiver}</div>
                                <div class="orderDate">Ngày đặt hàng : ${value.orderDate}</div>
                                <div class ="contact">Liên hệ : ${value.contact}</div>
                            </div>
                            <div class="address infoContainer">Địa chỉ nhận hàng : ${value.address}</div>
                            <table class="col-12 table-bordered text-center">
                                <thead>
                                    <th>Stt</th>
                                    <th>Tên sản phẩm</th>
                                    <th>Giá theo sản phẩm</th>
                                    <th>Số lượng</th>
                                    <th>Giá tiền theo số lượng</th>
                                </thead>
                                <tbody id="books-${value.id}">
                    `
                    let total = 0
                    $.each(value.items, function(j, item) {
                        total+=item.price * item.quantity
                        html+=
                            `
                            <tr>
                                <td>${j+1}</td>
                                <td>${item.name}</td>
                                <td>${renderPrice(item.price)}</td>
                                <td>${item.quantity}</td>
                                <td>${renderPrice(item.price * item.quantity)}</td>
                            </tr>     
                            `
                    })
                    html+= `    
                                    <tr>
                                        <td colspan="4">Thành tiền</td>
                                        <td>${renderPrice(total)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    `
                })
                $("#bills-container").html(html)
            }
        })
    }
    getBillByCart(user.cart_id)

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
function deleteBill(id,orderDate){
    let tmp = new Date(orderDate).getTime()
    let now = new Date().getTime()
    if(now - tmp >= 24*60*60*1000){
        alert("Bạn chỉ có thể hủy đơn hàng trong ngày !")
    }
    else {
        if(confirm("Bạn có chắc muốn hủy đơn hàng này")){
            $.ajax({
                type: "delete",
                url: billApi+"delete/" + id,
                success: function () {
                    $("#bill-"+id).hide()
                    alert("Hủy đơn thành công!")
                }
            })
        }
    }
}