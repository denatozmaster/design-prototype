import { BrowserRouter, Routes, Route } from 'react-router'
import Home from '@/pages/Home'
import ElectronicSignaturePage from '@/pages/electronic-signature'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/electronic-signature" element={<ElectronicSignaturePage />} />
      </Routes>
    </BrowserRouter>
  )
}
