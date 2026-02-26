const express = require('express');
const path = require('path');
const { execSync } = require('child_process');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

// Products database
let products = [
  { id: 1, name: 'Laptop', price: 999, stock: 5 },
  { id: 2, name: 'Mouse', price: 25, stock: 50 },
  { id: 3, name: 'Keyboard', price: 75, stock: 30 },
  { id: 4, name: 'Monitor', price: 299, stock: 10 }
];

let gitLog = [];

// API Routes
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.post('/api/cart', (req, res) => {
  const { productId } = req.body;
  const product = products.find(p => p.id === productId);
  
  if (product && product.stock > 0) {
    product.stock--;
    logGitCommand('git add .', 'Product added to cart', 'success');
    res.json({ success: true, product });
  } else {
    res.json({ success: false, message: 'Out of stock' });
  }
});

app.post('/api/git/push', (req, res) => {
  logGitCommand('git push origin main', 'Changes pushed to repository', 'success');
  res.json({ success: true, message: 'Pushed to remote' });
});

app.post('/api/git/pull', (req, res) => {
  logGitCommand('git pull origin main', 'Latest changes pulled', 'success');
  res.json({ success: true, message: 'Pulled from remote' });
});

app.post('/api/git/commit', (req, res) => {
  const { message } = req.body;
  logGitCommand(`git commit -m "${message}"`, `Commit: ${message}`, 'success');
  res.json({ success: true, message: 'Changes committed' });
});

app.post('/api/git/status', (req, res) => {
  logGitCommand('git status', 'Repository status checked', 'info');
  res.json({ success: true, changes: products.length });
});

app.get('/api/git/log', (req, res) => {
  res.json(gitLog);
});

function logGitCommand(command, description, type) {
  gitLog.unshift({
    timestamp: new Date().toLocaleTimeString(),
    command,
    description,
    type
  });
  if (gitLog.length > 20) gitLog.pop();
}

app.listen(PORT, () => {
  console.log(`🚀 E-commerce Git Demo running at http://localhost:${PORT}`);
  console.log(`📦 Products available | 🔧 Git commands showcase`);
});
