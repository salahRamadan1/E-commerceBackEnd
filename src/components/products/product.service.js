import { productModel } from "./product.model.js";
import fs from "fs";
import {
  factoryGetAllDocument,
  factoryGetOneDocumentId,
} from "../../utils/HandlerFactoryEndPoint/handler.factory.js";
import { catchAsyncError } from "../../utils/HandelError/catchError/catchError.js";
import AppError from "../../utils/HandelError/appError/APPERROR.js";
import slugify from "slugify";



const createProduct = catchAsyncError(async (req, res, next) => {
  // **Check for Duplicate Product Name**
  const productOne = await productModel.findOne({ name: req.body.name })
  console.log(req.body);
  if (productOne) {
    // If a product with the same name exists..
    let deleteImageFromUpload = [];
    // ... collect paths of all uploaded images
    req.files.images.forEach((elm) => {
      deleteImageFromUpload.push(elm.destination + '/' + elm.filename)
    })
    deleteImageFromUpload.push(req.files.image[0].destination + '/' + req.files.image[0].filename)
    // ... delete uploaded images
    for (let i = 0; i < deleteImageFromUpload.length; i++) {
      deleteImgs(deleteImageFromUpload[i]) // Call function to delete uploaded images
    }
    return next(new AppError('Document name is duplicate ', 201))// Throw error for duplicate
  }
  // **2. Prepare Product Data**
  // ... assuming `req.files.image` is a single image and `req.files.images` is an array of multiple images
  req.body.image = req.files.image[0].filename;
  let img = [];
  req.files.images.forEach((elm) => {
    img.push(elm.filename)// Add filenames of additional images to an array
  })
  req.body.images = img// Add the array of additional image filenames to the request body
  //   Generate a slug from the product name if it exists
  req.body.name ? (req.body.slug = slugify(req.body.name)) : "";
  // **3. Create and Save Product**
  const Document = new productModel(req.body) // Create a new product object from request body
  Document.priceAfterDiscount = req.body.price - req.body.discount // Calculate discounted price
  await Document.save()// Save the product to the database
  // Assuming `product` is the newly created product object and  Send success message and product object
  res.status(200).json({ message: "success", Document })
});
/****************************************** get all product************************************************/
const getProducts = factoryGetAllDocument(productModel);


/****************************************** get one product************************************************/
const getProduct = factoryGetOneDocumentId(productModel, 'categoryId brandId subCategoryId');




/****************************************** deleteProduct************************************************/
const deleteProduct = catchAsyncError(async (req, res, next) => {
  // Extract the product ID from the request parameters
  const { id } = req.params;
  // Find and delete the product document by its ID
  const Document = await productModel.findByIdAndDelete(id);
  // If the product document was not found, return a not found error

  if (!Document) {
    return next(new AppError("Document not found", 201));
  }

  // Collect all image paths (both single and multiple image scenarios)
  let imagePaths = [];
  imagePaths.push(...Document.images, Document.image);

  // Delete each image file
  for (let i = 0; i < imagePaths.length; i++) {
    deleteImgs(`./src/uploads/product/${imagePaths[i]}`);
  }
  // Send a success response with the deleted document
  res.status(200).json({ message: "success", Document });

});


/******************************************updateProductValue************************************************/
const updateProductValue = catchAsyncError(async (req, res, next) => {
  const { id } = req.body;
  req.body.name ? (req.body.slug = slugify(req.body.name)) : "";


  req.body.priceAfterDiscount = req.body.price - req.body.discount // Calculate discounted price
  let Document = await productModel.findByIdAndUpdate(id, req.body, { new: true })
  res.status(200).json({ message: "success", Document });

});



/******************************************updateOneProductImagesOrImage************************************************/
const updateOneProductImagesOrImage = catchAsyncError(async (req, res, next) => {
  // Extract the product ID from the request body
  const { id } = req.body;
  // Find the product by ID to retrieve its image information

  let getImagepath = await productModel.findById(id)
  // If product not found, delete uploaded files (if any) and return error
  if (!getImagepath) {
    req.files.image ? deleteImgs(req.files.image[0].destination + '/' + req.files.image[0].filename) : ''
    req.files.images ? deleteImgs(req.files.images[0].destination + '/' + req.files.images[0].filename) : ''
    return next(new AppError('product not found', 409))
  }
  // Update single image
  if (req.files.image) {
    // Delete the old image
    deleteImgs(`./src/uploads/product/${getImagepath.image}`)
    // Update the image field in the product document
    req.body.image = req.files?.image[0].filename;
    await productModel.findByIdAndUpdate(id, req.body)
    res.status(200).json({ message: "success" });

  }
  // Update image array
  if (req.files.images) {
    // Delete the old image at the specified index
    deleteImgs(`./src/uploads/product/${getImagepath.images[req.body.index]}`)
    // Replace the image at the specified index with the new one
    req.body.images = req.files.images[0].filename;
    await productModel.findByIdAndUpdate(id, { $push: { images: req.body.images } })
    await productModel.findByIdAndUpdate(id, { $pull: { images: getImagepath.images[req.body.index] } })
    res.status(200).json({ message: "success" });
  }
})



const productSpecificCategory = catchAsyncError(async (req, res, next) => {
  const specificProducts = await productModel.find({ categoryId: req.params.id }).populate('categoryId');
  if (specificProducts.length === 0) {
    res.status(201).json({ message: 'No products found for the specified category' });
  } else {
    res.status(200).json({ message: "success", result: specificProducts });
  }
});














// functionToDeleteImg
function deleteImgs(pathImg) {
  // `src\\uploads\\product\\${toGetImagePase.images}`
  fs.unlink(pathImg, (err) => {
    new AppError(err, 404);
  });
}
export {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProductValue,
  updateOneProductImagesOrImage,
  productSpecificCategory

};
