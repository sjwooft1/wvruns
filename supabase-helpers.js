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
// CSV IMPORT & BULK OPERATIONS
// ==========================================

/**
 * Parse time string to seconds
 * Handles formats like "18:30.45", "20:15", "1200.5", "1200"
 * @param {string} timeStr - Time string
 * @returns {number} Time in seconds
 */
function parseTimeToSeconds(timeStr) {
  if (!timeStr) return null;
  
  const str = timeStr.toString().trim();
  
  // If it's already a number (seconds), return it
  if (!isNaN(str) && !str.includes(':')) {
    return parseFloat(str);
  }
  
  // Handle MM:SS.ss format
  if (str.includes(':')) {
    const parts = str.split(':');
    
    if (parts.length === 2) {
      const minutes = parseInt(parts[0]);
      const seconds = parseFloat(parts[1]);
      return (minutes * 60) + seconds;
    }
    if (parts.length === 3) {
      const hours = parseInt(parts[0]);
      const minutes = parseInt(parts[1]);
      const seconds = parseFloat(parts[2]);
      return (hours * 3600) + (minutes * 60) + seconds;
    }
  }
  
  return NaN;
}

/**
 * Check if database schema is up to date
 * @returns {Promise<Object>} Object with success status and details
 */
async function checkDatabaseSchema() {
  try {
    // First, let's check the actual schema
    const { data: schemaData, error: schemaError } = await supabase
      .rpc('get_column_info', { table_name: 'results', column_name: 'time' });
    
    if (schemaError) {
      console.log('Schema check method 1 failed, trying method 2...');
      
      // Alternative method - try a simple insert with high precision
      const testTime = 1110.450; // 18:30.45 in seconds
      
      const { error: insertError } = await supabase
        .from('results')
        .insert([{
          athlete_name: 'TEST_SCHEMA_CHECK',
          time: testTime,
          meet_slug: 'test-schema-check'
        }]);
      
      if (insertError) {
        console.error('Database schema check failed:', insertError);
        return { 
          success: false, 
          error: insertError.message,
          details: 'Time field precision is insufficient. Please run: ALTER TABLE results ALTER COLUMN time TYPE DECIMAL(12, 3);'
        };
      }
      
      // Clean up test record
      await supabase
        .from('results')
        .delete()
        .eq('athlete_name', 'TEST_SCHEMA_CHECK');
      
      return { success: true, details: 'Schema check passed' };
    }
    
    return { success: true, details: 'Schema check passed via RPC' };
    
  } catch (error) {
    console.error('Database schema check error:', error);
    return { 
      success: false, 
      error: error.message,
      details: 'Unable to verify database schema. Please ensure the migration was run successfully.'
    };
  }
}

/**
 * Parse CSV text into array of objects
 * @param {string} csvText - The CSV text content
 * @param {Array} headers - Array of column headers
 * @returns {Array} Array of parsed objects
 */
function parseCSV(csvText, headers) {
  const lines = csvText.trim().split('\n');
  const results = [];
  
  // Skip the first line (header row)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Simple CSV parsing (handles basic cases)
    const values = line.split(',').map(val => val.trim().replace(/^"|"$/g, ''));
    
    if (values.length !== headers.length) {
      console.warn(`Line ${i + 1} has ${values.length} columns, expected ${headers.length}`);
      continue;
    }
    
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || null;
    });
    
    results.push(row);
  }
  
  return results;
}

/**
 * Bulk insert results from CSV data
 * @param {string} meetSlug - The meet's slug
 * @param {Array} csvData - Array of parsed CSV objects
 * @returns {Promise<Object>} Result object with success count and errors
 */
