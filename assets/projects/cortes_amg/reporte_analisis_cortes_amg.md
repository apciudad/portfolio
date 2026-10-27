# Análisis de la Oferta de Cortes de Carne & Steakhouses en el AMG

**Elaborado por:** @urbanistalepe  
**Fecha:** Octubre 2026  
**Universo analizado:** 445 establecimientos de cortes de carne y asadores georreferenciados  
**Cobertura:** Guadalajara, Zapopan, Tlaquepaque, Tonalá y Tlajomulco  
**Fuente de datos:** Google Places API (Places API v1 / Nearby Search & Text Search)

---

## 📌 Resumen Ejecutivo

El presente estudio analiza la estructura espacial, la reputación digital y la dinámica del mercado de cortes de carne, parrillas y steakhouses en el Área Metropolitana de Guadalajara (AMG). Mediante técnicas de analítica espacial y minería de datos geográficos, se identificaron y caracterizaron **445 establecimientos**, clasificándolos en tres grandes segmentos:

1. **Local / Neighborhood Grill (66.5% - 296 establecimientos)**: Asadores locales, espadas brasileñas, bufetes y restaurantes familiares de carne a escala barrial y metropolitana.
2. **Traditional Grill & Argentine (29.9% - 133 establecimientos)**: Parrillas argentinas, asadores campestres y tradicionales al carbón (*Asador Santa Anita, Parrilla 77, Carbón Parrilla de Barrio*).
3. **Premium Steakhouse (3.6% - 16 establecimientos)**: Establecimientos de alta gama y corte fino (*Mochomos, Outback, La Matera, El Almacén del Bife, Asador La Vaca Argentina*).

---

## 📊 Hallazgos y Métricas Principales

| Categoría | N° de Establecimientos | Porcentaje (%) | Rating Promedio (★) | Rating Mediana (★) | Reseñas Promedio por Sucursal | Total Acumulado de Reseñas |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Local / Neighborhood Grill** | 296 | 66.5% | 4.51 | 4.50 | 1,312.9 | 387,304 |
| **Traditional Grill & Argentine** | 133 | 29.9% | 4.49 | 4.60 | 485.9 | 63,655 |
| **Premium Steakhouse** | 16 | 3.6% | 4.61 | 4.65 | 3,185.7 | 50,971 |
| **TOTAL METROPOLITANO** | **445** | **100%** | **4.51** | **4.60** | **1,135.6** | **501,930** |

---

## 🔑 Conclusiones Clave del Estudio

### 1. Elevada Concentración de Reputación en Steakhouses de Alta Gama
El segmento **Premium Steakhouse**, representando solo el 3.6% de los establecimientos, promedia **3,185.7 reseñas por ubicación** y alcanza la calificación más alta (**4.61 ★**), reflejando una intensa interacción de comensales locales y turismo de negocios en corredores como Andares, Providencia y Puerta de Hierro.

### 2. Espadas y Asadores Tradicionales como Polos Metropolitanos
Establecimientos masivos como *Mr. Pampas*, *Sirloin Stockade* y asadores campestres como *Asador Santa Anita* logran sostener calificaciones entre **4.3 y 4.8 ★** con volúmenes superiores a las 9,000 - 16,000 reseñas, consolidándose como anclas gastronómicas de fin de semana.

### 3. Arraigo de la Parrilla Argentina y de Barrio
Las parrillas tradicionales argentinas y locales conforman más del 96% de la oferta física, ofreciendo una cobertura descentralizada a lo largo de corredores urbanos primarios en Guadalajara y Zapopan.

---

## 🏆 Top 10 Establecimientos con Mayor Volumen de Reseñas

1. **El Parián de Tlaquepaque** — `51,730 reseñas` | `4.4 ★` | *Local / Neighborhood Grill*
2. **Mr. Pampas Guadalajara** — `16,222 reseñas` | `4.6 ★` | *Local / Neighborhood Grill*
3. **Sirloin Stockade (Plaza del Sol)** — `14,930 reseñas` | `4.3 ★` | *Local / Neighborhood Grill*
4. **Cuerno Andares** — `14,159 reseñas` | `4.9 ★` | *Local / Neighborhood Grill*
5. **Sirloin Stockade (Galerías)** — `13,406 reseñas` | `4.2 ★` | *Local / Neighborhood Grill*
6. **Mochomos Guadalajara** — `13,217 reseñas` | `4.9 ★` | *Premium Steakhouse*
7. **Fogón do Brasil** — `10,014 reseñas` | `4.4 ★` | *Local / Neighborhood Grill*
8. **La Artesanal** — `9,361 reseñas` | `4.4 ★` | *Local / Neighborhood Grill*
9. **Asador Santa Anita** — `9,301 reseñas` | `4.8 ★` | *Traditional Grill & Argentine*
10. **El Tango** — `7,742 reseñas` | `4.6 ★` | *Local / Neighborhood Grill*

---

## 🗺️ Herramientas y Entregables Desarrollados

1. **`dashboard_cortes_amg.html`**: Plataforma analítica con selector de vistas (Split / Mapa / Matriz).
2. **`mapa_cortes_amg.html`**: Mapa interactivo Folium con geolocalización, filtros multivariados y marcadores enriquecidos.
3. **`matriz_interactiva_cortes_amg.html`**: Scatter Plot interactivo con cuadrantes de reputación y popularidad en Plotly.
