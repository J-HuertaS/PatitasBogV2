import styles from "../../styles/Home.module.css";

const HeroSection = () => (
    <div className={styles.landingHeroSection}>
        <div className={styles.heroContent}>
            <div className={styles.heroTextSection}>
                <h1 className={styles.heroTitle}>Encuentra a tu mascota perdida aquí</h1>

                <div className={styles.heroQuestions}>
                    <div className={styles.questionItem}>
                        <p>¿Alguna vez has visto un animal que parece perdido y no sabes a quién reportarlo?</p>
                    </div>
                    <div className={styles.questionItem}>
                        <p>¿Alguna vez has perdido a tu mascota y no sabes dónde pedir ayuda?</p>
                    </div>
                    <div className={styles.questionItem}>
                        <p>¿Se hace difícil seguir todos los avistamientos de tu mascota perdida?</p>
                    </div>
                </div>

                <div className={styles.heroSolution}>
                    <p>Aquí está la solución</p>
                </div>
            </div>

            <div className={styles.heroImageSection}>
                <div className={styles.catIllustration}>
                    <img src="/images/cat.svg" alt="Ilustración de gato" className={styles.catSvg} />
                </div>
            </div>
        </div>
    </div>
);

export default HeroSection;
