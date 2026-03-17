import styles from "./page.module.css";

export default function UpdatingPage() {
  return (
    <div className={styles["update-page"]}>
      <div className={styles["update-box"]}>
       <h1>🚧 Updating Soon</h1>
<p>Registration will be available shortly.</p>
<p className={styles.note}>Check back frequently for updates.</p>

      </div>
    </div>
  );
}
