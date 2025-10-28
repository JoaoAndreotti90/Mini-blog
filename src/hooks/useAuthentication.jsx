import { useState } from "react";
import { supabase } from "../supabase/client"; 

export const useAuthentication = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const createUser = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const { data: userData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            display_name: data.displayName, 
          },
        },
      });

      if (authError) {
        throw authError;
      }

      setLoading(false);
      return userData.user; 

    } catch (error) {
      console.error(error);
      let systemErrorMessage;

      if (error.message.includes("User already registered")) {
        systemErrorMessage = "E-mail já cadastrado.";
      } else if (error.message.includes("Password should be at least 6 characters")) {
        systemErrorMessage = "A senha precisa ter no mínimo 6 caracteres.";
      } else {
        systemErrorMessage = "Ocorreu um erro, por favor tente mais tarde.";
      }
      
      setError(systemErrorMessage);
      setLoading(false);
    }
  };

  const login = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        throw authError;
      }
      
      setLoading(false);

    } catch (error) {
      console.error(error);
      let systemErrorMessage;

      if (error.message.includes("Invalid login credentials")) {
        systemErrorMessage = "E-mail ou senha inválidos.";
      } else {
        systemErrorMessage = "Ocorreu um erro, por favor tente mais tarde.";
      }

      setError(systemErrorMessage);
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);

    try {
      await supabase.auth.signOut();
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError("Ocorreu um erro ao sair.");
      setLoading(false);
    }
  };
  
  return {
    createUser,
    login,
    logout,
    loading,
    error,
  };
};