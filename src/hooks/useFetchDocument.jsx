import { useState, useEffect } from "react";
import { supabase } from "../supabase/client";

export const useFetchDocument = (tableName, id) => {
  const [document, setDocument] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDocument() {
      setLoading(true);
      setError(null);
      setDocument(null); // Limpa o documento anterior

      try {
        // Busca um único documento pelo ID no Supabase
        const { data, error } = await supabase
          .from(tableName) // "posts"
          .select("*")      // Pega todas as colunas
          .eq('id', id)     // Onde a coluna 'id' é igual ao id da URL
          .single();      // Espera apenas um resultado

        if (error) {
          // Se o erro for 'PGRST116', significa "não encontrado"
          if (error.code === 'PGRST116') {
             console.warn(`Documento com id ${id} não encontrado na tabela ${tableName}.`);
             // Não definimos erro, apenas deixamos o document como null
          } else {
            throw error; // Lança outros erros
          }
        }

        setDocument(data); // Define o documento encontrado (ou null se não achou)

      } catch (error) {
        console.error("Erro ao buscar documento:", error);
        setError(error.message);
      } finally {
         setLoading(false);
      }
    }

    if (id) { // Só busca se tiver um ID
      loadDocument();
    } else {
      setLoading(false); // Se não tem ID, não está carregando
    }

  }, [tableName, id]); // Roda quando a tabela ou o ID mudam

  return { document, loading, error };
};