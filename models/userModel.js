const connection = require('../config/db');

const User = {
  findByEmailAndPassword: (email, password, callback) => {
    const query = 'SELECT * FROM participantes WHERE email = ? AND senha = ?';
    connection.query(query, [email, password], callback);
  },
  findByEmail: (email, callback) => {
    const query = 'SELECT * FROM participantes WHERE email = ?';
    connection.query(query, [email], callback);
  },
  create: (nome, email, password, callback) => {
    const query = 'INSERT INTO participantes (nome, email, senha) VALUES (?, ?, ?)';
    connection.query(query, [nome, email, password], callback);
  },
  
};

module.exports = User;
