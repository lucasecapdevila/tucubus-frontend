import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Contact, Help, Home, Login } from "./components/pages";
import { Footer, Sidebar } from "./components/common";
import { useState } from "react";
import RutasProtegidas from "./components/routes/RutasProtegidas";
import RutasAdmin from "./components/routes/RutasAdmin";

function App() {
  const user = JSON.parse(sessionStorage.getItem('usuarioTucuBus')) || {}
  const [loggedUser, setLoggedUser] = useState(user)

  return (
    <BrowserRouter>
      <Sidebar loggedUser={loggedUser} setLoggedUser={setLoggedUser} />
      <div className="mx-auto lg:pl-64">
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/ayuda" element={<Help />} />
          <Route exact path="/contacto" element={<Contact />} />
          <Route exact path="/login" element={<Login />} />
          <Route 
            exact 
            path="/admin/*" 
            element={
              <RutasProtegidas>
                <RutasAdmin />
              </RutasProtegidas>
            } />

        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  )
}

export default App