import { useState, useEffect } from 'react'

export default function Hero() {
  const [particles, setParticles] = useState([])
  const [firstLine, setFirstLine] = useState('')
  const [secondLine, setSecondLine] = useState('')
  const [isFirstLineDone, setIsFirstLineDone] = useState(false)
  const [isSecondLineDone, setIsSecondLineDone] = useState(false)

  const firstLineText = "From Concept to Clicks,"
  const secondLineText = "I Build It All."

  useEffect(() => {
    // 第一行文字的打字效果
    let index = 0
    const firstInterval = setInterval(() => {
      setFirstLine(firstLineText.slice(0, index))
      index++
      if (index > firstLineText.length) {
        clearInterval(firstInterval)
        setIsFirstLineDone(true)
      }
    }, 60)

    return () => clearInterval(firstInterval)
  }, [])

  useEffect(() => {
    // 第二行文字的打字效果，只在第一行完成后开始
    if (isFirstLineDone) {
      let index = 0
      const secondInterval = setInterval(() => {
        setSecondLine(secondLineText.slice(0, index))
        index++
        if (index > secondLineText.length) {
          clearInterval(secondInterval)
          setIsSecondLineDone(true)
        }
      }, 60)

      return () => clearInterval(secondInterval)
    }
  }, [isFirstLineDone])

  const icons = [
    'like_yuahhg',
    'thumbs-up_inbv3n',
    'stars_fi3fgd',
    'clap_ebwo9t',
    'happy_osmpn8',
    'hello_ng6ubf'
  ]

  const random = (min, max) => Math.random() * (max - min) + min

  const createParticle = (e) => {
    const rect = e.target.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const particle = {
      id: Date.now(),
      icon: icons[Math.floor(random(0, icons.length))],
      x: x,
      y: y,
      offsetX: random(50, 100),
      offsetY: random(-100, -30)
    }

    setParticles(prev => [...prev, particle])

    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== particle.id))
    }, 2000)
  }

  const handleScrollToServices = () => {
    const servicesSection = document.querySelector('#services')
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="bg-section-bg text-center py-24">
      <div className="mb-12 flex justify-center items-center">
        <div className="relative w-32 h-32 select-none">
          <img
            src={`https://res.cloudinary.com/djwau0xeb/image/upload/v1/avatar_tsepok`}
            alt="avatar"
            className="w-full object-cover mx-auto rounded-full bg-gray-200 mb-4 cursor-pointer"
            onClick={createParticle}
          />

          <span
            className="absolute top-12 left-[110px] inline-block bg-white rounded-full px-4 py-2 w-full animate-float select-none cursor-pointer"
            onClick={createParticle}
          >
            Rugee 👋
          </span>

          {particles.map(particle => (
            <img
              key={particle.id}
              src={`https://res.cloudinary.com/djwau0xeb/image/upload/v1/${particle.icon}`}
              alt="reaction"
              className="absolute pointer-events-none animate-particle w-8 h-8"
              style={{
                left: `${particle.x + particle.offsetX}px`,
                top: `${particle.y + particle.offsetY}px`,
              }}
            />
          ))}
        </div>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold mb-4 pt-4">
        <div className="h-[1.2em] relative">
          <span className="invisible">{firstLineText}</span>
          <span className="absolute top-0 left-0 right-0">{firstLine}</span>
        </div>
        <div className="h-[1.2em] relative">
          <span className="invisible">{secondLineText}</span>
          <span className="absolute top-0 left-0 right-0">
            {secondLine}
            {isSecondLineDone && (
              <span className="inline-block animate-cursor">_</span>
            )}
          </span>
        </div>
      </h1>
      <button
        onClick={handleScrollToServices}
        className="px-4 py-2 rounded-full border border-gray-200 text-white bg-black font-bold cursor-pointer mt-10 hover:bg-gray-800 transition-colors duration-300"
      >
        What I Offer
      </button>

      <style jsx>{`
        @keyframes blink {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }
        .animate-cursor {
          animation: blink 1s step-end infinite;
        }
      `}</style>
    </section>
  )
} 