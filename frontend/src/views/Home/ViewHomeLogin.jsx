"use client";

import { useState, useEffect, useContext } from "react";
import { reportService } from "../../services/reportService";
import styles from "../../styles/HomeLoggedIn.module.css";
import FilterControls from "../../components/Home/FilterControls";
import ReportButtons from "../../components/Home/ReportButtons";
import ReportGrid from "../../components/Home/ReportGrid";
import { AuthContext } from "../../contexts/AuthContext";

const ViewHomeLogin = () => {
  const { user } = useContext(AuthContext);

  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [radiusFilter, setRadiusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [userLocation, setUserLocation] = useState({ lat: null, lng: null });

  const [showMyReportsOnly, setShowMyReportsOnly] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    console.log("reportes actualizado:", reportes);
  }, [reportes]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // fallback Bogotá
          setUserLocation({ lat: 4.6097, lng: -74.0817 });
        }
      );
    } else {
      setUserLocation({ lat: 4.6097, lng: -74.0817 });
    }
  }, []);

  useEffect(() => {
    if (!userLocation.lat || !userLocation.lng) return;

    const fetchReports = async () => {
      try {
        setLoading(true);

        const response = await reportService.getAllReports(
          userLocation.lat,
          userLocation.lng,
          radiusFilter === "all" ? null : Number(radiusFilter),
          itemsPerPage,
          (currentPage - 1) * itemsPerPage,
          typeFilter === "all" ? null : typeFilter
        );

        console.log(response);

        let data = Array.isArray(response) ? response : [];

        if (showMyReportsOnly && user) {
          const currentUserId = user?.id || user?.userId;

          data = data.filter((r) => r.user_id === currentUserId);
        }
        
        setReportes(data);
      } catch (error) {
        console.error("Error al obtener reportes:", error);
        setReportes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [userLocation, radiusFilter, typeFilter, currentPage, showMyReportsOnly, user]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className={styles.homeContainer}>
      {loading ? (
        <div className={styles.loadingContainer}>
          Cargando reportes...
        </div>
      ) : (
        <>
          <div className={styles.topControls}>
            <FilterControls
              radiusFilter={radiusFilter}
              setRadiusFilter={setRadiusFilter}
              typeFilter={typeFilter}
              setTypeFilter={setTypeFilter}
              totalResults={reportes.length}
            />

            <ReportButtons
              showMyReportsOnly={showMyReportsOnly}
              toggleMyReports={() =>
                setShowMyReportsOnly((prev) => !prev)
              }
            />
          </div>

          <ReportGrid
            reports={reportes}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default ViewHomeLogin;