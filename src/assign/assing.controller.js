'use strict'
import { checkUpdate } from '../utils/validator.js'
import Course from '../course/course.model.js'
import User from '../user/user.model.js'
import Assing from '../assign/assing.model.js'

export const assingCourse = async (req, res) => {
    try{
        //Capturar la data
        let data = req.body
        //validar que el keeper exista 
        let course = await Course.findOne({_id: data.curso})
        if(!course) return res.status(404).send({message: 'Course not found'})
        let user = await User.findOne({_id: data.students})
        if(!user) return res.status(404).send({message: 'Student not found'}) 
        const studentId = data.students;
        const courseCount = await Assing.countDocuments({ students: studentId });
        if (courseCount >= 3) {
            return res.status(400).send({message: `El estudiante con el id ${studentId} ya está inscrito en 3 cursos.`});
        }

        // Verificar si el estudiante ya está inscrito en el curso
        const existingCourse = await Assing.findOne({ students: studentId, name: data.name });
        if (existingCourse) {
            return res.status(400).send({message: `El estudiante con el id ${studentId} ya está inscrito en el curso: ${data.name}.`});
        }
        let assing = new Assing(data)
        //guardar el animal 
        await assing.save()
        //responder al usuario
        return res.send({message: `El curso se ha registrado exitosamente`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Course is not save', err: err})
    }
};