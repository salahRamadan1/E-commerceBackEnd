import AppError from "../HandelError/appError/APPERROR.js";
import multer from "multer";


function uploadFileImage(path, fieldName) {

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {

            cb(null, `./src/uploads/${path}`)
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, uniqueSuffix + file.originalname)
        }
    })
    function fileFilter(req, file, cb) {
        if (!file.mimetype.startsWith("image")) {
            cb(new AppError("image only", 404), false);
        } else {
            cb(null, true);
        }
    }
    const upload = multer({ storage, fileFilter });
    return upload.single(fieldName)
}

function uploadFilesImages(path, fieldName) {
    const storage =
        multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, `./src/uploads/${path}`);

            },
            filename: function (req, file, cb) {
                console.log(file);
                const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
                cb(null, uniqueSuffix + "-" + file.originalname);
            },
        });
    function fileFilter(req, file, cb) {
        if (!file.mimetype.startsWith("image")) {
            cb(new AppError("image only", 404), false);
        } else {
            cb(null, true);
        }
    }
    const upload = multer({ storage, fileFilter });
    return upload.fields(fieldName)
}

export { uploadFileImage, uploadFilesImages };