async function bulkInsertResults(meetSlug, csvData) {
  const results = {
    success: 0,
    errors: [],
    total: csvData.length
  };
  
  // Validate required fields
  const requiredFields = ['athlete_name'];
  const validRows = [];
  
  csvData.forEach((row, index) => {
    const missingFields = requiredFields.filter(field => !row[field]);
    if (missingFields.length > 0) {
      results.errors.push(`Row ${index + 1}: Missing required fields: ${missingFields.join(', ')}`);
      return;
    }
    
    // Add meet_slug to each row
    row.meet_slug = meetSlug;
    
    // Convert numeric fields
    if (row.time) {
      const parsedTime = parseTimeToSeconds(row.time);
      if (isNaN(parsedTime)) {
        results.errors.push(`Row ${index + 1}: Invalid time value: ${row.time}`);
        return;
      }
      
    // Convert time to fit DECIMAL(10,2) format
    // DECIMAL(10,2) can store values up to 99,999,999.99
    // For running times, this is more than sufficient
    row.time = Math.round(parsedTime * 100) / 100;
    
    // Ensure it fits in the database field
    if (row.time > 99999999.99) {
      results.errors.push(`Row ${index + 1}: Time too large (${row.time}s). Original value: "${row.time}". Maximum allowed: 99,999,999.99 seconds. Please check your time format.`);
      return;
    }
    
    // Additional validation for reasonable running times
    if (row.time > 36000) { // More than 10 hours
      results.errors.push(`Row ${index + 1}: Time seems unusually long (${row.time}s = ${Math.round(row.time/60)} minutes). Original value: "${row.time}". Please verify this is correct.`);
      return;
    }
    
    if (row.distance) {
      row.distance = parseFloat(row.distance);
      if (isNaN(row.distance)) {
        results.errors.push(`Row ${index + 1}: Invalid distance value: ${row.distance}`);
        return;
      }
    }
    
    if (row.place) {
      row.place = parseInt(row.place);
      if (isNaN(row.place)) {
        results.errors.push(`Row ${index + 1}: Invalid place value: ${row.place}`);
        return;
      }
    }
    
    // Validate gender
    if (row.gender && !['M', 'F'].includes(row.gender.toUpperCase())) {
      results.errors.push(`Row ${index + 1}: Invalid gender value: ${row.gender}`);
      return;
    }
    
    if (row.gender) {
      row.gender = row.gender.toUpperCase();
    }
    
    validRows.push(row);

  }

  if (validRows.length === 0) {
    return results;
  }
  
  // Insert valid rows
  const { data, error } = await supabase
    .from('results')
    .insert(validRows);
  
  if (error) {
    console.error('Database insert error:', error);
    
    // Check if it's a numeric field overflow error
    if (error.message.includes('numeric field overflow') || error.message.includes('value too large')) {
      results.errors.push(`Database error: Time value too large for database field. Please check your time format. Error details: ${error.message}`);
    } else {
      results.errors.push(`Database error: ${error.message}`);
    }
  } else {
    results.success = validRows.length;
  }
  
  return results;
}

/**
 * Create a new meet from CSV import
 * @param {Object} meetData - Meet information
 * @returns {Promise<Object>} Created meet object or error
 */
async function createMeetFromCSV(meetData) {
  const { data, error } = await supabase
    .from('meets')
    .insert([meetData])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating meet:', error);
    return { error: error.message };
  }
  
  return data;
}

/**
 * Get CSV template headers for results import
 * @returns {Array} Array of column headers
 */
function getCSVTemplateHeaders() {
  return [
    'athlete_name',
    'school_slug', 
    'gender',
    'time',
    'distance',
    'place'
  ];
}

/**
 * Generate CSV template content
 * @returns {string} CSV template string
 */
function generateCSVTemplate() {
  const headers = getCSVTemplateHeaders();
  const sampleRows = [
    ['John Smith', 'morgantown', 'M', '18:30.45', '5000', '1'],
    ['Jane Doe', 'university-high', 'F', '20:15.20', '5000', '2'],
    ['Mike Johnson', 'bridgeport', 'M', '19:45.10', '5000', '3']
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
window.getAllSchools = getAllSchools;
window.getSchoolBySlug = getSchoolBySlug;
window.getSchoolNameBySlug = getSchoolNameBySlug;
window.getMeetBySlug = getMeetBySlug;
window.getMeets = getAllMeets;
window.getResultsByMeet = getResultsByMeet;
window.getResultsBySchool = getResultsBySchool;
window.getResultsByAthlete = getResultsByAthlete;
window.getAthleteBySlug = getAthleteBySlug;
window.getAthletes = getAthletesBySchool;
window.createMeet = createMeetFromCSV;
window.getCSVTemplateHeaders = getCSVTemplateHeaders;
window.generateCSVTemplate = generateCSVTemplate;
window.parseCSV = parseCSV;
window.bulkInsertResults = bulkInsertResults;
window.parseTimeToSeconds = parseTimeToSeconds;
window.checkDatabaseSchema = checkDatabaseSchema;
