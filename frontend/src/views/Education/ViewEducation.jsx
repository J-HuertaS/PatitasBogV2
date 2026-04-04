import React, { useState } from 'react';
import styles from '../../styles/Education.module.css';
import EducationHero from '../../components/Education/EducationHero';
import TipsSection from '../../components/Education/TipsSection';
import CategoriesSection from '../../components/Education/CategoriesSection';

const ViewEducation = () => {
  const [selectedCategory, setSelectedCategory] = useState('general');

  // Datos de ejemplo para los consejos
  const educationData = {
    general: {
      title: "Consejos Generales",
      tips: [
        {
          id: 1,
          title: "Identificación de tu mascota",
          description: "Asegúrate de que tu mascota siempre lleve identificación con tu número de teléfono actualizado.",
          icon: "🏷️",
          importance: "alta"
        },
        {
          id: 2,
          title: "Mantén fotos actualizadas",
          description: "Toma fotos recientes de tu mascota desde diferentes ángulos para facilitar su identificación.",
          icon: "📸",
          importance: "alta"
        },
        {
          id: 3,
          title: "Conoce tu vecindario",
          description: "Familiarízate con los lugares donde tu mascota suele pasear y explora rutas alternativas.",
          icon: "🏘️",
          importance: "media"
        },
        {
          id: 4,
          title: "Red de contactos",
          description: "Mantén contacto con veterinarios, refugios y grupos de rescate locales.",
          icon: "🤝",
          importance: "media"
        }
      ]
    },
    prevention: {
      title: "Prevención de Pérdidas",
      tips: [
        {
          id: 5,
          title: "Microchip obligatorio",
          description: "El microchip es la forma más segura de identificar a tu mascota. Mantén tus datos actualizados.",
          icon: "💾",
          importance: "alta"
        },
        {
          id: 6,
          title: "Collar con GPS",
          description: "Considera usar un collar con GPS para localizar a tu mascota en tiempo real.",
          icon: "📍",
          importance: "alta"
        },
        {
          id: 7,
          title: "Entrenamiento básico",
          description: "Enseña a tu mascota comandos básicos como 'ven' y 'quieto' para emergencias.",
          icon: "🎓",
          importance: "media"
        },
        {
          id: 8,
          title: "Rutinas establecidas",
          description: "Mantén horarios regulares para paseos y comidas para crear hábitos estables.",
          icon: "⏰",
          importance: "media"
        }
      ]
    },
    search: {
      title: "Búsqueda Efectiva",
      tips: [
        {
          id: 9,
          title: "Actúa rápidamente",
          description: "Las primeras 24 horas son cruciales. Comienza la búsqueda inmediatamente.",
          icon: "⚡",
          importance: "alta"
        },
        {
          id: 10,
          title: "Redes sociales",
          description: "Publica en grupos de mascotas perdidas en Facebook, Instagram y WhatsApp.",
          icon: "📱",
          importance: "alta"
        },
        {
          id: 11,
          title: "Carteles efectivos",
          description: "Usa fotos claras, información de contacto y ofrece recompensa si es posible.",
          icon: "📄",
          importance: "media"
        },
        {
          id: 12,
          title: "Busca en diferentes horarios",
          description: "Las mascotas pueden moverse en diferentes momentos del día.",
          icon: "🌅",
          importance: "media"
        }
      ]
    },
    care: {
      title: "Cuidados Especiales",
      tips: [
        {
          id: 13,
          title: "Medicina preventiva",
          description: "Mantén al día las vacunas y desparasitaciones para prevenir enfermedades.",
          icon: "💊",
          importance: "alta"
        },
        {
          id: 14,
          title: "Alimentación balanceada",
          description: "Proporciona una dieta equilibrada según la edad y necesidades de tu mascota.",
          icon: "🍖",
          importance: "media"
        },
        {
          id: 15,
          title: "Ejercicio regular",
          description: "Asegúrate de que tu mascota haga ejercicio diario apropiado para su especie y edad.",
          icon: "🏃",
          importance: "media"
        },
        {
          id: 16,
          title: "Revisiones veterinarias",
          description: "Programa chequeos regulares con el veterinario para detectar problemas temprano.",
          icon: "🩺",
          importance: "alta"
        }
      ]
    }
  };

  return (
    <div className={styles.educationContainer}>
      <div className={styles.contentWrapper}>
        <EducationHero />
        <CategoriesSection 
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <TipsSection 
          data={educationData[selectedCategory]}
          selectedCategory={selectedCategory}
        />
      </div>
      
      <div className={styles.bottomNotice}>
        <p>💡 ¿Tienes más consejos que compartir? Únete a nuestra comunidad y ayuda a otros dueños de mascotas</p>
      </div>
    </div>
  );
};

export default ViewEducation;
