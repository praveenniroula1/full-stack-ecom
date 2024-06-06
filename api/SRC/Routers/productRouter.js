import express from 'express';
import multer from 'multer';
import { insertProduct, getProductById, getAllProducts, updateProductById, deleteProductById } from '../models/productModel.js';
import { auth } from '../Auth/auth.js';

const router = express.Router();

const fileUploadDestination = 'public/img/products';
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, fileUploadDestination);
  },
  filename: (req, file, cb) => {
    const fullFileName = Date.now() + '-' + file.originalname;
    cb(null, fullFileName);
  },
});

const upload = multer({ storage });

router.post('/', upload.array('images', 5), async (req, res) => {
  try {
    const files = req.files;
    if (files.length) {
      const images = files.map((img) => img.path.replace('public', ''));
      req.body.images = images;
    }

    req.body.price = parseFloat(req.body.price);

    const newProduct = await insertProduct(req.body);
    if (newProduct) {
      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        product: newProduct,
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Product creation failed',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await getProductById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const updatedProduct = await updateProductById(req.params.id, req.body);
    if (updatedProduct) {
      res.json({
        success: true,
        message: 'Product updated successfully',
        product: updatedProduct,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedProduct = await deleteProductById(req.params.id);
    if (deletedProduct) {
      res.json({
        success: true,
        message: 'Product deleted successfully',
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Product not found',
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
