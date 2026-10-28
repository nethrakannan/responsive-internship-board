
const internshipList = document.getElementById("internship-list");

const searchInput = document.getElementById("search-input");
const searchForm = document.getElementById("search-form");

const domainFilter = document.getElementById("domain-filter");
const modeFilter = document.getElementById("mode-filter");

const resultCount = document.getElementById("result-count");
const emptyState = document.getElementById("empty-state");

const resetButton = document.getElementById("reset-button");
const emptyReset = document.getElementById("empty-reset");

const errorMessage = document.getElementById("error-message");

let internships = [];

// Load internship data
async function loadInternships() {
  try {
    resultCount.textContent = "Loading internships...";

    const response = await fetch("internships.json");

    if (!response.ok) {
      throw new Error("Unable to load internship data.");
    }

    const data = await response.json();

    if (!Array.isArray(data.internships)) {
      throw new Error("Invalid internship data.");
    }

    internships = data.internships;

    errorMessage.textContent = "";

    renderInternships();

  } catch (error) {
    internshipList.innerHTML = "";

    resultCount.textContent = "Unable to load internships.";

    errorMessage.textContent =
      "Something went wrong while loading internships. Please try again.";

    const retryButton = document.createElement("button");

    retryButton.type = "button";
    retryButton.textContent = "Retry loading";
    retryButton.addEventListener("click", loadInternships);

    errorMessage.appendChild(document.createTextNode(" "));
    errorMessage.appendChild(retryButton);
  }
}

// Create internship cards
function renderInternships() {
  const searchText = searchInput.value.trim().toLowerCase();

  const selectedDomain = domainFilter.value;
  const selectedMode = modeFilter.value;

  const filteredInternships = internships.filter((internship) => {

    const searchableText = [
      internship.title,
      internship.domain,
      internship.location,
      ...internship.skills
    ].join(" ").toLowerCase();

    const matchesSearch = searchableText.includes(searchText);

    const matchesDomain =
      selectedDomain === "all" ||
      internship.domain === selectedDomain;

    const matchesMode =
      selectedMode === "all" ||
      internship.mode === selectedMode;

    return matchesSearch && matchesDomain && matchesMode;
  });

  internshipList.innerHTML = "";

  filteredInternships.forEach((internship) => {

    const card = document.createElement("article");

    card.className = "internship-card";

    const cardTop = document.createElement("div");
    cardTop.className = "card-top";

    const domainBadge = document.createElement("span");
    domainBadge.className = "domain-badge";
    domainBadge.textContent = internship.domain;

    const modeBadge = document.createElement("span");
    modeBadge.className = "mode-badge";
    modeBadge.textContent = internship.mode;

    cardTop.append(domainBadge, modeBadge);

    const title = document.createElement("h3");
    title.textContent = internship.title;

    const location = document.createElement("p");
    location.textContent = `Location: ${internship.location}`;

    const skillsContainer = document.createElement("div");
    skillsContainer.className = "skills";

    internship.skills.forEach((skill) => {
      const skillElement = document.createElement("span");

      skillElement.className = "skill";
      skillElement.textContent = skill;

      skillsContainer.appendChild(skillElement);
    });

    const details = document.createElement("details");

    const summary = document.createElement("summary");
    summary.textContent = "View internship details";

    const description = document.createElement("p");
    description.textContent = internship.description;

    details.append(summary, description);

    const openings = document.createElement("p");
    openings.textContent =
      `${internship.openings} opening(s) available`;

    const footer = document.createElement("div");
    footer.className = "card-footer";

    const internshipId = document.createElement("span");
    internshipId.textContent = internship.id;

    const applyButton = document.createElement("button");
    applyButton.type = "button";
    applyButton.textContent = "Apply";

    applyButton.addEventListener("click", () => {
      alert(
        `Application demo for ${internship.title}.\n` +
        "This internship board uses fictional sample records."
      );
    });

    footer.append(internshipId, applyButton);

    card.append(
      cardTop,
      title,
      location,
      skillsContainer,
      details,
      openings,
      footer
    );

    internshipList.appendChild(card);
  });

  resultCount.textContent =
    `${filteredInternships.length} internship(s) found`;

  emptyState.hidden = filteredInternships.length !== 0;
}

// Search
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  renderInternships();
});

searchInput.addEventListener("input", renderInternships);

// Filters
domainFilter.addEventListener("change", renderInternships);

modeFilter.addEventListener("change", renderInternships);

// Reset filters
function resetFilters() {
  searchInput.value = "";
  domainFilter.value = "all";
  modeFilter.value = "all";

  renderInternships();
}

resetButton.addEventListener("click", resetFilters);

emptyReset.addEventListener("click", resetFilters);

// Start the application
loadInternships();
