import express from 'express'
import { validateJwt, isAdmin } from '../middlewares/validate.jwt.js'
import {test, registerStudent, registerTeacher, login, update, deleteUser} from './user.controller.js'

const api = express.Router()

//RUTAS PUBLICAS
api.post('/registerStudent', registerStudent)
api.put('/registerTeacher/:id', [validateJwt, isAdmin], registerTeacher)
api.post('/login', login)
//RUTAS PRIVADAS (solo ususarios logeados)
                //Middleware
api.get('/test', [validateJwt, isAdmin], test)
api.put('/update/:id', [validateJwt], update) //Middleware -> Funciones intermedias que sirven para validar
api.delete('/delete/:id', [validateJwt], deleteUser)

export default api