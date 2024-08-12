const middleWareHandlerErrorFun = (err, req, res, next) => {

  err.statusCode = err.statusCode || 201;
  if (err.message == "Unexpected field") {
    err.message = " maxCount to upload images  is  3";
  }
  res.status(err.statusCode).json({
    status: err.statusCode,
    message: err.message,
    err,
  });
};

export { middleWareHandlerErrorFun };
