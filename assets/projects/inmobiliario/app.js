let map;
let geojsonData = null;
let filteredFeatures = [];
let activeMarker = null;
let activePropertyId = null;

let priceSlider;
let priceM2Slider;

// Spatial Drawing & Filter State
let drawnItems;
let activeDrawnPolygon = null;

// Color scales and palette
const TYPE_COLORS = {
  house: '#38bdf8',       // Sky blue
  apartment: '#f472b6',   // Pink
  other: '#fbbf24'        // Amber
};

document.addEventListener('DOMContentLoaded', () => {
  initMap();
  loadData();
});

function initMap() {
  map = L.map('map', {
    zoomControl: false
  }).setView([20.6736, -103.3592], 12);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);

  L.control.zoom({ position: 'bottomright' }).addTo(map);

  // Initialize Leaflet Draw Feature Group
  drawnItems = new L.FeatureGroup();
  map.addLayer(drawnItems);

  // Initialize Draw Control (Polygons & Rectangles)
  const drawControl = new L.Control.Draw({
    position: 'topright',
    draw: {
      polygon: {
        allowIntersection: false,
        showArea: true,
        shapeOptions: {
          color: '#38bdf8',
          fillColor: '#38bdf8',
          fillOpacity: 0.2,
          weight: 2
        }
      },
      rectangle: {
        shapeOptions: {
          color: '#818cf8',
          fillColor: '#818cf8',
          fillOpacity: 0.2,
          weight: 2
        }
      },
      circle: false,
      polyline: false,
      marker: false,
      circlemarker: false
    },
    edit: {
      featureGroup: drawnItems,
      remove: true
    }
  });

  map.addControl(drawControl);

  // Handle Spatial Drawing Creation Event
  map.on(L.Draw.Event.CREATED, (e) => {
    drawnItems.clearLayers(); // Keep single active spatial filter
    const layer = e.layer;
    drawnItems.addLayer(layer);
    activeDrawnPolygon = layer.toGeoJSON();

    document.getElementById('spatial-filter-badge').classList.remove('hidden');
    filterData();
  });

  // Handle Spatial Drawing Deletion Event
  map.on(L.Draw.Event.DELETED, () => {
    activeDrawnPolygon = null;
    document.getElementById('spatial-filter-badge').classList.add('hidden');
    filterData();
  });
}

async function loadData() {
  try {
    const response = await fetch('data/propiedades.json');
    geojsonData = await response.json();
    filteredFeatures = [...geojsonData.features];
    
    initSliders();
    setupEventListeners();
    updateKPIs();
    renderMapPoints();
    renderListings();
  } catch (error) {
    console.error('Error cargando datos de propiedades:', error);
  }
}

function initSliders() {
  const priceSliderEl = document.getElementById('slider-price');
  noUiSlider.create(priceSliderEl, {
    start: [500000, 50000000],
    connect: true,
    step: 500000,
    range: {
      'min': 500000,
      'max': 50000000
    }
  });
  priceSlider = priceSliderEl.noUiSlider;

  priceSlider.on('update', (values) => {
    const minVal = parseFloat(values[0]);
    const maxVal = parseFloat(values[1]);
    const minText = formatCurrencyCompact(minVal);
    const maxText = maxVal >= 50000000 ? 'Sin límite' : formatCurrencyCompact(maxVal);
    document.getElementById('price-range-val').innerText = `${minText} - ${maxText}`;
    filterData();
  });

  const priceM2SliderEl = document.getElementById('slider-price-m2');
  noUiSlider.create(priceM2SliderEl, {
    start: [5000, 100000],
    connect: true,
    step: 1000,
    range: {
      'min': 5000,
      'max': 100000
    }
  });
  priceM2Slider = priceM2SliderEl.noUiSlider;

  priceM2Slider.on('update', (values) => {
    const minVal = parseFloat(values[0]);
    const maxVal = parseFloat(values[1]);
    const minText = `$${Math.round(minVal).toLocaleString()}`;
    const maxText = maxVal >= 100000 ? 'Sin límite' : `$${Math.round(maxVal).toLocaleString()}`;
    document.getElementById('price-m2-range-val').innerText = `${minText} - ${maxText}`;
    filterData();
  });
}

