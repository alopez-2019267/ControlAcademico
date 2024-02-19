'use strict'
import { checkUpdate } from '../utils/validator.js'
import Course from './course.model.js'
import User from '../user/user.model.js'

export const test = (req, res)=>{
    console.log('test is running animal')
    return res.send({message: 'Test us running'})
}

export const crearCurso = async (req, res) =>{
    try{
        // Capturar el nombre del curso desde el body
        let data = req.body

        const existingCourse = await Course.findOne({ name: data.name });
        if (existingCourse) {
            return res.status(400).send({message: `Un curso con el mismo nombre ya existe`});
        }
        // Crear una nueva instancia de Course solo con el nombre
        let course = new Course( data );
        // Guardar el curso
        await course.save();
        // Responder al usuario
        return res.send({ message: `El curso ${data.name} se ha registrado exitosamente` });
    } catch(err){
        console.error(err);
        return res.status(500).send({ message: 'No se pudo guardar el curso', err: err });
    }
};

export const editarCurso = async(req, res)=>{
    try {
        //Capturar la data
        let data = req.body
        //Capturar el id del animal a actualizar
        let { id } = req.params
        //Validar que vengan datos
        let update = checkUpdate(data, false)
        if(!update) return res.status(400).send({message: 'Have sumitted some data that cannot be updated or missing data'})
        //Actualizar
        let updatedCourse = await Course.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
        ).populate(['name'])//Elimianr la informacion sensible
        //Validar la actualizacion
        if(!updatedCourse) return res.status(404).send({message: 'Course not found and not updated'})
       
        //Responder si todo sale bien
        return res.send({message: 'Course updated successfully', updatedCourse})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error updating course'})
    }
}

export const deleteCourse = async(req, res) =>{
    try{
        let { id } = req.params
        //Eliminar 
        let deletedCourse = await Course.deleteOne({_id: id})
        //validar que se eliminó
        if(deletedCourse.deleteCount === 0 ) return res.status(404).send({message: 'Course not found and not deleted'})
        //Respondemos al usuario
        return res.send({message: 'Deleted course successfully'})
    }catch(err){
        console.error(err)
        return res.status(404).send({message: 'Error deleting course'})
    }
}

export const searchCourse = async(req, res) => {
    try{
        //Obtener el parámetro de búsqueda
        let { search } = req.body
        //Bsucar
        let courses = await Course.find(
            {teacher: search}
        ).populate('teacher', ['name', 'description'])

        //validar la respuesta
        if(!courses) return res.status(404).send({message: 'Courses not found '})
        //responder si todo sale bien 
        return res.send({message: 'Courses found', courses})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error searching Courses'})
    }
}

export const createCourse = async (req, res) => {
    try{
        //Capturar la data
        let data = req.body
        //validar que el keeper exista 
        let user = await User.findOne({_id: data.teacher})
        if(!user) return res.status(404).send({message: 'Teacher not found'})
        user = await User.findOne({_id: data.students})
        if(!user) return res.status(404).send({message: 'Student not found'}) 
        const studentId = data.students;
        const courseCount = await Course.countDocuments({ students: studentId });
        if (courseCount >= 3) {
            return res.status(400).send({message: `El estudiante con el id ${studentId} ya está inscrito en 3 cursos.`});
        }

        // Verificar si el estudiante ya está inscrito en el curso
        const existingCourse = await Course.findOne({ students: studentId, name: data.name });
        if (existingCourse) {
            return res.status(400).send({message: `El estudiante con el id ${studentId} ya está inscrito en el curso: ${data.name}.`});
        }
        let course = new Course(data)
        //guardar el animal 
        await course.save()
        //responder al usuario
        return res.send({message: `El curso se ha registrado exitosamente`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Course is not save', err: err})
    }
};