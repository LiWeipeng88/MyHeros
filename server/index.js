const express = require('express')

const app = express()

app.set('secret','dfg7tij6dhj1')

app.use(require('cors')())
app.use(express.json())

//静态文件
app.use('/uploads',express.static(__dirname + '/uploads'))

require('./routes/admin')(app)
require('./plugins/db')(app)

app.listen(3000, () => {
    console.log('http://localhost:3000');
});