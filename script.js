// Load meets from Supabase
async function loadMeets() {
      const container = document.getElementById("meet-list") || document.getElementById("meets-list");
  
  if (!container) return; // Exit if not on meets page
  
  try {
    const { data: meets, error } = await supabase
      .from('meets')
      .select('*')
      .order('date', { ascending: false })
      .limit(10);
    
    if (error) {
      console.error('Error fetching meets:', error);
      loadMeetsFromJSON();
      return;
    }
    
    if (meets && meets.length > 0) {
      container.innerHTML = ''; // Clear container
      
      // Load teams for each meet in parallel
      for (const meet of meets) {
        const card = await createMeetCard(meet);
        container.appendChild(card);
      }
    } else {
      // No data in Supabase, try JSON fallback
      loadMeetsFromJSON();
    }
  } catch (error) {
    console.error('Error loading meets:', error);
    loadMeetsFromJSON();
  }
}

// Fallback: Load meets from local JSON
function loadMeetsFromJSON() {
  const container = document.getElementById("meet-list") || document.getElementById("meets-list");
  if (!container) return;
  
  fetch("data/meets.json")
    .then(res => res.json())
    .then(meets => {
      container.innerHTML = ''; // Clear container
      meets.forEach(meet => {
        const card = document.createElement("div");
        card.className = "meet-card";
        card.innerHTML = `
          <h3>${meet.name}</h3>
          <p>${meet.date}</p>
          <p><strong>Location:</strong> ${meet.location || 'TBD'}</p>
        `;
        card.addEventListener("click", () => {
          alert(`Meet details coming soon! Meet: ${meet.name}`);
        });
        container.appendChild(card);
      });
    })
    .catch(error => {
      console.error('Error loading meets from JSON:', error);
      container.innerHTML = '<p>No meets available. Add meets via the admin page.</p>';
    });
}

// Helper function to create a meet card with team information
async function createMeetCard(meet) {
  const card = document.createElement("div");
  card.className = "meet-card";
  const date = meet.date ? new Date(meet.date).toLocaleDateString() : 'Date TBD';
  
  // Get participating teams
  const { data: results } = await supabase
    .from('results')
    .select('school_slug')
    .eq('meet_slug', meet.slug);
  
  let teamsInfo = '';
  if (results && results.length > 0) {
    // Get unique school slugs
    const uniqueSchools = [...new Set(results.map(r => r.school_slug).filter(Boolean))];
    
    if (uniqueSchools.length > 0) {
      // Get school names from database
      const { data: schools } = await supabase
        .from('schools')
        .select('name, slug')
        .in('slug', uniqueSchools);
      
      if (schools && schools.length > 0) {
        const schoolNames = schools.map(s => s.name).slice(0, 3); // Show first 3 teams
        teamsInfo = `<p><strong>Teams:</strong> ${schoolNames.join(', ')}${uniqueSchools.length > 3 ? ` and ${uniqueSchools.length - 3} more` : ''}</p>`;
      }
    }
  }
  
  card.innerHTML = `
    <h3>${meet.name}</h3>
    <p>Date: ${date}</p>
    <p><strong>Location:</strong> ${meet.location || 'TBD'}</p>
    ${teamsInfo}
  `;
  
  card.addEventListener("click", () => {
    // You can create a dynamic meet page later
    alert(`Meet details coming soon! Meet: ${meet.name}`);
  });
  
  return card;
}

// Load meets when page loads
loadMeets();
