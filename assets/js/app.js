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

window.addEventListener("scroll", () => {
    // Si el usuario baja más de 400px, muestra el botón
    if (window.scrollY > 400) {
        backToTopBtn.classList.add("show");
    } else {
        backToTopBtn.classList.remove("show");
    }
});

backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth" // Desplazamiento suave
    });
});