const express = require('express'); 
const { createClient } = require('@supabase/supabase-js'); 
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');

const app = express(); 

app.use(cors());

app.use(express.json()); 



// Supabase URL e chave de API
const supabaseUrl = 'https://bcjvrrcjeueinodcrcac.supabase.co'; // 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjanZycmNqZXVlaW5vZGNyY2FjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE1MDQxNzAsImV4cCI6MjAzNzA4MDE3MH0.1LP44oTad4lXWaGF_vjpI0gJxip1VkBy2BLWO97l2bc'; 
const supabase = createClient(supabaseUrl, supabaseKey); 

// Swagger configuration
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API CRUD de Livros',
            version: '1.0.0',
            description: 'Uma API para gerenciar uma coleção de livros.',
            contact: {
                name: 'Seu Nome',
                email: 'seu_email@example.com',
            },
        },
        servers: [
            {
                url: 'http://localhost:3000', // URL do servidor
            },
        ],
    },
    apis: ['./controller/*.js'], // Caminho para os arquivos onde a documentação das APIs está
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs)); // Define a rota /api-docs para acesso à documentação


// Definindo as rotas da aplicação
app.use('/api/books', require('./controller/books')(supabase)); 

// Iniciar o servidor
const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`); 
});


