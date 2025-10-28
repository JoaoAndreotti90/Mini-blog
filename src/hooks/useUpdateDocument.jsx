import { useState, useEffect, useReducer } from "react";
import { supabase } from "../supabase/client"; 

const initialState = {
  loading: null,
  error: null,
};

const updateReducer = (state, action) => {
  switch (action.type) {
    case "LOADING":
      return { loading: true, error: null };
    case "UPDATED_DOC":
      return { loading: false, error: null };
    case "ERROR":
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const useUpdateDocument = (docCollection) => {
  const [response, dispatch] = useReducer(updateReducer, initialState);

  const [cancelled, setCancelled] = useState(false);

  const checkCancelBeforeDispatch = (action) => {
    if (!cancelled) {
      dispatch(action);
    }
  };

  const updateDocument = async (id, data) => { 
    checkCancelBeforeDispatch({ type: "LOADING" });

    try {
      const { data: updatedDocument, error } = await supabase
        .from(docCollection)
        .update(data)
        .eq('id', id)
        .select();

      if (error) {
        throw error;
      }

      checkCancelBeforeDispatch({
        type: "UPDATED_DOC",
        payload: updatedDocument,
      });

      return updatedDocument;
      
    } catch (error) {
      console.error(error.message);
      checkCancelBeforeDispatch({ type: "ERROR", payload: error.message });
      throw new Error(error.message); 
    }
  };

  useEffect(() => {
    return () => setCancelled(true);
  }, []);

  return { updateDocument, response };
};