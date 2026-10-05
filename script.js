const petDetails = [
  {
    id: "miso",
    name: "Miso",
    kind: "cat",
    birthDate: "2022-04-12",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "A curious tabby cat looking straight at the camera",
    vibe: "Professional napper",
    bio: "A sunny windowsill enthusiast with strong opinions about your lap."
  },
  {
    id: "pepper",
    name: "Pepper",
    kind: "dog",
    birthDate: "2021-09-03",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "A fluffy golden dog enjoying a sunny day outdoors",
    vibe: "Hike, then snack",
    bio: "Part trail buddy, part snack detector, entirely here for you."
  },
  {
    id: "olive",
    name: "Olive",
    kind: "cat",
    birthDate: "2023-01-19",
    image: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "A fluffy gray cat sitting calmly",
    vibe: "Quiet sidekick",
    bio: "Soft paws, soft purrs, and a talent for making any room cozier."
  },
  {
    id: "archie",
    name: "Archie",
    kind: "dog",
    birthDate: "2024-02-08",
    image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "A playful brown-and-white dog with a bright expression",
    vibe: "Enthusiastic greeter",
    bio: "Makes friends in every room and thinks your shoes are a fun game."
  },
  {
    id: "juniper",
    name: "Juniper",
    kind: "cat",
    birthDate: "2020-11-26",
    image: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "A small tortoiseshell cat perched by a window",
    vibe: "Curious little scholar",
    bio: "Will inspect every box, bag, and book you bring home."
  },
  {
    id: "pippin",
    name: "Pippin",
    kind: "dog",
    birthDate: "2022-07-07",
    image: "https://images.unsplash.com/photo-1551717743-49959800b1f6?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "A happy white-and-brown dog sitting outside",
    vibe: "Certified cuddlebug",
    bio: "A gentle shadow who believes every blanket is a shared blanket."
  }
];

const pets = petDetails.map((details) => ({
  ...details,
  birthday() {
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(`${this.birthDate}T12:00:00`));
  },
  get ageLabel() {
    const born = new Date(`${this.birthDate}T12:00:00`);
    const today = new Date();
    let months = (today.getFullYear() - born.getFullYear()) * 12 + today.getMonth() - born.getMonth();
    if (today.getDate() < born.getDate()) months -= 1;
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (years === 0) return `${Math.max(1, months)} mo`;
    return remainingMonths ? `${years} yr ${remainingMonths} mo` : `${years} yr`;
  },
  getBlurb() {
    return `${this.bio} Born ${this.birthday()}.`;
  }
}));

const petCounts = pets.reduce((counts, pet) => {
  counts[pet.kind] += 1;
  return counts;
}, { cat: 0, dog: 0 });

const petGrid = document.querySelector("#pet-grid");
const searchInput = document.querySelector("#search-input");
const sortSelect = document.querySelector("#sort-select");
const savedToggle = document.querySelector("#saved-toggle");
const savedCount = document.querySelector("#saved-count");
const resultCount = document.querySelector("#result-count");
const resultsLabel = document.querySelector("#results-label");
const emptyState = document.querySelector("#empty-state");
const kindButtons = [...document.querySelectorAll(".filter-button")];
const surpriseButton = document.querySelector("#surprise-button");
const resetButton = document.querySelector("#reset-button");

let activeKind = "all";
let showSavedOnly = false;
let savedPets = new Set();

try {
  savedPets = new Set(JSON.parse(localStorage.getItem("paws-saved-pets") || "[]"));
} catch {
  savedPets = new Set();
}

document.querySelector("#total-count").textContent = String(pets.length).padStart(2, "0");
document.querySelector("#count-all").textContent = pets.length;
document.querySelector("#count-cat").textContent = petCounts.cat;
document.querySelector("#count-dog").textContent = petCounts.dog;

function getVisiblePets() {
  const query = searchInput.value.trim().toLowerCase();
  const filteredPets = pets.filter((pet) => {
    const matchesKind = activeKind === "all" || pet.kind === activeKind;
    const matchesSaved = !showSavedOnly || savedPets.has(pet.id);
    const searchableText = `${pet.name} ${pet.kind} ${pet.vibe} ${pet.bio}`.toLowerCase();
    return matchesKind && matchesSaved && searchableText.includes(query);
  });

  if (sortSelect.value === "name") return filteredPets.sort((left, right) => left.name.localeCompare(right.name));
  if (sortSelect.value === "youngest") return filteredPets.sort((left, right) => new Date(right.birthDate) - new Date(left.birthDate));
  if (sortSelect.value === "oldest") return filteredPets.sort((left, right) => new Date(left.birthDate) - new Date(right.birthDate));
  return filteredPets;
}

