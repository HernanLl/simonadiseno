const path = require("path");
const express = require("express");
const fs = require("fs");
const app = express();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");
require("dotenv").config();
const { sendEmail } = require("./config/nodemailer");
const cloudinary = require("cloudinary").v2;

//multer configuration
const configMulter = require("./config/multer");
const upload = configMulter(__dirname);

//controller methods
const {
  getProducts,
  addProduct,
  deleteProduct,
  editProduct,
  getProductById,
  getUser,
} = require("./controller");

//Server settings
app.use(express.static(path.join(__dirname, "static")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

function security(req, res, next) {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.substring(7);
    if (!token)
      res.status(403).json({ message: "Debe proporcionar un token de acceso" });
    try {
      jwt.verify(token, process.env.SECRET);
      next();
    } catch (err) {
      res.status(403).end({ message: "Token de acceso incorrecto" });
    }
  } else {
    res.status(403).end({ message: "No proporciono credenciales" });
  }
}

app.post("/login", async (req, res) => {
  const { name, password } = req.body;
  const user = await getUser(name);
  if (!user)
    res.status(403).json({ message: "No existe un usuario con ese nombre" });
  if (bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign({}, process.env.SECRET);
    res.status(200).json({ token });
  } else {
    res.status(403).json({ message: "Contraseña incorrecta" });
  }
});

//endpoints
app.post("/sendemail", async (req, res) => {
  const { body } = req;
  if (body) {
    const { name, phone, email, message } = body;
    if (!name || (!phone && !email) || !message) {
      res
        .status(400)
        .json({ status: 400, message: "Debe completar todos los campos" });
    }
    try {
      sendEmail(name, phone, email, message);
      res.status(200).json({ status: 200, message: "Email enviado con exito" });
    } catch (err) {
      res.status(500).json({
        status: 500,
        message: "Ocurrio un error, no se pudo enviar el email.",
      });
    }
  }
});
app.get("/products", async (_, res) => {
  const products = await getProducts();
  res.json({ products });
});
app.post("/product", security, upload.single("image"), async (req, res) => {
  const { name, price, category } = req.body;
  let filename = null;
  if (req.file) {
    const _path = path.join(__dirname, "uploads", req.file.filename);
    cloudinary.uploader.upload(_path, async (err, result) => {
      fs.unlinkSync(_path);
      if (err) {
        res
          .status(500)
          .json({ message: "Error al subir la imagen, intente mas tarde" });
      } else {
        if (!price || !category) {
          res.status(400).json({ message: "Debe ingresar todos los campos" });
        } else if (category.length > 255) {
          res.status(400).json({ message: "Campos demasiado largos" });
        } else {
          const { id } = await addProduct(
            name ? name : "",
            price,
            category,
            result.secure_url
          );
          res.status(200).json({
            id,
            url: result.secure_url,
            message: "Producto agregado correctamente",
          });
        }
      }
    });
  }
});
app.delete("/product/:id", security, async (req, res) => {
  const { id } = req.params;
  try {
    let result = await getProductById(id);
    if (result && result.rows) {
      const product = result.rows[0];
      let sub = product.url.substring(product.url.indexOf("upload") + 7);
      sub = sub.substring(sub.indexOf("/") + 1);
      sub = sub.substring(0, sub.indexOf("."));
      cloudinary.uploader.destroy(sub, (result) => console.log(result));
    }
    let erased = await deleteProduct(id);
    if (erased) res.status(200).json({ message: "Eliminacion completa" });
    else res.status(400).json({ message: "Id ingresado incorrecto" });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ message: "Error en el servidor, intente mas tarde" });
  }
});
app.put("/product/:id", security, async (req, res) => {
  const { id } = req.params;
  const { name, price, category } = req.body;
  try {
    let edit = await editProduct(id, name ? name : "", price, category);
    if (edit) res.status(200).json({ message: "Edicion completa" });
    else res.status(400).json({ message: "Id ingresado incorrecto" });
  } catch (e) {
    res
      .status(500)
      .json({ message: "Error en el servidor, intente mas tarde" });
  }
});

app.listen(process.env.PORT, () => {
  console.log("Server on port " + process.env.PORT);
});
