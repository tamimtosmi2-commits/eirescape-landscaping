# Web Development Internship — Project Submission Report
**Organization:** BISWAS IT FIRM  
**Task Code:** Task 101  
**Student Name:** Monoarul Islam Srabon  
**Department:** Web Development  
**Skill Level:** Intermediate  
**Niche:** Landscaping / Garden Design  
**Target Country:** Ireland  

---

## 1. Project Overview & Objective
The objective of this assignment is to research, design, wireframe, and develop a high-converting, fully mobile-responsive landing page for an Ireland-based landscaping and garden design company named **"ÉireScape Garden & Landscape Design"**.

The business specializes in transforming residential and suburban outdoor spaces across Dublin, Cork, Galway, and nationwide. The website is specifically tailored to the Irish climate, addressing local homeowner concerns such as rainfall drainage, durable non-slip natural stone and porcelain paving, native planting schemes, and modern outdoor living (pergolas, fire pits, and lighting).

---

## 2. 5 Competitor Analyses Summary

| # | Company Name | Location | Website URL | Key Strengths | Identified Gap / Opportunity |
|---|---|---|---|---|---|
| **1** | **Lavender Landscapes** | Cork, Ireland | [lavenderlandscapes.ie](https://lavenderlandscapes.ie) | Dedicated Before & After section; design-and-build workflow. | Uses static image grids; no interactive draggable slider widget. |
| **2** | **Shapes Garden Design** | Dublin, Ireland | [shapesgardendesign.ie](https://shapesgardendesign.ie) | Bord Bia Bloom showcase; 3D architectural renders. | CTAs buried in dense paragraphs; no interactive quote estimator. |
| **3** | **Tully Landscapes** | Dublin & Meath | [tullylandscapes.ie](https://tullylandscapes.ie) | 40+ years heritage; comprehensive hard & soft landscaping services. | Outdated visual UI; lack of modern micro-animations and card interactions. |
| **4** | **Colour Green** | Dublin, Ireland | [eugenehiggins.ie](https://eugenehiggins.ie) | Focus on problem-solving makeovers (drainage, overgrown plots). | Heavy text density on mobile; lacks automated lead qualification. |
| **5** | **LandArt** | Dublin, Ireland | [landart.ie](https://landart.ie) | High-end editorial photography; luxury architectural finishes. | Targets only luxury budgets; slower mobile load speeds due to raw imagery. |

*(For full competitor breakdowns, see the dedicated [competitor_analysis.md](file:///f:/Anti-Gravity%20Project/task101/competitor_analysis.md) file).*

---

## 3. Wireframe & UI Architecture Plan
The landing page was wireframed using a conversion-focused, mobile-first design hierarchy consisting of **6 distinct functional sections**:

```
+-----------------------------------------------------------------------+
|  [Header] Logo: ÉireScape  | Nav Links | Contact Info | [Get a Quote] |
+-----------------------------------------------------------------------+
|  [Hero Section]                                                       |
|  Badge: "Voted Ireland's Premier Landscaping Team"                    |
|  H1: "Bespoke Garden Design & Outdoor Living Across Ireland"          |
|  Subtitle: Weatherproof hardscaping, lush lawns & 3D garden blueprints |
|  CTAs: [Request Free Consultation] [Explore Transformations]          |
|  Trust Badges: ALCI Certified | Bord Bia Bloom Standards | 5-Yr Guarantee|
+-----------------------------------------------------------------------+
|  [Services Grid - 6 Key Offerings]                                    |
|  1. Porcelain & Granite Paving   2. 3D Architectural Garden Design    |
|  3. Irish Climate Lawn Drainage  4. Native Irish Biodiversity Planting|
|  5. Cedar Pergolas & Decking     6. Complete Turnkey Garden Makeovers |
+-----------------------------------------------------------------------+
|  [Interactive Before & After Transformation Showcase]                 |
|  Category Filter: [All] [Dublin Courtyards] [Family Lawns] [Patios]   |
|  << [Draggable Split Slider Widget: Overgrown Clay -> Modern Patio] >>|
|  Transformation Highlights: Timeline (3 Weeks) | Material Specs        |
+-----------------------------------------------------------------------+
|  [4-Step Design-to-Build Process]                                     |
|  Step 1: On-Site Soil & Sunlight Survey                               |
|  Step 2: 3D Visual Concept & Material Curation                       |
|  Step 3: Master Stonework & Landscaping Build                         |
|  Step 4: Final Handover & 5-Year Craftsmanship Guarantee              |
+-----------------------------------------------------------------------+
|  [Client Testimonials & Irish Proof]                                  |
|  Customer ratings (5.0 Stars) from Blackrock, Malahide, Cork & Galway |
+-----------------------------------------------------------------------+
|  [Interactive Quote Estimator & Contact Lead Form]                    |
|  Input: Garden Area (sq m) + Service Selection + County (Dublin, etc.)|
|  Real-time Cost Estimation Preview + Direct Quote Request Form        |
+-----------------------------------------------------------------------+
|  [Footer] Service Areas | Contact Details (+353) | Legal & Copyright  |
+-----------------------------------------------------------------------+
```

---

## 4. Wireframe-to-Code Development Process

### Step 1: Design System & Color Palette Creation
* **Primary Emerald (`#065f46`, `#047857`):** Represents lush Irish green pastures and rich landscape vitality.
* **Warm Earth & Sandstone (`#d97706`, `#b45309`):** Accents symbolizing premium natural paving and timber pergolas.
* **Slate & Charcoal (`#0f172a`, `#1e293b`):** High-contrast modern backdrop providing an ultra-premium feel.
* **Typography:** Modern Google Fonts (`Outfit` for crisp modern titles, `Plus Jakarta Sans` for clean, readable body copy).

### Step 2: Semantic HTML5 Structure
* Implemented clean semantic tags (`<header>`, `<nav>`, `<section>`, `<article>`, `<figure>`, `<footer>`).
* Structured interactive elements with unique accessible IDs and ARIA labels (`aria-label`, `role="slider"`, `aria-valuenow`).

### Step 3: Mobile-First Responsive CSS
* Utilized CSS Custom Properties (Variables) for consistent spacing, borders, shadows, and color transitions.
* Leveraged CSS Grid with `repeat(auto-fit, minmax(...))` for automatic responsive card reflow without awkward breakpoints.
* Incorporated subtle glassmorphism (`backdrop-filter: blur(12px)`) and micro-hover transitions (`transform: translateY(-4px)`).

### Step 4: Vanilla JavaScript Interactivity
* **Draggable Before/After Slider:** Built a lightweight, touch-and-mouse enabled split-image slider that updates CSS clipping dynamically based on cursor or finger movement.
* **Instant Project Cost Estimator:** Real-time JavaScript formula calculating realistic Irish market ballpark pricing based on garden square meterage and selected work tiers.
* **Mobile Navigation:** Smooth toggle navigation drawer with blur backdrop.

---

## 5. Learning Outcomes Achieved
1. **Competitor & Market Analysis:** Learned how to identify market gaps by analyzing real regional competitors (Irish climate needs, ALCI credentials, local pricing).
2. **Interactive UI Component Engineering:** Mastered the creation of custom interactive split-screen image sliders without bloated external plugins.
3. **Design-to-Code Precision:** Successfully converted structural wireframe concepts into production-grade HTML and CSS.
4. **Responsive Web Standards:** Ensured zero-overflow fluid layouts across all viewport widths (375px mobile through 4K desktop).

---

## 6. Submission Links
* **Live Demo URL:** `https://your-username.github.io/task101/` *(or local server `http://localhost:3000/task101/index.html`)*
* **GitHub Repository:** `https://github.com/your-username/eirescape-landscaping-ireland`
* **Wireframe Prototype:** [Figma / Canva Project Spec included in Task 101 Deliverables]
