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
    const data = { title: title.value, description: description.value, price: Number(price.value), thumbnails: file?.files[0]?.name ? "http://localhost:8080/" + file?.files[0]?.name : undefined, code: code.value, stock: Number(stock.value) }
    socket.emit("msg_front_to_back", { data })
})
socket.on("newProduct_to_front", (product) => {
    //recibir todos los productos para renderizarlos en el failura
    if (product.status === "failure") {
        alert(product.message)
    } else {
        list.innerHTML += `<li>
    <h2>Nombre: ${product.data.title}</h2>
    <p>Descripcion: ${product.data.description}</p>
    <p>Stock: ${product.data.stock}</p>
    <p>Precio: ${product.data.price}</p>
    <p>Codigo: ${product.data.code}</p>
    <p>Id: ${product.data.id}</p>
    <p>Img: ${product.data.thumbnails}</p>
    <button id="${product.data.id}"><img src="http://localhost:8080/assets/quitar.png" alt="Eliminar producto"title="Eliminar producto"></button>
</li>`
        document.getElementById(product.data.id).addEventListener("click", () => {
            socket.emit("msg_front_to_back_delete_product", product)
        })
    }
})
socket.on("msg_back_to_front_products", (products) => {
    for (let i = 0; i < products.length; i++) {
        const product = products[i]
        document.getElementById(product.id).addEventListener("click", () => {
            socket.emit("msg_front_to_back_delete_product", product)
        })
    }
})
socket.on("msg_front_to_back_deleted", (products) => {
    list.innerHTML = ""
    for (let i = 0; i < products.length; i++) {
        const product = products[i]
        list.innerHTML += `<li>
        <h2>Nombre: ${product.title}</h2>
        <p>Descripcion: ${product.description}</p>
        <p>Stock: ${product.stock}</p>
        <p>Precio: ${product.price}</p>
        <p>Codigo: ${product.code}</p>
        <p>Id: ${product.id}</p>
        <p>Img: ${product.thumbnails}</p>
        <button id="${product.id}"><img src="http://localhost:8080/assets/quitar.png" alt="Eliminar producto"
        title="Eliminar producto"></button>
        </li>`
    }
    for (let i = 0; i < products.length; i++) {
        const product = products[i]
        const { id } = product
        document.getElementById(id).addEventListener("click", () => {
            socket.emit("msg_front_to_back_delete_product", product)
        })
    }
})