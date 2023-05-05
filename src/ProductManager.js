import fs from "fs"
import { newMessage } from "./utils.js"
export class ProductManager {
    constructor(path) {
        if (!fs.existsSync(path)) {
            fs.writeFileSync(path, "[]")
        }
        this.path = path
        this.products = JSON.parse(fs.readFileSync(path, "utf-8"))
    }
    async addProduct(title, description, price, thumbnail, code, stock) {
        let product = { title, description, price, thumbnail, code, stock }
        let maxId = JSON.stringify(this.products.length)
        let id = maxId
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
            return newMessage("failure", "Error, data is incomplete please provide more data", "")
        } else {
            this.products.push({ ...product, id: id, status: true })
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2))
            const lastAdded = this.products[this.products.length - 1]
            return newMessage("success", "Added successfully", lastAdded)
        }
    }
    async updateProduct(id, propsReceivedToUpdate) {
        let productToUpdate = this.getProductById(id).data
        let isArray = propsReceivedToUpdate.length !== undefined
        const messages = []
        if (!productToUpdate || isArray) {
            return newMessage("failure", "The product was not found or is an Array", "")
        }
        let propToUpdateFound = []
        let i = 0
        for (const propRecieved in propsReceivedToUpdate) {
            if (propRecieved === "id") {
                messages.push(" and You cannot change the id")
                continue
            }
            for (const propProduct in productToUpdate) {
                if (propProduct === propRecieved) {
                    productToUpdate[propProduct] = propsReceivedToUpdate[propRecieved]
                    propToUpdateFound[i] = true
                    break
                }
                propToUpdateFound[i] = false
            }
            i++
        }
        const valuesToUpdate=Object.keys(propsReceivedToUpdate)
        console.log(valuesToUpdate)
        if (propToUpdateFound.some(element => element === false)) {
            const indexFalse = []
            propToUpdateFound.forEach((el, i) => {
                if (el === false) {
                    indexFalse.push(` ${i + 1} (${valuesToUpdate[i]}) `)
                }
            })
            messages.push(`,but The props Number: ${indexFalse} were provided incorrectly`)
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
        if (!productToDelete) { return this.getProductById(id)}
        let positionProductToDelete = this.products.indexOf(productToDelete)
        this.products.splice(positionProductToDelete, 1)
        const updateIds = () => {
            this.products.forEach((pro) => {
                let positionProduct = this.products.indexOf(pro)
                pro.id = JSON.stringify(positionProduct)
            })
        }
        if (this.products.length > 0) {
            updateIds()
        }
        await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2))
        return newMessage("success", "Deleted successfully", productToDelete)
    }
}
