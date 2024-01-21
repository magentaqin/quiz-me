import type { NextPage } from "next";
import Layout from "../components/Layout";
import MainContent from "../components/MainContent";
import styles from "../styles/Home.module.scss";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <main>
        <MainContent />
      </main>
    </div>
  );
};

export default Home;
