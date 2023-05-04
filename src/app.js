import express from "express"
/* import { ProductManager } from "../ProductManager.js" */
import { cartsRouter } from "./routes/carts.router.js"
import { productsRouter } from "./routes/products.router.js"
import { __dirname } from "./utils.js"
import path from "path"
const app = express()
const port = 8080

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname,"public")))

app.use("/products", productsRouter)
app.use("/carts", cartsRouter)

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})

app.get("*", (req, res) => {
    return res.status(404).json({
        status: "error", msg: "no encontrado", data: ""
    })
})