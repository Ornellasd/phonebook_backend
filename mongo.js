const mongoose = require('mongoose')

if(process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://ornellasd:${password}@cluster0.ryq40.azure.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const entrySchema = new mongoose.Schema({
  name: String,
  phone: String,
})

const Entry = mongoose.model('Entry', entrySchema)

const entry = new Entry({
  name: name,
  phone: number,
})

entry.save().then(result => {
  console.log(`added ${entry.name} number ${entry.phone} to phonebook`)
  mongoose.connection.close()
})
