var book_id;
$(document).ready(function() {
    $(".edit-btn").click(function() {
        $(".infoInput").attr("disabled",false)
        $(this).hide()
        $(".save-btn").show()
    })
    $(".save-btn").click(function() {
        $(".infoInput").attr("disabled",true)
        $(this).hide()
        $(".edit-btn").show()
        editBook()
    })
    setCategoryInput()
    displayBook(localStorage.getItem("currentBook"))
})
const bookApi = "http://localhost:8086/book"
function displayBook(id){
    $.ajax({
        type: "GET",
        url: bookApi +"/"+id,
        contentType: "application/json",
        dataType: "json",
        success: function(data){
            book_id = data.id
            $("#title").val(data.title)
            $("#description").val(data.description)
            $("#author").val(data.author)
            $("#publishDate").val(data.publishDate)
            $("#category").val(data.category)
            $("#price").val(data.price)
            $("#page").val(data.page)
            $("#avatar").attr("src", "/electro-master/image/"+data.image)
            $(".imageUrl").text(data.image)
        }
    })
}
function setCategoryInput(){
    var categoryApi= "http://localhost:8086/categories"
    $.ajax({
        type: "GET",
        url: categoryApi,
        contentType: "application/json",
        dataType: "json",
        success: function(data){
            var html=""
            $.each(data, function(i,value){
                html+= `<option value="${value.id}">${value.category}</option>`
            })
            $("#category").html(html)
        }
    })
}
function getBookData(){
    var book ={
        'id': book_id,
        'title': $('#title').val(),
        'author': $('#author').val(),
        'description': $('#description').val(),
        'publishDate': $('#publishDate').val(),
        'page': $('#page').val(),
        'category': $('#category').val(),
        'price': $('#price').val(),
        'image': $(".imageUrl").text()
    }
    return book;
}
function editBook(){
    $.ajax({
        type:'PUT',
        url: 'http://localhost:8086/book/edit',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(getBookData()),
        success: function(data){
            if(data.id!=null) {
                alert("Chỉnh sửa sách thành công");
                $("#avatar").attr("src", "/electro-master/image/"+data.image)
            }
            else alert("Thông tin thay đổi đã tồn tại trong hệ thống")
        } 
    })
}

