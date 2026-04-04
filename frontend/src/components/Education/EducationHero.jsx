import React from 'react';
import styles from '../../styles/Education.module.css';

const EducationHero = () => {
  return (
    <section className={styles.educationHeroSection}>
      <div className={styles.heroContent}>
        <div className={styles.heroText}>
          <h1 className={styles.heroTitle}>
            Centro Educativo
            <span className={styles.heroSubtitle}>PatitasBog</span>
          </h1>
          <p className={styles.heroDescription}>
            Aprende consejos y mejores prácticas para cuidar a tu mascota, 
            prevenir pérdidas y actuar eficazmente en caso de emergencia.
          </p>
          <div className={styles.heroStats}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>500+</span>
              <span className={styles.statLabel}>Consejos útiles</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>1000+</span>
              <span className={styles.statLabel}>Mascotas ayudadas</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>24/7</span>
              <span className={styles.statLabel}>Disponible</span>
            </div>
          </div>
        </div>
        <div className={styles.heroImage}>
          <div className={styles.imageContainer}>
            <div className={styles.heroIcon}>🎓</div>
            <div className={styles.floatingElements}>
              <div className={styles.floatingElement}>💡</div>
              <div className={styles.floatingElement}>📚</div>
              <div className={styles.floatingElement}>🐕</div>
              <div className={styles.floatingElement}>🐱</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EducationHero;
