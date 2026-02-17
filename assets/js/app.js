// Definimos la función fuera para que sea accesible globalmente por el atributo onclick
let openModal;

window.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById("projectGrid");
    const searchInput = document.getElementById("searchInput");
    const pageSizeSelect = document.getElementById("pageSize");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const pageInfo = document.getElementById("pageInfo");

    const modal = document.getElementById("modal");
    const modalClose = document.getElementById("modalClose");

    let projects = [];
    let filtered = [];
    let page = 1;
    let pageSize = 12;

    // --- FUNCIÓN DEL MODAL ---
    openModal = function (p) {
        if (!modal) return;

        document.getElementById("modalImg").src = p.cover || '';
        document.getElementById("modalTitle").textContent = p.title || '';
        document.getElementById("modalMeta").textContent = `${p.year || ''} • ${p.type || ''}`;

        const modalTags = document.getElementById("modalTags");
        modalTags.innerHTML = "";
        (p.tags || []).forEach(t => {
            const span = document.createElement("span");
            span.className = "tag";
            span.textContent = t;
            modalTags.appendChild(span);
        });

        document.getElementById("modalText").innerHTML = Array.isArray(p.html) ? p.html.join('') : (p.html || "");

        const modalLink = document.getElementById("modalLink");
        if (p.url) {
            modalLink.href = p.url;
            modalLink.style.display = "inline-block";
        } else {
            modalLink.style.display = "none";
        }

        modal.classList.add("active");
        document.body.style.overflow = "hidden";
    };

    const closeModal = () => {
        modal.classList.remove("active");
        document.body.style.overflow = "auto";
    };

    modalClose?.addEventListener("click", closeModal);
    modal?.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });

    // --- RENDERIZADO ---
    function render() {
        if (!grid) return;
        grid.innerHTML = "";

        const totalPages = Math.ceil(filtered.length / pageSize);
        const start = (page - 1) * pageSize;
        const slice = filtered.slice(start, start + pageSize);

        slice.forEach(p => {
            const card = document.createElement("div");
            card.className = "card";
            card.onclick = () => openModal(p); // Asignación directa
            card.innerHTML = `
                <img src="${p.cover || ''}" alt="${p.title}" onerror="this.src='https://via.placeholder.com/400x220?text=Error'">
                <div class="card-body">
                    <div class="card-meta">${p.year} • ${p.type}</div>
                    <div class="card-title">${p.title}</div>
                </div>
            `;
            grid.appendChild(card);
        });

        if (pageInfo) pageInfo.textContent = `Página ${page} de ${totalPages}`;
        if (prevBtn) prevBtn.disabled = (page <= 1);
        if (nextBtn) nextBtn.disabled = (page >= totalPages);
    }

    async function loadData() {
        try {
            const res = await fetch("data/projects.json");
            projects = await res.json();
            projects.sort((a, b) => parseInt(b.year) - parseInt(a.year));
            filtered = [...projects];
            render();
        } catch (e) { console.error("Error cargando JSON", e); }
    }

    searchInput?.addEventListener("input", (e) => {
        const q = e.target.value.toLowerCase();
        filtered = projects.filter(p => p.title.toLowerCase().includes(q));
        page = 1;
        render();
    });

    pageSizeSelect?.addEventListener("change", (e) => {
        pageSize = parseInt(e.target.value);
        page = 1;
        render();
    });

    prevBtn?.addEventListener("click", () => { if (page > 1) { page--; render(); } });
    nextBtn?.addEventListener("click", () => { if ((page * pageSize) < filtered.length) { page++; render(); } });

    loadData();
});