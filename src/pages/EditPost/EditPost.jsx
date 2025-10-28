import styles from "./EditPost.module.css";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useAuthValue } from "../../contexts/AuthContext";
import { useFetchDocument } from "../../hooks/useFetchDocument"; 
import { useUpdateDocument } from "../../hooks/useUpdateDocument"; 

const EditPost = () => {
  const { id } = useParams();
  const { document: post, loading: fetchLoading } = useFetchDocument("posts", id);

  const [title, setTitle] = useState("");
  const [image, setImage] = useState(""); 
  const [body, setBody] = useState("");
  const [tags, setTags] = useState(""); 
  const [formError, setFormError] = useState("");

  const { user } = useAuthValue();
  const navigate = useNavigate();

  const { updateDocument, response: updateResponse } = useUpdateDocument("posts");

  useEffect(() => {
    if (post) {
      setTitle(post.title || "");
      setImage(post.image || "");
      setBody(post.body || "");
      
      const textTags = post.tags ? post.tags.join(", ") : "";
      setTags(textTags);
    }
  }, [post]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");

    if (!post || post.user_id !== user.id) {
        setFormError("Ação não autorizada ou post não encontrado.");
        return;
    }

    if (!title || !image || !tags || !body) {
      setFormError("Por favor, preencha todos os campos!");
      return;
    }
    
    const tagsArray = tags.split(",").map((tag) => tag.trim().toLowerCase());
    
    const data = {
      title,
      image,
      body,
      tags: tagsArray,
    };

    updateDocument(id, data)
      .then(() => {
        navigate("/dashboard");
      })
      .catch((error) => {
        setFormError(`Erro ao atualizar: ${error.message}`);
      });
  };

  if (fetchLoading) {
    return <p>Carregando post para edição...</p>;
  }

  if (!post || (post.user_id && post.user_id !== user.id)) {
    return <p className={styles.error}>Você não tem permissão para editar este post ou ele não existe.</p>;
  }

  return (
    <div className={styles.edit_post}>
      <h2>Editando post: {post.title}</h2>
      <p>Altere os dados do post conforme a sua necessidade.</p>
      
      <form onSubmit={handleSubmit}>
        <label>
          <span>Título:</span>
          <input
            type="text"
            name="title"
            required
            placeholder="Título do post"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
        </label>
        
        <p className={styles.preview_title}>Pré-visualização da imagem atual:</p>
        <img
          className={styles.image_preview}
          src={image}
          alt={`Imagem de ${title}`}
        />

        <label>
          <span>URL da Imagem (Apenas link):</span>
          <input
            type="text"
            name="image"
            required
            placeholder="Insira a URL da imagem (Supabase/Cloudinary)"
            onChange={(e) => setImage(e.target.value)}
            value={image}
          />
        </label>

        <label>
          <span>Conteúdo:</span>
          <textarea
            name="body"
            required
            placeholder="Conteúdo do post"
            onChange={(e) => setBody(e.target.value)}
            value={body}
          ></textarea>
        </label>
        
        <label>
          <span>Tags:</span>
          <input
            type="text"
            name="tags"
            required
            placeholder="Insira as tags separadas por vírgula"
            onChange={(e) => setTags(e.target.value)}
            value={tags}
          />
        </label>

        {updateResponse.loading ? (
          <button className="btn" disabled>
            Aguarde...
          </button>
        ) : (
          <button className="btn">Atualizar</button>
        )}
        
        {(updateResponse.error || formError) && (
          <p className="error">{updateResponse.error || formError}</p>
        )}
      </form>
    </div>
  );
};

export default EditPost;