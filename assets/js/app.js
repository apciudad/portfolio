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

    // --- LÓGICA DEL CARRUSEL ---
    let currentSlide = 0;
    const carouselTrack = document.querySelector(".carousel-slide");
    const slides = document.querySelectorAll(".carousel-slide img");

    // Generar Dots dinámicamente
    slides.forEach((_, idx) => {
        const dot = document.createElement("div");
        dot.className = `dot ${idx === 0 ? 'active' : ''}`;
        dot.onclick = () => setSlide(idx);
        dotsContainer.appendChild(dot);
    });

    const updateDots = () => {
        const dots = document.querySelectorAll(".dot");
        dots.forEach((d, i) => d.classList.toggle("active", i === currentSlide));
    };

    setSlide = function (index) {
        currentSlide = index;
        carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
        updateDots();
    };

    moveSlide = function (step) {
        currentSlide = (currentSlide + step + slides.length) % slides.length;
        carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
        updateDots();
    };

    let autoSlideInterval = setInterval(() => moveSlide(1), 5000);

    const carouselContainer = document.querySelector(".carousel-container");
    carouselContainer?.addEventListener("mouseenter", () => clearInterval(autoSlideInterval));
    carouselContainer?.addEventListener("mouseleave", () => {
        autoSlideInterval = setInterval(() => moveSlide(1), 5000);
    });

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
        modalLink.href = p.url || "#";
        modalLink.style.display = p.url ? "inline-block" : "none";
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
    };

    const closeModal = () => {
        modal.classList.remove("active");
        document.body.style.overflow = "auto";
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