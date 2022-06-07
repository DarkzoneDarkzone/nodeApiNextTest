"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const moment_1 = __importDefault(require("moment"));
require("moment/locale/th");
const uploadImage = () => {
    const storage = multer_1.default.diskStorage({
        destination: function (req, file, cb) {
            var newfolder = `./public/uploads/${(0, moment_1.default)().format('YYYY')}/${(0, moment_1.default)().format('MM')}/`;
            if (!fs_1.default.existsSync(`${newfolder}`)) {
                fs_1.default.mkdirSync(newfolder, { recursive: true });
            }
            cb(null, newfolder);
        },
        filename: function (req, file, cb) {
            var ext = path_1.default.extname(file.originalname);
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, file.fieldname + '-' + uniqueSuffix + ext);
        }
    });
    return (0, multer_1.default)({
        storage: storage,
        fileFilter: function (req, file, callback) {
            var ext = path_1.default.extname(file.originalname);
            if (ext !== '.png' && ext !== '.jpg' && ext !== '.webp' && ext !== '.jpeg') {
                return callback(new Error('Only images are allowed'));
            }
            callback(null, true);
        },
        limits: {
            fileSize: (1048576 * 10)
        }
    });
};
exports.uploadImage = uploadImage;
