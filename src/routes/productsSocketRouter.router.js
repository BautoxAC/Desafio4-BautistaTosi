import express from "express"
export const productsSocketRouter = express.Router()
import { ProductManager } from "../ProductManager.js"
productsSocketRouter.get('/', function (req, res) {
    const list = new ProductManager("src/public/products.json")
    const products = list.getProducts()
    return res.status(200).render("realTimeProducts", { products })
})
export function functionSocketServer(socketServer) {
    socketServer.on("connection", (socket) => {
        console.log("cliente conectado")
        const list = new ProductManager("src/public/products.json")
        socket.on("msg_front_to_back", async (data) => {
            try {
                const { title, description, price, thumbnails, code, stock } = data.data
                socket.emit("newProduct_to_front", await list.addProduct(title, description, price, thumbnails, code, stock), list.getProducts())
            } catch (e) {
                console.log(e)
                socket.emit("newProduct_to_front", { status: "failure", message: "something went wrong :(", data: {} })
            }
        })
        socket.emit("msg_back_to_front_products", list.getProducts())
        socket.on("msg_front_to_back_delete_product", async (product) => {
            await list.deleteProduct(product.id)
            socket.emit("msg_front_to_back_deleted", list.getProducts())
        })
    })
}
