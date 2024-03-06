const express = require('express')
const app = express()
var morgan = require('morgan')
morgan('tiny')

app.use(express.json())
app.use(morgan('combined'))
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.use(express.static('dist'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "phone": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "phone": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "phone": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "phone": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {

    response.json(persons)
  })

app.get('/info', (request, response) => {
    requestTime = new Date()
    response.send(`<p> phonebook has info for ${persons.length} people </p>
                    <p>${requestTime}</p>`)
  })

const generateId = () => {
    return Math.floor(Math.random() * 25555) + 1
}


app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body || !body.name || !body.phone) {
        return (response.status(400).json({
            error: 'missing info'
        }))
    } 
    if (persons.some(p => p.name === body.name)) {
        return (response.status(400).json({
            error: 'name must be unique'
        }))
    }

    const id = generateId()
    const person = {
        id: id,
        name: body.name,
        phone: body.phone
    }
    persons = persons.concat(person)
    response.json(person)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.filter(p => {
        return p.id === id
    })
    if (person.length > 0) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log(id)
    persons = persons.filter(p => {
        return p.id !== id
    })
    console.log(persons)

    response.status(204).end()
})

// log only 4xx and 5xx responses to console
app.use(morgan('dev', {
    skip: function (req, res) { return res.statusCode < 400 }
  }))
  



const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)



