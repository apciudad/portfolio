/**
 * APP.JS - Alejandro Lepe Portfolio
 * Incluye: Proyectos Pineados, Carrusel Automático con Dots y Filtros Rápidos.
 */

let openModal;
let moveSlide;
let setSlide;

window.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById("projectGrid");
    const searchInput = document.getElementById("searchInput");
    const filterChips = document.getElementById("filterChips");
    const pageSizeSelect = document.getElementById("pageSize");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const pageInfo = document.getElementById("pageInfo");
    const dotsContainer = document.getElementById("carouselDots");

    const modal = document.getElementById("modal");
    const modalClose = document.getElementById("modalClose");

    let projects = [];
    let filtered = [];
    let page = 1;
    let pageSize = 12;
    let currentCategory = "Todos";

    // --- LÓGICA DEL CARRUSEL HORIZONTAL TILES (pmndrs style) ---
    const tilesViewport = document.getElementById("tilesViewport");
    const tilesTrack = document.getElementById("tilesTrack");
    const tilesMinimap = document.getElementById("tilesMinimap");

    const sampleImages = [
        { img: "assets/img/projects/proyecto-6-1.jpg", title: "Valuación Masiva & Plusvalía", cat: "GIS · Analítica" },
        { img: "assets/img/projects/proyecto-2.jpg", title: "Modelos de Expansión Urbana", cat: "Ciencia de la Ciudad" },
        { img: "assets/img/projects/proyecto-3.jpg", title: "Infraestructura de Datos", cat: "GeoData" },
        { img: "assets/img/projects/proyecto-4.jpg", title: "Cartografía Digital & Territorio", cat: "GIS" },
        { img: "assets/img/projects/proyecto-5.jpg", title: "Análisis de Suelo Metropolitano", cat: "Urbanismo" },
        { img: "assets/img/projects/proyecto-6.jpg", title: "Redes Urbanas & Movilidad", cat: "Analítica" },
        { img: "assets/img/projects/proyecto-2.jpg", title: "Zonificación & Captura de Valor", cat: "Planificación" },
        { img: "assets/img/projects/proyecto-3.jpg", title: "Monitoreo Geoespacial", cat: "GIS" }
    ];

    let activeTileIndex = null;

    function initHorizontalTiles() {
        if (!tilesTrack || !tilesMinimap) return;
        tilesTrack.innerHTML = "";
        tilesMinimap.innerHTML = "";

        sampleImages.forEach((item, index) => {
            // Tile item
            const tile = document.createElement("div");
            tile.className = "tile-item";
            tile.dataset.index = index;
            tile.innerHTML = `
                <img src="${item.img}" alt="${item.title}" loading="lazy">
                <div class="tile-overlay">
                    <div class="tile-category">${item.cat}</div>
                    <div class="tile-title">${item.title}</div>
                </div>
            `;

            tile.addEventListener("click", () => {
                if (activeTileIndex === index) {
                    activeTileIndex = null;
                    tile.classList.remove("active");
                } else {
                    document.querySelectorAll(".tile-item").forEach(t => t.classList.remove("active"));
                    activeTileIndex = index;
                    tile.classList.add("active");
                    
                    // Centrar tile seleccionado
                    const scrollPos = tile.offsetLeft - (tilesViewport.clientWidth / 2) + (tile.clientWidth / 2);
                    tilesViewport.scrollTo({ left: scrollPos, behavior: 'smooth' });
                }
                updateMinimap();
            });

            tilesTrack.appendChild(tile);

            // Minimap bar
            const bar = document.createElement("div");
            bar.className = "minimap-bar";
            bar.addEventListener("click", () => {
                const targetTile = tilesTrack.children[index];
                targetTile.click();
            });
            tilesMinimap.appendChild(bar);
        });

        updateMinimap();

        // Activar el primer tile por defecto para mejor presentación
        if (tilesTrack.children.length > 0) {
            activeTileIndex = 0;
            tilesTrack.children[0].classList.add("active");
            updateMinimap();
        }
    }

    function updateMinimap() {
        if (!tilesViewport || !tilesMinimap) return;
        const scrollPercent = tilesViewport.scrollLeft / (tilesViewport.scrollWidth - tilesViewport.clientWidth || 1);
        const bars = tilesMinimap.children;
        const total = bars.length;
        if (!total) return;

        const activeIndex = Math.min(Math.floor(scrollPercent * total), total - 1);

        Array.from(bars).forEach((bar, i) => {
            if (activeTileIndex !== null) {
                bar.classList.toggle("active", i === activeTileIndex);
            } else {
                bar.classList.toggle("active", i === activeIndex);
            }
        });
    }

    // Drag-to-scroll functionality for viewport
    let isDown = false;
    let startX;
    let scrollLeft;

    if (tilesViewport) {
        tilesViewport.addEventListener("scroll", () => updateMinimap());

        tilesViewport.addEventListener("mousedown", (e) => {
            isDown = true;
            startX = e.pageX - tilesViewport.offsetLeft;
            scrollLeft = tilesViewport.scrollLeft;
        });
        tilesViewport.addEventListener("mouseleave", () => { isDown = false; });
        tilesViewport.addEventListener("mouseup", () => { isDown = false; });
        tilesViewport.addEventListener("mousemove", (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - tilesViewport.offsetLeft;
            const walk = (x - startX) * 1.5;
            tilesViewport.scrollLeft = scrollLeft - walk;
        });
    }

    initHorizontalTiles();

    // --- FILTROS RÁPIDOS (Categorías) ---
    function setupFilters() {
        const types = ["Todos", ...new Set(projects.map(p => p.type))];
        filterChips.innerHTML = "";
        types.forEach(type => {
            const btn = document.createElement("button");
            btn.className = `filter-btn ${type === "Todos" ? "active" : ""}`;
            btn.textContent = type;
            btn.onclick = () => {
                document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                currentCategory = type;
                applyFilters();
            };
            filterChips.appendChild(btn);
        });
    }

    function applyFilters() {
        const q = searchInput.value.toLowerCase();
        filtered = projects.filter(p => {
            const matchesSearch = p.title.toLowerCase().includes(q) ||
                (p.tags && p.tags.some(t => t.toLowerCase().includes(q)));
            const matchesCategory = currentCategory === "Todos" || p.type === currentCategory;
            return matchesSearch && matchesCategory;
        });
        page = 1;
        render();
    }

    // --- RENDERIZADO ---
    function render() {
        if (!grid) return;
        grid.innerHTML = "";

        const totalPages = Math.ceil(filtered.length / pageSize) || 1;
        const start = (page - 1) * pageSize;
        const slice = filtered.slice(start, start + pageSize);

        slice.forEach(p => {
            const card = document.createElement("div");
            // Efecto Hover y Clase especial para Pinned
            card.className = `card ${p.pinned ? 'pinned-card' : ''}`;
            card.onclick = () => openModal(p);

            // Lazy loading en imágenes
            card.innerHTML = `
                <img src="${p.cover || ''}" alt="${p.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x220?text=Error'">
                <div class="card-body">
                    <div class="card-meta">${p.year} • ${p.type}</div>
                    <div class="card-title">${p.title}</div>
                </div>
            `;
            grid.appendChild(card);
        });

        if (pageInfo) pageInfo.textContent = `Página ${page} de ${totalPages}`;
        prevBtn.disabled = (page <= 1);
        nextBtn.disabled = (page >= totalPages);
    }

    // --- CARGA DE DATOS ---
    async function loadData() {
        try {
            const res = await fetch("data/projects.json");
            projects = await res.json();

            // Orden: Pinned primero, luego Año
            projects.sort((a, b) => {
                if (a.pinned && !b.pinned) return -1;
                if (!a.pinned && b.pinned) return 1;
                return parseInt(b.year) - parseInt(a.year);
            });

            filtered = [...projects];
            setupFilters();
            render();
        } catch (e) { console.error("Error cargando JSON", e); }
    }

    // --- MODAL & EVENTOS ---
    openModal = function (p) {
        document.getElementById("modalImg").src = p.cover || '';
        document.getElementById("modalTitle").textContent = p.title || '';
        document.getElementById("modalMeta").textContent = `${p.year} • ${p.type}`;
        document.getElementById("modalText").innerHTML = Array.isArray(p.html) ? p.html.join('') : (p.html || "");

        const modalLink = document.getElementById("modalLink");
        if (modalLink) {
            if (p.url && p.url.trim() !== "") {
                modalLink.href = p.url;
                modalLink.style.display = "inline-block";
                // Cambiamos el texto según el tipo de contenido
                modalLink.textContent = (p.type === "Blog") ? "Leer artículo completo" : "Ver proyecto";
            } else {
                modalLink.style.display = "none"; // Se oculta si no hay link en el JSON
            }
        }

        // --- LÓGICA DE SUGERENCIAS ---
        const suggestionsGrid = document.getElementById("suggestionsGrid");
        if (suggestionsGrid) {
            suggestionsGrid.innerHTML = "";

            // 1. Filtrar proyectos que compartan etiquetas (excluyendo el actual)
            let related = projects.filter(item =>
                item.id !== p.id &&
                item.tags.some(tag => p.tags.includes(tag))
            );

            // 2. Si hay pocos relacionados, rellenar con los más recientes
            if (related.length < 3) {
                const extras = projects.filter(item => item.id !== p.id && !related.includes(item));
                related = [...related, ...extras];
            }

            // 3. Mostrar solo los primeros 3
            related.slice(0, 3).forEach(rel => {
                const sugCard = document.createElement("div");
                sugCard.className = "card";
                sugCard.style.fontSize = "0.85rem"; // Versión mini para sugerencias
                sugCard.onclick = (e) => {
                    e.stopPropagation();
                    openModal(rel); // Permite navegar entre sugerencias
                    document.getElementById("modal").scrollTo(0, 0); // Sube al inicio del modal
                };
                sugCard.innerHTML = `
                <img src="${rel.cover}" alt="${rel.title}" style="height: 120px;">
                <div class="card-body" style="padding: 10px;">
                    <div class="card-title" style="font-size: 0.9rem;">${rel.title}</div>
                </div>`;
                suggestionsGrid.appendChild(sugCard);
            });
        }

        if (modal) {
            modal.classList.add("active");
            document.body.style.overflow = "hidden";
        }
    };

    const closeModal = () => {
        if (modal) {
            modal.classList.remove("active");
            document.body.style.overflow = "auto";
        }
    };

    modalClose?.addEventListener("click", closeModal);
    modal?.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
    searchInput?.addEventListener("input", applyFilters);
    pageSizeSelect?.addEventListener("change", (e) => {
        pageSize = parseInt(e.target.value);
        page = 1;
        render();
    });
    prevBtn?.addEventListener("click", () => { if (page > 1) { page--; render(); } });
    nextBtn?.addEventListener("click", () => { if ((page * pageSize) < filtered.length) { page++; render(); } });

    loadData();
});

const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = new FormData(contactForm);

        formStatus.textContent = "Enviando...";
        formStatus.className = "form-status success"; // Estilo temporal
        formStatus.style.display = "block";

        try {
            const response = await fetch(contactForm.action, {
                method: contactForm.method,
                body: data,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                formStatus.textContent = "¡Gracias! Tu mensaje ha sido enviado con éxito.";
                formStatus.className = "form-status success";
                contactForm.reset();
            } else {
                const errorData = await response.json();
                formStatus.textContent = "Oops! Hubo un problema enviando el formulario.";
                formStatus.className = "form-status error";
            }
        } catch (error) {
            formStatus.textContent = "Error de conexión. Inténtalo más tarde.";
            formStatus.className = "form-status error";
        }
    });
}

// --- LÓGICA BOTÓN IR ARRIBA ---
const backToTopBtn = document.getElementById("backToTop");

if (backToTopBtn) {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add("show");
        } else {
            backToTopBtn.classList.remove("show");
        }
    });

    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}