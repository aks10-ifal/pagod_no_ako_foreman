const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'database-14.mysql.database.azure.com',
  user: 'kaua',
  password: 'Augusto777#',
  database: 'gerenciamento_projetos',
  ssl: {
    rejectUnauthorized: true // Define como false se você estiver usando certificados autoassinados
  }
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.stack);
    return;
  }
  console.log('Conectado ao banco de dados como ID', connection.threadId);
});

connection.query('SELECT * FROM participantes', (err, results, fields) => {
  if (err) {
    console.error('Erro ao executar a query:', err.stack);
    return;
  }
  console.log('Resultados da query:', results);
});

module.exports = connection;
