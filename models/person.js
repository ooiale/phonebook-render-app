const mongoose = require('mongoose')

mongoose.set('strictQuery',false)

const url = process.env.MONGODB_URI


mongoose.connect(url)
    .then( () => {
        console.log('connected to MongoDB')
    })
    .catch( () => {
        console.log('failed to connect to MongoDB')
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    phone: {
        type: String,
        minLength: 8,
        match: /^\d{2,3}-\d+$/
    }
})

personSchema.set('toJSON', {
    transform:(document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject.__v
        delete returnedObject._id
    }
})

module.exports = mongoose.model('Person', personSchema)