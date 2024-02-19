import { Schema, model } from "mongoose";

const assingSchema = Schema({
    curso: {
        type: Schema.ObjectId, 
        lowerCase: true,
        require: true,
        ref: 'curso'
    },
    students: {
        type: Schema.ObjectId, 
        lowerCase: true,
        require: true,
        ref: 'user'
    }
},
{
    versionKey: false //desahabilitar el __v (versión del docuemnto)
}
)

export default model('asign', assingSchema)