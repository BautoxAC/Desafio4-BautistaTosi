import multer from "multer"
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + "/public")
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
})

export const uploader = multer({ storage })

import path from "path"
import { fileURLToPath } from "url"
export const __filename = fileURLToPath(import.meta.url)
export const __dirname = path.dirname(__filename)

export function newMessage(status,message,data) {
  return {status:status,message:message,data:data}
}