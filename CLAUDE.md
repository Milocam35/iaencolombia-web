# ACIA - Landing Page (iaencolombia.org)

## Tech Stack
- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4 (CSS-first @theme config, no tailwind.config.ts)
- Framer Motion for animations
- CVA + clsx + tailwind-merge for component variants
- Fonts: Plus Jakarta Sans (sans) + JetBrains Mono (mono)
- Language: Spanish only (lang="es")

## Project Structure
- `src/app/` — Pages and layout (App Router)
- `src/components/ui/` — Reusable UI components (Button, Container, SectionWrapper, FloatingDots, CircuitPattern)
- `src/components/layout/` — Header, Footer
- `src/components/sections/` — Landing page sections (Hero, Pillars, Value, Events, Governance, CTA)
- `src/lib/` — Utilities (utils.ts with cn) and constants (all text content)
- `src/types/` — TypeScript types
- `public/logos/` — Logo variants (GIF animado, PNG circular, rectangular, transparente)
- `public/sections/` — Section images (WebP format)

## Sections (order in page.tsx)
1. **HeroSection** — Unified hero: centered logo + title, split layout (NewStage image + nueva etapa text), CTAs
2. **PillarsSection** — Carousel of 3 ACIA pillars with auto-advance
3. **ValueSection** — Terminal typewriter effect for affiliate benefits
4. **EventsSection** — Event cards with images
5. **GovernanceSection** — Merged International (marquee allies) + Governance (principles grid). Dark bg with CircuitPattern
6. **CTASection** — Final CTA with dark bg and CircuitPattern

## Performance Optimizations
- Canvas components (FloatingDots, CircuitPattern) use IntersectionObserver to pause when off-screen
- Canvas animations throttled to ~30fps
- All section images in WebP format
- `priority` on above-the-fold images (logo, NewStage.webp)

---

## Identidad Visual ACIA — Manual de Marca

### Colores Corporativos Oficiales

| Color | Hex | Uso |
|---|---|---|
| Azul oscuro oficial (fondo) | `#080820` | Fondo institucional oscuro |
| Azul celeste corporativo (A, C iniciales en fondo blanco) | `#041D77` | Letras A y C del logo sobre fondo blanco |
| Azul celeste corporativo (I, A finales) | `#4EC7F0` | Letras I y A final del logo — siempre este color |
| Blanco | `#FFFFFF` | Fondo claro, letras sobre fondo oscuro |

### Reglas de Color del Logo
- **Sobre fondo blanco (#FFFFFF):** A y C iniciales usan `#041D77`, I y A final usan `#4EC7F0`
- **Sobre fondo azul oscuro (#080820):** A y C iniciales usan `#FFFFFF`, I y A final usan `#4EC7F0`
- La I y la A finales **siempre** conservan el pantone `#4EC7F0`

### Sistema de Logotipo
- Logotipo tipográfico "ACIA" + descriptor "ASOCIACIÓN COLOMBIANA DE INTELIGENCIA ARTIFICIAL"
- Marca tipográfica con intervención geométrica personalizada
- Jerarquía: ACIA (nivel 1, marca dominante) → Descriptor (nivel 2, institucional)
- Tipografía del logotipo: personalizada (lettering modificado) — no replicar con fuentes genéricas

### Área de Seguridad
- Margen mínimo: 1x la altura de la letra "I" alrededor de todo el logotipo
- No colocar texto, imágenes ni bordes dentro de esta zona

### Tamaños Mínimos Digitales
- Logotipo completo: mínimo **180px** de ancho
- Solo ACIA: mínimo **90px**

### Fondos Permitidos
- Fondo azul oscuro institucional (`#080820`)
- Fondo blanco (`#FFFFFF`)
- No aplicar sobre fondos no oficiales

### Usos Incorrectos (PROHIBIDO)
- Cambiar proporciones del logo
- Alterar colores corporativos
- Aplicar sombras no oficiales
- Agregar degradados al logo
- Rotar el logotipo
- Aplicar sobre fondos no oficiales

### Concepto Visual
La marca transmite: institucionalidad, confianza, tecnología estructurada, formalidad académica.
El contraste azul profundo + azul claro + blanco comunica: autoridad + innovación, ciencia + futuro, base sólida + expansión.

### Archivos del Logo
- `public/logos/ACIA-GIFT.gif` — Logo animado GIF (usar `unoptimized` en next/image para preservar animación). Usado en Header.
- `public/logos/LOGO ACIA TRANSPARENTE PARA FONDO BLANCO.png` — Logo estático para fondo claro. Usado en HeroSection.
- `public/logos/LOGO ACIA TRANSPARENTE PARA FONDO AZUL OSCURO.png` — Logo estático para fondo oscuro. Usado en Footer.