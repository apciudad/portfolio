# Análisis Urbano y Digital de la Oferta de Pollerías en el Área Metropolitana de Guadalajara (AMG)

**Elaborado por:** @urbanistalepe  
**Fecha:** Septiembre 2026  
**Universo analizado:** 1,954 pollerías y restaurantes de pollo georreferenciados  
**Cobertura:** Guadalajara, Zapopan, Tlaquepaque, Tonalá y Tlajomulco  
**Fuente de datos:** Google Places API (Places API New / Nearby Search & Text Search)

---

## 📌 Resumen Ejecutivo

El presente estudio analiza la estructura espacial, la reputación digital y la dinámica del mercado de pollerías y restaurantes de pollo en el Área Metropolitana de Guadalajara (AMG). A través de técnicas de analítica espacial y minería de datos geográficos, se identificaron y caracterizaron **1,954 establecimientos**, clasificándolos en tres grandes segmentos:

1. **Pollerías Locales / de Barrio (69.3% - 1,355 establecimientos)**: Pequeños expendios, negocios familiares y pollerías de colonia.
2. **Tradicional & Carbón / Asados y Rosticerías (24.2% - 472 establecimientos)**: Rosticerías emblemáticas (*El Pechugón, Rosticería Cheque, Acarda*) y asados al carbón / leña / estilo Sinaloa.
3. **Cadenas Comerciales (6.5% - 127 establecimientos)**: Grandes marcas masivas y franquicias internacionales (*Pollo Pepe, KFC, Church's, Wingstop, Buffalo Wild Wings, Pollo Feliz*).

---

## 📊 Hallazgos y Métricas Principales

| Categoría | N° de Establecimientos | Porcentaje (%) | Rating Promedio (★) | Rating Mediana (★) | Reseñas Promedio por Sucursal | Total Acumulado de Reseñas |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Pollerías Locales / Barrio** | 1,355 | 69.3% | 4.50 | 4.70 | 41.5 | 44,051 |
| **Tradicional & Carbón (Rosticerías)** | 472 | 24.2% | 4.19 | 4.30 | 60.0 | 25,758 |
| **Cadenas Comerciales (Franquicias)** | 127 | 6.5% | 4.24 | 4.40 | 1,341.4 | 166,328 |
| **TOTAL METROPOLITANO** | **1,954** | **100%** | **4.39** | **4.50** | **146.2** | **230,318** |

---

## 🔑 Conclusiones Clave del Estudio

### 1. Dominio de Tráfico Digital de las Cadenas vs. Alta Satisfacción Barrial
- Las **Cadenas Comerciales** concentran únicamente el **6.5% de los puntos de venta físicos**, pero capturan el **72.2% de todas las opiniones digitales** (166,328 reseñas).
- Sin embargo, las **Pollerías Locales y de Barrio** obtienen el nivel de satisfacción más alto con un **rating promedio de 4.50 ★ (mediana 4.70 ★)**, reflejando un fuerte arraigo comunitario y frescura en el servicio diario.

### 2. El Fenómeno "Pollo Pepe" en el AMG
A diferencia de otras cadenas de comida rápida donde el volumen castiga la calificación (como *KFC* con promedios de 3.7 - 4.0 ★), **Pollo Pepe** destaca como el líder indiscutible en reputación masiva: sucursales icónicas con más de 4,000 reseñas mantienen calificaciones extraordinarias de **4.7 a 4.9 ★**, convirtiéndose en un referente gastronómico metropolitano.

### 3. Densidad de Rosticerías y Asados al Carbón
El segmento tradicional (24.2%) constituye una infraestructura alimentaria básica para las familias tapatías. Nombres como *El Pechugón*, *Rosticería Cheque* y *Asados Sinaloa* vertebran avenidas principales y centros barriales en toda la metrópoli.

---

## 🏆 Top 10 Pollerías con Mayor Volumen de Reseñas

1. **KFC (Álamo Industrial / Carr. Chapala)** — `9,653 reseñas` | `3.9 ★`
2. **KFC (Centro Guadalajara / Av. Juárez)** — `5,966 reseñas` | `4.0 ★`
3. **KFC (Plaza del Sol)** — `5,113 reseñas` | `3.8 ★`
4. **KFC (Tonalá Centro / And. Tonaltecas)** — `5,089 reseñas` | `3.7 ★`
5. **Pollo Pepe (Periférico Sur / Sta. María Tequepexpan)** — `4,793 reseñas` | `4.7 ★`
6. **KFC (Acueducto / Zapopan)** — `4,614 reseñas` | `3.9 ★`
7. **KFC Fried Chicken (López Mateos Sur / Las Águilas)** — `4,377 reseñas` | `3.5 ★`
8. **KFC (Av. Alcalde / Centro)** — `4,252 reseñas` | `3.9 ★`
9. **KFC (Río Nilo / Villas de Oriente, Tonalá)** — `4,210 reseñas` | `3.7 ★`
10. **Pollo Pepe (Av. Patria / Jardines Universidad)** — `4,043 reseñas` | `4.7 ★`

---

## 🗺️ Herramientas y Entregables Desarrollados

1. **`dashboard_pollerias_amg.html`**: Dashboard web 50/50 responsivo integrando mapa y matriz de reputación.
2. **`mapa_pollerias_amg.html`**: Mapa interactivo Folium con sliders en tiempo real (Rating y Reseñas), buscador autocompletable y minimapa.
3. **`matriz_interactiva_pollerias_amg.html`**: Scatter Plot interactivo en Plotly con histogramas marginales.
4. **`pollerias_matrix_amg.png`**: Gráfica de reputación estática a 300 DPI con cuadrantes de medianas.
5. **`pollerias_amg.geojson`**: Capa vectorial georreferenciada EPSG:4326 con los 1,954 establecimientos.
6. **`pollerias_amg_classified.csv`**: Dataset procesado y clasificado.
