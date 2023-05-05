import express from "express"
import { ProductManager } from "../ProductManager.js"
export const productsRouter = express.Router()
const list = new ProductManager("src/public/products.json")
import { newMessage } from "../utils.js"
productsRouter.get("/", (req, res) => {
    const products = list.getProducts()
    const { limit } = req.query
    const productsLimited = products.filter((pro) => Number(pro.id) < limit)
    const messageProductsLimited = newMessage("success","listado de productos limitados", productsLimited)
    const messageAllProducts = newMessage("success","listado de productos", list.getProducts())
    return res.status(200).json(Number(limit) ? messageProductsLimited : messageAllProducts)
})
productsRouter.get("/:pid", (req, res) => {
    const Id = req.params.pid
    return res.status(200).json(newMessage("success","producto por id", list.getProductById(Id)))
})
productsRouter.post("/", async(req, res) =>  {
    const newProduct = req.body
    const { title, description, price, thumbnail, code, stock } = newProduct
    return res.status(200).json(await list.addProduct(title, description, price, thumbnail, code, stock))
})
productsRouter.put("/:pid", async(req, res) => {
    const Id = req.params.pid
    const productPropsToUpdate = req.body
    return res.status(200).json(newMessage(await list.updateProduct(Id,productPropsToUpdate)))
})