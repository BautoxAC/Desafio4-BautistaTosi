import fs from "fs"
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
            console.log("Error, the code is repeated")
        } else if (!addPro) {
            console.log("Error, data is incomplete please provide more data")
        } else {
            this.products.push({ ...product, id: id })
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2))
        }
    }
    async updateProduct(id, ToUpd) {
        let productToUpd = this.getProductById(id)
        let isArray = ToUpd.length !== undefined
        if (!productToUpd || isArray) {
            console.log("Bad argument")
            return
        }
        let ToUpdateFound = []
        let i = 0
        for (const propArg in ToUpd) {
            if (propArg === "id") {
                console.log("You cannot change the id")
                continue
            }
            for (const propProduct in productToUpd) {
                if (propProduct === propArg) {
                    productToUpd[propProduct] = ToUpd[propArg]
                    ToUpdateFound[i] = true
                    break
                }
                ToUpdateFound[i] = false
            }
            i++
        }
        if (ToUpdateFound.some(el => el === false)) {
            const indexFalse = []
            ToUpdateFound.forEach((el, i) => {
                if (el === false) {
                    indexFalse.push(i)
                }
            })
            console.log(`The props Number: ${indexFalse} were provided incorrectly`)
        }
        console.log(productToUpd)
        await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2))
    }
    getProducts() {
        return this.products
    }
    getProductById(id) {
        let productFindId = this.products.find((product) => product.id === id)
        if (productFindId) {
            return productFindId
        } else {
            console.log("Not Found")
            return {status:"failure",message:"producto no encontrado",data: "Not Found"}
        }
    }
    async deleteProduct(id) {
        let productToDelete = this.getProductById(id)
        if (!productToDelete) { return }
        let positionProduct = this.products.indexOf(productToDelete)
        this.products.splice(positionProduct, 1)
        const updateIds = () => {
            this.products.forEach((pro) => {
                let positionProduct = this.products.indexOf(pro)
                pro.id = JSON.stringify(positionProduct)
            })
        }
        console.log(this.products)
        if (this.products.length > 0) {
            updateIds()
        }
        await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2))
    }
}
