const mongoose = require('mongoose')

const name = process.argv[3]
const number = process.argv[4]

//const url=`mongodb+srv://fullstack:${password}@cluster0.9baaj.mongodb.net/persons-app?retryWrites=true&w=majority`




if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:Yenkong1.@cluster0.djuims9.mongodb.net/?retryWrites=true&w=majority`
  PORT=3001
  
  

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  content: String,
  name: String,
  number: String,
  date: Date,
  important: Boolean,

})
const Person = mongoose.model('Person', personSchema)

if (name === undefined || number === undefined) {
  Person
    .find({})
    .then(person => {
      console.log('Phonebook:')
      person.map(person => console.log(person.name, person.number))
      mongoose.connection.close()
    })
}
else
{
  const person = new Person({
    name: name,
    number: number,
  })

  person.save().then(() => {
    console.log(`${name} ${number} added to phonebook`)
    mongoose.connection.close()
  })
}