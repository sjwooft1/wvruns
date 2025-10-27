// Load meets from Supabase
async function loadMeets() {
  const container = document.getElementById("meet-list");
  
  if (!container) return; // Exit if not on meets page
  
  try {
    // Example: Fetch meets from Supabase
    // Replace 'meets' with your actual table name
    const { data: meets, error } = await supabase
      .from('meets')
      .select('*')
      .order('date', { ascending: false })
      .limit(10);
    
    if (error) {
      console.error('Error fetching meets:', error);
      // Fallback to local JSON if Supabase fails
      loadMeetsFromJSON();
      return;
    }
    
    if (meets && meets.length > 0) {
      meets.forEach(meet => {
        const card = document.createElement("div");
        card.className = "meet-card";
        card.innerHTML = `
          <h3>${meet.name}</h3>
          <p>${meet.date}</p>
          <p><strong>Location:</strong> ${meet.location}</p>
        `;
        card.addEventListener("click", () => {
          window.location.href = `meets/${meet.slug}.html`;
        });
        container.appendChild(card);
      });
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
  fetch("data/meets.json")
    .then(res => res.json())
    .then(meets => {
      const container = document.getElementById("meet-list");
      if (!container) return;
      
      meets.forEach(meet => {
        const card = document.createElement("div");
        card.className = "meet-card";
        card.innerHTML = `
          <h3>${meet.name}</h3>
          <p>${meet.date}</p>
          <p><strong>Location:</strong> ${meet.location}</p>
        `;
        card.addEventListener("click", () => {
          window.location.href = `meets/${meet.slug}.html`;
        });
        container.appendChild(card);
      });
    })
    .catch(error => console.error('Error loading meets from JSON:', error));
}

// Load meets when page loads
loadMeets();
