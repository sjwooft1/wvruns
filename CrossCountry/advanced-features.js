/**
 * Advanced Features for Mountain State Miles
 * - Dark Mode
 * - Favorites/Bookmarks
 * - Athlete Comparison
 * - Mobile Navigation
 * - Local Storage Management
 */

class AdvancedFeatures {
  constructor() {
    this.favorites = this.loadFavorites();
    this.compareList = this.loadCompareList();
    this.darkMode = this.loadDarkMode();
    this.init();
  }

  // ===== DARK MODE =====
  init() {
    this.setupDarkMode();
    this.setupMobileMenu();
    this.setupFavorites();
    this.setupComparison();
  }

  loadDarkMode() {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? JSON.parse(saved) : false;
  }

  saveDarkMode(isDark) {
    localStorage.setItem('darkMode', JSON.stringify(isDark));
    this.darkMode = isDark;
  }

  setupDarkMode() {
    if (this.darkMode) {
      document.body.classList.add('dark-mode');
    }

    // Create theme toggle button
    const themeBtn = document.createElement('button');
    themeBtn.className = 'theme-toggle';
    themeBtn.innerHTML = this.darkMode ? '☀️' : '🌙';
    themeBtn.setAttribute('aria-label', 'Toggle dark mode');
    themeBtn.style.position = 'fixed';
    themeBtn.style.top = '20px';
    themeBtn.style.right = '20px';
    themeBtn.style.zIndex = '999';

    themeBtn.addEventListener('click', () => {
      this.darkMode = !this.darkMode;
      this.saveDarkMode(this.darkMode);
      document.body.classList.toggle('dark-mode');
      themeBtn.innerHTML = this.darkMode ? '☀️' : '🌙';
    });

    document.body.appendChild(themeBtn);
  }

