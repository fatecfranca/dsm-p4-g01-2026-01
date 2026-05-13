# EcoSense — Design System

> Sistema de monitoramento IoT de eficiência energética em tempo real.
> Projeto acadêmico (P.I) — 4º Semestre.

---

## 1. Filosofia de Design

### Propósito
Comunicar dados técnicos de energia de forma clara, confiável e visualmente atraente. O design existe para servir os dados, nunca para competir com eles.

### Três Pilares
| Pilar | Descrição |
|-------|-----------|
| **Clareza** | Dados first. Hierarquia visual inconfundível. Zero ruído. |
| **Confiabilidade** | Estética de precisão. Cores consistentes, tipografia limpa, espaçamento rigoroso. |
| **Sustentabilidade** | O tema visual deve refletir o propósito — eficiência, consciência, tecnologia a serviço do meio ambiente. |

### Público-alvo
- Professores e avaliadores acadêmicos
- Estudantes de tecnologia e engenharia
- Gestores de instalações (uso futuro)
- Perfil: B2B, data-focused, profissional

---

## 2. Sistema de Cores

### Paleta Principal

| Token | Cor | Uso |
|-------|-----|-----|
| `--color-primary` | `#22C55E` | Ações principais, dados positivos, elementos energizados |
| `--color-secondary` | `#3B82F6` | Elementos secundários, links, dados de tecnologia |
| `--color-background` | `#0F172A` | Fundo da aplicação (dark mode) |
| `--color-surface` | `#1E293B` | Cards, navbars, superfícies elevadas |
| `--color-border` | `#334155` | Bordas, separadores |
| `--color-text-primary` | `#E2E8F0` | Texto principal, headings |
| `--color-text-secondary` | `#94A3B8` | Texto de apoio, legendas, metadados |

### Cores Semânticas

| Token | Cor | Uso |
|-------|-----|-----|
| `--color-success` | `#22C55E` | Confirmações, consumo eficiente |
| `--color-warning` | `#F59E0B` | Alertas moderados, consumo elevado |
| `--color-danger` | `#EF4444` | Erros, consumo crítico, alertas graves |
| `--color-info` | `#06B6D4` | Informações, dicas, dados auxiliares |

### Regras de Uso
- **60-30-10**: 60% background, 30% surface, 10% primary/secondary para destaque
- Primary `#22C55E` = crescimento, energia, natureza — alinhado ao propósito do projeto
- Secondary `#3B82F6` = tecnologia, confiança, IoT
- Nunca usar cores hardcoded. Sempre utilizar as variáveis CSS (`var(--color-*)`)
- Para componentes JS, importar de `theme/colors.js`

### Psicologia das Cores
- **Verde (primary)**: associado a energia limpa, eficiência, sustentabilidade, crescimento
- **Azul (secondary)**: confiança, tecnologia, monitoramento, dados
- **Dark mode**: sensação tecnológica, reduz fadiga visual em dashboards, destaca dados

---

## 3. Tipografia

### Família
**Inter** — Google Fonts (variable font)

Por quê Inter?
- Alta legibilidade em telas (design para dashboards)
- Grande variedade de pesos (400, 500, 600, 700)
- Mistura neutralidade técnica com personalidade moderna
- Excelente desempenho em monitores de alta densidade

### Escala Tipográfica

| Nível | Tamanho | Peso | Uso |
|-------|---------|------|-----|
| H1 | 2.5rem (40px) | 700 | Título principal da página |
| H2 | 1.75rem (28px) | 700 | Título de seção |
| H3 | 1.25rem (20px) | 600 | Subtítulo / card heading |
| Body | 1rem (16px) | 400 | Parágrafos e conteúdo geral |
| Small | 0.875rem (14px) | 500 | Navegação, labels |
| Caption | 0.8125rem (13px) | 400 | Footer, metadados |

### Regras
- **Line height**: 1.6 para body, 1.2-1.3 para headings
- **Letter spacing**: -0.02em em headings grandes, normal para body
- **Máximo de 2 pesos por componente** (ex: 400 + 700 ou 500 + 600)
- **Contraste mínimo**: WCAG AA (4.5:1 para texto normal)

---

## 4. Layout & Espaçamento

### Grid
- **8-point grid system**: todos os espaçamentos em múltiplos de 8px
- Conteúdo centralizado com `max-width: 1200px` para páginas
- Cards com padding de `2rem (32px)`

### Hierarquia de Espaçamento

| Token | Valor | Uso |
|-------|-------|-----|
| `--space-xs` | 4px | Micro-ajustes |
| `--space-sm` | 8px | Ícones, gaps internos |
| `--space-md` | 16px | Entre elementos relacionados |
| `--space-lg` | 24px | Entre seções |
| `--space-xl` | 32px | Padding de cards, container |
| `--space-2xl` | 48px | Separação de grandes blocos |

### Layout da Aplicação
```
┌──────────────────────────────────────┐
│  Navbar (64px)                       │
│  [logo]                    [links]   │
├──────────────────────────────────────┤
│                                      │
│  <Outlet /> — conteúdo da página     │
│                                      │
├──────────────────────────────────────┤
│  Footer (52px)                       │
│  P.I 4° Semestre — EcoSense ...      │
└──────────────────────────────────────┘
```

---

## 5. Componentes

