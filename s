warning: in the working copy of 'src/public/products.json', LF will be replaced by CRLF the next time Git touches it
[1mdiff --git a/src/ProductManager.js b/src/ProductManager.js[m
[1mindex 3680492..8a745aa 100644[m
[1m--- a/src/ProductManager.js[m
[1m+++ b/src/ProductManager.js[m
[36m@@ -11,7 +11,7 @@[m [mexport class ProductManager {[m
         this.products = JSON.parse(fs.readFileSync(path, "utf-8"))[m
     }[m
     async addProduct(title, description, price, thumbnails, code, stock) {[m
[31m-        let product = { title, description, price: Number(price), thumbnails: thumbnails!==undefined && [thumbnails], code, stock: Number(stock) }[m
[32m+[m[32m        let product = { title, description, price: Number(price), thumbnails: thumbnails !== undefined && [thumbnails], code, stock: Number(stock) }[m
         let id = uuidv4()[m
         while (this.products.some(pro => pro.id === id)) {[m
             id = uuidv4()[m
[36m@@ -46,7 +46,7 @@[m [mexport class ProductManager {[m
             return newMessage("failure", "The product was not found or the data is an Array", "")[m
         }[m
         const propToUpdateFound = valuesRecieved.map((prop) => {[m
[31m-            const status = valuesToUpdate.some((propUpdate) => prop[0] === propUpdate && prop[0] !== "id" && prop[0] !== "status") [m
[32m+[m[32m            const status = valuesToUpdate.some((propUpdate) => prop[0] === propUpdate && prop[0] !== "id" && prop[0] !== "status")[m
             return { entries: { key: prop[0], value: prop[1] }, status: status, type: typeof (prop[1]) }[m
         })[m
         for (let i = 0; i < propToUpdateFound.length; i++) {[m
[36m@@ -55,7 +55,7 @@[m [mexport class ProductManager {[m
             const sameKey = dataTypes.find(type => type.key === prop.entries.key)[m
             if (prop.status && sameTypeAndKey) {[m
                 if (prop.entries.key === "thumbnails") {[m
[31m-                    const thumbnailRepeated=productToUpdate.thumbnails.some(thumbnail=>thumbnail===prop.entries.value)[m
[32m+[m[32m                    const thumbnailRepeated = productToUpdate.thumbnails.some(thumbnail => thumbnail === prop.entries.value)[m
                     thumbnailRepeated ? messages.push(` The prop Number: ${i + 1} (${prop.entries.key}) has a value repeated`) : productToUpdate.thumbnails.push(prop.entries.value)[m
                 } else {[m
                     productToUpdate[prop.entries.key] = prop.entries.value[m
[1mdiff --git a/src/app.js b/src/app.js[m
[1mindex 439115b..3ab1b34 100644[m
[1m--- a/src/app.js[m
[1m+++ b/src/app.js[m
[36m@@ -7,7 +7,7 @@[m [mimport { Server } from "socket.io"[m
 import handlebars from "express-handlebars"[m
 import { productRouterHtml } from "./routes/productRouterHtml.router.js"[m
 import { productsSocketRouter } from "./routes/productsSocketRouter.router.js"[m
[31m-import { ProductManager } from "./ProductManager.js"[m
[32m+[m[32mimport { functionSocketServer } from "./routes/productsSocketRouter.router.js"[m
 const app = express()[m
 const port = 8080[m
 [m
[36m@@ -33,20 +33,11 @@[m [mapp.use("/realtimeproducts", productsSocketRouter)[m
 const httpServer = app.listen(port, () => {[m
     console.log(`Example app listening on port http://localhost:${port}`)[m
 })[m
[32m+[m
 const socketServer = new Server(httpServer)[m
[31m-socketServer.on("connection", (socket) => {[m
[31m-    console.log("cliente conectado")[m
[31m-    const list = new ProductManager("src/public/products.json")[m
[31m-    socket.on("msg_front_to_back", async (data) => {[m
[31m-        const { title, description, price, thumbnails, code, stock } = data.data[m
[31m-        socket.emit("newProduct_to_front",await list.addProduct(title, description, price, thumbnails, code, stock ),list.getProducts())[m
[31m-    })[m
[31m-    socket.emit("msg_back_to_front_products",list.getProducts())[m
[31m-    socket.on("msg_front_to_back_delete_product", async(product)=>{[m
[31m-        await list.deleteProduct(product.id)[m
[31m-        socket.emit("msg_front_to_back_deleted",list.getProducts())[m
[31m-    })[m
[31m-})[m
[32m+[m
[32m+[m[32m// Execute SocketSever in Rute /realtimeserver[m
[32m+[m[32mfunctionSocketServer(socketServer)[m
 [m
 app.get("*", (req, res) => {[m
     return res.status(404).json({[m
[1mdiff --git a/src/public/js/indexSocket.js b/src/public/js/indexSocket.js[m
[1mindex 480445e..af75e7e 100644[m
[1m--- a/src/public/js/indexSocket.js[m
[1m+++ b/src/public/js/indexSocket.js[m
[36m@@ -1,4 +1,3 @@[m
[31m-//FRONT[m
 const socket = io()[m
 const code = document.getElementById("code")[m
 const title = document.getElementById("title")[m
[36m@@ -11,6 +10,7 @@[m [mfunction renderProducts(products) {[m
     list.innerHTML = ""[m
     for (let i = 0; i < products.length; i++) {[m
         const product = products[i][m
[32m+[m[32m        const imgs = product.thumbnails.map((thumbnail) => (`<img src="${thumbnail}">`))[m
         list.innerHTML += `<li>[m
         <h2>Nombre: ${product.title}</h2>[m
         <p>Descripcion: ${product.description}</p>[m
[36m@@ -18,7 +18,7 @@[m [mfunction renderProducts(products) {[m
         <p>Precio: ${product.price}</p>[m
         <p>Codigo: ${product.code}</p>[m
         <p>Id: ${product.id}</p>[m
[31m-        <p>Img: ${product.thumbnails}</p>[m
[32m+[m[32m        <p>Img: ${imgs}</p>[m
         <button id="${product.id}"><img src="http://localhost:8080/assets/quitar.png" alt="Eliminar producto"[m
         title="Eliminar producto"></button>[m
         </li>`[m
[36m@@ -31,12 +31,11 @@[m [mfunction renderProducts(products) {[m
         })[m
     }[m
 }[m
[31m-document.getElementById("buttonSumbit").addEventListener("click", (e) => {[m
[31m-    e.preventDefault()[m
[32m+[m[32mdocument.getElementById("buttonSumbit").addEventListener("click", () => {[m
     const data = { title: title.value, description: description.value, price: Number(price.value), thumbnails: file?.files[0]?.name ? "http://localhost:8080/" + file?.files[0]?.name : undefined, code: code.value, stock: Number(stock.value) }[m
     socket.emit("msg_front_to_back", { data })[m
 })[m
[31m-socket.on("newProduct_to_front", (product,products) => {[m
[32m+[m[32msocket.on("newProduct_to_front", (product, products) => {[m
     if (product.status === "failure") {[m
         alert(product.message)[m
     } else {[m
[1mdiff --git a/src/public/products.json b/src/public/products.json[m
[1mindex 6786ce4..f6a9414 100644[m
[1m--- a/src/public/products.json[m
[1m+++ b/src/public/products.json[m
[36m@@ -1,13 +1,11 @@[m
 [[m
   {[m
[31m-    "title": "HeyYou",[m
[32m+[m[32m    "title": "dasasd",[m
     "id": "4d11339f-18cc-441e-95cc-7c5c1c2ad01b",[m
     "code": "dsfsdf",[m
     "stock": 1,[m
     "price": 23,[m
[31m-    "thumbnails": [[m
[31m-      "ads"[m
[31m-    ],[m
[32m+[m[32m    "thumbnails": [],[m
     "description": "foto de unos jeans azules",[m
     "status": true[m
   },[m
[36m@@ -77,7 +75,9 @@[m
     "code": "vestid76os",[m
     "stock": 11,[m
     "price": 50,[m
[31m-    "thumbnails": [],[m
[32m+[m[32m    "thumbnails": [[m
[32m+[m[32m      "http://localhost:8080/assets/Celest.png"[m
[32m+[m[32m    ],[m
     "description": "foto de un vestido celeste",[m
     "status": true[m
   },[m
[36m@@ -110,29 +110,5 @@[m
     "thumbnails": [],[m
     "description": "foto de remera de color azul llamada lightE2",[m
     "status": true[m
[31m-  },[m
[31m-  {[m
[31m-    "title": "producto prueba",[m
[31m-    "description": "Este es un producto prueba",[m
[31m-    "price": 200,[m
[31m-    "thumbnails": [[m
[31m-      "Sin imagen"[m
[31m-    ],[m
[31m-    "code": "a1hj2a3",[m
[31m-    "stock": 25,[m
[31m-    "id": "b1a7343c-33ce-40ca-a676-ca36a48965cb",[m
[31m-    "status": true[m
[31m-  },[m
[31m-  {[m
[31m-    "title": "producto prueba",[m
[31m-    "description": "Este es un producto prueba",[m
[31m-    "price": 200,[m
[31m-    "thumbnails": [[m
[31m-      "http://localhost:8080/Celest.png"[m
[31m-    ],[m
[31m-    "code": "a1hj2a32",[m
[31m-    "stock": 25,[m
[31m-    "id": "995a8ff9-35b7-4349-831e-8e053acbcf13",[m
[31m-    "status": true[m
   }[m
 ][m
\ No newline at end of file[m
[1mdiff --git a/src/routes/products.router.js b/src/routes/products.router.js[m
[1mindex f301f35..f2985de 100644[m
[1m--- a/src/routes/products.router.js[m
[1m+++ b/src/routes/products.router.js[m
[36m@@ -20,10 +20,7 @@[m [mproductsRouter.get("/:pid", (req, res) => {[m
 })[m
 [m
 productsRouter.post("/", uploader.single("file"), async (req, res) => {[m
[31m-    const newProduct = req.body[m
[31m-    newProduct.thumbnail = "http://localhost:8080/" + req.file?.filename[m
[31m-    const { title, description, price, thumbnail, code, stock } = newProduct[m
[31m-    return res.status(200).json(await list.addProduct(title, description, price, thumbnail, code, stock))[m
[32m+[m[32m    res.redirect("/realtimeproducts")[m
 })[m
 [m
 productsRouter.put("/:pid", async (req, res) => {[m
[1mdiff --git a/src/routes/productsSocketRouter.router.js b/src/routes/productsSocketRouter.router.js[m
[1mindex 6d492a7..c4f4049 100644[m
[1m--- a/src/routes/productsSocketRouter.router.js[m
[1m+++ b/src/routes/productsSocketRouter.router.js[m
[36m@@ -1,9 +1,28 @@[m
 import express from "express"[m
 export const productsSocketRouter = express.Router()[m
 import { ProductManager } from "../ProductManager.js"[m
[31m-[m
 productsSocketRouter.get('/', function (req, res) {[m
     const list = new ProductManager("src/public/products.json")[m
     const products = list.getProducts()[m
     return res.status(200).render("realTimeProducts", { products })[m
 })[m
[32m+[m[32mexport function functionSocketServer(socketServer) {[m
[32m+[m[32m    socketServer.on("connection", (socket) => {[m
[32m+[m[32m        console.log("cliente conectado")[m
[32m+[m[32m        const list = new ProductManager("src/public/products.json")[m
[32m+[m[32m        socket.on("msg_front_to_back", async (data) => {[m
[32m+[m[32m            try {[m
[32m+[m[32m                const { title, description, price, thumbnails, code, stock } = data.data[m
[32m+[m[32m                socket.emit("newProduct_to_front", await list.addProduct(title, description, price, thumbnails, code, stock), list.getProducts())[m
[32m+[m[32m            } catch (e) {[m
[32m+[m[32m                console.log(e)[m
[32m+[m[32m                socket.emit("newProduct_to_front", { status: "failure", message: "something went wrong :(", data: {} })[m
[32m+[m[32m            }[m
[32m+[m[32m        })[m
[32m+[m[32m        socket.emit("msg_back_to_front_products", list.getProducts())[m
[32m+[m[32m        socket.on("msg_front_to_back_delete_product", async (product) => {[m
[32m+[m[32m            await list.deleteProduct(product.id)[m
[32m+[m[32m            socket.emit("msg_front_to_back_deleted", list.getProducts())[m
[32m+[m[32m        })[m
[32m+[m[32m    })[m
[32m+[m[32m}[m
[1mdiff --git a/src/views/index.handlebars b/src/views/index.handlebars[m
[1mindex 0ee308a..20cfdb8 100644[m
[1m--- a/src/views/index.handlebars[m
[1m+++ b/src/views/index.handlebars[m
[36m@@ -9,7 +9,7 @@[m
             <p>Precio: {{this.price}}</p>[m
             <p>Codigo: {{this.code}}</p>[m
             <p>Id: {{this.id}}</p>[m
[31m-            <p>Img: {{this.thumbnails}}</p>[m
[32m+[m[32m            <p>Img: {{#each this.thumbnails}}<img src="{{this}}">{{/each}}</p>[m
         </li>[m
         {{/each}}[m
     </ol>[m
[1mdiff --git a/src/views/realTimeProducts.handlebars b/src/views/realTimeProducts.handlebars[m
[1mindex da7d4bd..b33f036 100644[m
[1m--- a/src/views/realTimeProducts.handlebars[m
[1m+++ b/src/views/realTimeProducts.handlebars[m
[36m@@ -9,32 +9,32 @@[m
             <p>Precio: {{this.price}}</p>[m
             <p>Codigo: {{this.code}}</p>[m
             <p>Id: {{this.id}}</p>[m
[31m-            <p>Img: {{this.thumbnails}}</p>[m
[32m+[m[32m            <p>Img: {{#each this.thumbnails}}<img src="{{this}}">{{/each}}</p>[m
             <button id="{{this.id}}"><img src="http://localhost:8080/assets/quitar.png" alt="Eliminar producto"[m
                     title="Eliminar producto"></button>[m
         </li>[m
         {{/each}}[m
     </ol>[m
[31m-    <form action=""> [m
[32m+[m[32m    <form action="/api/products" method="post" enctype="multipart/form-data">[m
         <fieldset>[m
             <h2>Nuevo Producto</h2>[m
             <label for="title">Nombre:</label>[m
[31m-            <input type="text" id="title">[m
[32m+[m[32m            <input type="text" id="title" name="title">[m
             <hr>[m
             <label for="description">Descripicion:</label>[m
[31m-            <input type="text" id="description">[m
[32m+[m[32m            <input type="text" id="description" name="description">[m
             <hr>[m
             <label for="stock">Stock:</label>[m
[31m-            <input type="number" id="stock">[m
[32m+[m[32m            <input type="number" id="stock" name="stock">[m
             <hr>[m
             <label for="price">Precio:</label>[m
[31m-            <input type="number" id="price">[m
[32m+[m[32m            <input type="number" id="price" name="price">[m
             <hr>[m
             <label for="code">Codigo:</label>[m
[31m-            <input type="text" id="code">[m
[32m+[m[32m            <input type="text" id="code" name="code">[m
             <hr>[m
             <label for="file">Imagen del producto:</label>[m
[31m-            <input type="file" id="file">[m
[32m+[m[32m            <input type="file" id="file" name="file">[m
             <hr>[m
             <input type="submit" id="buttonSumbit">[m
         </fieldset>[m
