export const keyframes = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from {
      transform: translateY(1rem);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes slideDown {
    from {
      transform: translateY(-1rem);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes scale {
    from {
      transform: scale(0.95);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-0.5rem);
    }
  }
`

export const animationClasses = {
  'animate-fadeIn': 'animation: fadeIn 0.5s ease-out forwards',
  'animate-slideUp': 'animation: slideUp 0.5s ease-out forwards',
  'animate-slideDown': 'animation: slideDown 0.5s ease-out forwards',
  'animate-scale': 'animation: scale 0.5s ease-out forwards',
  'animate-float': 'animation: float 3s ease-in-out infinite'
} 