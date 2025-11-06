import Sidebar from "./components/common/Sidebar"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/pages/Home";
import Footer from "./components/common/Footer";

function App() {

  return (
    <BrowserRouter>
      <Sidebar />
      <Routes>
        <Route exact path="/" element={<Home />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
