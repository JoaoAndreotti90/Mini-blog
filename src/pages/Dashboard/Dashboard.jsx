import styles from "./Dashboard.module.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import { useFetchUserDocuments } from "../../hooks/useFetchUserDocuments.jsx";
import { useDeleteDocument } from "../../hooks/useDeleteDocument";

const Dashboard = () => {
  const { deleteDocument, response } = useDeleteDocument("posts");
  const {
    documents: fetchedPosts,
    loading,
    error,
  } = useFetchUserDocuments("posts");

  const [posts, setPosts] = useState([]);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  useEffect(() => {
    if (fetchedPosts) {
      setPosts(fetchedPosts);
    }
  }, [fetchedPosts]);

  const handleDelete = (id) => {
    setPostToDelete(id);
    setShowConfirmModal(true);
  };

  const handleCancel = () => {
    setShowConfirmModal(false);
    setPostToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (postToDelete) {
      deleteDocument(postToDelete);
      setPosts(posts.filter((post) => post.id !== postToDelete));
    }
    handleCancel();
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p className="error">Erro ao carregar posts: {error}</p>;
  }

  return (
    <div className={styles.dashboard}>
      <h2>Dashboard</h2>
      <p>Gerencie os seus posts</p>
      {posts && posts.length === 0 ? (
        <div className={styles.noposts}>
          <p>Não foram encontrados posts</p>
          <Link to="/posts/create" className="btn">
            Criar primeiro post
          </Link>
        </div>
      ) : (
        <>
          <div className={styles.post_header}>
            <span>Título</span>
            <span>Ações</span>
          </div>

          {posts &&
            posts.map((post) => (
              <div key={post.id} className={styles.post_row}>
                <p>{post.title}</p>
                <div>
                  <Link to={`/posts/${post.id}`} className="btn btn-outline">
                    Ver
                  </Link>
                  <Link
                    to={`/posts/edit/${post.id}`}
                    className="btn btn-outline"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="btn btn-outline btn-danger"
                    disabled={response.loading}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
        </>
      )}

      {response.error && <p className="error">{response.error}</p>}

      {showConfirmModal && (
        <div className={styles.modal_backdrop}>
          <div className={styles.modal_box}>
            <h2>Confirmar Exclusão</h2>
            <p>Tem certeza que deseja excluir este post?</p>
            <div className={styles.modal_buttons}>
              <button
                onClick={handleCancel}
                className="btn btn-outline"
                disabled={response.loading}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="btn btn-danger"
                disabled={response.loading}
              >
                {response.loading ? "Excluindo..." : "Confirmar Exclusão"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;