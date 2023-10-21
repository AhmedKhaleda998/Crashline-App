const router = require("express").Router();

const postController = require("../controllers/post");
const isAuth = require("../middlewares/isAuth");
const multerConfig = require("../configurations/image");
const { postValidation, requiredPostValidation, commentValidation } = require("../validations/post");

router.post('/', isAuth, requiredPostValidation, postValidation, multerConfig.postImage.single('image'), postController.create);

router.get('/', isAuth, postController.viewAll);

router.get('/:postId', isAuth, postController.view);

router.put("/:postId", isAuth, postValidation, multerConfig.postImage.single('image'), postController.update);

router.delete("/:postId", isAuth, postController.delete);

router.post("/:postId/like", isAuth, postController.like);

router.post("/:postId/comment", isAuth, commentValidation, postController.comment);

module.exports = router;