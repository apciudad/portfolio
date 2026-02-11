const grid = document.getElementById("projectGrid");

const modal = document.getElementById("modal");
const modalClose = document.getElementById("modalClose");
const modalImg = document.getElementById("modalImg");
const modalTags = document.getElementById("modalTags");
const modalMeta = document.getElementById("modalMeta");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");
const modalLink = document.getElementById("modalLink");

let projects = [];

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

modalClose.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

function render() {
    grid.innerHTML = "";
    projects.forEach(p => {
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
}

async function main() {
    const res = await fetch("data/projects.json", { cache: "no-store" });
    projects = await res.json();
    render();
}

main();
