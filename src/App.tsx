import { BrowserRouter, Routes, Route } from 'react-router'
import Home from '@/pages/Home'
import ElectronicSignaturePage from '@/pages/electronic-signature'
import PhotoReceptionPage from '@/pages/photo-reception'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/electronic-signature" element={<ElectronicSignaturePage />} />
        <Route path="/photo-reception" element={<PhotoReceptionPage />} />
      </Routes>
    </BrowserRouter>
  )
}
