import express from 'express'

const app = express()
const PORT = 3333

app.get('/', (req, res) => {
    res.send('helloa woraa   ld')
})


app.listen(PORT, () => {console.log(`Server is running at  http://localhost:${PORT}`)})