'use strict'
import {Router} from "express";
import { validateJwt, isAdmin } from '../middlewares/validate.jwt.js'
import { createCourse, crearCurso, test, editarCurso, deleteCourse, searchCourse} from "./course.controller.js";

const api = Router()

api.get('/test', test)
api.post('/crearCurso', [validateJwt, isAdmin], crearCurso)
api.put('/editarCurso/:id', [validateJwt, isAdmin], editarCurso)
api.delete('/deleteCourse/:id', [validateJwt, isAdmin], deleteCourse)
api.post('/searchCourse', [validateJwt, isAdmin], searchCourse)
api.post('/createCourse', [validateJwt, isAdmin], createCourse)



export default api