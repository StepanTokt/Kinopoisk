#!/usr/bin/env node

import { createServer } from 'http';
import { parse } from 'url';
import { readFileSync } from 'fs';

const PORT = 3004;
const ACTORS_FILE = new URL('actors_db.json', import.meta.url);

console.log('directory', ACTORS_FILE);

let actors;
try {
    const data = readFileSync(ACTORS_FILE, 'utf8');
    actors = JSON.parse(data);
} catch (err) {
    console.error('Error reading actors file:', err);
    process.exit(1);
}

const server = createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    const parsedUrl = parse(req.url, true);

    if (parsedUrl.pathname === '/actor' && req.method === 'GET') {
        const query = parsedUrl.query;

        console.log('Request:', parsedUrl.path);
        // console.log('Query:', query);

        if (query.id) {
            const actor = actors[query.id];

            if (actor) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                console.log('Response:', actor);
                res.end(JSON.stringify(actor));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Actor not found' }));
            }
        } else {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Missing id query parameter' }));
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Endpoint not found' }));
    }
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});