import React, { useState } from 'react'
import ServiceCard from './ServiceCard'

export default function Services() {
  const [showVideo, setShowVideo] = useState(false)
  const [currentVideo, setCurrentVideo] = useState(null)
  const [isVideoLoading, setIsVideoLoading] = useState(true)
  const [videoError, setVideoError] = useState(null)
  const [showPrivacyMessage, setShowPrivacyMessage] = useState(false)

  const services = [
    {
      title: 'E-commerce Solutions',
      description: 'Professional e-commerce solutions with complete features including product management, order system, membership, and payment integration. Equipped with an intuitive admin dashboard for effortless store management.',
      icon: 'shop_sao6zh',
      demoUrl: 'https://e-commerce-demo-ten-dun.vercel.app',
      features: ['Product Management', 'Order Processing', 'User Management', 'Payment Integration', 'Admin Dashboard'],
      customizable: true,
      video: 'e-commerce_pjz8xb'
    },
    {
      title: 'Corporate Websites',
      description: 'Create professional corporate web platforms that combine modern design with functionality, helping businesses establish a strong online brand presence.',
      icon: 'company_iqdcvi',
      demoUrl: 'https://corporate-demo-delta.vercel.app',
      features: ['Responsive Design', 'Content Management', 'SEO Optimization', 'Multi-language Support', 'Contact Forms'],
      customizable: true,
      video: 'corporate_up06yw'
    },
    {
      title: 'Premium Design',
      description: 'Craft high-end custom websites for brands seeking unique visual experiences, showcasing brand excellence through creative design and smooth animations.',
      icon: 'premium_pdofmo',
      demoUrl: 'https://www.google.com/premium',
      features: ['Creative Design', 'Smooth Animations', 'Visual Experience', 'Brand Showcase', 'Custom Development'],
      customizable: true,
      video: 'premium_tzb4js',
      isPrivate: true
    }
  ]

  const handleVideoClick = (videoId) => {
    const videoUrl = `https://res.cloudinary.com/djwau0xeb/video/upload/v1/${videoId}`
    setCurrentVideo(videoUrl)
    setShowVideo(true)
    setIsVideoLoading(true)
    setVideoError(null)
  }

  const handleSiteClick = (service, e) => {
    if (service.isPrivate) {
      e.preventDefault()
      setShowPrivacyMessage(true)
      setTimeout(() => setShowPrivacyMessage(false), 3000)
    }
  }

  return (
    <div id="services" className="relative">
      <section className="bg-section-bg py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">My Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                service={{ ...service, showPrivacyMessage }}
                onVideoClick={handleVideoClick}
                onSiteClick={handleSiteClick}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Bottom curve */}
      <div className="absolute bottom-0 left-0 right-0 h-24 md:h-32 bg-section-bg rounded-b-[100%] translate-y-12 md:translate-y-16" />

      {/* Video Modal */}
      {showVideo && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-modalBackdrop"
          onClick={(e) => e.target === e.currentTarget && setShowVideo(false)}
        >
          <div className="relative w-full max-w-4xl animate-modalContent">
            <div className="absolute -top-10 right-0 flex items-center space-x-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const video = document.querySelector('#premium-video');
                  if (video) {
                    video.muted = !video.muted;
                    e.currentTarget.classList.toggle('text-gray-300');
                  }
                }}
                className="text-white hover:text-gray-300 transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 0 1 0 7.07M19 12c0-3.53-2.61-6.44-6-6.93v13.87c3.39-.49 6-3.4 6-6.94z" />
                </svg>
              </button>
              <button
                onClick={() => setShowVideo(false)}
                className="text-white hover:text-gray-300 text-xl transition-colors duration-200"
              >
                ✕ Close
              </button>
            </div>

            <div className="relative pt-[56.25%] bg-black rounded-lg overflow-hidden shadow-2xl">
              {isVideoLoading && !videoError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <div className="w-12 h-12 border-4 border-gray-300 border-t-white rounded-full animate-spin mb-4"></div>
                  <span className="text-lg">Loading video...</span>
                </div>
              )}

              <video
                id="premium-video"
                className="absolute inset-0 w-full h-full"
                playsInline
                autoPlay
                controls
                loop
                onLoadedData={() => setIsVideoLoading(false)}
                onError={() => {
                  setIsVideoLoading(false)
                  setVideoError('Failed to load video')
                }}
                src={currentVideo}
              >
                <source src={currentVideo} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes modalBackdrop {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalContent {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-modalBackdrop {
          animation: modalBackdrop 0.2s ease-out;
        }
        .animate-modalContent {
          animation: modalContent 0.3s ease-out;
        }
      `}</style>
    </div>
  )
} 