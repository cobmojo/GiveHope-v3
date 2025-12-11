
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Define paths that act as "Portals" or "Dashboards" where we want to 
    // maintain the application-like state or where layout handles scrolling internally.
    const isDashboard = 
      pathname.startsWith('/mission-control') || 
      pathname.startsWith('/worker-dashboard') || 
      pathname.startsWith('/donor-portal');

    // For all other "Webpage" style routes (Home, About, FAQ, etc.), 
    // ensure the user starts at the top of the page.
    if (!isDashboard) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' // Use instant to mimic standard browser navigation
      });
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
