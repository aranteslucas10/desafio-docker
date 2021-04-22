const express = require('express')
const app = express()
const port = 3000
const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'nodedb'
};
const mysql = require('mysql2/promise')

async function addNewPeople(name) {
    const connection = await mysql.createConnection(config)
    const sql = `INSERT INTO people(name) values('${name}')`
    await connection.query(sql)
    connection.end()
}

async function createTableIfNotExists() {
    const connection = await mysql.createConnection(config)
    const sql = `CREATE TABLE IF NOT EXISTS people (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL)`
    await connection.query(sql)
    connection.end()
}

async function query(sql) {
    const connection = await mysql.createConnection(config)
    const [results, ] = await connection.query(sql)
    return results
}

async function getPeoples() {
    const rows = await query("SELECT name FROM people")
    return rows
}

app.get('/', async (request, response) => {
    html = '<h1>Full Cycle Rocks!</h1>'
    const peoples = await getPeoples()
    for (row in peoples) {
        html += "<li>" + peoples[row].name + "</li>"
    }
    response.send(html)
})

app.listen(port, async () => {
    await createTableIfNotExists()
    await addNewPeople("Lucas Arantes")
})