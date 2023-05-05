import express from "express"
import { ProductManager } from "../ProductManager.js"
import { newMessage } from "../utils.js"
export const cartsRouter = express.Router()
const list = new ProductManager("src/public/carts.json")
cartsRouter.get("/", (req, res) => {
    const carts = list.getProducts()
    const { limit } = req.query
    const cartsLimited = carts.filter((pro) => Number(pro.id) < limit)
    const messageCartsLimited = newMessage("success","listado de carritos limitados", cartsLimited)
    const messageAllCarts = newMessage("success","listado de carritos", list.getProducts())
    return res.status(200).json(Number(limit) ? messageCartsLimited : messageAllCarts)
})
cartsRouter.get("/:pid", (req, res) => {
    const Id = req.params.pid
    return res.status(200).json(newMessage("success","carrito por id", list.getProductById(Id)))
})