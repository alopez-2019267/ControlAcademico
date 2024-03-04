'use strict'
import {Router} from "express";
import { validateJwt, isUser} from '../middlewares/validate.jwt.js'
import { assingCourse, searchCourses } from "./assing.controller.js";

const api = Router()

api.post('/assingCourse', [validateJwt, isUser], assingCourse)
api.post('/searchCourses',  [validateJwt, isUser], searchCourses)
export default api