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
    
    /**
     * @swagger
     * /api/books:
     *   post:
     *     summary: Adiciona um novo livro
     *     tags: [Livros]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               nome:
     *                 type: string
     *               autor:
     *                 type: string
     *               editora:
     *                 type: string
     *             required:
     *               - nome
     *               - autor
     *               - editora
     *     responses:
     *       201:
     *         description: Livro criado com sucesso
     *       400:
     *         description: Erro de validação
     */
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

    // Obter um livro específico
    /**
     * @swagger
     * /api/books/{id}:
     *   get:
     *     summary: Obtém um livro específico pelo ID
     *     tags: [Livros]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: ID do livro a ser obtido
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Detalhes do livro
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Livro'
     *       404:
     *         description: Livro não encontrado
     *       500:
     *         description: Erro no servidor
     */
    router.get('/:id', async (req, res) => {
        const { id } = req.params;

        if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido.' });
    }

        // Tenta obter o livro pelo ID
        const { data: book, error } = await Book.getBookById(id);

        if (error) {
        return res.status(500).json({ message: error.message });
    }

        if (!book) {
        return res.status(404).json({ message: 'Livro não encontrado.' });
    }

        res.json(book);
    });


    // Obter todos os livros
    /**
     * @swagger
     * /api/books:
     *   get:
     *     summary: Obtém todos os livros
     *     tags: [Livros]
     *     responses:
     *       200:
     *         description: Lista de livros
     *       500:
     *         description: Erro no servidor
     */
    router.get('/', async (req, res) => {
        const { data, error } = await Book.getAllBooks(); 
        // Retorna um erro 500 se houver problemas na consulta
        if (error) return res.status(500).json({ message: error.message });
        res.json(data); 
    });

    // Atualizar um livro
    /**
     * @swagger
     * /api/books/{id}:
     *   put:
     *     summary: Atualiza um livro existente
     *     tags: [Livros]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: ID do livro a ser atualizado
     *         schema:
     *           type: integer
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               nome:
     *                 type: string
     *               autor:
     *                 type: string
     *               editora:
     *                 type: string
     *     responses:
     *       200:
     *         description: Livro atualizado com sucesso
     *       404:
     *         description: Livro não encontrado
     */
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
     /**
     * @swagger
     * /api/books/{id}:
     *   delete:
     *     summary: Deleta um livro
     *     tags: [Livros]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: ID do livro a ser deletado
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Livro deletado com sucesso
     *       404:
     *         description: Livro não encontrado
     */
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