  // ===== MOBILE NAVIGATION =====
  setupMobileMenu() {
    const header = document.querySelector('header') || document.querySelector('.hero-header');
    if (!header) return;

    // Create hamburger menu
    const menuToggle = document.createElement('button');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = `
      <span></span>
      <span></span>
      <span></span>
    `;
    menuToggle.setAttribute('aria-label', 'Toggle navigation menu');

    // Get or create nav
    let nav = document.querySelector('nav') || document.querySelector('.hero-nav');
    if (!nav) return;

    // Clone nav for mobile
    const mobileNav = nav.cloneNode(true);
    mobileNav.classList.add('mobile-nav');
    mobileNav.classList.remove('hero-nav');

    // Insert menu toggle and mobile nav
    header.insertBefore(menuToggle, header.firstChild);
    header.parentElement.insertBefore(mobileNav, header.nextSibling);

    // Toggle menu
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      mobileNav.classList.toggle('active');
    });

    // Close menu when link clicked
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        mobileNav.classList.remove('active');
      });
    });

    // Close menu on window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        menuToggle.classList.remove('active');
        mobileNav.classList.remove('active');
      }
    });
  }

  // ===== FAVORITES SYSTEM =====
  loadFavorites() {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  }

  saveFavorites() {
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
  }

  addFavorite(item) {
    if (!this.isFavorite(item)) {
      this.favorites.push(item);
      this.saveFavorites();
      return true;
    }
    return false;
  }

  removeFavorite(item) {
    this.favorites = this.favorites.filter(fav => fav !== item);
    this.saveFavorites();
  }

  isFavorite(item) {
    return this.favorites.includes(item);
  }

  setupFavorites() {
    // Add favorite buttons to athlete links
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('favorite-btn')) {
        const athleteName = e.target.dataset.athlete;
        const btn = e.target;

        if (this.isFavorite(athleteName)) {
          this.removeFavorite(athleteName);
          btn.classList.remove('favorited');
        } else {
          this.addFavorite(athleteName);
          btn.classList.add('favorited');
        }
      }
    });
  }

  // ===== COMPARISON SYSTEM =====
  loadCompareList() {
    const saved = localStorage.getItem('compareList');
    return saved ? JSON.parse(saved) : [];
  }

  saveCompareList() {
    localStorage.setItem('compareList', JSON.stringify(this.compareList));
  }

  addToCompare(athlete) {
    if (!this.isInCompare(athlete) && this.compareList.length < 4) {
      this.compareList.push(athlete);
      this.saveCompareList();
      this.updateCompareWidget();
      return true;
    }
    return false;
  }

  removeFromCompare(athlete) {
    this.compareList = this.compareList.filter(a => a !== athlete);
    this.saveCompareList();
    this.updateCompareWidget();
  }

  isInCompare(athlete) {
    return this.compareList.includes(athlete);
  }

  setupComparison() {
    // Create compare widget
    const widget = document.createElement('div');
    widget.className = 'compare-widget';
    widget.id = 'compare-widget';
    widget.style.display = 'none';
    widget.innerHTML = `
      <h4>📊 Compare Athletes</h4>
      <ul class="compare-list" id="compare-list"></ul>
      <button class="compare-btn" onclick="window.location.href='compare.html'">View Comparison</button>
    `;
    document.body.appendChild(widget);

    // Add compare buttons to athlete rows
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('compare-athlete-btn')) {
        const athleteName = e.target.dataset.athlete;
        const btn = e.target;

        if (this.isInCompare(athleteName)) {
          this.removeFromCompare(athleteName);
          btn.classList.remove('active');
        } else if (this.addToCompare(athleteName)) {
          btn.classList.add('active');
        }
      }
    });
  }

  updateCompareWidget() {
    const widget = document.getElementById('compare-widget');
    const list = document.getElementById('compare-list');

    if (this.compareList.length === 0) {
      widget.style.display = 'none';
      return;
    }

    widget.style.display = 'block';
    list.innerHTML = this.compareList.map(athlete => `
      <li>
        <span>${athlete}</span>
        <button onclick="advancedFeatures.removeFromCompare('${athlete.replace(/'/g, "\\'")}')">✕</button>
      </li>
    `).join('');
  }

  // ===== UTILITIES =====
  formatTime(seconds) {
    if (!seconds && seconds !== 0) return '';
    const sec = Number(seconds);
    if (Number.isNaN(sec)) return seconds;
    const minutes = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    const ms = Math.round((sec - Math.floor(sec)) * 100);
    return `${minutes}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  }

  calculatePace(seconds, distanceMeters = 5000) {
    if (!seconds && seconds !== 0) return '';
    const sec = Number(seconds);
    if (Number.isNaN(sec) || sec <= 0) return '';

    const distance = distanceMeters ? Number(distanceMeters) : 5000;
    if (Number.isNaN(distance) || distance <= 0) return '';

    const DISTANCE_MILES = distance / 1609.34;
    const paceSecondsPerMile = sec / DISTANCE_MILES;
    const paceMinutes = Math.floor(paceSecondsPerMile / 60);
    const paceSeconds = Math.floor(paceSecondsPerMile % 60);
    return `${paceMinutes}:${paceSeconds.toString().padStart(2, '0')}`;
  }

  // ===== ANALYTICS =====
  generateStats(data) {
    return {
      total: data.length,
      average: data.length > 0 ? data.reduce((a, b) => a + Number(b), 0) / data.length : 0,
      fastest: data.length > 0 ? Math.min(...data.map(Number)) : 0,
      slowest: data.length > 0 ? Math.max(...data.map(Number)) : 0,
    };
  }

  createStatCard(label, value) {
    const card = document.createElement('div');
    card.className = 'stat-card';
    card.innerHTML = `
      <div class="stat-value">${value}</div>
      <div class="stat-label">${label}</div>
    `;
    return card;
  }

  // ===== FILTER TAGS =====
  createFilterTags(filters) {
    const container = document.createElement('div');
    container.className = 'filter-tags';

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        const tag = document.createElement('span');
        tag.className = 'filter-tag';
        tag.innerHTML = `
          ${key}: ${value}
          <button data-filter="${key}">✕</button>
        `;
        container.appendChild(tag);
      }
    });

    return container;
  }
}

// Initialize on page load
let advancedFeatures;
document.addEventListener('DOMContentLoaded', () => {
  advancedFeatures = new AdvancedFeatures();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AdvancedFeatures;
}
