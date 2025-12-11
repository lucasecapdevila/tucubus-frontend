import { Route, Routes } from "react-router-dom"
import { Admin } from "../pages"

const RutasAdmin: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Admin />} />
    </Routes>
  )
}

export default RutasAdmin