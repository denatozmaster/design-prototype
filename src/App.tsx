import { BrowserRouter, Routes, Route } from 'react-router'
import Home from '@/pages/Home'
import ElectronicSignaturePage from '@/pages/electronic-signature'
import PhotoReceptionPage from '@/pages/photo-reception'
import ClinicalChartPage from '@/pages/clinical-chart'
import ResinSurfacePage from '@/pages/resin-surface'
import GiSurfacePage from '@/pages/gi-surface'
import PatientConsultPage from '@/pages/patient-consult'
import PiInputPage from '@/pages/pi-input'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/electronic-signature" element={<ElectronicSignaturePage />} />
        <Route path="/photo-reception" element={<PhotoReceptionPage />} />
        <Route path="/clinical-chart" element={<ClinicalChartPage />} />
        <Route path="/resin-surface" element={<ResinSurfacePage />} />
        <Route path="/gi-surface" element={<GiSurfacePage />} />
        <Route path="/patient-consult" element={<PatientConsultPage />} />
        <Route path="/pi-input" element={<PiInputPage />} />
      </Routes>
    </BrowserRouter>
  )
}
