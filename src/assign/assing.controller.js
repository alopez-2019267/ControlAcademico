'use strict'
import { checkUpdate } from '../utils/validator.js'
import Course from '../course/course.model.js'
import User from '../user/user.model.js'
import Assing from '../assign/assing.model.js'

export const assingCourse = async (req, res) => {
    try{
        //Capturar la data
        let data = req.body
        let course = await Course.findOne({_id: data.curso})
        if(!course) return res.status(404).send({message: 'Course not found'})
        let user = await User.findOne({_id: data.students})
        if(!user) return res.status(404).send({message: 'Student not found'}) 
        const studentId = data.students;
        const courseId = data.curso

        const existingAssignment = await Assing.findOne({ curso: courseId });
        const courseCount = await Assing.countDocuments({ students: studentId });
        if (courseCount >= 3) {
            return res.status(400).send({message: `El estudiante ya está inscrito en 3 cursos.`});
        }
        // Verificar si el estudiante ya está inscrito en el curso
        if (existingAssignment) {
            return res.status(400).send({ message: `El estudiante con el id ${studentId} ya está inscrito en el curso: ${data.curso}.` });
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
}

export const searchCourses = async(req, res) => {
    try{
        //Obtener el parámetro de búsqueda
        let { search } = req.body
        //Bsucar
        let courses = await Assing.find(
            {students: search}
        ).populate('curso', ['name'])
 
        //validar la respuesta
        if(!courses) return res.status(404).send({message: 'Courses not found '})
        //responder si todo sale bien
        return res.send({message: 'Courses found', courses})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error searching Courses'})
    }
}