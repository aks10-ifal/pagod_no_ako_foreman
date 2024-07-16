const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const http = require('http');
const socketIo = require('socket.io');
const userRoutes = require('./routes/userRoutes');
const connection = require('./config/db');
const sharedSession = require('express-socket.io-session');
const methodOverride = require('method-override');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const sessionMiddleware = session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(sessionMiddleware);
app.use(methodOverride('_method'));


app.use('/', userRoutes);

io.use(sharedSession(sessionMiddleware, {
  autoSave: true
}));

io.on('connection', (socket) => {
  console.log('a user connected');

  // Recuperar mensagens do banco de dados e enviá-las ao cliente
  connection.query('SELECT * FROM mensagem', (err, results) => {
    if (err) {
      console.error('Erro ao recuperar mensagens:', err.stack);
      return;
    }
    socket.emit('chat history', results);
  });

  socket.on('chat message', (msg) => {
    if (!socket.handshake.session.user) {
      console.error('Usuário não está autenticado');
      return;
    }

    const { id: id_remetente, nome: nome_remetente } = socket.handshake.session.user;
    const { texto: messageText } = msg; // Ajuste aqui para pegar 'texto' corretamente

    // Salvar a mensagem no banco de dados
    const query = 'INSERT INTO mensagem (id_remetente, texto) VALUES (?, ?)';
    connection.query(query, [id_remetente, messageText], (err, results) => {
      if (err) {
        console.error('Erro ao salvar mensagem:', err.stack);
        return;
      }
      // Emitir a mensagem para todos os clientes
      io.emit('chat message', { nome: nome_remetente, texto: messageText }); // Envia o nome do remetente junto com a mensagem
    });
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const port = process.env.PORT || 3009;
server.listen(port, () => console.log(`Server ready on port ${port}`));
