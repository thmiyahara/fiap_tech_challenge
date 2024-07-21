const express = require('express'); 
const { createClient } = require('@supabase/supabase-js'); 

const app = express(); 
app.use(express.json()); 

// Supabase URL e chave de API
const supabaseUrl = 'https://bcjvrrcjeueinodcrcac.supabase.co'; // 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjanZycmNqZXVlaW5vZGNyY2FjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE1MDQxNzAsImV4cCI6MjAzNzA4MDE3MH0.1LP44oTad4lXWaGF_vjpI0gJxip1VkBy2BLWO97l2bc'; 
const supabase = createClient(supabaseUrl, supabaseKey); 

// Definindo as rotas da aplicação
app.use('/api/books', require('./controller/books')(supabase)); 

// Iniciar o servidor
const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`); 
});


