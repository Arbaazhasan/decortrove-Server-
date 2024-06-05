import multer from "multer";
import path from "path";

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'public/images');
//     },
//     filename: (req, file, cb) => {
//         const fileName = Date.now() + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
//         cb(null, file.fieldname + fileName);
//     }
// });

// const fileUpload = multer({ storage: storage }).array("file");

// export default fileUpload;


const storage = multer.memoryStorage();
const fileUpload = multer({ storage: storage }).array("file");

export default fileUpload;



