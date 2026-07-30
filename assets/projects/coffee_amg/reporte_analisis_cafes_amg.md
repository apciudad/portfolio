# Análisis Urbano y Digital de la Oferta de Cafeterías en el Área Metropolitana de Guadalajara (AMG)

**Elaborado por:** @urbanistalepe  
**Fecha:** Julio 2026  
**Universo analizado:** 3,385 cafeterías georreferenciadas  
**Cobertura:** Guadalajara, Zapopan, Tlaquepaque y Tonalá  
**Fuente de datos:** Google Places API (Places API v1 / Nearby Search)

---

## 📌 Resumen Ejecutivo

El presente estudio analiza la estructura espacial, la reputación digital y la dinámica del mercado de cafeterías en el Área Metropolitana de Guadalajara (AMG). A través de técnicas de analítica espacial y minería de datos geográficos, se identificaron y caracterizaron **3,385 establecimientos**, clasificándolos en tres grandes segmentos: **Cafeterías Independientes/Locales (94.1%)**, **Cadenas Comerciales (4.8%)** y **Cafeterías de Especialidad / Tostadores Artesanales (1.2%)**.

El análisis revela un mercado altamente fragmentado donde coexisten grandes cadenas con alto volumen de tráfico digital, un nicho de especialidad en acelerado crecimiento con índices de satisfacción excepcionales, y una vasta red de cafeterías locales que vertebran la vida de barrio en la metrópoli.

---

## 📊 Hallazgos y Métricas Principales

| Categoría | N° de Establecimientos | Porcentaje (%) | Rating Promedio (★) | Rating Mediana (★) | Reseñas Promedio por Sucursal | Total Acumulado de Reseñas |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Independientes / Barrio** | 3,185 | 94.1% | 4.59 | 4.80 | 166 | 410,407 |
| **Commercial Coffee (Cadenas)** | 161 | 4.8% | 4.17 | 4.35 | 927 | 144,555 |
| **Specialty Coffee (Especialidad)** | 39 | 1.2% | 4.62 | 4.70 | 286 | 10,601 |
| **TOTAL METROPOLITANO** | **3,385** | **100%** | **4.57** | **4.60** | **193** | **565,563** |

---

## 🔑 Conclusiones Clave del Estudio

### 1. La Paradoja de la Escala vs. la Calidad Percibida
Existe una clara divergencia entre la escala comercial y la satisfacción del usuario. Las **cadenas comerciales** (Starbucks, La Flor de Córdoba, Cielito Querido, etc.) capturan el mayor volumen de interacciones digitales por sucursal (promedio de **927 reseñas** vs. 286 de especialidad), pero obtienen la calificación promedio más baja del mercado (**4.17 ★**). Esto refleja una percepción de conveniencia y estandarización, pero con menor apreciación en la experiencia de producto.

### 2. El Auge del Nicho de Especialidad (Specialty Coffee)
A pesar de representar únicamente el **1.2% de la oferta total** (39 establecimientos consolidados), las cafeterías de especialidad y tostadores locales registran el promedio de satisfacción de clientes más alto de la metrópoli (**4.62 ★**). 
Exponentes emblemáticos como ***El Terrible Juan*** (liderando el segmento con 4,526 reseñas y 4.7 ★), ***Gran Tostador*** (4.8 ★), ***Fika*** (4.7 ★), ***Matraz Tostador*** (4.6 ★) y ***Cálamo*** (4.9 ★) han logrado escalar su volumen de usuarios sin comprometer el estándar de calidad ni la fidelidad de su comunidad.

### 3. La Red de Café de Barrio (Tejido Local)
El **94.1% de la oferta urbana** está compuesta por cafeterías independientes, barras locales y negocios de barrio. Con una calificación mediana de **4.80 ★**, este segmento demuestra una cercanía y aprecio comunitario sobresaliente. Sin embargo, su distribución en volumen de reseñas presenta una alta dispersión, concentrando el tráfico digital en corredores gastronómicos (Chapultepec, Providencia, Americana, Chapalita, Centro de Tlaquepaque) y dejando zonas periféricas con baja visibilidad en plataformas digitales.

---

## 🏆 Top 10 Cafeterías de Especialidad Destacadas en el AMG

1. **El Terrible Juan Café** — Rating: `4.7 ★` | `4,526 reseñas`
2. **El Terrible Juan Café Chapalita** — Rating: `4.7 ★` | `749 reseñas`
3. **El Terrible Juan Café Providencia** — Rating: `4.7 ★` | `683 reseñas`
4. **Matraz Tostador** — Rating: `4.6 ★` | `637 reseñas`
5. **Gran Tostador (Bosques / Provenza / Av. México)** — Rating: `4.8 ★` | `538 reseñas`
6. **Fika Espresso Bar** — Rating: `4.7 ★` | `505 reseñas`
7. **Taller de Espresso (Paseos del Sol)** — Rating: `4.7 ★` | `339 reseñas`
8. **Cálamo Cafetería de Especialidad** — Rating: `4.9 ★` | `240 reseñas`
9. **Casa Moka Cafetería de Especialidad** — Rating: `4.9 ★` | `188 reseñas`
10. **Namu Café de Especialidad** — Rating: `4.9 ★` | `63 reseñas`

---

## 🗺️ Herramientas de Visualización Desarrolladas

Para la consulta y difusión de este estudio, se desarrollaron tres productos interactivos:

- **Dashboard Interactivo Responsivo (`dashboard_cafes_amg.html`)**: Interfaz dividida 50/50 que integra en tiempo real el mapa espacial con la matriz analítica de reputación.
- **Mapa Web con Filtros y Buscador (`mapa_cafeterias_amg.html`)**: Mapa con buscadores por autocompletado, minimapa y *sliders* interactivos para filtrar por rating y número de reseñas.
- **Matriz de Reputación Digital (`specialty_coffee_amg.png` / `matriz_interactiva_amg.html`)**: Gráfica de cuadrantes basada en medianas (Rating vs. Log Reseñas) para clasificar líderes de mercado y gemas ocultas.
- **Capa Espacial SIG (`cafes_amg.geojson`)**: Capa vectorial en WGS 84 (EPSG:4326) para su integración en sistemas de información geográfica como QGIS o ArcGIS.

---

*Estudio y procesamiento de datos elaborados por **@urbanistalepe**.*
