// Supabase Helper Functions for WV Runs

// ==========================================
// SCHOOLS
// ==========================================

/**
 * Get all schools from the database
 * @returns {Promise<Array>} Array of school objects
 */
async function getAllSchools() {
  const { data, error } = await supabase
    .from('schools')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching schools:', error);
    return [];
  }
  
  return data || [];
}

/**
 * Get a single school by slug
 * @param {string} slug - The school's slug identifier
 * @returns {Promise<Object|null>} School object or null
 */
async function getSchoolBySlug(slug) {
  const { data, error } = await supabase
    .from('schools')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error) {
    console.error('Error fetching school:', error);
    return null;
  }
  
  return data;
}

// ==========================================
// MEETS
// ==========================================

/**
 * Get all meets, ordered by date (newest first)
 * @param {number} limit - Maximum number of meets to return
 * @returns {Promise<Array>} Array of meet objects
 */
async function getAllMeets(limit = 10) {
  const { data, error } = await supabase
    .from('meets')
    .select('*')
    .order('date', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('Error fetching meets:', error);
    return [];
  }
  
  return data || [];
}

/**
 * Get a meet by slug
 * @param {string} slug - The meet's slug identifier
 * @returns {Promise<Object|null>} Meet object or null
 */
async function getMeetBySlug(slug) {
  const { data, error } = await supabase
    .from('meets')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error) {
    console.error('Error fetching meet:', error);
    return null;
  }
  
  return data;
}

/**
 * Get meets for a specific school
 * @param {string} schoolSlug - The school's slug
 * @returns {Promise<Array>} Array of meet objects
 */
async function getMeetsBySchool(schoolSlug) {
  const { data, error } = await supabase
    .from('meets')
    .select('*, results!inner(school_slug)')
    .eq('results.school_slug', schoolSlug)
    .order('date', { ascending: false });
  
  if (error) {
    console.error('Error fetching school meets:', error);
    return [];
  }
  
  return data || [];
}

// ==========================================
// RESULTS
// ==========================================

/**
 * Get results for a specific meet
 * @param {string} meetSlug - The meet's slug
 * @returns {Promise<Array>} Array of result objects
 */
async function getResultsByMeet(meetSlug) {
  const { data, error } = await supabase
    .from('results')
    .select('*')
    .eq('meet_slug', meetSlug)
    .order('time');
  
  if (error) {
    console.error('Error fetching results:', error);
    return [];
  }
  
  return data || [];
}

/**
 * Get results for a specific school
 * @param {string} schoolSlug - The school's slug
 * @returns {Promise<Array>} Array of result objects
 */
async function getResultsBySchool(schoolSlug) {
  const { data, error } = await supabase
    .from('results')
    .select('*')
    .eq('school_slug', schoolSlug)
    .order('date', { ascending: false });
  
  if (error) {
    console.error('Error fetching school results:', error);
    return [];
  }
  
  return data || [];
}

/**
 * Get athlete results
 * @param {string} athleteName - The athlete's name
 * @returns {Promise<Array>} Array of result objects
 */
async function getResultsByAthlete(athleteName) {
  const { data, error } = await supabase
    .from('results')
    .select('*')
    .eq('athlete_name', athleteName)
    .order('date', { ascending: false });
  
  if (error) {
    console.error('Error fetching athlete results:', error);
    return [];
  }
  
  return data || [];
}

// ==========================================
// ATHLETES
// ==========================================

/**
 * Get all athletes for a specific school
 * @param {string} schoolSlug - The school's slug
 * @returns {Promise<Array>} Array of athlete objects
 */
async function getAthletesBySchool(schoolSlug) {
  const { data, error } = await supabase
    .from('athletes')
    .select('*')
    .eq('school_slug', schoolSlug)
    .order('name');
  
  if (error) {
    console.error('Error fetching athletes:', error);
    return [];
  }
  
  return data || [];
}

// ==========================================
// EXPORT
// ==========================================

// Note: In a browser environment, these functions are globally available
// In a module environment, you would export them like:
// export { getAllSchools, getSchoolBySlug, ... };

