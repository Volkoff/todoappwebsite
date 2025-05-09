import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.contact}>
          <h3>Contact Us</h3>
          <p>Email: antonmivo@gmail.com</p>
          <p>Phone: 608025360</p>
        </div>
        <div className={styles.social}>
          <h3>Follow Us</h3>
          <div className={styles.socialLinks}>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <span className="material-icons">facebook</span>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <span className="material-icons">twitter</span>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <span className="material-icons">linkedin</span>
            </a>
          </div>
        </div>
      </div>
      <div className={styles.copyright}>
        <p>&copy; {new Date().getFullYear()} Game Task Manager. All rights reserved.</p>
      </div>
    </footer>
  );
} 