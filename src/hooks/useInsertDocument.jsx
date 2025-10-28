import { useState, useReducer } from "react";
import { supabase } from "../supabase/client"; 

const initialState = {
  loading: null,
  error: null,
};

const insertReducer = (state, action) => {
  switch (action.type) {
    case "LOADING":
      return { loading: true, error: null };
    case "INSERTED_DOC":
      return { loading: false, error: null };
    case "ERROR":
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const useInsertDocument = (tableName) => {
  const [response, dispatch] = useReducer(insertReducer, initialState);
  const [cancelled] = useState(false); 

  const checkCancelBeforeDispatch = (action) => {
    if (!cancelled) {
      dispatch(action);
    }
  };

  const insertDocument = async (document) => {
    checkCancelBeforeDispatch({ type: "LOADING" });

    try {
      const { data, error } = await supabase
        .from(tableName) 
        .insert([document]) 
        .select(); 

      if (error) {
        throw error;
      }

      checkCancelBeforeDispatch({
        type: "INSERTED_DOC",
        payload: data,
      });

    } catch (error) {
      console.error(error.message);
      checkCancelBeforeDispatch({ type: "ERROR", payload: error.message });
      throw new Error(error.message);
    }
  };
  
  return { insertDocument, response };
};