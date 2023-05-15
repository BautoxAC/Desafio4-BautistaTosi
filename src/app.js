import express from "express"
import { cartsRouter } from "./routes/carts.router.js"
import { productsRouter } from "./routes/products.router.js"
import { __dirname } from "./utils.js"
import path from "path"
import { Server } from "socket.io"
import handlebars from "express-handlebars"
import { productRouterHtml } from "./routes/productRouterHtml.router.js"
import { productsSocketRouter } from "./routes/productsSocketRouter.router.js"
import { ProductManager } from "./ProductManager.js"
const app = express()
const port = 8080

app.use(express.static(path.join(__dirname, "/public")))
app.use(express.static(path.join(__dirname, "/public/assets")))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.engine("handlebars", handlebars.engine())
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "handlebars")

//Rutes: API REST WITH JSON
app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)

//Rutes: HTML
app.use("/products", productRouterHtml)

//Rutes: SOCKETS
app.use("/realtimeproducts", productsSocketRouter)

const httpServer = app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})
const socketServer = new Server(httpServer)

socketServer.on("connection", (socket) => {
    socket.on("msg_front_to_back", async (data) => {
        const list = new ProductManager("src/public/products.json")
        const { title, description, price, thumbnails, code, stock } = data.data
        await socket.emit("newProduct_to_front", await list.addProduct(title, description, price, thumbnails, code, stock ))
    })
})

app.get("*", (req, res) => {
    return res.status(404).json({
        status: "error", msg: "no encontrado", data: ""
    })
})