 // CrickBurst Live Cricket Script
const API_KEY = "YOUR_API_KEY_HERE"; // Replace with your CricketData.org API key
let offset = 0; // Start from first set of matches

const scoresDiv = document.getElementById("scores");
const refreshBtn = document.getElementById("refresh");

// Set current year in footer
document.getElementById("year").textContent = new Date().getFullYear();

// Fetch live matches from CricketData.org
async function fetchLiveScores() {
  scoresDiv.innerHTML = "<p>Fetching live scores...</p>";

  try {
    const response = await fetch(
      `https://api.cricapi.com/v1/currentMatches?apikey=${API_KEY}&offset=${offset}`
    );

    const data = await response.json();

    if (!data || !data.data || data.data.length === 0) {
      scoresDiv.innerHTML = "<p>No live matches right now.</p>";
      return;
    }

    scoresDiv.innerHTML = "";

    data.data.slice(0, 5).forEach((match) => {
      const card = document.createElement("div");
      card.className = "match-card";

      const team1 = match.teamInfo?.[0];
      const team2 = match.teamInfo?.[1];

      card.innerHTML = `
        <h2>${match.name}</h2>
        <div class="teams">
          ${
            team1 && team2
              ? `
              <div class="team">
                <img src="${team1.img}" alt="${team1.name}" />
                <span>${team1.shortname || team1.name}</span>
              </div>
              <strong>vs</strong>
              <div class="team">
                <img src="${team2.img}" alt="${team2.name}" />
                <span>${team2.shortname || team2.name}</span>
              </div>
              `
              : ""
          }
        </div>

        <p><strong>Status:</strong> ${match.status}</p>

        ${
          match.score && match.score.length > 0
            ? match.score
                .map(
                  (s) =>
                    `<p><strong>${s.inning}</strong>: ${s.r}/${s.w} (${s.o} overs)</p>`
                )
                .join("")
            : "<p>No score data yet.</p>"
        }
      `;

      scoresDiv.appendChild(card);
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    scoresDiv.innerHTML = "<p>Unable to load scores. Please try again later.</p>";
  }
}

// Refresh button
refreshBtn.addEventListener("click", () => {
  fetchLiveScores();
});

// Auto refresh every 60 seconds
setInterval(fetchLiveScores, 60000);

// Initial load
fetchLiveScores();
