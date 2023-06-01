$(document).ready(function () {
    const bookApi = "http://localhost:8086/book/category/"
    //xem tất cả cuốn sách
    function renderAllBooks() {
        $.ajax({
            type: "GET",
            url: bookApi+0,
            contentType: "application/json",
            dataType: "json", 
            success: function (data) {
                var html = "";
                $.each(data, function (i, value) {
                    html += `
                <tr id="book-${value.id}">
                    <td>${i + 1}</td>
                    <td>${value.title}</td>
                    <td>${value.author}</td>
                    <td>${value.category}</td>
                    <td>${value.publishDate}</td>
                    <td>${value.page}</td>
                    <td>${value.sold}</td>
                    <td>
                        <button class="btn btn-primary" onclick="viewBook(${value.id})">Xem</button>
                        <button class="btn btn-danger" onclick="deleteBook(${value.id})">Xóa</button>
                    </td>
                </tr>
                `
                })
                $("tbody").html(html)
            }
        })
    }
    renderAllBooks()

})


