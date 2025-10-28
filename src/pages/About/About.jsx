import styles from "./About.module.css";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className={styles.about}>
      <h2>
        Sobre o Mini <span>Blog</span>
      </h2>
      <p>
        Bem-vindo ao Mini Blog! Esta plataforma foi desenvolvida com React no
        front-end, proporcionando uma interface de usuário dinâmica, e Supabase
        no back-end para gerenciamento de dados e autenticação.
      </p>
      <Link to="/posts/create" className="btn">
        Criar post
      </Link>
    </div>
  );
};

export default About;