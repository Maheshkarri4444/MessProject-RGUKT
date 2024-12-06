import express from "express";
import { studentLogin, studentLogout, studentSignup, messAuthorityLogin, messAuthorityLogout , messAuthoritySignup} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/student/signup",studentSignup);
router.post("/student/login",studentLogin);
router.post("/student/logout",studentLogout);

router.post("/messauthority/signup",messAuthoritySignup);
router.post("/messauthority/login",messAuthorityLogin);
router.post("/messauthority/logout",messAuthorityLogout);


export default router;