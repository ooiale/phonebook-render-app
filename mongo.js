const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const phone = process.argv[4]

const url =
  `mongodb+srv://ale:${password}@phonebook.ruf1dll.mongodb.net/?retryWrites=true&w=majority&appName=phonebook`


mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  phone: String,
})

const Person = mongoose.model('Person', personSchema)

if (!name) {
    Person.find({}).then(result => {
        result.forEach(person => {
          console.log(person)
        })
        mongoose.connection.close()
      })
} else {
    const person = new Person({
        name: name,
        phone: phone
      })
      
      
      person.save().then(result => {
        console.log('note saved!')
        mongoose.connection.close()
      })      
}

