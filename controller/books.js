const express = require('express'); 
const router = express.Router(); 
const Book = require('../models/book'); 


module.exports = (supabase) => {

    // Função para validar o corpo da requisição
    const validateBook = (body) => {
        const { nome, autor, editora } = body; 
        const errors = []; 

     
        if (!nome) {
            errors.push('O campo "nome" é obrigatório.'); 
        } else if (typeof nome !== 'string') {
            errors.push('O campo "nome" deve ser uma string.'); 
        }

        // Valida o campo "autor"
        if (!autor) {
            errors.push('O campo "autor" é obrigatório.'); 
        } else if (typeof autor !== 'string') {
            errors.push('O campo "autor" deve ser uma string.'); 
        }

        // Valida o campo "editora"
        if (!editora) {
            errors.push('O campo "editora" é obrigatório.'); 
        } else if (typeof editora !== 'string') {
            errors.push('O campo "editora" deve ser uma string.'); 
        }

        return errors; 
    }

    // Criar um novo livro
    router.post('/', async (req, res) => {
        const errors = validateBook(req.body); 
        if (errors.length > 0) {
            return res.status(400).json({ errors }); // Retorna um erro 400 (Bad Request) se houver erros de validação
        }

        const { nome, autor, editora } = req.body;
        const { data, error } = await Book.insertBook({ nome, autor, editora });

        // Retorna uma mensagem de erro caso a inserção falhe
        if (error) return res.status(400).json({ message: error.message });
        // Retorna uma resposta de sucesso com os dados inseridos
        res.status(201).json({ message: 'Livro criado com sucesso!', data });
    });

    // Obter todos os livros
    router.get('/', async (req, res) => {
        const { data, error } = await Book.getAllBooks(); 
        // Retorna um erro 500 se houver problemas na consulta
        if (error) return res.status(500).json({ message: error.message });
        res.json(data); 
    });

    // Atualizar um livro
    router.put('/:id', async (req, res) => {
        const { id } = req.params; // Obtém o ID do livro a ser atualizado da URL
        const errors = validateBook(req.body); 
        if (errors.length > 0) {
            return res.status(400).json({ errors }); 
        }

        // Verifica se o livro existe antes de atualizar
        const { data: existingBooks, error: fetchError } = await Book.getAllBooks();
        if (fetchError) {
            return res.status(500).json({ message: fetchError.message }); // Retorna erro 500 se houver um problema ao buscar os livros
        }

        const bookToUpdate = existingBooks.find(book => book.id === parseInt(id));

        if (!bookToUpdate) {
            return res.status(404).json({ message: 'Livro não encontrado.' });
        }

        const { nome, autor, editora } = req.body;
        const { data, error } = await Book.updateBook(id, { nome, autor, editora });

        if (error) return res.status(400).json({ message: error.message });
        res.json({ message: 'Livro atualizado com sucesso!', data });
    });

    // Deletar um livro
    router.delete('/:id', async (req, res) => {
        const { id } = req.params;

        // Verifica se o livro existe antes de deletar
        const { data: existingBooks, error: fetchError } = await Book.getAllBooks();
        if (fetchError) {
            return res.status(500).json({ message: fetchError.message }); 
        }

        const bookToDelete = existingBooks.find(book => book.id === parseInt(id)); 

        if (!bookToDelete) {
            return res.status(404).json({ message: 'Livro não encontrado.' }); 
        }

        // Seguir com o delete
        const { data, error } = await Book.deleteBook(id);
        if (error) return res.status(400).json({ message: error.message });
        res.json({ message: 'Livro deletado com sucesso!' });
    });

    return router; 
};