import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

import postRoutes from './routes/posts.js'
import userRoutes from './routes/users.js'

const app = express()

app.use(cors())
app.use(express.json({ limit: '30mb', extended: true }))
app.use(express.urlencoded({ limit: '30mb', extended: true }))
app.use('/posts', postRoutes)
app.use('/users', userRoutes)

const CONNECTION_URL =
	'mongodb+srv://safiraja:avadakedavra@asfandyarscluster.m89ej.mongodb.net/memoriesApp?retryWrites=true&w=majority'
const PORT = process.env.PORT || 5000
mongoose
	.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(
		app.listen(PORT, () => console.log('The server is running on port ' + PORT))
	)
	.catch((error) => console.log(error))
mongoose.set('useFindAndModify', false)
