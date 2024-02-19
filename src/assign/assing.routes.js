'use strict'
import {Router} from "express";
import { validateJwt, isUser} from '../middlewares/validate.jwt.js'
import { assingCourse } from "./assing.controller.js";

const api = Router()

api.post('/assingCourse', [validateJwt, isUser], assingCourse)

export default api