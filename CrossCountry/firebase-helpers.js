// Firebase Helper Functions for WV Runs
// Using Firebase Realtime Database

const db = window.firebaseDatabase;
const CC_PREFIX = 'crosscountry'; // CrossCountry data prefix

// Helper function to convert Firebase snapshot to array
function snapshotToArray(snapshot) {
  if (!snapshot.exists()) return [];
  const data = snapshot.val();
  if (!data) return [];
  
  // If data is an object with keys, convert to array
  if (typeof data === 'object' && !Array.isArray(data)) {
    return Object.keys(data).map(key => ({
      id: key,
      ...data[key]
    }));
  }
  
  return Array.isArray(data) ? data : [];
}

// Helper function to get single item from snapshot
function snapshotToObject(snapshot) {
  if (!snapshot.exists()) return null;
  const data = snapshot.val();
  if (!data) return null;
  
  // If it's an object with a single key, return the value with the key as id
  if (typeof data === 'object' && !Array.isArray(data)) {
    const keys = Object.keys(data);
    if (keys.length === 1) {
      return { id: keys[0], ...data[keys[0]] };
    }
  }
  
  return data;
}

// ==========================================
// SCHOOLS
// ==========================================

/**
 * Get all schools from the database
 * @returns {Promise<Array>} Array of school objects
 */
async function getAllSchools() {
  try {
    const snapshot = await db.ref(`${CC_PREFIX}/schools`).once('value');
    return snapshotToArray(snapshot);
  } catch (error) {
    console.error("Error getting all schools:", error);
    return [];
  }
}

/**
 * Get a single school by its slug
 * @param {string} slug The school slug (e.g., 'morgantown').
 * @returns {Promise<Object|null>} School object or null
 */
async function getSchoolBySlug(slug) {
  if (!slug) return null;
  try {
    const snapshot = await db.ref(`${CC_PREFIX}/schools/${slug}`).once('value');
    if (!snapshot.exists()) return null;
    return { slug: snapshot.key, ...snapshot.val() };
  } catch (error) {
    console.error(`Error getting school ${slug}:`, error);
    return null;
  }
}

/**
 * Get school name by slug
 * @param {string} slug The school slug (e.g., 'morgantown').
 * @returns {Promise<string|null>} School name or null
 */
async function getSchoolNameBySlug(slug) {
  const school = await getSchoolBySlug(slug);
  return school ? school.name : null;
}


// ==========================================
// MEETS
// ==========================================

/**
 * Get all meets from the database
 * @returns {Promise<Array>} Array of meet objects
 */
