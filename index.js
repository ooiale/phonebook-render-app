require('dotenv').config()

const express = require('express')
const app = express()
var morgan = require('morgan')

app.use(express.json())
app.use(morgan('tiny'))
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.use(express.static('dist'))

const Person = require('./models/person')


app.get('/api/persons', (request, response, next) => {
    Person.find({})
        .then(persons => {
            response.json(persons)
        })
        .catch(error => {
            next(error)
        })
  })

app.get('/info', async (request, response) => {
    try {
        const personCount = await Person.countDocuments({});
        const requestTime = new Date();
  
        response.send(`
            <p>Phonebook has info for ${personCount} people</p>
            <p>${requestTime}</p>
        `);
    } catch (error) {
        console.error('Error fetching person count:', error);
        response.status(500).send('Internal Server Error');
    }
  });
  


app.post('/api/persons', (request, response, next) => {
    const body = request.body
    if (!body) {
        return (response.status(400).json({
            error: 'missing info'
        }))
    } 

    const person =  new Person({
        name: body.name,
        phone: body.phone
    })

    person.save()
        .then(savedPerson => {
            console.log('person saved')
            response.json(savedPerson)
        })
        .catch(error => {
            next(error)
        })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person =>{
            response.json(person)
        })
        .catch(error => {
            next(error)
        })
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then( () => {
            response.status(204).end()
        })
        .catch(error => {
            next(error)
        })
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        phone: body.phone
    }

    Person.findByIdAndUpdate(request.params.id, person, {new: true, runValidators: true})
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => {
            next(error)
        })
})


// log only 4xx and 5xx responses to console
app.use(morgan('dev', {
    skip: function (req, res) { return res.statusCode < 400 }
  }))


const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
      } else if (error.name === 'ValidationError') {
        return response.status(400).json({error: error.message})
      }

    next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
  


