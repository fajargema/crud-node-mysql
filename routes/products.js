var express = require('express');
var router = express.Router();
var dbConn = require('../lib/db');

router.get('/', function (req, res, next) {

    dbConn.query('SELECT * FROM produk ORDER BY id_produk desc', function (err, rows) {

        if (err) {
            req.flash('error', err);
            res.render('products', { data: '' });
        } else {
            res.render('products', { data: rows });
        }
    });
});

router.get('/add', function (req, res, next) {
    res.render('products/add', {
        nama_produk: '',
        harga_produk: ''
    })
})

router.post('/add', function (req, res, next) {

    let nama_produk = req.body.nama_produk;
    let harga_produk = req.body.harga_produk;
    let errors = false;

    if (nama_produk.length === 0 || harga_produk.length === 0) {
        errors = true;

        req.flash('error', "Masukan Nama dan harga produk");
        res.render('products/add', {
            nama_produk: nama_produk,
            harga_produk: harga_produk
        })
    }

    if (!errors) {
        var form_data = {
            nama_produk: nama_produk,
            harga_produk: harga_produk
        }

        dbConn.query('INSERT INTO produk SET ?', form_data, function (err, result) {
            if (err) {
                req.flash('error', err)

                res.render('products/add', {
                    nama_produk: form_data.nama_produk,
                    harga_produk: form_data.harga_produk
                })
            } else {
                req.flash('success', 'Produk berhasil di tambah');
                res.redirect('/products');
            }
        })
    }
})

router.get('/edit/(:id_produk)', function (req, res, next) {

    let id_produk = req.params.id_produk;

    dbConn.query('SELECT * FROM produk WHERE id_produk = ' + id_produk, function (err, rows, fields) {
        if (err) throw err

        if (rows.length <= 0) {
            req.flash('error', 'Produk dengan id = ' + id + ' tidak di temukan')
            res.redirect('/products')
        }
        else {
            res.render('products/edit', {
                title: 'Edit Book',
                id_produk: rows[ 0 ].id_produk,
                nama_produk: rows[ 0 ].nama_produk,
                harga_produk: rows[ 0 ].harga_produk
            })
        }
    })
})

router.post('/update/:id_produk', function (req, res, next) {

    let id_produk = req.params.id_produk;
    let nama_produk = req.body.nama_produk;
    let harga_produk = req.body.harga_produk;
    let errors = false;

    if (nama_produk.length === 0 || harga_produk.length === 0) {
        errors = true;

        req.flash('error', "Silahkan isi nama dan harga produk");
        res.render('products/edit', {
            id_produk: req.params.id_produk,
            nama_produk: nama_produk,
            harga_produk: harga_produk
        })
    }

    if (!errors) {

        var form_data = {
            nama_produk: nama_produk,
            harga_produk: harga_produk
        }

        dbConn.query('UPDATE produk SET ? WHERE id_produk = ' + id_produk, form_data, function (err, result) {

            if (err) {
                req.flash('error', err)
                res.render('products/edit', {
                    id_produk: req.params.id_produk,
                    nama_produk: form_data.nama_produk,
                    harga_produk: form_data.harga_produk
                })
            } else {
                req.flash('success', 'Data produk berhasil di perbarui');
                res.redirect('/products');
            }
        })
    }
})

router.get('/delete/(:id_produk)', function (req, res, next) {

    let id_produk = req.params.id_produk;

    dbConn.query('DELETE FROM produk WHERE id_produk = ' + id_produk, function (err, result) {
        if (err) {
            req.flash('error', err)
            res.redirect('/products')
        } else {
            req.flash('success', 'Data produk berhasil dihapus! Id Produk = ' + id_produk)
            res.redirect('/products')
        }
    })
})

module.exports = router;