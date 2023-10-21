const router = require("express").Router();

const profileController = require("../controllers/profile");
const multerConfig = require("../configurations/image");
const { changeNameValidation, changePasswordValidation } = require("../validations/auth");
const isAuth = require("../middlewares/isAuth");

router.get('/:userId', isAuth, profileController.view);

router.get('/user/:userId', isAuth, profileController.user);

router.put('/picture/:userId', isAuth, multerConfig.profilePicture.single('image'), profileController.manipulatePicture);

router.delete('/picture/:userId', isAuth, profileController.deletePicture);

router.put('/password/:userId', isAuth, changePasswordValidation, profileController.changePassword);

router.put('/name/:userId', isAuth, changeNameValidation, profileController.changeName);

router.put('/:followerId/follow', isAuth, profileController.follow);

router.get('/:userId/followers', isAuth, profileController.followers);

router.get('/:userId/followings', isAuth, profileController.followings);

module.exports = router;