### Navbar
- **Altura**: 64px
- **Background**: surface (`--color-surface`) com 1px border-bottom
- **Logo**: full logo (ícone + texto), altura 32px
- **Navegação**: NavLinks do react-router-dom com estado ativo em primary
- **Links**: Home, Dashboard, Sobre (máximo 5 itens — Lei de Hick)

### Footer
- **Altura**: ~52px (1rem padding vertical)
- **Background**: surface com 1px border-top
- **Conteúdo**: créditos do projeto centralizados
- **Tom**: informativo, não intrusivo

### Card
- **Background**: surface
- **Border**: 1px solid border
- **Border-radius**: 12px
- **Padding**: 2rem
- **Sombra**: nenhuma (flat design) ou sutil quando em hover

### Botões (futuro)
- **Primário**: background primary, texto escuro ou branco
- **Altura mínima**: 44px (Fitts Law, touch target)
- **Border-radius**: 8px (consistente com sistema)

---

## 6. Efeitos Visuais

### Abordagem
**Minimalista e funcional** — sem glassmorphism, sem neumorphism, sem gradientes desnecessários.

Efeitos permitidos:
- **Hover suave**: transição de cor em 200ms ease
- **Elevação**: box-shadow sutil em elementos interativos (cards, botões)
- **Active state**: opacidade ou leve escala para feedback de clique

### O que NÃO fazer
- Gradientes decorativos sem propósito
- Glow effects exagerados
- Animações que competem com os dados
- Glassmorphism (prejudica legibilidade de dados)

---

## 7. Experiência do Usuário (UX)

### Leis Aplicadas

| Lei | Aplicação no EcoSense |
|-----|----------------------|
| **Hick's Law** | Navbar com no máximo 5 links. Dashboard com cards agrupados por categoria. |
| **Fitts' Law** | Botões de ação com altura mínima de 44px. Navegação principal sempre no topo. |
| **Miller's Law** | Cards de dashboard agrupados em blocos de 3-4. Leituras organizadas em chunks. |
| **Von Restorff** | Alertas em vermelho/warning se destacam visualmente do restante. |
| **Serial Position** | Informações mais críticas no topo do dashboard. |
| **Jakob's Law** | Padrões familiares: logo no topo-esquerdo, navegação à direita, footer institucional. |
| **Gestalt (Proximidade)** | Labels próximas a seus valores. Cards agrupam dados relacionados. |
| **Gestalt (Região Comum)** | Cada equipamento em seu próprio card com fundo surface. |
| **Aesthetic-Usability** | Design dark mode polido para gerar confiança mesmo em fase acadêmica. |
| **Peak-End Rule** | Tela de confirmação de leitura com feedback visual claro. |

### Níveis de Design Emocional
1. **Visceral** (primeira impressão): dark mode + verde tecnológico → "parece profissional/sério"
2. **Behavioral** (uso): leituras claras, navegação óbvia, alertas visíveis → "funciona como esperado"
3. **Reflective** (memória): consistência visual gera confiança no sistema → "é um projeto bem feito"

---

## 8. Acessibilidade

- Contraste mínimo de 4.5:1 para texto normal (WCAG AA)
- Todos os elementos interativos focáveis via teclado
- `prefers-reduced-motion` para animações
- Textos com tamanho mínimo de 14px
- Labels descritivos em formulários futuros
- Hierarquia semântica de headings (h1 → h2 → h3)

---

## 9. Arquitetura de Arquivos

```
src/
├── assets/images/       Imagens estáticas (logos, ícones)
├── components/          Componentes reutilizáveis (Navbar, Footer, etc.)
├── layouts/             Layouts que estruturam páginas (MainLayout)
├── pages/               Páginas da aplicação (Home, Dashboard, Sobre)
├── services/            Comunicação com API backend
├── styles/              Estilos globais (global.css com CSS custom properties)
├── theme/               Tokens de tema (colors.js)
├── App.jsx              Rotas da aplicação
└── main.jsx             Entry point (BrowserRouter)
```

### Convenções
- **CSS Modules** para escopo de estilos: `Componente.module.css`
- **Nome de classes**: camelCase (ex: `.nav`, `.content`, `.brand`)
- **Imports**: nome default export para páginas e componentes
- **Pastas**: PascalCase (ex: `components/Navbar/`)

---

## 10. Integração com Backend

### Services (`services/api.js`)
- Funções `get`, `post`, `put`, `del` prontas para consumo
- Base URL configurável via `VITE_API_URL`
- Tratamento de erro centralizado
- Content-Type JSON por padrão

### Futuras rotas da API
- `GET /api/leituras` — dados de telemetria
- `GET /api/dispositivos` — equipamentos monitorados
- `GET /api/alertas` — notificações do sistema
- `POST /api/leituras` — receber dados do ESP32

---

## 11. Stack Tecnológica

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| React | 19 | Interface de usuário |
| Vite | 8 | Build tool / dev server |
| React Router | 7+ | Navegação SPA |
| Victory | ~37 | Visualização de dados (gráficos) |
| CSS Modules | — | Estilização escopada |
| Inter (Google Fonts) | — | Tipografia do sistema |

---

> **Manutenção**: Este documento deve evoluir junto com o projeto. Ao adicionar novos componentes, padrões ou decisões de design, atualize este guia.
>
> "Cada pixel tem propósito. Restrição é luxo."
