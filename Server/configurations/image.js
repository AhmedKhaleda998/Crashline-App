const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const createMulterInstance = (destination) => {
    const storage = multer.diskStorage({
        destination: destination,
        filename: (req, file, callback) => {
            callback(null, uuidv4() + '-' + file.originalname);
        }
    });

    const filter = (req, file, callback) => {
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
            callback(null, true);
        } else {
            callback(null, false);
        }
    };

    return multer({ storage: storage, fileFilter: filter });
};

exports.postImage = createMulterInstance('public/images/posts');
exports.profilePicture = createMulterInstance('public/images/profiles');
