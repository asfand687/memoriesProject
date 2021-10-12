import mongoose from 'mongoose'
import PostMessage from '../models/post.js'

export const getPosts = async (req, res) => {
	try {
		const posts = await PostMessage.find()
		res.status(200).json(posts)
	} catch (error) {
		res.status(404).json({ message: error.message })
	}
}

export const createPost = async (req, res) => {
	const post = req.body
	const newPost = new PostMessage({
		...post,
		creator: req.userId,
		createdAt: new Date().toISOString(),
	})
	try {
		await newPost.save()
		res.status(201).json(newPost)
	} catch (error) {
		res.status(409).json({ message: error.message })
	}
}

export const updatePost = async (req, res) => {
	const { id: _id } = req.params
	const post = req.body
	try {
		if (!mongoose.Types.ObjectId.isValid(_id))
			return res.status(404).send('No post with that id')
		const updatedPost = await PostMessage.findByIdAndUpdate(
			_id,
			{ ...post, _id },
			{
				new: true,
			}
		)
		res.json(updatedPost)
	} catch (error) {
		res.status(409).json({ message: error.message })
	}
}

export const deletePost = async (req, res) => {
	const { id } = req.params
	try {
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(404).send('No post with that id')
		}
		PostMessage.deleteOne({ _id: id }).exec()
		res.json({ message: 'Post deleted successfully' })
	} catch (error) {
		res.status(409).json({ message: error.message })
	}
}

export const likePost = async (req, res) => {
	const { id } = req.params
	try {
		if (!req.userId) return res.status(501).json({ message: 'Unauthenticated' })
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(404).send('No post with that id')
		}
		const post = await PostMessage.findById(id)
		const index = await post.likes.findIndex((id) => id === String(req.userId))
		if (index === -1) {
			post.likes.push(req.userId)
		} else {
			post.likes.filter((id) => id === String(req.userId))
		}
		const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {
			new: true,
		})
		res.json(updatedPost)
	} catch (error) {
		console.log(error)
	}
}
