import DataURIParser from "datauri/parser.js";
import path from "path";

export const uploadOncloudinary = (file) => {
    const parser = new DataURIParser();
    // console.log(file);
    const extName = path.extname(file.originalname).toString();

    // console.log(extName);
    return parser.format(extName, file.buffer);

}