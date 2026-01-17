import { response } from '../utils/response.js';
import { getProductService, getAllProductsService, addProductService, updateProductService, deleteProductService, getLowStockProductsService } from '../service/productService.js';

export const getProduct = async (req, res) => {
    try {
        const sno = req.query.sno;
        const result = await getProductService(sno);
        if(result.status === 200) {
            return res.status(200).send(response('SUCCESS', result.message, result.data));
        }
        else {
            return res.status(result.status).send(response('FAILED', result.message, null));
        }
    }
    catch(err) {
        return res.status(500).send(response('FAILED', err.message, null));
    }
}

export const getAllProducts = async(req, res) => {
    try {
        const result = await getAllProductsService(req.query);
        if(result.status === 200) {
            return res.status(200).send(response('SUCCESS', result.message, result.data));
        }
        else {
            return res.status(result.status).send(response('FAILED', result.message, null));
        }
    }
    catch(err) {
        return res.status(500).send(response('FAILED', err.message, null));
    }
}

export const addProduct = async (req, res) => {
    if(req.user.role !== 'ADMIN') {
        return res.status(401).send(response('FAILED', 'Admin only able to add product!', null));
    }
    try {
        const product = req.body;
        const result = await addProductService(product);
        if(result.status === 201) {
            return res.status(201).send(response('SUCCESS', result.message, result.data));
        }
        else {
            return res.status(result.status).send(response('FAILED', result.message));
        }
    }
    catch(err) {
        return res.status(500).send(response('FAILED', err.message, null));
    }
}

export const updateProduct = async (req, res) => {
    if(req.user.role !== 'ADMIN') {
        return res.status(401).send(response('FAILED', 'Admin only able to update product!', null));
    }
    try {
        const product = req.body;
        
        const result = await updateProductService(product._id, product);
        if(result.status === 200) {
            return res.status(200).send(response('SUCCESS', result.message, result.data));
        }
        else {
            return res.status(result.status).send(response('FAILED', result.message));
        }
    }
    catch(err) {
        return res.status(500).send(response('FAILED', err.message, null));
    }
}

export const deleteProduct = async (req, res) => {
    if(req.user.role !== 'ADMIN') {
        return res.status(401).send(response('FAILED', 'Admin only able to delete product!', null));
    }
    try {        
        const result = await deleteProductService(req.body._id);
        if(result.status === 200) {
            return res.status(200).send(response('SUCCESS', result.message, result.data));
        }
        else {
            return res.status(result.status).send(response('FAILED', result.message));
        }
    }
    catch(err) {
        return res.status(500).send(response('FAILED', err.message, null));
    }
}

export const getLowStockProducts = async (req, res) => {
  try {
    const result = await getLowStockProductsService();
    if (result.status === 200) {
      return res.status(200).send(response('SUCCESS', result.message, result.data));
    } else {
      return res.status(result.status).send(response('FAILED', result.message, null));
    }
  } catch (err) {
    return res.status(500).send(response('FAILED', err.message, null));
  }
};
