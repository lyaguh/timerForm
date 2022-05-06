const express = require('express')
const app = express()
const cors = require('cors')

const mongoose = require('mongoose')
const host = '127.0.0.1';
const port = process.env.PORT || 5000;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({origin: 'http://127.0.0.1:5000'}));



const start = async () => {
    try {
      await mongoose.connect('mongodb+srv://<user>:<password>@cluster0.gw5os.mongodb.net/timerWeb'); 
      app.listen(port, host , () => console.log(`Server listens http://${host}:${port}`))
    }catch(er) {
      console.log(er)
    }
}



const schema = new mongoose.Schema({ email: 'string', count: 'number'});
const fellow = mongoose.model('Fellow', schema)



app.get('/', (req,res) => {
    res.sendFile(__dirname + '/index.html')

})

app.post('/reg', async (req,res) => {

    console.log('Пост')
    console.log(req.body)
    if(req.body.email){
        const email = req.body.email

        const pretendent = await fellow.findOne({email:email}) 
        console.log(pretendent)
        if(!pretendent) {
            const count = 1
            const newFool = new fellow({email:email,count:count})
            await newFool.save()
            res.json({message: 'Новый пользователь создан'}).end();
            console.log('Новый')
        } else {
            if((await fellow.findOne({email:email},'count').exec())['count'] < 5){
                const count = (await fellow.findOne({email:email},'count').exec())['count']
                console.log(count)
                const updateCount = await fellow.findOneAndUpdate({email:email},{count:count+1}, {new:true})
                
                res.json({message: `Добро пожаловать назад! Осталось ${5-count} попытки(а)`}).end();
                
                console.log('Бывалый')
            } else {
                res.json({message: `Хватит с тебя! Иди поспи`}).end();
            }
            
        }
    }
    
    
})


app.use(express.static('./'))
start()