function createPetCard(pet, index) {
  const isSaved = savedPets.has(pet.id);
  const kindLabel = pet.kind === "cat" ? "Cat" : "Dog";
  const saveLabel = isSaved ? `Remove ${pet.name} from saved pets` : `Save ${pet.name}`;
  return `
    <article class="pet-card" data-pet-id="${pet.id}" style="animation-delay:${index * 45}ms">
      <div class="pet-image-wrap">
        <img class="pet-image" src="${pet.image}" alt="${pet.imageAlt}" loading="lazy" />
        <span class="pet-kind">${kindLabel}</span>
        <button class="save-button${isSaved ? " is-saved" : ""}" type="button" data-save-id="${pet.id}" aria-label="${saveLabel}" aria-pressed="${isSaved}">
          <span aria-hidden="true">${isSaved ? "&#9829;" : "&#9825;"}</span>
        </button>
      </div>
      <div class="pet-content">
        <div class="pet-title-row"><h3>${pet.name}</h3><span class="pet-age">${pet.ageLabel}</span></div>
        <p class="pet-blurb">${pet.getBlurb()}</p>
        <div class="pet-meta"><span class="pet-vibe">${pet.vibe}</span><span>${kindLabel} &middot; ${pet.birthday()}</span></div>
      </div>
    </article>`;
}

function renderPets() {
  const visiblePets = getVisiblePets();
  petGrid.innerHTML = visiblePets.map(createPetCard).join("");
  resultCount.textContent = visiblePets.length;
  savedCount.textContent = savedPets.size;
  resultsLabel.textContent = showSavedOnly ? "Your saved crew" : "Meet the whole crew";
  emptyState.hidden = visiblePets.length > 0;
  petGrid.hidden = visiblePets.length === 0;
}

kindButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeKind = button.dataset.kind;
    kindButtons.forEach((kindButton) => {
      const isActive = kindButton === button;
      kindButton.classList.toggle("is-active", isActive);
      kindButton.setAttribute("aria-pressed", String(isActive));
    });
    renderPets();
  });
});

document.addEventListener("keydown", (event) => {
  const activeElement = document.activeElement;
  if (event.key !== "/" || event.altKey || event.ctrlKey || event.metaKey) return;
  if (activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement || activeElement?.isContentEditable) return;
  event.preventDefault();
  searchInput.focus();
});

searchInput.addEventListener("input", renderPets);
sortSelect.addEventListener("change", renderPets);

savedToggle.addEventListener("click", () => {
  showSavedOnly = !showSavedOnly;
  savedToggle.setAttribute("aria-pressed", String(showSavedOnly));
  renderPets();
});

petGrid.addEventListener("click", (event) => {
  const saveButton = event.target.closest("[data-save-id]");
  if (!saveButton) return;
  const petId = saveButton.dataset.saveId;
  if (savedPets.has(petId)) savedPets.delete(petId);
  else savedPets.add(petId);
  try {
    localStorage.setItem("paws-saved-pets", JSON.stringify([...savedPets]));
  } catch {
    savedPets = new Set(savedPets);
  }
  renderPets();
});

surpriseButton.addEventListener("click", () => {
  const visiblePets = getVisiblePets();
  if (visiblePets.length === 0) {
    searchInput.focus();
    return;
  }
  const chosenPet = visiblePets[Math.floor(Math.random() * visiblePets.length)];
  const card = petGrid.querySelector(`[data-pet-id="${chosenPet.id}"]`);
  card.classList.add("is-picked");
  card.scrollIntoView({ behavior: "smooth", block: "center" });
  window.setTimeout(() => card.classList.remove("is-picked"), 1600);
});

resetButton.addEventListener("click", () => {
  activeKind = "all";
  showSavedOnly = false;
  searchInput.value = "";
  savedToggle.setAttribute("aria-pressed", "false");
  kindButtons.forEach((button) => {
    const isActive = button.dataset.kind === "all";
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  renderPets();
});

renderPets();