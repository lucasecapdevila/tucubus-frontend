import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Contact, Help, Home, Login } from "./components/pages";
import { Footer, Sidebar } from "./components/common";

function App() {

  return (
    <BrowserRouter>
      <Sidebar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/ayuda" element={<Help />} />
        <Route exact path="/contacto" element={<Contact />} />
        <Route exact path="/login" element={<Login />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
