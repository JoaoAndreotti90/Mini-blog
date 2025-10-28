import styles from "./CreatePost.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthValue } from "../../contexts/AuthContext";
import { supabase } from "../../supabase/client"; 
import { useInsertDocument } from "../../hooks/useInsertDocument";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [body, setBody] = useState("");
  const [tags, setTags] = useState(""); 
  const [formError, setFormError] = useState("");
  const [uploading, setUploading] = useState(false);

  const { user } = useAuthValue();
  const navigate = useNavigate();
  const { insertDocument, response } = useInsertDocument("posts");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!user) {
      setFormError("Você precisa estar logado para criar um post!");
      return;
    }

    setUploading(true);

    if (!image || !title || !body || !tags) {
      setFormError("Por favor, preencha todos os campos!");
      setUploading(false);
      return;
    }

    let imageUrl = "";

    try {
      const fileName = `${Date.now()}_${image.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("post-images")
        .upload(fileName, image);

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage
        .from("post-images")
        .getPublicUrl(fileName);

      if (!publicUrlData) {
        throw new Error("Não foi possível obter a URL pública da imagem.");
      }

      imageUrl = publicUrlData.publicUrl;

    } catch (error) {
      console.error(error.message);
      setFormError("Ocorreu um erro ao enviar a imagem. Tente novamente.");
      setUploading(false);
      return;
    }

    setUploading(false);

    const tagsArray = tags.split(",").map((tag) => tag.trim().toLowerCase());

    try {
      await insertDocument({
        title,
        image: imageUrl,
        body,
        tags: tagsArray,
        user_id: user.id, 
        created_by: user.user_metadata.display_name, 
      });

      navigate("/");
    } catch (error) {
      setFormError(`Erro ao salvar o post: ${error.message}`);
    }
  };

  return (
    <div className={styles.create_post}>
      <h2>Criar post</h2>
      <p>Escreva sobre o que quiser e compartilhe o seu conhecimento!</p>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Título:</span>
          <input
            type="text"
            name="text"
            required
            placeholder="Pense num bom título..."
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
        </label>

        <label className={styles.image_label}>
          <span>Imagem:</span>
          <label htmlFor="file_input" className={styles.upload_btn}>
            Selecionar Imagem
          </label>
          <input
            id="file_input"
            type="file"
            name="image"
            required
            onChange={(e) => setImage(e.target.files[0])}
            className={styles.hidden_input}
          />
          {image && <span className={styles.file_name}>{image.name}</span>}
        </label>

        <label>
          <span>Conteúdo:</span>
          <textarea
            name="body"
            required
            placeholder="Insira o conteúdo do post"
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

        {!(response.loading || uploading) && (
          <button className="btn">Criar post!</button>
        )}
        {(response.loading || uploading) && (
          <button className="btn" disabled>
            Aguarde...
          </button>
        )}
        {(response.error || formError) && (
          <p className="error">{response.error || formError}</p>
        )}
      </form>
    </div>
  );
};

export default CreatePost;