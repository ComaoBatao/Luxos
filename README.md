# ✧ LUXOS — O Bestiário de Horxs

**Versão 1.0 — Grimório antigo**. Site estático em HTML, CSS e JavaScript (sem Node, sem npm e sem backend próprio), com Firestore em tempo real e um painel protegido para o guardião.

## O que já funciona

- Catálogo com pesquisa em nome, espécie, reino, habitat, alimentação, descrição e comida, tolerante a acentos.
- Filtros de reino e dieta, e ordenação alfabética, por altura, peso ou data.
- Fichas com descrição, habitat, dieta detalhada, raridade, dimensões, comportamento, conservação, curiosidades e até 6 imagens.
- Comparação visual das alturas de duas criaturas com referência humana de 1,70 m.
- Login do guardião com Firebase Authentication (e-mail/palavra-passe).
- Criar, editar e eliminar criaturas no Firestore; alterações aparecem automaticamente para todos os visitantes.
- Imagens por URL HTTPS ou ficheiros previamente colocados em `assets/`; upload direto de ficheiros para Firebase Storage (opcional, exige Blaze).
- Design responsivo, ilustrações SVG locais, links para fichas (`?animal=ID`), acessibilidade básica e modo demonstração.

> **Atenção:** as seis criaturas incluídas são apenas exemplos fictícios para testar o layout. Não representam o cânone de Horxs. Assim que configurares o Firebase, o site passa a mostrar exclusivamente os registos da tua base de dados.

## 1. Experimentar antes de configurar o Firebase

No Windows, abre a pasta do projeto no VS Code e usa a extensão **Live Server**. Alternativamente, num terminal dentro da pasta:

```bash
python -m http.server 8000
```

Acede a `http://localhost:8000`. Podes pesquisar, filtrar, abrir as fichas e comparar criaturas sem contas e sem Firebase. Para adicionar animais, configura o Firebase nos passos seguintes.

> Não abras `index.html` diretamente pelo protocolo `file://`: como o projeto utiliza módulos JS, usa um servidor local ou GitHub Pages.

## 2. Criar o projeto Firebase

1. Acede a https://console.firebase.google.com e cria um projeto chamado, por exemplo, **Luxos**.
2. Em **Project settings / Definições do projeto**, regista uma **Web app** (`</>`), com nome **Luxos Web**. Não precisas de ativar Firebase Hosting porque vamos usar GitHub Pages.
3. Copia os valores de `firebaseConfig` fornecidos pela consola e substitui os exemplos em `firebase-config.js` (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId).
4. Em **Build → Firestore Database**, cria uma base de dados (modo de produção, de preferência). Não a deixes em modo de teste aberto.
5. Em **Build → Authentication → Sign-in method**, ativa **Email/Password** (E-mail/palavra-passe). Em **Authentication → Users**, cria manualmente a tua conta de guardião, com um e-mail e palavra-passe fortes.
6. Na lista de utilizadores copia o **UID** da conta que acabaste de criar.
7. No `firebase-config.js`, substitui `COLOCA_AQUI_O_TEU_UID` pelo UID real.

**Não publiques a palavra-passe no repositório.** A configuração pública do Firebase **não é uma palavra-passe**, mas as regras de segurança devem ser publicadas e testadas antes de partilhar o site.

## 3. Proteger a base de dados (indispensável)

1. Abre `firestore.rules` neste pacote e substitui `COLOCA_AQUI_O_TEU_UID` pelo **mesmo UID**.
2. Na consola Firebase, vai a **Firestore Database → Rules**.
3. Cola o conteúdo de `firestore.rules` e clica **Publish / Publicar**.
4. Verifica que apenas a coleção `animals` permite leitura pública, e que escrever requer o teu UID exato.

As regras, **e não** esconder o botão de edição, são o que protege efetivamente os animais.

### Testar as permissões

Usa o simulador de regras do Firebase ou o Emulator Suite para confirmar:
- Visitante sem sessão: pode **ler** `/animals/qualquer-id`, mas **não** pode criar/editar/eliminar.
- Outro utilizador autenticado: também **não** pode alterar dados.
- A tua conta com UID autorizado: pode ler e alterar dados.

## 4. Imagens: escolhe uma das opções

**Opção A — sem Storage:** usa links HTTPS de imagens públicas, sob autorização adequada, no campo "Imagens por URL". Também podes colocar imagens dentro de `assets/` e escrever `./assets/nome-da-imagem.webp` nesse campo. Nesse segundo caso, adicionas as imagens ao repositório GitHub (mas nunca precisas de alterar JavaScript para criar novos registos).

