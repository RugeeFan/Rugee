import React from 'react'
import Button from '../common/Button'
import Icon from '../common/Icon'

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
        <img
          src={icon}
          alt={title}
          className="w-16 h-16 mb-4"
        />
        <h3 className="font-bold text-2xl text-center">{title}</h3>
      </div>
      <p className="text-gray-600 mb-4 flex-grow">{description}</p>
      <div className="space-y-4">
        <div className="relative flex items-start justify-between">
          <ul className="text-sm text-gray-500 flex-grow">
            {features.map((feature, i) => (
              <li key={i} className="flex items-center mb-2">
                <span className="mr-2">•</span>
                {feature}
              </li>
            ))}
          </ul>
          {customizable && (
            <div className="floating-tag ml-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-base font-medium px-4 py-2 rounded-full shadow-md whitespace-nowrap">
              Customizable +
            </div>
          )}
        </div>
        <div className="space-y-2 relative">
          <Button
            onClick={() => video && onVideoClick(video)}
            variant="primary"
            className="w-full"
          >
            Video Intro
          </Button>
          <Button
            as="a"
            href={isPrivate ? '#' : service.demoUrl}
            onClick={(e) => onSiteClick(service, e)}
            variant="outline"
            className="w-full"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Demo Site
          </Button>

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
    </div>
  )
} 