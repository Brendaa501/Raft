const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Estado dos nós
let leader = "node1";

let nodes = {
  node1: [],
  node2: [],
  node3: []
};

// Ver estado
app.get('/status', (req, res) => {
  res.json({ leader, nodes });
});

// Enviar transação
app.post('/transacao', (req, res) => {
  const { valor } = req.body;

  // líder recebe
  nodes[leader].push(valor);

  // replica para maioria
  let count = 1;
  for (let node in nodes) {
    if (node !== leader && count < 3) {
      nodes[node].push(valor);
      count++;
    }
  }

  res.json({ msg: "Transação confirmada!", leader });
});

// Simular falha do líder
app.post('/falha', (req, res) => {
  if (leader === "node1") leader = "node2";
  else if (leader === "node2") leader = "node3";
  else leader = "node1";

  res.json({ msg: "Novo líder eleito!", leader });
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));