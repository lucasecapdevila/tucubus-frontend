import { Route, Routes } from "react-router-dom"
import { Admin } from "../pages"

const RutasAdmin = () => {
  return (
    <Routes>
      <Route exact path="/" element={<Admin />} />
    </Routes>
  )
}

export default RutasAdmin