async function getAllMeets() {
  try {
    const snapshot = await db.ref(`${CC_PREFIX}/meets`).once('value');
    // Meets are stored as objects keyed by slug, so convert to array
    const meets = snapshotToArray(snapshot);
    // Sort meets by date in descending order
    return meets.sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (error) {
    console.error("Error getting all meets:", error);
    return [];
  }
}

/**
 * Get a single meet by its slug
 * @param {string} slug The meet slug (e.g., 'fast-times-invitational-2024').
 * @returns {Promise<Object|null>} Meet object or null
 */
async function getMeetBySlug(slug) {
  if (!slug) return null;
  try {
    const snapshot = await db.ref(`${CC_PREFIX}/meets/${slug}`).once('value');
    if (!snapshot.exists()) return null;
    return { slug: snapshot.key, ...snapshot.val() };
  } catch (error) {
    console.error(`Error getting meet ${slug}:`, error);
    return null;
  }
}

// ==========================================
// RESULTS
// ==========================================

/**
 * Get results for a specific meet
 * @param {string} meetSlug The meet slug.
 * @returns {Promise<Array>} Array of result objects
 */
async function getResultsByMeet(meetSlug) {
  if (!meetSlug) return [];
  try {
    const snapshot = await db.ref(`${CC_PREFIX}/results/${meetSlug}`).once('value');
    return snapshotToArray(snapshot);
  } catch (error) {
    console.error(`Error getting results for meet ${meetSlug}:`, error);
    return [];
  }
}

/**
 * Get all results associated with a specific school (e.g., for school profile)
 * NOTE: This assumes an index is available on `school_slug` under the `/results` node or requires significant iteration.
 * Since Firebase RTDB doesn't easily support secondary indexes in a simple fetch,
 * a pre-indexed structure or client-side filtering would be necessary if the dataset is large.
 * For now, this function is defined as an intention, but its implementation is complex without proper indexing.
 * We will return an empty array for simplicity in this helper, assuming data will be fetched via a more focused path or ranked lists.
 * @param {string} schoolSlug The school slug.
 * @returns {Promise<Array>} Array of result objects
 */
async function getResultsBySchool(schoolSlug) {
  // Implementation requires iterating through all meets, which is inefficient.
  // Use a pre-computed or ranked list for efficiency in the main app.
  console.warn("getResultsBySchool is not implemented efficiently in this helper structure and will return empty array.");
  return [];
}

/**
 * Get all results for a specific athlete (e.g., for athlete profile)
 * @param {string} athleteSlug The athlete slug.
 * @returns {Promise<Array>} Array of result objects
 */
async function getResultsByAthlete(athleteSlug) {
  if (!athleteSlug) return [];
  try {
    const snapshot = await db.ref(`${CC_PREFIX}/athlete_results/${athleteSlug}`).once('value');
    const results = snapshotToArray(snapshot);
    // Sort by date if available, or just return as-is
    return results.sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (error) {
    console.error(`Error getting results for athlete ${athleteSlug}:`, error);
    return [];
  }
}

// ==========================================
// ATHLETES
// ==========================================

/**
 * Get a single athlete's profile data
 * @param {string} slug The athlete slug.
 * @returns {Promise<Object|null>} Athlete object or null
 */
async function getAthleteBySlug(slug) {
  if (!slug) return null;
  try {
    const snapshot = await db.ref(`${CC_PREFIX}/athletes/${slug}`).once('value');
    if (!snapshot.exists()) return null;
    return { slug: snapshot.key, ...snapshot.val() };
  } catch (error) {
    console.error(`Error getting athlete ${slug}:`, error);
    return null;
  }
}

/**
 * Get all athletes
 * @returns {Promise<Array>} Array of all athlete objects
 */
async function getAthletes() {
  try {
    const snapshot = await db.ref(`${CC_PREFIX}/athletes`).once('value');
    return snapshotToArray(snapshot);
  } catch (error) {
    console.error("Error getting all athletes:", error);
    return [];
  }
}


// ==========================================
// CSV TEMPLATE HELPERS
// ==========================================

/**
 * Get required CSV headers for result uploads
 * @returns {Array<string>} Array of header names
 */
function getCSVTemplateHeaders() {
  return [
    'athlete_name',
    'school_slug', 
    'grad_year', // Added grad_year for rankings page logic
    'gender',
    'time',
    'distance',
    'place',
    'meet_slug', // Optional but helpful
    'meet_date' // Optional but helpful
  ];
}

/**
 * Generate CSV template content
 * @returns {string} CSV template string
 */
function generateCSVTemplate() {
  const headers = getCSVTemplateHeaders();
  const sampleRows = [
    ['John Smith', 'morgantown', '2027', 'M', '18:30.45', '5000', '1', 'my-fall-invitational-2025', '2025-09-15'],
    ['Jane Doe', 'university-high', '2026', 'F', '20:15.20', '5000', '2', 'my-fall-invitational-2025', '2025-09-15'],
    ['Mike Johnson', 'bridgeport', '2028', 'M', '19:45.10', '5000', '3', 'my-fall-invitational-2025', '2025-09-15']
  ];
  
  const csvContent = [
    headers.join(','),
    ...sampleRows.map(row => row.join(','))
  ].join('\n');
  
  return csvContent;
}

// ==========================================
// EXPORT (only for browser)
// ==========================================
// Make functions available globally so they can be called from rankings.html script
window.getAllSchools = getAllSchools;
window.getSchoolBySlug = getSchoolBySlug;
window.getSchoolNameBySlug = getSchoolNameBySlug;
window.getMeetBySlug = getMeetBySlug;
window.getMeets = getAllMeets;
window.getResultsByMeet = getResultsByMeet;
window.getResultsBySchool = getResultsBySchool;
window.getResultsByAthlete = getResultsByAthlete;
window.getAthleteBySlug = getAthleteBySlug;
window.getAthletes = getAthletes;
window.getCSVTemplateHeaders = getCSVTemplateHeaders;
window.generateCSVTemplate = generateCSVTemplate;
window.snapshotToArray = snapshotToArray; // Also exposed in case it's needed elsewhere
window.snapshotToObject = snapshotToObject; // Also exposed in case it's needed elsewhere