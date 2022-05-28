require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
//const { request } = require('expressconst http = require('http')

app.use(express.json())
app.use(express.static('build'))
app.use(cors())

morgan.token('data', (request) => {
  if (request.method === 'POST') {
    return JSON.stringify(request.body)
  }
  else
  {
    return null
  }
})
app.use(morgan(':method :url :status :response[content-length] - :response-time ms :data'))


let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456'

  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523'

  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345'

  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122'

  }
]
app.get('/api/persons/', (request, response) => {
  Person.find({}).then(persons => {
    res.json(persons.map(person => person.toJSON()))
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      }
      else
      {
        response.status(404).end()
      }

    })
    .catch(error => next(error))
})


app.get('/info', (request, response) => {
  persons.find({}).then(people => {
    const info = `Phonebook has info for ${people.length} people`
    const time = Date()

    response.send(`<p>${info}</p><p>${time}</p>`)
  })

})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }
  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(Personupdate => {
      response.json(Personupdate)
    })
    .catch(error => next(error))
})


app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))

})


app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (body.name === undefined) {
    return response.status(400).json({ error: 'Missing name!' })
  }

  if (body.number === undefined) {
    return response.status(404).json({ error: 'Missing number!' })
  }

  const person = new Person ({
    id: Math.floor(Math.random() * 100),
    name: body.name,
    number: body.number,

  })

  person.save().then(personSaved => {
    response.json(personSaved.toJSON())
  })
    .catch(error => next(error))
})


const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)

}

app.use(errorHandler)

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})