const User = require('../models/userModel');
const connection = require('../config/db');

exports.login = (req, res) => {
    const { username, password } = req.body;

    User.findByEmailAndPassword(username, password, (err, results) => {
        if (err) {
            console.error('Erro ao executar a query:', err.stack);
            return res.render('login', { error: 'Erro no servidor.' });
        }
        if (results.length > 0) {
            req.session.user = {
                id: results[0].id,
                nome: results[0].nome
            };
            return res.redirect('/dashboard');
        } else {
            return res.render('login', { error: 'Falha no login.' });
        }
    });
};

exports.register = (req, res) => {
    const { nome, email, password } = req.body;

    User.findByEmail(email, (err, results) => {
        if (err) {
            console.error('Erro ao executar a query:', err.stack);
            return res.render('registro', { erroemail: 'Erro no servidor.' });
        }
        if (results.length > 0) {
            return res.render('registro', { erroemail: 'Email já registrado. Escolha outro email.' });
        } else {
            User.create(nome, email, password, (err, results) => {
                if (err) {
                    console.error('Erro ao executar a query:', err.stack);
                    return res.render('registro', { erroemail: 'Erro no servidor.' });
                }
                res.redirect('/');
            });
        }
    });
};

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
};

exports.dashboard = (req, res) => {
    if (req.session.user) {
        const nomeUsuario = req.session.user.nome;
        res.render('dashboard', { nomeUsuario });
    } else {
        res.redirect('/');
    }
};

exports.chat = (req, res) => {
    if (req.session.user) {
        const nomeUsuario = req.session.user.nome;
        res.render('chat', { nomeUsuario });
    } else {
        res.redirect('/');
    }
};

exports.criarAtividade = (req, res) => {
    const { titulo, descricao, status, prazo } = req.body;
    const query = 'INSERT INTO tarefa (titulo, descricao, status, prazo) VALUES (?, ?, ?, ?)';
    connection.query(query, [titulo, descricao, status, prazo], (err, results) => {
        if (err) {
            console.error('Erro ao inserir atividade:', err);
            return res.status(500).send('Erro ao criar atividade');
        }
        res.redirect('/dashboard');
    });
};

exports.listarAtividades = (req, res) => {
    const query = 'SELECT * FROM tarefa';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar atividades:', err);
            return res.status(500).send('Erro ao buscar atividades');
        }
        res.render('listagem', { atividades: results });
    });
};

exports.deletarAtividade = (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM tarefa WHERE id = ?';
    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error('Erro ao deletar atividade:', err);
            return res.status(500).send('Erro ao deletar atividade');
        }
        res.redirect('/listarAtividades');
    });
};


exports.editarAtividade = (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM tarefa WHERE id = ?';
    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar atividade:', err);
            return res.status(500).send('Erro ao buscar atividade');
        }
        if (results.length > 0) {
            res.render('editarAtividade', { atividade: results[0] });
        } else {
            res.status(404).send('Atividade não encontrada');
        }
    });
};

exports.atualizarAtividade = (req, res) => {
    const { id } = req.params;
    const { titulo, descricao, status, prazo } = req.body;
    const query = 'UPDATE tarefa SET titulo = ?, descricao = ?, status = ?, prazo = ? WHERE id = ?';
    connection.query(query, [titulo, descricao, status, prazo, id], (err, results) => {
        if (err) {
            console.error('Erro ao atualizar atividade:', err);
            return res.status(500).send('Erro ao atualizar atividade');
        }
        res.redirect('/listarAtividades');
    });
};
