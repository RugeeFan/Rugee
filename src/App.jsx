import React, { memo } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Partners from './components/Partners'
import Services from './components/Services'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default memo(function App() {
  return (
    <div className="min-h-screen bg-white select-none">
      <Navbar />
      <main>
        <Hero />
        <Partners />
        <Services />
        <Contact />
      </main>
      <Footer />
    </div>
  )
})
