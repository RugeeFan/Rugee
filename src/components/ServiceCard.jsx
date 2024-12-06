import React from 'react'
import { AdvancedImage } from '@cloudinary/react'
import cld from '../config/cloudinary'

export default function ServiceCard({
  service,
  onVideoClick,
  onSiteClick
}) {
  const { 
    title, 
    description, 
    icon, 
    features, 
    customizable, 
    video, 
    isPrivate,
    showPrivacyMessage 
  } = service

  return (
    <div className="bg-white rounded-xl p-6 shadow-[2px_2px_8px_rgba(0,0,0,0.1)] hover:shadow-[4px_4px_12px_rgba(0,0,0,0.15)] transition-shadow duration-300 flex flex-col relative">
      <div className="flex flex-col items-center mb-6">
        <AdvancedImage
          cldImg={cld.image(icon)}
          className="w-16 h-16 mb-4"
        />
        <h3 className="font-bold text-2xl text-center">{title}</h3>
      </div>
      <p className="text-gray-600 mb-4 flex-grow">{description}</p>
      <div className="space-y-4">
        <div className="relative">
          <ul className="text-sm text-gray-500">
            {features.map((feature, i) => (
              <li key={i} className="flex items-center mb-2">
                <span className="mr-2">•</span>
                {feature}
              </li>
            ))}
          </ul>
          {customizable && (
            <div className="floating-tag absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-base font-medium px-4 py-2 rounded-full shadow-md whitespace-nowrap rotate-12">
              Customizable +
            </div>
          )}
        </div>
        <div className="space-y-2 relative">
          <button
            onClick={() => video && onVideoClick(video)}
            className="inline-block w-full text-center bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors duration-300"
          >
            Video Intro
          </button>
          <a
            href={isPrivate ? '#' : service.demoUrl}
            onClick={(e) => onSiteClick(service, e)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full text-center border-2 border-primary text-primary px-6 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors duration-300"
          >
            View Demo Site
          </a>

          {/* Privacy Message */}
          {isPrivate && showPrivacyMessage && (
            <div className="absolute -bottom-32 left-1/2 transform -translate-x-1/2 bg-gray-900 px-5 py-4 rounded-lg shadow-lg z-10 w-72 animate-fadeIn">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <div className="border-[14px] border-transparent border-b-gray-900"></div>
              </div>
              <div className="flex items-center">
                <span className="text-red-500 mr-3 text-xl">❗</span>
                <span className="text-white text-sm">
                  Sorry, these premium client sites are private for confidentiality reasons.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(12deg);
          }
          50% {
            transform: translateY(-8px) rotate(12deg);
          }
        }
        .floating-tag {
          animation: float 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
} 