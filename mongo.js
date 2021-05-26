const mongoose = require('mongoose')

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

if(process.argv.length === 3) {
  console.log('phonebook:')
  Entry.find({}).then(result => {
    result.forEach(entry => {
      console.log(`${entry.name} ${entry.phone}`)
    })
    mongoose.connection.close()
  })
} else if(process.argv.length < 5){
  console.log('ERROR: name or phone number missing')
  process.exit(1)
} else {
  entry.save().then(result => {
    console.log(`added ${entry.name} number ${entry.phone} to phonebook`)
    mongoose.connection.close()
  })
}


