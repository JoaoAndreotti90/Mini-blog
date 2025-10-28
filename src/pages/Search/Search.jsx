import styles from "./Search.module.css";
import { useMemo } from "react";
import { useFetchDocuments } from "../../hooks/useFetchDocuments";
import { useQuery } from "../../hooks/useQuery";
import PostDetail from "../../components/PostDetail";
import { Link } from "react-router-dom";

const Search = () => {
  const query = useQuery();
  const search = query.get("q") ? query.get("q").toLowerCase().replace("#", "") : "";

  const { documents: posts, loading } = useFetchDocuments("posts");

  console.log("--- DEBUG BUSCA ---");
  console.log("Termo de Busca:", search);
  console.log("Posts Recebidos do Supabase:", posts);
  console.log("Loading:", loading);

  const filteredPosts = useMemo(() => {
    if (!posts || search.length === 0) {
      return null;
    }
    
    return posts.filter(post => {
      const contentMatch = post.title?.toLowerCase().includes(search) || 
                           post.body?.toLowerCase().includes(search);

      const tagMatch = post.tags && Array.isArray(post.tags) && post.tags.some(tag => 
          tag?.toLowerCase().includes(search)
      );

      return contentMatch || tagMatch;
    });

  }, [posts, search]);

  return (
    <div className={styles.search_container}>
      <h2>Resultados da Busca</h2>
      {loading && <p>Carregando...</p>}
      
      <div className="post-list"> 
        {!loading && filteredPosts && filteredPosts.length === 0 && (
          <div className={styles.noposts}>
            <p>Não foram encontrados posts para o termo: "{search}"</p>
            <Link to="/" className="btn btn-outline">
              Voltar
            </Link>
          </div>
        )}

        {filteredPosts && filteredPosts.length > 0 && 
            filteredPosts.map((post) => <PostDetail key={post.id} post={post} />)}
      </div>
    </div>
  );
};

export default Search;