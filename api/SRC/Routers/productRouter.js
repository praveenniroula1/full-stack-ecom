import express from "express";
import multer from "multer";
import {
  insertProduct,
  getProductById,
  getAllProducts,
  updateProductById,
  deleteProductById,
  getFeaturedProducts,
  searchProducts
} from "../models/productModel.js";
import { auth } from "../Auth/auth.js";

const router = express.Router();

// Setup multer for validation and upload destination
const fileUploadDestination = "upload";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, fileUploadDestination);
  },
  filename: (req, file, cb) => {
    const fullFileName = Date.now() + "-" + file.originalname;
    cb(null, fullFileName);
  },
});

const upload = multer({ storage });

// Route to handle product creation with image uploads
router.post("/", upload.array("images", 5), async (req, res) => {
  try {
    const files = req.files;
    if (files.length) {
      const images = files.map((img) => img.path.slice(6)); // Adjust this slice according to your directory structure
      req.body.images = images;
    }
    req.body.price = parseFloat(req.body.price);

    const newProduct = await insertProduct(req.body);
    if (newProduct) {
      res.status(201).json({
        success: true,
        message: "Product created successfully",
        product: newProduct,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Product creation failed",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


router.get("/search", async (req, res) => {
  const { query } = req.query;

  try {
    const searchResults = await searchProducts(query);
    res.json(searchResults);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Route to get all products with pagination
router.get("/", async (req, res) => {
  const { page = 1, limit = 3 } = req.query;

  try {
    const result = await getAllProducts(parseInt(page), parseInt(limit));
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Route to get featured products
router.get("/featured", async (req, res) => {
  try {
    const featuredProducts = await getFeaturedProducts();
    res.json(featuredProducts);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await getProductById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Route to update a product by ID with image uploads
router.put("/:id", auth, upload.array("images", 5), async (req, res) => {
  try {
    const files = req.files;
    if (files.length) {
      const images = files.map((img) => img.path.slice(6));
      req.body.images = images;
    }

    const updatedProduct = await updateProductById(req.params.id, req.body);
    if (updatedProduct) {
      res.json({
        success: true,
        message: "Product updated successfully",
        product: updatedProduct,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.delete("/:id",  async (req, res) => {
  try {
    const deletedProduct = await deleteProductById(req.params.id);
    if (deletedProduct) {
      res.json({
        success: true,
        message: "Product deleted successfully",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
