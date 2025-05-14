const jwt = require("jsonwebtoken");
const authorizationschema = require("../models/authorization");

const protect = async (req, res, next) => {
const token = req.headers.authorization?.split(" ")[1];
if (!token) return res.status(401).json({ message: "Not authorized" });

try {
const decoded = jwt.verify(token, "secret_key");
req.user = await authorizationschema.findById(decoded.id);
next();
} catch (err) {
res.status(401).json({ message: "Invalid token" });
}
};

module.exports = protect;

