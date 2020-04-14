const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

//GET tasks?completed=true
//GET /tasks?limit=10&skip=20
//GET /tasks?sortBy = createdAt_asc
//GET /tasks?sortBy = createdAt_desc
//GET /tasks?sortBy = completed_asc
//GET /tasks?sortBy = completed_desc

//Ordenando tarefas em ordem descendente
router.get('/tasks', auth, async (req, res) => {
    const matchProperties = {}
    //Digite aqui a propriedade do documento na qual se deseja fazer a ordenação
    // -1 é desendente 1 é ascendente
    sortProperty = {

    }
    if (req.query.completed) {
        matchProperties.completed = req.query.completed === 'true';
    }

    if (req.query.sortBy) {
        // break createdAt_desc value from sortBy
        const parts = req.query.sortBy.split('_');//separando pelo underscore
        //colocando propriedade de ordenação em sortProperty pra deixar dinamico, assim posso usar completed ou createdAt ou outro
        sortProperty[parts[0]] = parts[1] == "desc" ? -1 : 1;
        //console.log(parts[0])
    }

    // if(req.query.sortBy){
    //     createdAt.split('_')
    // }
    try {
        await req.user.populate({
            path: 'tasks',
            match: matchProperties,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort: sortProperty        //SortProperty
            }

        }).execPopulate()
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findOne({ _id, owner: req.user._id })

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })

        if (!task) {
            return res.status(404).send()
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!task) {
            res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router