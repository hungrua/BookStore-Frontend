$(document).ready(function(){
    const bookApi = "http://localhost:8086/book"
    setCategoryInput()
    $(".add-btn").click(function(){
        saveBook()
    })
})
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
        'title': $('#title').val(),
        'author': $('#author').val(),
        'description': $('#description').val(),
        'publishDate': $('#publishDate').val(),
        'page': $('#page').val(),
        'category': $('#category').val(),
        'price': $('#price').val(),
        'image': $("#image").val().split('\\').pop()
    }
    console.log(book)
    if(book.title == '' || book.author == '' || book.category == null || book.price == '' || book.image=='' || book.page == '' || book.category ==''  || book.description=='' || book.publishDate == '' || book.publishDate=='') alert("Vui lòng điền đầy đủ thông tin cuốn sách")
    else return book;
}
function saveBook(){
    $.ajax({
        type:'POST',
        url: 'http://localhost:8086/book/add',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(getBookData()),
        success: function(data){
            if(data.id!=null) {
                alert("Thêm sách thành công")
                window.location.href = "http://localhost:5500/electro-master/admin.html"
            }
            else alert("Cuốn sách này đã tồn tại trong hệ thống")
        } 
    })
}