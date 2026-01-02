/**
 * Collapsible Footer Toggle Functionality
 * Works with the mobile-footer class
 */

document.addEventListener('DOMContentLoaded', function() {
  const footer = document.querySelector('.mobile-footer');
  const footerTab = document.querySelector('.footer-pull-tab');
  const footerToggleButton = document.querySelector('.footer-toggle-button');
  
  if (!footer) {
    return; // Footer not found, exit
  }
  
  // Check if we're on mobile
  const isMobile = window.innerWidth <= 768;
  
  // Initialize footer state - collapsed on mobile by default
  if (isMobile) {
    footer.classList.add('footer-collapsed');
  }
  
  // Function to toggle footer
  function toggleFooter() {
    footer.classList.toggle('footer-collapsed');
    if (footerToggleButton) {
      footerToggleButton.classList.add('pulse');
      setTimeout(() => {
        footerToggleButton.classList.remove('pulse');
      }, 600);
    }
  }
  
  // Toggle footer on tab click
  if (footerTab) {
    footerTab.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleFooter();
    });
  }
  
  // Toggle footer on button click
  if (footerToggleButton) {
    footerToggleButton.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleFooter();
    });
  }
  
  // Handle window resize
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      const isMobileNow = window.innerWidth <= 768;
      if (!isMobileNow) {
        // Desktop: always show footer
        footer.classList.remove('footer-collapsed');
      }
    }, 250);
  });
  
  // Copy to clipboard functionality for contact items
  const contactItems = document.querySelectorAll('.contact-item[data-copy]');
  contactItems.forEach(item => {
    item.addEventListener('click', function() {
      const textToCopy = this.getAttribute('data-copy');
      const tooltip = this.querySelector('.tooltip');
      
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          // Show feedback
          if (tooltip) {
            tooltip.textContent = 'Copied!';
            tooltip.style.opacity = '1';
            setTimeout(() => {
              tooltip.style.opacity = '0';
              tooltip.textContent = 'Tap to copy';
            }, 2000);
          }
          
          this.classList.add('contact-copied');
          setTimeout(() => {
            this.classList.remove('contact-copied');
          }, 300);
        }).catch(err => {
          console.error('Failed to copy:', err);
        });
      }
    });
    
    // Show tooltip on hover
    const tooltip = item.querySelector('.tooltip');
    if (tooltip) {
      item.addEventListener('mouseenter', function() {
        tooltip.style.opacity = '1';
      });
      item.addEventListener('mouseleave', function() {
        tooltip.style.opacity = '0';
      });
    }
  });
  
  // Social icon tooltips
  const socialIcons = document.querySelectorAll('.social-icon');
  socialIcons.forEach(icon => {
    const tooltip = icon.querySelector('.tooltip');
    if (tooltip) {
      icon.addEventListener('mouseenter', function() {
        tooltip.style.opacity = '1';
      });
      icon.addEventListener('mouseleave', function() {
        tooltip.style.opacity = '0';
      });
    }
  });
});

