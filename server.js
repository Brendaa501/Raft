// Importa as bibliotecas necessárias
const express = require('express'); // cria o servidor
const cors = require('cors'); // permite conexão com o frontend

// Cria o servidor
const app = express();

// Permite acesso de outras origens (frontend)
app.use(cors());

// Permite receber dados em JSON
app.use(express.json());


// 🧠 ESTADO DO SISTEMA (RAFT SIMPLIFICADO)

// Define quem é o líder atual
let leader = "node1";

// Simula os nós do sistema distribuído
// Cada nó armazena uma lista de transações
let nodes = {
  node1: [],
  node2: [],
  node3: []
};


// 📊 ROTA PARA VER O ESTADO DO SISTEMA

app.get('/status', (req, res) => {
  // Retorna quem é o líder e o estado de todos os nós
  res.json({ leader, nodes });
});


// 💰 ROTA PARA ENVIAR TRANSAÇÃO

app.post('/transacao', (req, res) => {

  // Pega o valor enviado pelo usuário
  const { valor } = req.body;

  // 🟢 PASSO 1: líder recebe a transação
  nodes[leader].push(valor);

  // 🟢 PASSO 2: replicação para outros nós (consenso)
  let count = 1; // já conta o líder

  for (let node in nodes) {

    // Evita enviar para o próprio líder
    if (node !== leader && count < 3) {

      // Replica a transação
      nodes[node].push(valor);

      count++; // aumenta o número de nós que receberam
    }
  }

  // 🟢 PASSO 3: confirma a transação
  res.json({ msg: "Transação confirmada!", leader });
});


// ⚠️ ROTA PARA SIMULAR FALHA DO LÍDER

app.post('/falha', (req, res) => {

  // Troca o líder (simulação de eleição)
  if (leader === "node1") leader = "node2";
  else if (leader === "node2") leader = "node3";
  else leader = "node1";

  // Retorna o novo líder
  res.json({ msg: "Novo líder eleito!", leader });
});


// 🚀 INICIA O SERVIDOR

app.listen(3000, () => 
  console.log("Servidor rodando na porta 3000")
);