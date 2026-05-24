const uploadToCloudinary=require("../../helpers/uploadToCloudinary.helper");




module.exports.upload= async(req, res, next)=> {  
    if(req.file){
       
       try {
      const result = await uploadToCloudinary(req.file.buffer); // result là object trả về từ Cloudinary
      console.log("file nhan:", result);
      // nếu uploadToCloudinary trả về url string, lưu trực tiếp
      // nếu trả về object, dùng result.url hoặc result.secure_url
      req.body[req.file.fieldname] = result.url || result.secure_url || result;
    } catch (err) {
      console.error("Upload error:", err);
      // tùy xử lý: next(err) hoặc chỉ log và next()
    }
        }
    next();
}