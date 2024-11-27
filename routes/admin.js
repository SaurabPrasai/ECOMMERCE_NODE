const uploadOnCloudinary = require("../middleware/cloudinary");
const { requireAuth } = require("../middleware/requireAuth");
const router = require("express").Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");
const Product = require("../models/product");

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.render("home", {
      title: "Home Page",
      products,
      user: req.session.userId,
    });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

router.get("/admin", requireAuth, async(req, res) => {
  try {
    const products=await Product.find({userId:req.session.userId})
    res.render("admin/adminProduct", { title: "Admin Page",products });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

router.get("/add-product", requireAuth, (req, res) => {
  res.render("admin/addProduct", { title: "Add Product" });
});

router.post(
  "/add-product",
  upload.single("file"),
  requireAuth,
  async (req, res) => {
    try {
      const url = await uploadOnCloudinary(req.file.path);
      if (url) {
        fs.unlinkSync(req.file.path);
      }
      const product = new Product({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        image: url,
        userId: req.session.userId,
      });
      await product.save();
      return res.status(302).redirect("/");
    } catch (error) {
      res.status(500).json({ error: "Server Error" });
    }
  }
);

// get single product
router.get("/product/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.render("product", {
      title: product.name,
      product,
      user: req.session.userId,
    });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

// delete product
router.get("/delete/:id", requireAuth, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(302).redirect("/");
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

// edit product
router.get("/edit/:id", requireAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.render("admin/editProduct", { title: "Edit Product", product });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

// save edited product
router.post("/edit/:id", upload.single("file"), requireAuth, async (req, res) => {
  try {
    let url = req.body.oldImage;
    if (req.file) {
      url = await uploadOnCloudinary(req.file.path);
      if (url) {
        fs.unlinkSync(req.file.path);
      }
    }
    await Product.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      image: url,
    });
    res.status(302).redirect("/");
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});


module.exports = router;