**Opção B — upload direto do painel:** ativa **Firebase Storage** e cria o bucket. O Google exige o plano **Blaze (pagamento por utilização)** para usar Cloud Storage for Firebase, mesmo que possas ficar dentro de quotas sem custos em condições aplicáveis. Define alertas de orçamento, caso optes por esta via.

1. Abre `storage.rules` neste pacote, substitui `COLOCA_AQUI_O_TEU_UID` pelo mesmo UID e publica o conteúdo em **Storage → Rules**.
2. Confirma que `firebaseConfig.storageBucket` corresponde ao bucket correto.
3. No editor das criaturas, escolhe os ficheiros; as imagens são enviadas para `animals/ID/...`.
4. A regra aceita apenas JPG, PNG, WEBP e GIF com tamanho inferior a 5 MB por ficheiro.

**Nota:** apagar uma criatura limpa os ficheiros de Storage registados na ficha. Substituir/remover imagens numa edição pode deixar ficheiros antigos no bucket; podes apagá-los na consola. URLs externos deixam de funcionar se os respetivos sites os removerem.

## 5. Publicar no GitHub Pages

1. Cria um repositório GitHub chamado **luxos** (podes usar outro nome).
2. Faz upload **de todos os ficheiros desta pasta**, com `index.html` na raiz do repositório (incluindo `assets/`, `firebase-config.js`, `app.js`, `firebase-service.js` e `styles.css`). Não faças apenas upload do ZIP.
3. Vai a **Settings → Pages → Build and deployment**, escolhe **Deploy from a branch**, branch `main`, diretório `/(root)` e guarda.
4. Quando estiver publicado, abre `https://O-TEU-UTILIZADOR.github.io/luxos/`.
5. Se precisares, em **Firebase Authentication → Settings → Authorized domains**, adiciona `O-TEU-UTILIZADOR.github.io` (sem protocolo), sobretudo se no futuro utilizares métodos de login com redirecionamento.

Podes escolher um repositório **público** para o GitHub Pages; a segurança depende do Firebase, não da privacidade do código. Se atualizares HTML, CSS ou JS no GitHub, o Pages publica a nova versão. Se adicionares animais através do painel, **não precisas de fazer novo deploy**.

## 6. Como adicionar um animal

1. Com o site já ligado ao Firebase, clica no símbolo de escudo no canto superior direito.
2. Inicia sessão com a conta que criaste no Firebase Authentication.
3. Surge o botão **✦ Nova criatura**.
4. Preenche os campos obrigatórios: nome, reino, habitat, dieta, altura, comida e descrição.
5. Adiciona uma ou mais imagens por URL (ou por upload se tiveres Storage ativo).
6. Clica **Publicar criatura**. O animal aparece no catálogo em tempo real, sem editar código.
7. Para editar/apagar, abre a ficha da criatura como administrador.

## Organização dos ficheiros

```text
Luxos-v1/
├── index.html              # Estrutura do site e formulários
├── styles.css              # Estilo do grimório e versão móvel
├── app.js                  # Interface, filtros, fichas e comparador
├── firebase-config.js      # A TUA configuração pública e UID
├── firebase-service.js     # Ligação ao Firestore/Auth/Storage
├── firestore.rules         # Regras do Firestore: leitura pública e escrita exclusiva
├── storage.rules           # Regras do Storage (opcional)
└── assets/                 # Ícone e ilustrações DEMO locais
```

## Limitações da versão 1

- O comparador mede **altura**, não produz uma silhueta zoologicamente correta; se a criatura for comprida e rasteira, introduz a altura real na posição habitual e o comprimento em campo próprio.
- No editor, o campo de imagem URL admite até 6 imagens no total, somando ficheiros enviados.
- A pesquisa é feita no navegador depois da leitura dos registos públicos; ideal para um bestiário pequeno/médio. Para milhares de animais, convém implementar pesquisa indexada e paginação.
- O projeto não traz uma conta de administrador predefinida. **Só tu a crias na tua consola Firebase.**
- Os conteúdos do modo demo são inventados e não oficiais.
- Como imagens e fichas são públicas, evita nelas material privado ou spoilers que não queiras revelar aos jogadores.

## Referências oficiais

- Firebase web SDK: https://firebase.google.com/docs/web/setup
- Segurança do Firestore: https://firebase.google.com/docs/firestore/security/get-started
- Firebase Storage: https://firebase.google.com/docs/storage/web/start
- GitHub Pages: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
