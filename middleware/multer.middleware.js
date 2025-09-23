import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage });


// for hosting on render 

// import multer from "multer";
// // import path from "path";

// const storage = multer.memoryStorage({
//   destination: function (req, file, cb) {
//     cb(null, './public');
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });

// export  const upload = multer({ storage });
