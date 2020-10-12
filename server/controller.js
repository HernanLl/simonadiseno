const { Pool } = require("pg");
const crypto = require("crypto");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
pool.query(
  "create table if not exists users(name varchar(255) primary key,password varchar(255))",
  (err, res) => {}
);
pool.query(
  "create table if not exists products(id varchar(255) primary key,name varchar(255),price float, category varchar(255),url varchar(255))",
  (err, res) => {}
);
const insertQuery =
  "insert into products(id,name,price,category,url) values($1,$2,$3,$4,$5);";
const deleteQuery = "delete from products where id=$1";
const findQuery = "select * from products where id=$1";
const updateQuery =
  "update products set name=$2, price=$3,category=$4, url=$5 where id=$1;";
const findUser = "select * from users where name=$1;";

async function getProducts() {
  try {
    const res = await pool.query("select * from products");
    if (res) return res.rows;
    return [];
  } catch {
    return [];
  }
}
async function addProduct(name, price, category, url) {
  const id = crypto.randomBytes(20).toString("hex");
  await pool.query(insertQuery, [id, name, price, category, url]);
  return { id };
}
async function editProduct(id, name, price, category) {
  try {
    const res = await pool.query(findQuery, [id]);
    if (res.rows.length > 0) {
      const product = res.rows[0];
      await pool.query(updateQuery, [
        id,
        name ? name : product.name,
        price ? price : product.price,
        category ? category : product.category,
        product.url,
      ]);
      return true;
    }
    return false;
  } catch (err) {
    return false;
  }
}
async function deleteProduct(id) {
  try {
    await pool.query(deleteQuery, [id]);
    return true;
  } catch (err) {
    return false;
  }
}
async function getProductById(id) {
  try {
    const res = await pool.query(findQuery, [id]);
    return res;
  } catch (err) {
    return null;
  }
}
async function getUser(name) {
  try {
    const res = await pool.query(findUser, [name]);
    if (res && res.rows.length > 0) {
      return res.rows[0];
    }
    return null;
  } catch (err) {
    return null;
  }
}
module.exports = {
  getProductById,
  getProducts,
  addProduct,
  deleteProduct,
  editProduct,
  getUser,
};
