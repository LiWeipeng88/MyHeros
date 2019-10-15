module.exports = app =>{
    const express = require('express')
    const jwt = require('jsonwebtoken')
    const assert = require('http-assert')
    const AdminUser = require('../../models/AdminUser')
    const router = express.Router({
        mergeParams:true
    })
    
    /**
     * 创建分类（创建资源）
     */
    router.post('/', async (req,res)=>{
        const model = await req.Model.create(req.body)
        res.send((model))
    })
    /**
     * 根据ID编辑数据（更新资源）
     */
    router.put('/:id', async (req,res)=>{
        const model = await req.Model.findByIdAndUpdate(req.params.id,req.body)
        res.send((model))
    })
    /**
     * 根据ID删除分类（删除资源）
     */
    router.delete('/:id', async (req,res)=>{
        await req.Model.findByIdAndDelete(req.params.id,req.body)
        res.send({
            success:true
        })
    })
    /**
     * 分类列表（资源列表）
     */
    router.get('/', async ( req, res, next) =>{
        const token = String(req.headers.authorization || '').split(' ').pop()
        if(!token){
            return res.status(401).send({
                message:'请先登录'
            })
        }
        const { id } = jwt.verify(token,app.get('secret'))
        if(!id){
            return res.status(401).send({
                message:'请先登录'
            })
        }
        req.user = await AdminUser.findById(id)
        if(!req.user){
            return res.status(401).send({
                message:'请先登录'
            })
        }
        await next()
    }, async (req,res)=>{
        const queryOptions = {}
        if (req.Model.modelName === 'Category') {
            queryOptions.populate = 'parent'
        }
        const items = await req.Model.find().setOptions(queryOptions).limit(10)
        res.send((items))
    })
     /**
     * 根据ID获取元素的值（资源详情）
     */
    router.get('/:id', async (req,res)=>{
        const model = await req.Model.findById(req.params.id)
        res.send((model))
    })
    app.use('/admin/api/rest/:resource',async (req,res,next)=>{
        const modelName = require('inflection').classify(req.params.resource)
        req.Model = require(`../../models/${modelName}`)
        next()
    },router)
    const multer = require('multer')
    const upload = multer({dest:__dirname + '/../../uploads'})
    app.post('/admin/api/upload',upload.single('file'),async (req,res)=>{
        const file = req.file
        file.url = `http://localhost:3000/uploads/${file.filename}`
        res.send(file)
    })

    app.post('/admin/api/login',async (req, res) => {
        const { username, password} = req.body
        //1.根据用户名找用户
        
        const user = await AdminUser.findOne({username}).select('+password')
        // assert(user, 422, '用户名不存在')
        if(!user){
            return res.status(422).send({
                message:'用户名不存在'
            })
        }
        //2.校验密码
        const isValid = require('bcrypt').compareSync(password,user.password)
        if(!isValid){
            return res.status(422).send({
                message:'密码错误'
            })
        }
        //3.返回token
        
        const token = jwt.sign({id:user._id},app.get('secret'))
        res.send({token})
    });
    //错误处理函数
    // app.use( async (err, req, res, next)=>{
    //     // console.log(err)
    //     res.status(err.statusCode).send({
    //         message:err.message
    //     })
    // })
}