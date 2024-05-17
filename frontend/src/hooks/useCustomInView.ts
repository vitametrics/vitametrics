import { useInView } from 'react-intersection-observer';

// Custom hook that encapsulates the common inView functionality
const useCustomInView = (options = {}) => {
  const defaultOptions = {
    threshold: 0.1, // Default threshold
    triggerOnce: true, // Default to only triggering once
    ...options, // Allow overriding default options
  };

  const { ref, inView, entry } = useInView(defaultOptions);
  return { ref, inView, entry }; // Return whatever might be useful
};

export default useCustomInView;
