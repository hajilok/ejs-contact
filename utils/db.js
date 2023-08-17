const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://imamwahyu635:imamwahyu1927@contactapp.tdlavql.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,

})


// const addcontact = new contact({
//     nama: "senpaiangin",
//     nohp: "083123047649",
//     email: "imamwahyu635@gmail.com"

// })

// addcontact.save().then((response) => console.log(response));