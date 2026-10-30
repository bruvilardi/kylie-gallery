# Kylie Lovers BR Gallery

Galeria de imagens estilo Apple TV dedicada à Kylie Minogue, cobrindo as eras de 1987 a 2025.
Feita com React 19 + Vite + TypeScript; as imagens ficam no Cloudinary.

## Rodar localmente

Pré-requisito: Node.js 18+

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # gera a pasta dist/
```

## Como as imagens são organizadas (Cloudinary)

A galeria não tem banco de dados: ela lê as listas públicas de imagens por **tag** do Cloudinary
(`https://res.cloudinary.com/<cloud>/image/list/<tag>.json`). Para uma imagem aparecer no site,
basta subir na conta e aplicar a tag certa.

| Onde aparece | Tag | Exemplo |
|---|---|---|
| Capa da categoria na home | `main_<categoria>` | `main_live` |
| Fotos de um álbum | `<categoria>_<ano>_<id-do-álbum>` | `live_2025_tension-tour-brasil` |
| Capa de um álbum | a tag de capa definida em `constants.ts` (`coverTag`) | `live_2025_tension-tour-brasil_cover` |
| Artworks sem ano | `artwork_live_albums`, `artwork_other` | |

Categorias: `photoshoots`, `video`, `artwork`, `live`.

Os álbuns de Photoshoots e Live, e os catálogos de Video e Artwork, são definidos em `constants.ts`
(`SPECIFIC_ALBUMS`, `VIDEO_CATALOG`, `ARTWORK_CATALOG`). Para um álbum novo: crie a entrada lá e suba
as fotos com a tag correspondente.

### Configuração da conta

- A conta usada é definida em `constants.ts` (`CLOUD_NAME`, padrão `drvtrbeky`) e pode ser trocada pela
  variável de ambiente `VITE_CLOUDINARY_CLOUD_NAME` (por exemplo, nas Environment Variables da Vercel).
- No Cloudinary, em **Settings → Security**, a opção **Resource list** precisa estar **liberada**
  (desmarcada em "Restricted media types"), senão as listas por tag retornam 404 e a galeria fica vazia.
- As imagens estão na pasta `kylie-gallery` da Media Library.

## Deploy na Vercel

Importe este repositório em https://vercel.com/new. A Vercel detecta Vite sozinha
(build `npm run build`, saída `dist`).