function updateKPIs() {
  const total = filteredFeatures.length;
  document.getElementById('kpi-total').innerText = total.toLocaleString();

  if (total === 0) {
    document.getElementById('kpi-avg-price').innerText = '$0';
    document.getElementById('kpi-avg-m2').innerText = '$0';
    return;
  }

  const prices = filteredFeatures.map(f => f.properties.price).filter(p => p > 0);
  const avgPrice = prices.length ? (prices.reduce((a, b) => a + b, 0) / prices.length) : 0;
  
  const pricesM2 = filteredFeatures.map(f => f.properties.price_m2).filter(p => p > 0);
  const avgM2 = pricesM2.length ? (pricesM2.reduce((a, b) => a + b, 0) / pricesM2.length) : 0;

  document.getElementById('kpi-avg-price').innerText = formatCurrencyCompact(avgPrice);
  document.getElementById('kpi-avg-m2').innerText = `$${Math.round(avgM2).toLocaleString()}`;
}

function formatCurrencyCompact(val) {
  if (val >= 1e6) {
    return `$${(val / 1e6).toFixed(1)}M`;
  } else if (val >= 1e3) {
    return `$${(val / 1e3).toFixed(0)}k`;
  }
  return `$${Math.round(val).toLocaleString()}`;
}

let markersLayerGroup = L.layerGroup();

function renderMapPoints() {
  markersLayerGroup.clearLayers();

  filteredFeatures.forEach(feature => {
    const coords = feature.geometry.coordinates;
    const props = feature.properties;
    const color = TYPE_COLORS[props.type] || TYPE_COLORS.other;

    const marker = L.circleMarker([coords[1], coords[0]], {
      radius: 6,
      fillColor: color,
      color: '#ffffff',
      weight: 1,
      opacity: 0.9,
      fillOpacity: 0.85
    });

    const popupContent = `
      <div style="font-family: sans-serif; color: #0f172a; padding: 4px;">
        <div style="font-weight: 700; font-size: 1.05rem; color: #0284c7;">${props.price_formatted}</div>
        <div style="font-size: 0.8rem; color: #475569; margin: 3px 0;">${props.address}</div>
        <div style="font-size: 0.75rem; font-weight: 600; text-transform: uppercase; color: #64748b;">${props.type === 'house' ? 'Casa' : 'Departamento'} • ${props.bedrooms || '-'} rec • ${props.bathrooms || '-'} baños</div>
      </div>
    `;

    marker.bindPopup(popupContent);

    marker.on('click', () => {
      openModal(props);
      highlightCard(props.id);
    });

    markersLayerGroup.addLayer(marker);
  });

  markersLayerGroup.addTo(map);
}

function renderListings() {
  const container = document.getElementById('listings-container');
  container.innerHTML = '';

  document.getElementById('results-count').innerText = `${filteredFeatures.length} propiedades encontradas`;

  const displayFeatures = filteredFeatures.slice(0, 100);

  displayFeatures.forEach(feature => {
    const p = feature.properties;
    const photoUrl = (p.photos && p.photos.length > 0) 
      ? p.photos[0] 
      : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=300&q=80';

    const card = document.createElement('div');
    card.className = `property-card ${activePropertyId === p.id ? 'active' : ''}`;
    card.id = `card-${p.id}`;
    
    card.innerHTML = `
      <div class="card-img-wrapper">
        <img src="${photoUrl}" alt="Property" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=300&q=80'">
        <div class="card-tag">${p.type === 'house' ? 'Casa' : 'Depto'}</div>
      </div>
      <div class="card-info">
        <div>
          <div class="card-price">${p.price_formatted}</div>
          <div class="card-address" title="${p.address}">${p.address}</div>
        </div>
        <div class="card-specs">
          <span class="spec-item">🛏️ ${p.bedrooms || '-'} rec</span>
          <span class="spec-item">🚿 ${p.bathrooms || '-'} baño</span>
          <span class="spec-item">📐 ${p.construction_m2 ? p.construction_m2 + 'm²' : '-'}</span>
        </div>
      </div>
    `;

    card.addEventListener('click', () => {
      map.flyTo([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], 15, { duration: 1.2 });
      openModal(p);
      highlightCard(p.id);
    });

    container.appendChild(card);
  });
}

