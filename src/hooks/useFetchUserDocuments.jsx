import { useState, useEffect } from "react";
import { supabase } from "../supabase/client";
import { useAuthValue } from "../contexts/AuthContext"; 

export const useFetchUserDocuments = (tableName) => {
  const [documents, setDocuments] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthValue(); 

  useEffect(() => {
    async function loadData() {
      if (!user) {
        setLoading(false);
        setDocuments([]); 
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from(tableName) 
          .select("*")
          .eq('user_id', user.id) 
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        setDocuments(data);
      } catch (error) {
        console.error("Erro ao buscar documentos do usuário:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [tableName, user]); 

  return { documents, loading, error };
};