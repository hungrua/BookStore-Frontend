const cartApi = "http://localhost:8086/cart/"
$(document).ready(function(){
    var user = JSON.parse(sessionStorage.getItem("user"))
    console.log(user.cart_id)
    function getBookCart(id){
        $.ajax({
            type: "GET",
            url : cartApi + id,
            dataType: "json",
            success: function(data){
                let total = 0;
                let html = ""
                $.each(data, function(i,value){
                    total+= value.price*value.quantity
                    html+=`
                    <tr id="bookCart-${value.id}">
                        <td class="td-center">${i+1}</td>
                        <td>${value.name}</td>
                        <td class="td-center" id="priceEach-${value.id}" >${renderPrice(value.price)}</td>
                        <td class="td-center" ><button class="quantity-btn decrease-btn" onclick="decreaseQuantity(${value.id})" >-</button><input type="number" name="" id="quantity-${value.id}" value="${value.quantity}"   ><button class="quantity-btn increase-btn" onclick="increaseQuantity(${value.id})" >+</button></td>
                        <td class="td-center" id="priceAll-${value.id}" >${renderPrice(value.price*value.quantity)}</td>
                        <td class="td-center" >
                            <button onclick="deleteBookCart(${value.id})">
                                <i class="fa fa-trash-o" aria-hidden="true"></i>
                            </button>
                        </td>
                    </tr>
                    `
                })
                if(data.length>0){
                    $("#createBillLink").css("display","block")
                }
                else $("#createBillLink").css("display","none")
                $("tbody").html(html)
                $("#totalPaid").text(renderPrice(total))
            }
        })
    }
    getBookCart(user.cart_id)


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
function deleteBookCart(id){
    let priceAll = $("#priceAll-"+id).text().split(".").join("")
    if(confirm("Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng ?")){
        $.ajax({
            type: "DELETE",
            url:"http://localhost:8086/cart/"+"delete/"+id,
            success: function(data){
                alert("Xóa sản phẩm khỏi giỏ hàng thành công")
                let total= $("#totalPaid").text().split(".").join("")
                $("#totalPaid").text(renderPrice(parseInt(total)-parseInt(priceAll)))
                $("#bookCart-"+data).hide()
                if($("#totalPaid").text()=="0")  $("#createBillLink").css("display","none")
            }
        })
    }
}
function editBookCart(id,math){
    let total= $("#totalPaid").text().split(".").join("")
    let qtt = $("#quantity-"+id).val()
    let price = $("#priceEach-"+id).text().split('.').join("")
    console.log(qtt, price)
    $("#priceAll-"+id).text(renderPrice(parseInt(qtt)*parseInt(price)))
    if(math=="-"){
        total = parseInt(total) - parseInt(price)
        $("#totalPaid").text(renderPrice(total))
    }
    else{
        total = parseInt(total) + parseInt(price)
        $("#totalPaid").text(renderPrice(total))
    }
    let bookCart ={
        "id": id,
        "quantity": parseInt(qtt)
    }
    $.ajax({
        type:"PUT",
        url: cartApi+"edit",
        contentType:"application/json",
        data: JSON.stringify(bookCart),
        success: function(){

        }
    })

}

// Hàm tăng giảm quantity 
function decreaseQuantity(id){
    let tmp = $("#quantity-"+id).val()
    if(tmp>1) {
        $("#quantity-"+id).val(tmp-1)
        editBookCart(id,"-");
    }
}
function increaseQuantity(id){
    let tmp = $("#quantity-"+id).val()
    $("#quantity-"+id).val(parseInt(tmp)+1)
    editBookCart(id,"+")
}