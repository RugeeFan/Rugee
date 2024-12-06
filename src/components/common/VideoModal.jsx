import React from 'react'
import Icon from './Icon'

export default function VideoModal({
  isOpen,
  onClose,
  videoSrc,
  isLoading,
  onLoadedData,
  onError
}) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-modalBackdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-4xl animate-modalContent">
        <div className="absolute -top-10 right-0 flex items-center space-x-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              const video = document.querySelector('#modal-video');
              if (video) {
                video.muted = !video.muted;
                e.currentTarget.classList.toggle('text-gray-300');
              }
            }}
            className="text-white hover:text-gray-300 transition-colors duration-200"
          >
            <Icon name="volume" />
          </button>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 text-xl transition-colors duration-200"
          >
            ✕ Close
          </button>
        </div>

        <div className="relative pt-[56.25%] bg-black rounded-lg overflow-hidden shadow-2xl">
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-white rounded-full animate-spin mb-4"></div>
              <span className="text-lg">Loading video...</span>
            </div>
          )}

          <video
            id="modal-video"
            className="absolute inset-0 w-full h-full"
            playsInline
            autoPlay
            controls
            loop
            onLoadedData={onLoadedData}
            onError={onError}
            src={videoSrc}
          >
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

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