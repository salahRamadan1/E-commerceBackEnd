import AppError from "../HandelError/appError/APPERROR.js";
import { catchAsyncError } from "../HandelError/catchError/catchError.js";
import slugify from "slugify";
import { ServiceFuture } from "../factoryServiceFuture/futureService.js";
import fs from "fs";
// to add document
const factoryAddDocument = (model) => {
  return catchAsyncError(async (req, res, next) => {
    const sad = await model.findOne({ name: req.body.name })
    if (sad) {
      if (req.file) fs.unlink(`${req.file.destination + '/' + req.file.filename}`, (err) => { new AppError(err, 202); });
      return next(new AppError('Document name is duplicate ', 202))
    }
    console.log(req.file);
    req.body.image = req.file?.filename;
    req.body.name ? (req.body.slug = slugify(req.body.name)) : "";
    const Document = model(req.body)
    await Document.save()
    res.status(200).json({ message: 'success', Document })
  });
};
// to delete Document
const factoryDelete = (model, nameFileUpload) => {
  return catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const oneDocument = await model.findById(id);
    if (!oneDocument) {
      return next(new AppError('Document not found', 409))
    }
    deleteImg(`./src/uploads/${nameFileUpload + oneDocument.image}`)
    const Document = await model.findByIdAndDelete(id);
    resultFun(Document, next, res);
  });
};
// to update Document
const factoryUpdate = (model, nameFileUpload) => {
  return catchAsyncError(async (req, res, next) => {
    const { id } = req.body;
    const oneDocument = await model.findById(id)
    console.log(req.body);
    if (!oneDocument) {
      if (req.file) deleteImg(`${req.file.destination + '/' + req.file.filename}`)
      return next(new AppError('Document not found', 201))
    }
    if (req.file) {
      deleteImg(`./src/uploads/${nameFileUpload + oneDocument.image}`)
    }
    req.body.image = req.file?.filename;
    req.body.name ? (req.body.slug = slugify(req.body.name)) : "";
    const Document = await model.findByIdAndUpdate(id, req.body,);
    resultFun(Document, next, res);
  });
};
//   to get one Document
const factoryGetOneDocumentId = (model , filed) => {
  return catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    let Document = await model.findById(id).populate(filed);
    resultFun(Document, next, res);
  });
};
//   to get all Documents
const factoryGetAllDocument = (model) => {
  return catchAsyncError(async (req, res, next) => {
    process.env.BASEURL = "http://" + req.get("host");
    // filter to mergeParams
    let filter = {};
    if (req.params.categoryId) {
      filter = { categoryId: req.params.categoryId };
    }
    // ***
    let serviceFuture = new ServiceFuture(model.find(filter), req.query)
      .paginating()
      .filter()
      .sorting()
      .searching()
      .fielding();
    let Document = await serviceFuture.mongooseQuery;
    if (!Document) {
      return next(new AppError("Document not found", 404));
    }
    let numberOfPage = await model.find();

    let numberPages = Math.ceil(numberOfPage.length / 12)

    res.status(200).json({
      massage: "success",
      numberOfPage: numberPages,
      page: serviceFuture.page,
      result: Document,
    });
  });
};






export {
  factoryDelete,
  factoryUpdate,
  factoryGetOneDocumentId,
  factoryGetAllDocument,
  factoryAddDocument,
  deleteImg
};
//  to not save image if there error

// clean to function if
function resultFun(Document, next, res) {
  if (!Document) {
    return next(new AppError("Document not found", 200));
  }
  res.status(200).json({ message: "success", result: Document });
}

function deleteImg(path) {
  fs.unlink(
    path,
    (err) => {
      return new AppError(err, 404);
    }
  );
}
