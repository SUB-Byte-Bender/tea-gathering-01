import React, { useEffect } from "react";

/**
 * Custom cursor component that replaces the default cursor with a custom SVG
 * @returns {JSX.Element|null} Returns null as it only applies CSS
 */
const CustomCursor = () => {
  // Hide default cursor
  useEffect(() => {
    // Add cursor style directly to document root
    document.body.style.cursor = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 24 24'%3E%3Cpath fill='%23fdd935' stroke='%23000' stroke-width='2' d='M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.5.5 0 0 0 .35-.85L6.35 2.85a.5.5 0 0 0-.85.35Z'%3E%3C/path%3E%3C/svg%3E\"), auto";
    
    const style = document.createElement('style');
    style.innerHTML = `
      * {
        cursor: inherit;
      }
      
      a, button, input[type="submit"], input[type="button"], [role="button"] {
        cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24'%3E%3Cpath fill='%23fdd935' stroke='%23000' stroke-width='2' d='M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.5.5 0 0 0 .35-.85L6.35 2.85a.5.5 0 0 0-.85.35Z'%3E%3C/path%3E%3C/svg%3E"), pointer;
      }
      
      @media (pointer: coarse) {
        * {
          cursor: auto !important;
        }
        
        a, button, input, textarea, select, label, [role="button"] {
          cursor: pointer !important;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.body.style.cursor = "auto";
      document.head.removeChild(style);
    };
  }, []);

  // No need to render anything as we're just applying CSS
  return null;
};

export default CustomCursor;