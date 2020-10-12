const crypto = require("crypto");
function configMulter(dirname) {
  const multer = require("multer");
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, dirname + "/uploads");
    },
    filename: function (req, file, cb) {
      cb(
        null,
        crypto.randomBytes(20).toString("hex") + "-" + file.originalname
      );
    },
  });
  const upload = multer({ storage: storage });
  return upload;
}
module.exports = configMulter;
