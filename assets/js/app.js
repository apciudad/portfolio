// Envoltura de seguridad para esperar al DOM
window.addEventListener('DOMContentLoaded', () => {

    // Referencias con verificación
    const grid = document.getElementById("projectGrid");
    const searchInput = document.getElementById("searchInput");
    const pageSizeSelect = document.getElementById("pageSize");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const pageInfo = document.getElementById("pageInfo");

    // Referencias del Modal
    const modal = document.getElementById("modal");
    const modalClose = document.getElementById("modalClose");
    const modalImg = document.getElementById("modalImg");
    const modalTitle = document.getElementById("modalTitle");
    const modalTags = document.getElementById("modalTags");
    const modalMeta = document.getElementById("modalMeta");
    const modalText = document.getElementById("modalText");
    const modalLink = document.getElementById("modalLink");

    let projects = [];
    let filtered = [];
    let page = 1;
    let pageSize = 12;

    // --- FUNCIÓN DEL MODAL ---
    function openModal(p) {
        if (!modal) return;

        // Llenar datos
        modalImg.src = p.cover || '';
        modalImg.alt = p.title || '';
        modalTitle.textContent = p.title || 'Sin título';
        modalMeta.textContent = `${p.year || ''} • ${p.type || ''}`;

        // Limpiar y llenar tags
        modalTags.innerHTML = "";
        (p.tags || []).forEach(t => {
            const span = document.createElement("span");
            span.className = "tag";
            span.textContent = t;
            modalTags.appendChild(span);
        });

        // Contenido HTML (Maneja si es String o Array)
        modalText.innerHTML = Array.isArray(p.html) ? p.html.join('') : (p.html || "");

        // Configurar botón
        if (p.url) {
            modalLink.href = p.url;
            modalLink.style.display = "inline-block";
        } else {
            modalLink.style.display = "none";
        }

        // Mostrar modal
        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden"; // Bloquear scroll
    }

    function closeModal() {
        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "auto"; // Liberar scroll
    }

    // Eventos de cierre
    modalClose?.addEventListener("click", closeModal);
    modal?.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
    window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

    // --- RENDERIZADO DE TARJETAS ---
    function render() {
        if (!grid) return;
        grid.innerHTML = "";

        if (filtered.length === 0) {
            grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center;">No se encontraron proyectos.</p>`;
            return;
        }

        const totalPages = Math.ceil(filtered.length / pageSize);
        const start = (page - 1) * pageSize;
        const slice = filtered.slice(start, start + pageSize);

        slice.forEach(p => {
            const card = document.createElement("div");
            card.className = "card";

            // Vincular la función openModal
            card.onclick = () => openModal(p);

            card.innerHTML = `
                <img src="${p.cover || ''}" alt="${p.title}" onerror="this.src='https://via.placeholder.com/400x220?text=Error+Imagen'">
                <div class="card-body">
                    <div class="card-meta">${p.year || ''} • ${p.type || ''}</div>
                    <div class="card-title">${p.title || 'Sin título'}</div>
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
            const response = await fetch("data/projects.json");
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            projects = await response.json();
            projects.sort((a, b) => parseInt(b.year) - parseInt(a.year));
            filtered = [...projects];
            render();
        } catch (error) {
            console.error("Fallo al cargar el JSON:", error);
            if (grid) grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #ff4e4e;">Error al cargar proyectos.</p>`;
        }
    }

    // Listeners
    searchInput?.addEventListener("input", (e) => {
        const q = e.target.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        filtered = projects.filter(p => {
            const text = `${p.title} ${p.year} ${p.tags?.join(' ')}`.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            return text.includes(q);
        });
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