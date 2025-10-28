import { useState, useEffect } from "react";
import { supabase } from "../supabase/client";

export const useFetchDocuments = (tableName) => {
  const [documents, setDocuments] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from(tableName) 
          .select("*") 
          .order("created_at", { ascending: false }); 

        if (error) {
          throw error;
        }

        setDocuments(data);
      } catch (error) {
        console.error("Erro ao buscar documentos:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [tableName]);

  return { documents, loading, error };
};