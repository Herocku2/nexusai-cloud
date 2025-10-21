# 🎨 Guía de Logos Nexus AI

## 📦 Archivos de Logo Creados

---

### 1. **Logo Principal - Icon Circular** 
`/public/nexus-ai-logo.svg`

**Dimensiones**: 200x200px  
**Formato**: SVG escalable  
**Uso**: Icono principal, redes sociales, favicon grande

**Características**:
- ✨ Gradiente azul-púrpura (#3B82F6 → #8B5CF6)
- 🔤 Letra "N" estilizada en blanco
- 🌐 Red de nodos (representa MLM/networking)
- 🤖 Elementos de IA integrados
- ⚡ Puntos de circuito neuronal

**Cuándo usar**:
- Avatar de perfil en redes sociales
- Icono de aplicación
- Watermark en documentos
- Favicon de alta resolución

---

### 2. **Logo Light - Versión Clara**
`/public/nexus-ai-logo-light.svg`

**Dimensiones**: 200x200px  
**Formato**: SVG escalable  
**Uso**: Fondos oscuros, modo dark

**Características**:
- 🌙 Optimizado para tema oscuro
- 🎨 Mismo diseño con colores ajustados
- 💡 Mayor contraste en fondos negros

**Cuándo usar**:
- Modo oscuro del dashboard
- Presentaciones con fondo negro
- Videos con fondo oscuro
- Documentos en modo nocturno

---

### 3. **Favicon - Icono Compacto**
`/public/nexus-ai-favicon.svg`

**Dimensiones**: 32x32px  
**Formato**: SVG escalable  
**Uso**: Favicon del navegador

**Características**:
- 📐 Diseño simplificado
- 🎯 Versión minimalista del logo principal
- ⚡ Optimizado para tamaños pequeños
- 🔵 Mismo gradiente corporativo

**Cuándo usar**:
- Tab del navegador
- Barra de favoritos
- Marcadores
- Shortcut de escritorio

---

### 4. **Logo con Texto - Completo**
`/public/nexus-ai-logo-text.svg`

**Dimensiones**: 300x80px  
**Formato**: SVG escalable  
**Uso**: Header, firma, documentos oficiales

**Características**:
- 🏢 Logo + texto "NEXUS"
- 🎓 Subtitle "AI Academy"
- 📏 Horizontal layout
- 🎨 Gradiente en texto

**Cuándo usar**:
- Header del sitio web
- Firma de emails
- Documentos oficiales
- Presentaciones corporativas
- Banners publicitarios

---

## 🎨 Paleta de Colores Oficial

### Colores Principales

```css
/* Gradiente Principal */
--primary-gradient-start: #3B82F6;  /* Azul brillante */
--primary-gradient-end: #8B5CF6;    /* Púrpura vibrante */

/* Colores Sólidos */
--primary-blue: #3B82F6;
--primary-purple: #8B5CF6;
--accent-light: #60A5FA;
--accent-purple: #A78BFA;

/* Colores de Soporte */
--dark-blue: #1E40AF;
--dark-purple: #7C3AED;
--text-gray: #6B7280;
```

### Uso del Gradiente

```css
/* CSS */
background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%);

/* Tailwind */
bg-gradient-to-br from-blue-500 to-purple-600
```

---

## 📐 Dimensiones Recomendadas

### Usos Comunes

| Uso | Dimensión | Archivo Recomendado |
|-----|-----------|---------------------|
| Favicon | 32x32 | `nexus-ai-favicon.svg` |
| App Icon iOS | 180x180 | `nexus-ai-logo.svg` (escalado) |
| App Icon Android | 192x192 | `nexus-ai-logo.svg` (escalado) |
| OG Image | 1200x630 | Crear variante horizontal |
| Twitter Card | 1200x675 | Crear variante horizontal |
| LinkedIn | 1200x627 | Crear variante horizontal |
| Logo Header | 300x80 | `nexus-ai-logo-text.svg` |
| Email Signature | 150x40 | `nexus-ai-logo-text.svg` (escalado) |

---

## 🔧 Implementación Actual

### En el Sidebar
```tsx
// components/shared/logo-sidebar.tsx
import LogoDark from '@/public/nexus-ai-logo.svg'
import LogoWhite from '@/public/nexus-ai-logo-light.svg'
import LogoIcon from '@/public/nexus-ai-favicon.svg'
```

### En el Layout
```tsx
// app/layout.tsx
export const metadata: Metadata = {
  icons: {
    icon: [
      { url: '/nexus-ai-favicon.svg', type: 'image/svg+xml' },
      { url: '/nexus-ai-logo.svg', type: 'image/svg+xml', sizes: '32x32' },
    ],
    apple: '/nexus-ai-logo.svg',
  },
}
```

---

## 📱 Assets Adicionales a Crear (Opcional)

### Para Máximo Alcance

1. **PNG Versions** (para compatibilidad)
   ```
   - nexus-ai-logo-32.png (32x32)
   - nexus-ai-logo-64.png (64x64)
   - nexus-ai-logo-128.png (128x128)
   - nexus-ai-logo-256.png (256x256)
   - nexus-ai-logo-512.png (512x512)
   ```

2. **OG Images**
   ```
   - og-image.jpg (1200x630) - Para Open Graph
   - twitter-card.jpg (1200x675) - Para Twitter
   ```

3. **App Icons**
   ```
   - apple-touch-icon.png (180x180)
   - android-chrome-192x192.png
   - android-chrome-512x512.png
   ```

4. **Variations**
   ```
   - logo-horizontal.svg (para headers)
   - logo-vertical.svg (para banners)
   - logo-monochrome.svg (versión B/N)
   ```

---

## 🎯 Comandos de Conversión

### Convertir SVG a PNG (usando Inkscape o ImageMagick)

```bash
# Con ImageMagick
convert nexus-ai-logo.svg -resize 512x512 nexus-ai-logo-512.png

# Con Inkscape (mejor calidad)
inkscape nexus-ai-logo.svg --export-width=512 --export-filename=nexus-ai-logo-512.png
```

### Optimizar SVG

```bash
# Con svgo
svgo nexus-ai-logo.svg -o nexus-ai-logo-optimized.svg
```

---

## 📝 Licencia y Uso

### Derechos
© 2025 Nexus AI. Todos los derechos reservados.

### Restricciones
- ❌ No modificar los colores corporativos
- ❌ No distorsionar las proporciones
- ❌ No usar en fondos que afecten la legibilidad
- ✅ Mantener espacio de respiro mínimo alrededor del logo

### Espacio de Respiro
Mantener un espacio mínimo equivalente a la altura de la "N" alrededor del logo.

```
┌─────────────────────────┐
│                         │
│    ┌─────────────┐     │
│    │   LOGO      │     │ ← Espacio mínimo = altura "N"
│    └─────────────┘     │
│                         │
└─────────────────────────┘
```

---

## 🔗 Recursos Adicionales

### Herramientas de Diseño
- **Figma**: Crear variaciones del logo
- **Adobe Illustrator**: Edición avanzada de SVG
- **Inkscape**: Editor SVG gratuito
- **SVGOMG**: Optimización online de SVG

### Generadores
- **Favicon Generator**: https://realfavicongenerator.net/
- **OG Image**: https://www.opengraph.xyz/

---

## ✅ Checklist de Implementación

- [x] Logo principal SVG creado
- [x] Logo light SVG creado
- [x] Favicon SVG creado
- [x] Logo con texto SVG creado
- [x] Implementado en sidebar
- [x] Implementado en metadata
- [ ] Crear variantes PNG (opcional)
- [ ] Crear OG images (opcional)
- [ ] Crear app icons (opcional)

---

**Última actualización**: 2025-10-19  
**Diseñado por**: Equipo Nexus AI  
**Versión**: 1.0.0
