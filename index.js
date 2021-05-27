const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const dotenv = require('dotenv').config()

const app = express()

const Entry = require('./models/entry')

const errorHandler = (error, req, res, next) => {
  if(error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id'})
  } else if(error.name === 'ValidationError') {
    let errors = {};

    Object.keys(error.errors).forEach((key) => {
      errors[key] = error.errors[key].message;
    });

    return res.status(400).send(errors);
  }

  next(error)
}

morgan.token('data', (req) => {
  return JSON.stringify(req.body)
})

app.use(express.json())
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
app.use(express.static('build'))

app.get('/api/persons', (req, res) => {
  Entry.find({}).then(entries => {
    res.json(entries)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Entry.findById(req.params.id)
    .then(entry => {
      if(entry) {
        res.json(entry)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.get('/info', (req, res) => {
  Entry.find({})
    .then(entries => {
      res.send(`
        <p>Phonebook has info for ${entries.length} people</p>
        <p>${Date()}</p>
      `)
    })
})

app.delete('/api/persons/:id', (req, res, next) => {
  Entry.findByIdAndDelete(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  if(!body.name || !body.number) {
    return res.status(400).json({
      error: 'content missing'
    })
  }

  const entry = new Entry({
    name: body.name,
    phone: body.number
  })
  
  entry.save()
    .then(savedEntry => {
      res.json(savedEntry)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body
  
  const entry = {
    name: body.name,
    phone: body.phone
  }

  Entry.findByIdAndUpdate(req.params.id, entry, { new: true })
    .then(updatedEntry => {
      res.json(updatedEntry)
    })
    .catch(error => next(error)) 
})

app.use(errorHandler)

const PORT = process.env.PORT || 3001 
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})
