# Veedha M&A · Pipeline Dashboard

Dashboard interativo conectado ao Monday.com, publicado via GitHub Pages.

## 🔗 Link do Dashboard

**https://tom3063.github.io/veedha-dashboard**

---

## 🚀 Activar GitHub Pages

1. Acede ao repositório em **GitHub → Settings → Pages**
2. Em **Source**, selecciona **Deploy from a branch**
3. Em **Branch**, selecciona `main` (ou `master`) e pasta `/root`
4. Clica **Save**
5. Aguarda ~1 minuto — o link acima ficará activo

---

## 🔑 Actualizar a API Key

A API Key está no topo do ficheiro `index.html`, claramente identificada:

```js
// ════════════════════════════════════════════════════════════════════
//  API KEY — substitua pelo seu token Monday.com quando necessário
// ════════════════════════════════════════════════════════════════════
const MONDAY_API_KEY = "COLA_AQUI_A_TUA_API_KEY";
```

Para substituir:
1. Abre `index.html` num editor de texto
2. Localiza a linha `const MONDAY_API_KEY = "..."`
3. Substitui o valor entre aspas pelo novo token
4. Guarda e faz commit/push

> O token Monday.com encontra-se em: **Monday → Perfil → Developers → API**

---

## 📊 Boards configurados

| Board | Utilização |
|-------|-----------|
| **Pipeline** | Funil de conversão, KPIs de leads, propostas e conquistas |
| **Lista de Contatos** | Mapeamento originador → escritório (filial) |
| **Controle Financeiro** | Receita faturada/contratada (via subelementos/parcelas) |

---

## 💾 Dados editáveis persistentes

Os seguintes valores são guardados no `localStorage` do browser e **persistem entre refreshes**:

- **Metas anuais** dos donuts (Leads, Propostas, Mandatos)
- **Fases dos mandatos** no gráfico de Receita Potencial
- **Labels personalizadas** nos gráficos G3 e G5

---

## 🛠 Stack técnica

- **React 18** via CDN (unpkg)
- **Recharts 2.12** via CDN (unpkg)
- **Babel Standalone** para transpilação JSX no browser
- **Fetch API** nativo para chamadas GraphQL ao Monday.com
- Sem npm, sem build step — ficheiro único `index.html`
