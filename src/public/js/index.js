//FRONT
const socket = io()
const code = document.getElementById("code")
const title = document.getElementById("title")
const description = document.getElementById("description")
const stock = document.getElementById("stock")
const file = document.getElementById("file")
const price = document.getElementById("price")
const list = document.getElementById("list")
document.getElementById("buttonSumbit").addEventListener("click", (e) => {
    e.preventDefault()
    const data = { title: title.value, description: description.value, price: Number(price.value), thumbnails: "http://localhost:8080/" + file?.files[0]?.name, code: code.value, stock: Number(stock.value) }
    socket.emit("msg_front_to_back", { data })
})
socket.on("newProduct_to_front", (product) => {
    list.innerHTML += `<li>
    <h2>Nombre: ${product.data.title}</h2>
    <p>Descripcion: ${product.data.description}</p>
    <p>Stock: ${product.data.stock}</p>
    <p>Precio: ${product.data.price}</p>
    <p>Codigo: ${product.data.code}</p>
    <p>Id: ${product.data.id}</p>
    <p>Img: ${product.data.thumbnails}</p>
    <button><img src="http://localhost:8080/assets/quitar.png" alt="Eliminar producto"
            title="Eliminar producto"></button>
</li>`
})