function highlightCard(id) {
  activePropertyId = id;
  document.querySelectorAll('.property-card').forEach(el => el.classList.remove('active'));
  const targetCard = document.getElementById(`card-${id}`);
  if (targetCard) {
    targetCard.classList.add('active');
    targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function filterData() {
  if (!geojsonData || !priceSlider || !priceM2Slider) return;

  const [minPrice, maxPrice] = priceSlider.get().map(parseFloat);
  const [minPriceM2, maxPriceM2] = priceM2Slider.get().map(parseFloat);
  
  const bedrooms = document.getElementById('filter-bedrooms').value;
  const selectedType = document.querySelector('.btn-toggle.active').dataset.type;

  filteredFeatures = geojsonData.features.filter(f => {
    const p = f.properties;
    
    // 1. Spatial Polygon Draw Filter (Turf.js point-in-polygon)
    if (activeDrawnPolygon) {
      const pt = turf.point(f.geometry.coordinates);
      const poly = turf.polygon(activeDrawnPolygon.geometry.coordinates);
      const isInside = turf.booleanPointInPolygon(pt, poly);
      if (!isInside) return false;
    }
    
    // 2. Price total dual range filter
    if (p.price) {
      if (p.price < minPrice) return false;
      if (maxPrice < 50000000 && p.price > maxPrice) return false;
    }
    
    // 3. Price per m2 dual range filter
    if (p.price_m2) {
      if (p.price_m2 < minPriceM2) return false;
      if (maxPriceM2 < 100000 && p.price_m2 > maxPriceM2) return false;
    }
    
    // 4. Bedrooms filter
    if (bedrooms !== 'all') {
      if (bedrooms === '4+' && (p.bedrooms < 4 || !p.bedrooms)) return false;
      if (bedrooms !== '4+' && p.bedrooms !== parseInt(bedrooms)) return false;
    }
    
    // 5. Type filter
    if (selectedType !== 'all' && p.type !== selectedType) return false;

    return true;
  });

  updateKPIs();
  renderMapPoints();
  renderListings();
}

function setupEventListeners() {
  document.getElementById('filter-bedrooms').addEventListener('change', filterData);

  document.querySelectorAll('.btn-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.btn-toggle').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      filterData();
    });
  });

  // Clear drawn area filter button listener
  document.getElementById('btn-clear-draw').addEventListener('click', () => {
    drawnItems.clearLayers();
    activeDrawnPolygon = null;
    document.getElementById('spatial-filter-badge').classList.add('hidden');
    filterData();
  });

  document.getElementById('welcome-btn-continue').addEventListener('click', () => {
    const welcomeOverlay = document.getElementById('welcome-modal-overlay');
    if (welcomeOverlay) {
      welcomeOverlay.classList.add('hidden');
    }
  });

  document.getElementById('welcome-modal-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'welcome-modal-overlay') {
      const welcomeOverlay = document.getElementById('welcome-modal-overlay');
      if (welcomeOverlay) {
        welcomeOverlay.classList.add('hidden');
      }
    }
  });

  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('modal-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-overlay') closeModal();
  });
}

function openModal(props) {
  const overlay = document.getElementById('modal-overlay');
  
  const photoUrl = (props.photos && props.photos.length > 0) 
    ? props.photos[0] 
    : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=300&q=80';

  document.getElementById('modal-img').src = photoUrl;
  document.getElementById('modal-price').innerText = props.price_formatted;
  document.getElementById('modal-price-m2').innerText = props.price_m2 ? `$${props.price_m2.toLocaleString()} MXN / m²` : 'N/D';
  document.getElementById('modal-address').innerText = props.address;
  document.getElementById('modal-type').innerText = props.type === 'house' ? 'Casa Residencial' : 'Departamento';
  
  document.getElementById('modal-bedrooms').innerText = props.bedrooms || 'N/D';
  document.getElementById('modal-bathrooms').innerText = props.bathrooms || 'N/D';
  document.getElementById('modal-const-m2').innerText = props.construction_m2 ? `${props.construction_m2} m²` : 'N/D';
  document.getElementById('modal-terr-m2').innerText = props.terrain_m2 ? `${props.terrain_m2} m²` : 'N/D';

  overlay.style.display = 'flex';
  overlay.classList.add('open');
}

function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('open');
  overlay.style.display = 'none';
}
