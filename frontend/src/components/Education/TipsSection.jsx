import React from 'react';
import styles from '../../styles/Education.module.css';

const TipsSection = ({ data, selectedCategory }) => {
  const getImportanceClass = (importance) => {
    switch (importance) {
      case 'alta': return styles.highImportance;
      case 'media': return styles.mediumImportance;
      default: return styles.lowImportance;
    }
  };

  const getImportanceLabel = (importance) => {
    switch (importance) {
      case 'alta': return 'Alta Prioridad';
      case 'media': return 'Prioridad Media';
      default: return 'Información General';
    }
  };

  return (
    <section className={styles.tipsSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{data.title}</h2>
        <p className={styles.sectionDescription}>
          Consejos prácticos y efectivos para el cuidado de tu mascota
        </p>
      </div>
      
      <div className={styles.tipsGrid}>
        {data.tips.map((tip) => (
          <div key={tip.id} className={styles.tipCard}>
            <div className={styles.tipHeader}>
              <div className={styles.tipIcon}>{tip.icon}</div>
              <div className={`${styles.tipImportance} ${getImportanceClass(tip.importance)}`}>
                {getImportanceLabel(tip.importance)}
              </div>
            </div>
            
            <div className={styles.tipContent}>
              <h3 className={styles.tipTitle}>{tip.title}</h3>
              <p className={styles.tipDescription}>{tip.description}</p>
            </div>
            
            <div className={styles.tipFooter}>
              <button className={styles.tipButton}>
                Leer más
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className={styles.tipsFooter}>
        <div className={styles.tipsSummary}>
          <span className={styles.tipsCount}>
            {data.tips.length} consejos disponibles
          </span>
          <span className={styles.tipsPriority}>
            {data.tips.filter(tip => tip.importance === 'alta').length} de alta prioridad
          </span>
        </div>
      </div>
    </section>
  );
};

export default TipsSection;
