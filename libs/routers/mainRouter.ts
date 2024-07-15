import {Router} from "express";
import authUserController from "../controllers/authUserController";
import loginPageController from "../controllers/loginPageController";
import sitesPageController from "../controllers/sitesPageController";
import chooseSiteController from "../controllers/chooseSiteController";

const mainRouter = Router()
mainRouter.post('/login', authUserController)
mainRouter.post('/choose', chooseSiteController)
mainRouter.get('/login-page', loginPageController)
mainRouter.get('/sites-page', sitesPageController)
export default mainRouter