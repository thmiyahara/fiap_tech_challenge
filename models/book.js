const { createClient } = require('@supabase/supabase-js');

// Configurar Supabase
const supabaseUrl = 'https://bcjvrrcjeueinodcrcac.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjanZycmNqZXVlaW5vZGNyY2FjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE1MDQxNzAsImV4cCI6MjAzNzA4MDE3MH0.1LP44oTad4lXWaGF_vjpI0gJxip1VkBy2BLWO97l2bc'; 

const supabase = createClient(supabaseUrl, supabaseKey);

const Book = {
    // Inserir novo livro
    async insertBook(book) {
        const { data, error } = await supabase
            .from('books')
            .insert([book]) 
            .select(); 

        return { data, error }; 
    },

    // Buscar livros
    async getAllBooks() {
        return await supabase.from('books').select('*');
    },

    // Atualizar livros
    async updateBook(id, book) {
        return await supabase.from('books').update(book).eq('id', id).select(); 
    },

    // Deletar livros
    async deleteBook(id) {
        return await supabase.from('books').delete().eq('id', id);
    }
};


module.exports = Book;