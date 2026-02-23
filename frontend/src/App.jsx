import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useContext } from 'react';
import './App.css';
import Layout from './components/Principal/Layout';
import PrivateRoute from './components/PrivateRoute';
import { AuthContext } from './contexts/AuthContext';
import ViewRecuperarClave from './views/Login/ViewRecuperarClave';
import ViewCambiarClave from './views/Login/ViewCambiarClave';
import ViewCambiarClaveLogued from './views/Login/ViewCambiarClaveLogued';
import ViewPerfil from './views/Login/ViewPerfil';
import ViewEditarPerfil from './views/Login/ViewEditarPerfil';
import ViewCrearPerdida from './views/Reportes/ViewCrearPerdida';
import ViewEditarPerdida from './views/Reportes/ViewEditarPerdida';
import ViewCrearAvistamiento from './views/Reportes/ViewCrearAvistamiento';
import ViewEditarAvistamiento from './views/Reportes/ViewEditarAvistamiento';
import ViewCrearHallazgo from './views/Reportes/ViewCrearHallazgo';
import ViewEditarHallazgo from './views/Reportes/ViewEditarHallazgo';
import ViewVisualizarReportes from './views/Reportes/ViewVisualizarReportes';
import ViewLogin from './views/Login/ViewLogin';
import ViewRegistro from './views/Login/ViewRegistro';
import ViewHomeLogin from './views/Home/ViewHomeLogin';
import ViewHome from './views/Home/ViewHome';
import ViewRegister from './views/Register/ViewRegister';
import ConnTest from "./views/conn-test/conn-test";

function App() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        {/* Públicas */}
        <Route path="/" element={<Layout><ViewHome /></Layout>} />
        <Route path="/login" element={<Layout><ViewLogin /></Layout>} />
        <Route path="/register" element={<Layout><ViewRegistro /></Layout>} />
        <Route path="/recover_password_request" element={<Layout><ViewRecuperarClave /></Layout>} />
        <Route path="/change_password" element={<Layout><ViewCambiarClave /></Layout>} />

        {/* Protegidas */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Layout><ViewHomeLogin /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/my_profile"
          element={
            <PrivateRoute>
              <Layout><ViewPerfil /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/my_profile/edit"
          element={
            <PrivateRoute>
              <Layout><ViewEditarPerfil /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/my_profile/change_password"
          element={
            <PrivateRoute>
              <Layout><ViewCambiarClaveLogued /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/my_profile/picture"
          element={
            <PrivateRoute>
              <Layout><></></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/education"
          element={
            <PrivateRoute>
              <Layout><></></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <PrivateRoute>
              <Layout><></></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/create_lost"
          element={
            <PrivateRoute>
              <Layout><ViewCrearPerdida /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/edit_lost"
          element={
            <PrivateRoute>
              <Layout><ViewEditarPerdida /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/create_seen"
          element={
            <PrivateRoute>
              <Layout><ViewCrearAvistamiento /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/edit_seen"
          element={
            <PrivateRoute>
              <Layout><ViewEditarAvistamiento /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/create_found"
          element={
            <PrivateRoute>
              <Layout><ViewCrearHallazgo /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/edit_found"
          element={
            <PrivateRoute>
              <Layout><ViewEditarHallazgo /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/report_details"
          element={
            <PrivateRoute>
              <Layout><ViewVisualizarReportes /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/conn-test"
          element={
            <PrivateRoute>
              <ConnTest />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
