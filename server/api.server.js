'use strict';

const express = require('express');
const compress = require('compression');
const {unlink, writeFile} = require('fs').promises;
const path = require('path');
const {Pool} = require('pg');
const cors = require('cors')

// Don't keep credentials in the source tree in a real app!
const pool = new Pool(require('./credentials'));

const PORT = process.env.PORT || 4000;
const app = express();
app.use(cors())
app.use(compress());
app.use(express.json());

app
    .listen(PORT, () => {
        console.log(`React Notes listening at ${PORT}...`);
    })
    .on('error', function (error) {
        if (error.syscall !== 'listen') {
            throw error;
        }
        const isPipe = (portOrPipe) => Number.isNaN(portOrPipe);
        const bind = isPipe(PORT) ? 'Pipe ' + PORT : 'Port ' + PORT;
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    });

function handleErrors(fn) {
    return async function (req, res, next) {
        try {
            return await fn(req, res);
        } catch (x) {
            next(x);
        }
    };
}

const NOTES_PATH = path.resolve(__dirname, '../notes');

app.post(
    '/notes',
    handleErrors(async function (req, res) {
        const now = new Date();
        const result = await pool.query(
            'insert into notes (title, body, created_at, updated_at) values ($1, $2, $3, $3) returning id',
            [req.body.title, req.body.body, now]
        );
        const insertedId = result.rows[0].id;
        await writeFile(
            path.resolve(NOTES_PATH, `${insertedId}.md`),
            req.body.body,
            'utf8'
        );
        res.status(201).json({id: insertedId})
    })
);

app.put(
    '/notes/:id',
    handleErrors(async function (req, res) {
        const now = new Date();
        const updatedId = Number(req.params.id);
        await pool.query(
            'update notes set title = $1, body = $2, updated_at = $3 where id = $4',
            [req.body.title, req.body.body, now, updatedId]
        );
        await writeFile(
            path.resolve(NOTES_PATH, `${updatedId}.md`),
            req.body.body,
            'utf8'
        );
        res.sendStatus(204)
    })
);

app.delete(
    '/notes/:id',
    handleErrors(async function (req, res) {
        await pool.query('delete from notes where id = $1', [req.params.id]);
        await unlink(path.resolve(NOTES_PATH, `${req.params.id}.md`));
        res.sendStatus(204);
    })
);

app.get(
    '/notes',
    handleErrors(async function (req, res) {
        if (req.query.q) {
            const {rows} = await pool.query('select * from notes where title ilike $1 order by id desc', ['%' + req.query.q + '%']);
            res.json(rows);
        } else {
            const {rows} = await pool.query('select * from notes order by id desc');
            res.json(rows);
        }
    })
);

app.get(
    '/notes/:id',
    handleErrors(async function (req, res) {
        const {rows} = await pool.query('select * from notes where id = $1', [
            req.params.id,
        ]);
        res.json(rows[0]);
    })
);

app.get('/sleep/:ms', function (req, res) {
    setTimeout(() => {
        res.json({ok: true});
    }, req.params.ms);
});
