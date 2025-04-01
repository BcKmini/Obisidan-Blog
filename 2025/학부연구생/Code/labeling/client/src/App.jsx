import './App.css'
import { Routes, Route } from 'react-router-dom'
import Main from "./pages/Main";
import ProjectDetail from "./pages/ProjectDetail";
import Labeling from "./pages/Labeling";

const App = () => {
  return (
    <Routes>
        <Route index element={<Main />} />
        <Route path="/project/:projectId" element={<ProjectDetail />} />
        <Route path="/labeling/:projectId" element={<Labeling />} /> 
    </Routes>
  )
}

export default App;