const express = require('express');
const expressEjsLayouts = require('express-ejs-layouts');
const expresslayout = require('express-ejs-layouts')
const { body, validationResult, check } = require('express-validator');
const session = require('express-session')
const cookieparse = require('cookie-parser')
const cookieParser = require('cookie-parser');
const flash = require('connect-flash')
const mongoose = require('./utils/db')
const { cekip, contact } = require('./moduls/contact');
const methodOverride = require('method-override');



const app = express()
const port = 3000;

app.use(methodOverride('_method'))

app.set('view engine', 'ejs');
app.use(expresslayout);
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser('secret'));
app.use(session({
    cookie: ({ maxAge: 6000 }),
    secret: 'secret',
    resave: true,
    saveUninitialized: true,

})
)
app.use(flash());

app.get('/', async (req, res) => {
    const myinpoif = await cekip()
    res.render('index', {
        layout: "layouts/main-layout",
        title: "Halaman Utama",
        myinpoif,
    })

})

app.get('/contact', async (req, res) => {
    const contacts = await contact.find()
    res.render('contact', {
        title: "Halaman Contact",
        layout: "layouts/main-layout",
        contacts,
        msg: req.flash('msg'),
    })
})

app.get('/contact/add', (req, res) => {
    res.render('add', {
        layout: 'layouts/main-layout',
        title: 'Halaman Tambah Kontak',
    })


})

app.post('/contact', ([
    body('nama').custom(async (value) => {
        const duplikat = await contact.findOne({ nama: value })
        if (duplikat) {
            throw new Error('Nama Sudah ada di Database silahkan gunakan nama lain')

        }
        return true;
    }),
    check('email', 'Emailnya gak valid Senpai >_<').isEmail(),
    check('nohp', 'No hp tidak Valid').isMobilePhone('id-ID')]
), (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // return res.status(400).json({ errors: errors.array() })
        res.render('add', {
            title: 'Tambahkan Data',
            layout: 'layouts/main-layout',
            errors: errors.array(),

        })
    } else {
        contact.insertMany(req.body).then(result => {
            req.flash('msg', 'Data telah Berhasil ditambahkan')
            res.redirect('/contact')
        })
    }
}
)

app.delete('/contact', async (req, res) => {
    await contact.deleteOne({ nama: req.body.nama }).then(result => {
        req.flash('msg', 'Data telah Berhasil dihapus')
        res.redirect('/contact')

    })
}
)

app.get('/contact/edit/:nama', async (req, res) => {
    const contacts = await contact.findOne({ nama: req.params.nama })
    res.render('edit', {
        layout: 'layouts/main-layout',
        title: 'edit data',
        contacts,
    })


})

app.put('/contact', ([
    body('nama').custom(async (value, { req }) => {
        const duplikat = await contact.findOne({ nama: value })
        if (duplikat) {
            throw new Error('Nama Sudah ada di Database silahkan gunakan nama lain')

        }
        return true;
    }),
    check('email', 'Emailnya gak valid Senpai >_<').isEmail(),
    check('nohp', 'No hp tidak Valid').isMobilePhone('id-ID')]
), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // return res.status(400).json({ errors: errors.array() })
        res.render('edit', {
            title: 'edit data',
            layout: 'layouts/main-layout',
            errors: errors.array(),
            contacts: req.body

        })
    } else {
        await contact.updateOne({_id: req.body._id}, {
            $set: {
                nama: req.body.nama,
                nohp: req.body.nohp,
                email: req.body.email,
            }


        }).then(result => {
            req.flash('msg', 'Data telah Berhasil diedit')
            res.redirect('/contact')
    
        })
    }


    }

)


app.get('/contact/:nama', async (req, res) => {
    const seker = await contact.findOne({ nama: req.params.nama })
    res.render('detail', {
        title: 'Detail Contact',
        layout: "layouts/main-layout",
        seker,

    })
})

app.get('/about', (req, res) => {
    res.render('About', {
        title: 'Halaman About',
        layout: "layouts/main-layout",

    })
})

app.listen(port, () => {
    console.log('coneksi done to 3000')

})