const grid = document.getElementById("projectGrid");

// Toolbar
const searchInput = document.getElementById("searchInput");
const pageSizeSelect = document.getElementById("pageSize");

// Pagination controls
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageInfo = document.getElementById("pageInfo");

// Modal
const modal = document.getElementById("modal");
const modalClose = document.getElementById("modalClose");
const modalImg = document.getElementById("modalImg");
const modalTags = document.getElementById("modalTags");
const modalMeta = document.getElementById("modalMeta");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");
const modalLink = document.getElementById("modalLink");

let projects = [];
let filtered = [];

let page = 1;
let pageSize = 12;

function openModal(p) {
    modalImg.src = p.cover || "";
    modalImg.alt = p.title || "";
    modalTitle.textContent = p.title || "";
    modalMeta.textContent = `${p.year || ""} • ${p.type || ""}`;

    modalTags.innerHTML = "";
    (p.tags || []).forEach(t => {
        const s = document.createElement("span");
        s.className = "tag";
        s.textContent = t;
        modalTags.appendChild(s);
    });

    modalText.innerHTML = p.html || "";
    if (p.url) {
        modalLink.style.display = "inline-block";
        modalLink.href = p.url;
    } else {
        modalLink.style.display = "none";
    }

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}

function closeModal() {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "auto";
}

modalClose?.addEventListener("click", closeModal);
modal?.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

function normalize(s) {
    return (s || "").toString().toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

function applyFilter() {
    const q = normalize(searchInput?.value || "");
    if (!q) {
        filtered = [...projects];
    } else {
        filtered = projects.filter(p => {
            const haystack = [
                p.title, p.year, p.type,
                ...(p.tags || [])
            ].map(normalize).join(" ");
            return haystack.includes(q);
        });
    }
    page = 1;
    render();
}

function render() {
    // Calculate pagination
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    page = Math.min(page, totalPages);

    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const slice = filtered.slice(start, end);

    // Render cards
    grid.innerHTML = "";
    slice.forEach(p => {
        const card = document.createElement("div");
        card.className = "card";
        card.onclick = () => openModal(p);

        card.innerHTML = `
      <img src="${p.cover || ""}" alt="${p.title || ""}" loading="lazy"/>
      <div class="card-body">
        <div class="card-meta">${p.year || ""} • ${p.type || ""}</div>
        <div class="card-title">${p.title || ""}</div>
      </div>
    `;
        grid.appendChild(card);
    });

    // Update controls
    if (pageInfo) {
        pageInfo.textContent = `Página ${page} de ${totalPages} · ${total} proyectos`;
    }
    if (prevBtn) prevBtn.disabled = (page <= 1);
    if (nextBtn) nextBtn.disabled = (page >= totalPages);
}

prevBtn?.addEventListener("click", () => {
    page = Math.max(1, page - 1);
    render();
});

nextBtn?.addEventListener("click", () => {
    page = page + 1;
    render();
});

pageSizeSelect?.addEventListener("change", () => {
    pageSize = parseInt(pageSizeSelect.value, 10) || 12;
    page = 1;
    render();
});

searchInput?.addEventListener("input", () => {
    applyFilter();
});

async function main() {
    const res = await fetch("data/projects.json", { cache: "no-store" });
    projects = await res.json();

    // (Opcional) ordenar por año desc si el año es número
    projects.sort((a, b) => {
        const ay = parseInt(a.year, 10);
        const by = parseInt(b.year, 10);
        if (Number.isFinite(ay) && Number.isFinite(by)) return by - ay;
        return (b.year || "").localeCompare(a.year || "");
    });

    filtered = [...projects];

    // Inicializa pageSize desde el select
    pageSize = parseInt(pageSizeSelect?.value || "12", 10) || 12;

    render();
}
main();
