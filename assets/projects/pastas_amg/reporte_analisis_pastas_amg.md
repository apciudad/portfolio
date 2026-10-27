# Análisis de la Oferta de Pastas & Cocina Italiana en el AMG

**Elaborado por:** @urbanistalepe  
**Fecha:** Octubre 2026  
**Universo analizado:** 335 establecimientos de pastas, trattorias y cocina italiana georreferenciados  
**Cobertura:** Guadalajara, Zapopan, Tlaquepaque, Tonalá y Tlajomulco  
**Fuente de datos:** Google Places API (Places API v1 / Nearby Search & Text Search)

---

## 📌 Resumen Ejecutivo

El presente estudio analiza la distribución territorial, la reputación digital y la estructura competitiva del mercado de pastas, trattorias y restaurantes italianos en el Área Metropolitana de Guadalajara (AMG). Mediante analítica geoespacial y minería de datos, se identificaron y caracterizaron **335 establecimientos**, categorizados en tres segmentos funcionales:

1. **Casual & Neighborhood (77.6% - 260 establecimientos)**: Pizzerías de barrio, bistrós italianos y cocina casual italiana.
2. **Trattoria & Artisan (21.5% - 72 establecimientos)**: Trattorias tradicionales, restaurantes de pasta artesanal y alta cocina italiana (*La Trattoria de Guadalajara, El Italiano, Altezza, Pomodoro, Ristorante Angelo*).
3. **Commercial & Pizza Chains (0.9% - 3 establecimientos)**: Cadenas comerciales masivas orientadas a pasta rápida / franquicia.

---

## 📊 Hallazgos y Métricas Principales

| Categoría | N° de Establecimientos | Porcentaje (%) | Rating Promedio (★) | Rating Mediana (★) | Reseñas Promedio por Sucursal | Total Acumulado de Reseñas |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Casual & Neighborhood** | 260 | 77.6% | 4.50 | 4.60 | 1,160.3 | 290,073 |
| **Trattoria & Artisan** | 72 | 21.5% | 4.61 | 4.60 | 919.4 | 65,278 |
| **Commercial & Pizza Chains** | 3 | 0.9% | 3.83 | 3.90 | 1,727.7 | 5,183 |
| **TOTAL METROPOLITANO** | **335** | **100%** | **4.51** | **4.60** | **1,112.8** | **360,534** |

---

## 🔑 Conclusiones Clave del Estudio

### 1. Excelencia y Fidelización en Trattorias Artesanales
El segmento **Trattoria & Artisan** obtiene la calificación promedio más alta del mercado (**4.61 ★**), liderado por instituciones gastronómicas de Guadalajara con décadas de tradición como *La Trattoria* (8,828 reseñas, 4.6 ★) y *El Italiano* (7,184 reseñas, 4.6 ★), demostrando que la especialización y autenticidad retienen la fidelidad del comensal tapatío.

### 2. Contraste entre Cadenas Comerciales y Locales Artesanales
A diferencia de las cafeterías o pollerías, las cadenas masivas de pasta representan una proporción ínfima (menos del 1%) y sufren el mayor castigo en percepción (**3.83 ★** vs 4.61 ★ de las trattorias), confirmando que en este nicho el mercado metropolitano valora decididamente la experiencia artesanal sobre la estandarización.

### 3. Densidad en Corredores Gastronómicos Emblemáticos
La cocina italiana se conglomera notablemente en ejes consolidados como Providencia, Colonia Americana / Chapultepec, Chapalita y corredores comerciales de Zapopan, articulando una oferta sofisticada que coexiste con pizzerías y trattorias barriales.

---

## 🏆 Top 10 Establecimientos con Mayor Volumen de Reseñas

1. **El Parián de Tlaquepaque** — `51,730 reseñas` | `4.4 ★` | *Casual & Neighborhood*
2. **Cuerno Andares** — `14,159 reseñas` | `4.9 ★` | *Casual & Neighborhood*
3. **La Condenada** — `10,581 reseñas` | `4.3 ★` | *Casual & Neighborhood*
4. **Barolo 71** — `9,437 reseñas` | `4.8 ★` | *Casual & Neighborhood*
5. **La Trattoria de Guadalajara** — `8,828 reseñas` | `4.6 ★` | *Trattoria & Artisan*
6. **Broken Cheese Tepeyac** — `7,936 reseñas` | `4.2 ★` | *Casual & Neighborhood*
7. **El Italiano** — `7,184 reseñas` | `4.6 ★` | *Trattoria & Artisan*
8. **La Cabotina** — `6,797 reseñas` | `4.6 ★` | *Casual & Neighborhood*
9. **La Moresca** — `6,697 reseñas` | `4.8 ★` | *Casual & Neighborhood*
10. **Fornino** — `6,151 reseñas` | `4.7 ★` | *Casual & Neighborhood*

---

## 🗺️ Herramientas y Entregables Desarrollados

1. **`dashboard_pastas_amg.html`**: Plataforma analítica con interfaz responsiva y control de vistas en tiempo real.
2. **`mapa_pastas_amg.html`**: Cartografía interactiva Folium con capas y visualización espacial de trattorias y restaurantes italianos.
3. **`matriz_interactiva_pastas_amg.html`**: Matriz de posicionamiento y reputación digital desarrollada en Plotly.
