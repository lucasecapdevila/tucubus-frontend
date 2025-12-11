import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Contact, Help, Home, Login } from './components/pages';
import RutasProtegidas from './components/routes/RutasProtegidas';
import RutasAdmin from './components/routes/RutasAdmin';
import { Toaster } from 'react-hot-toast';
import { ModalProvider } from './contexts';
import { ModalManager } from './components/layout/ModalManager';
import { Footer, Sidebar } from './components/common';

const App: React.FC = () => {
  return (
    <ModalProvider>
      <BrowserRouter>
        <Sidebar />
        <div className="mx-auto lg:pl-64 grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ayuda" element={<Help />} />
            <Route path="/contacto" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/admin/*"
              element={
                <RutasProtegidas>
                  <RutasAdmin />
                </RutasProtegidas>
              }
            />
          </Routes>
        </div>
        <Footer />
        <ModalManager />
        <Toaster position="top-center" reverseOrder={false} />
      </BrowserRouter>
    </ModalProvider>
  );
};

export default App;
