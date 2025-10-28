import { useState, useReducer } from "react";
import { supabase } from "../supabase/client";

const initialState = {
  loading: null,
  error: null,
};

const deleteReducer = (state, action) => {
  switch (action.type) {
    case "LOADING":
      return { loading: true, error: null };
    case "DELETED_DOC":
      return { loading: false, error: null };
    case "ERROR":
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const useDeleteDocument = (tableName) => {
  const [response, dispatch] = useReducer(deleteReducer, initialState);
  const [cancelled] = useState(false);

  const checkCancelBeforeDispatch = (action) => {
    if (!cancelled) {
      dispatch(action);
    }
  };

  const deleteDocument = async (id) => {
    checkCancelBeforeDispatch({ type: "LOADING" });

    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      checkCancelBeforeDispatch({
        type: "DELETED_DOC",
        payload: id,
      });

    } catch (error) {
      console.error("Erro ao deletar documento:", error.message);
      checkCancelBeforeDispatch({ type: "ERROR", payload: error.message });
      throw new Error(error.message);
    }
  };
  
  return { deleteDocument, response };
};