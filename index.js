const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

morgan.token('data', (req) => {
  return JSON.stringify(req.body)
})

app.use(express.json())
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    phone: '040-123456'
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    phone: '39-44-5323523'
  },
  {
    id: 3,
    name: 'Dan Abramov',
    phone: '12-43-234345'
  },
  {
    id: 4,
    name: 'Mary Poppendick',
    phone: '39-23-6423122'
  }
]

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)

  if(person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.get('/info', (req, res) => {
  const phonebookLength = persons.length

  res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${Date()}</p>
  `)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if(!body.name || !body.number) {
    return res.status(400).json({
      error: 'content missing'
    })
  }

  if(persons.find(person => person.name === body.name) !== undefined) {
    return res.status(400).json({
      error: 'name already exists in phonebook'
    })
  }
  
  const person = {
    id: Math.floor(Math.random() * 1000),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)

  res.json(person)
})

const PORT = process.env.PORT || 3001 
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})
