import express from "express";
import { studentLogin, studentLogout, studentSignup, mrLogin , mrLogout ,mrSignup ,higherLogin,higherSignup ,higherLogout } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/student/signup",studentSignup);
router.post("/student/login",studentLogin);
router.post("/student/logout",studentLogout);

router.post("/mr/signup",mrSignup);
router.post("/mr/login",mrLogin);
router.post("/mr/logout",mrLogout);

router.post("/higher/signup",higherSignup);
router.post("/higher/login",higherLogin);
router.post("/higher/logout",higherLogout);


export default router;