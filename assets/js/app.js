// Envoltura de seguridad para esperar al DOM
window.addEventListener('DOMContentLoaded', () => {

    // Referencias con verificación
    const grid = document.getElementById("projectGrid");
    const searchInput = document.getElementById("searchInput");
    const pageSizeSelect = document.getElementById("pageSize");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const pageInfo = document.getElementById("pageInfo");

    let projects = [];
    let filtered = [];
    let page = 1;
    let pageSize = 12;

    // Función de renderizado segura
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
            // Si tienes la función openModal definida, úsala aquí
            card.onclick = () => typeof openModal === 'function' ? openModal(p) : console.log(p);

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

    // Carga de datos con manejo de errores de red
    async function loadData() {
        try {
            const response = await fetch("data/projects.json");
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            projects = await response.json();
            // Ordenar por año descendente
            projects.sort((a, b) => parseInt(b.year) - parseInt(a.year));
            filtered = [...projects];
            render();
        } catch (error) {
            console.error("Fallo al cargar el JSON:", error);
            if (grid) grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #ff4e4e;">Error: No se pudo conectar con projects.json. Revisa que el servidor local esté activo.</p>`;
        }
    }

    // Listeners protegidos (solo se activan si el elemento existe)
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

    // Iniciar carga
    loadData();
});