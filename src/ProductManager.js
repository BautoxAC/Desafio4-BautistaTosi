import fs from "fs"
import { newMessage } from "./utils.js"
import { v4 as uuidv4 } from 'uuid'

export class ProductManager {
    constructor(path) {
        if (!fs.existsSync(path)) {
            fs.writeFileSync(path, "[]")
        }
        this.path = path
        this.products = JSON.parse(fs.readFileSync(path, "utf-8"))
    }
    async addProduct(title, description, price, thumbnails, code, stock) {
        let product = { title, description, price: Number(price), thumbnails: [thumbnails], code, stock: Number(stock) }
        let id = uuidv4()
        while (this.products.some(pro => pro.id === id)) {
            id = uuidv4()
        }
        let addPro = true
        const productValues = Object.values(product)
        for (const prop of productValues) {
            if (!prop) {
                addPro = false
                break
            }
        }
        let codeVerificator = this.products.find((product) => product.code === code)
        if (codeVerificator) {
            return newMessage("failure", "Error, the code is repeated", "")
        } else if (!addPro) {
            return newMessage("failure", "Error, data is incomplete please provide more data and the stock and the price must be numbers", "")
        } else {
            this.products.push({ ...product, id: id, status: true })
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2))
            const lastAdded = this.products[this.products.length - 1]
            return newMessage("success", "Product added successfully", lastAdded)
        }
    }
    async updateProduct(id, propsReceivedToUpdate) {
        let productToUpdate = this.getProductById(id).data
        const messages = []
        if (!productToUpdate || Array.isArray(propsReceivedToUpdate)) {
            return newMessage("failure", "The product was not found or the data is an Array", "")
        }
        let propToUpdateFound = []
        let i = 0
        for (const propRecieved in propsReceivedToUpdate) {
            propToUpdateFound[i] = false
            if (propRecieved === "id" || propRecieved === "status") {
                messages.push(` you cannot change the ${propRecieved}`)
            } else if (propRecieved === "thumbnails" && !Array.isArray(propRecieved)) {
                productToUpdate.thumbnails.push(propsReceivedToUpdate[propRecieved])
                propToUpdateFound[i] = true
            } else if (propRecieved === "code" && this.products.find(pro => pro.code === propsReceivedToUpdate[propRecieved])) {
                messages.push(" you cannot make the code iqual to other product")
            } else if ((propRecieved === "price" || propRecieved === "stock") && typeof (propsReceivedToUpdate[propRecieved]) !== "number") {
                messages.push(` the ${propRecieved} must be Number`)
            } else if (typeof (propsReceivedToUpdate[propRecieved]) !== "string" && (propRecieved === "title" || propRecieved === "code" || propRecieved === "description" || propRecieved === "category")) {
                messages.push(` the ${propRecieved} must be String`)
            } else {
                for (const propProduct in productToUpdate) {
                    if (propProduct === propRecieved) {
                        productToUpdate[propProduct] = propsReceivedToUpdate[propRecieved]
                        propToUpdateFound[i] = true
                        break
                    }
                }
            }
            i++
        }
        const valuesToUpdate = Object.keys(propsReceivedToUpdate)
        if (propToUpdateFound.some(element => element === false)) {
            const indexFalse = []
            propToUpdateFound.forEach((el, i) => {
                if (el === false) {
                    indexFalse.push(` ${i + 1} (${valuesToUpdate[i]}) `)
                }
            })
            messages.push(`The props Number: ${indexFalse} were provided incorrectly`)
        }
        await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2))
        return newMessage("success", "Updated successfully" + (messages).toString(), productToUpdate)
    }
    getProducts() {
        return this.products
    }
    getProductById(id) {
        let productFindId = this.products.find((product) => product.id === id)
        if (productFindId) {
            return newMessage("success", "Found successfully", productFindId)
        } else {
            return newMessage("failure", "Not Found", "")
        }
    }
    async deleteProduct(id) {
        let productToDelete = this.getProductById(id).data
        if (!productToDelete) { return this.getProductById(id) }
        let positionProductToDelete = this.products.indexOf(productToDelete)
        this.products.splice(positionProductToDelete, 1)
        await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2))
        return newMessage("success", "Deleted successfully", productToDelete)
    }
}
export class CartManager {
    constructor(path) {
        if (!fs.existsSync(path)) {
            fs.writeFileSync(path, "[]")
        }
        this.path = path
        this.carts = JSON.parse(fs.readFileSync(path, "utf-8"))
    }
    getCartById(id) {
        let cartFindId = this.carts.find((cart) => cart.idCarrito === id)
        if (cartFindId) {
            return newMessage("success", "Found successfully", cartFindId.productos)
        } else {
            return newMessage("failure", "Not Found", "")
        }
    }
    async addCart() {
        let id = uuidv4()
        while (this.carts.some(pro => pro.id === id)) {
            id = uuidv4()
        }
        this.carts.push({ productos: [], idCarrito: id })
        await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2))
        const lastAdded = this.carts[this.carts.length - 1]
        return newMessage("success", "Cart added successfully", lastAdded)
    }
    async addProduct(idCart, idProduct) {
        const listProducts = new ProductManager("src/public/products.json");
        const cart = this.carts.find(cart => cart.idCarrito === idCart)
        if (!cart) {
            return newMessage("failure", "cart not found", "")
        }
        const product = listProducts.getProductById(idProduct).data
        if (!product) {
            return newMessage("failure", "product not found", "")
        }
        const productRepeated = cart.productos.find(pro => pro.idProduct === product.id)
        let messageReturn = {}
        if (productRepeated) {
            const positionProductRepeated = cart.productos.indexOf(productRepeated)
            if (cart.productos[positionProductRepeated].quantity < product.stock) {
                cart.productos[positionProductRepeated].quantity++
                messageReturn = newMessage("success", "Product repeated: quantity added correctly", cart)
            } else {
                messageReturn = newMessage("failure", "Product repeated: quantity is iqual to the stock", cart)
            }
        } else {
            cart.productos.push({ idProduct: product.id, quantity: 1 })
            messageReturn = newMessage("success", "Product added correctly", cart)
        }
        await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2))
        return messageReturn
    }
}