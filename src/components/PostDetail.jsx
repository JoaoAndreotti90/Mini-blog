import { Link } from "react-router-dom";
import styles from "./PostDetail.module.css";

const PostDetail = ({ post }) => {
  return (
    <div className={styles.post_detail}>
      <div> 
        <img src={post.image} alt={post.title} />
        <div className={styles.post_content}> 
          <h2>{post.title}</h2>
          <p className={styles.createdby}>por: {post.created_by}</p>
          <div className={styles.tags}>
            {post.tags.map((tag) => (
              <p key={tag}>
                <span>#</span>
                {tag}
              </p>
            ))}
          </div>
        </div>
      </div>
      <Link to={`/posts/${post.id}`} className={styles.post_read_btn}> 
        Ler
      </Link>
    </div>
  );
};

export default PostDetail;