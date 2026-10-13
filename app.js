import { firebaseConfig, ADMIN_UID } from './firebase-config.js';

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const demoAnimals = [
  { id: 'demo-001', name: 'Cervo Áureo', species: 'Cervídeo místico', kingdom: 'Oleander', habitat: 'Florestas de folhas douradas', diet: 'Herbívoro', rarity: 'Raro', temperament: 'Pacífico e vigilante', height: 2.4, length: 3.1, weight: 360, conservation: 'Desconhecido', symbol: '✦', food: 'Folhagem jovem, frutos silvestres e cogumelos luminosos.', description: 'Entre as árvores antigas, os seus chifres parecem desenhar constelações. O Cervo Áureo raramente se aproxima dos viajantes, mas a sua presença é anunciada por pequenas luzes douradas entre as folhas.', behavior: 'Vive em pequenos grupos e desloca-se sobretudo ao amanhecer. Afasta-se silenciosamente quando pressente perigo.', curiosity: 'Diz-se que os caminhos por onde passa nunca são esquecidos pela floresta.', images: ['./assets/cervo-aureo.svg'] },
  { id: 'demo-002', name: 'Besouro Celeste', species: 'Escaravelho gigante', kingdom: 'Dauphim', habitat: 'Planícies altas e falésias', diet: 'Omnívoro', rarity: 'Lendário', temperament: 'Protetor e territorial', height: 3.3, length: 5.7, weight: 1800, conservation: 'Desconhecido', symbol: '❦', food: 'Raízes, fungos, frutos caídos e pequenos invertebrados.', description: 'O bater das suas asas faz eco através dos vales. A carapaça reflete a luz como metal antigo e, quando voa, o contorno da criatura confunde-se com as nuvens.', behavior: 'É geralmente calmo, mas protege os locais onde repousa. Costuma viajar sozinho.', curiosity: 'Algumas lendas locais associam o seu voo a manifestações de Horxs.', images: ['./assets/besouro-celeste.svg'] },
  { id: 'demo-003', name: 'Lobo das Cinzas', species: 'Canídeo crepuscular', kingdom: 'Nox-Anibus', habitat: 'Bosques queimados e montanhas', diet: 'Carnívoro', rarity: 'Incomum', temperament: 'Desconfiado e territorial', height: 1.35, length: 2.6, weight: 92, conservation: 'Estável', symbol: '☾', food: 'Pequenos mamíferos, aves e animais feridos.', description: 'A sua pelagem cinzenta mistura-se com a neblina das terras secas. Os olhos cor de âmbar destacam-se mesmo quando o restante corpo desaparece na escuridão.', behavior: 'Caça em matilha e comunica com uivos longos. Evita confrontos se existir outra passagem.', curiosity: 'Os habitantes das regiões próximas reconhecem as suas pegadas pelo desenho incomum das garras.', images: ['./assets/lobo-cinzas.svg'] },
  { id: 'demo-004', name: 'Serpente do Eclipse', species: 'Serpente das águas profundas', kingdom: 'Cygne', habitat: 'Lagos subterrâneos e cavernas', diet: 'Carnívoro', rarity: 'Raro', temperament: 'Solitário e imprevisível', height: .85, length: 11, weight: 540, conservation: 'Desconhecido', symbol: '☽', food: 'Peixes grandes, crustáceos e criaturas que se aproximem da margem.', description: 'O corpo escuro possui marcas prateadas que refletem a luz em padrões semelhantes às fases da lua. Raramente emerge por completo.', behavior: 'Permanece imóvel durante horas e aproxima-se da presa quase sem perturbar a superfície da água.', curiosity: 'Apesar do comprimento colossal, a altura registada é inferior à de uma pessoa.', images: ['./assets/serpente-eclipse.svg'] },
  { id: 'demo-005', name: 'Mariposa Lunar', species: 'Lepidóptero feérico', kingdom: 'Taigara', habitat: 'Bosques húmidos e jardins noturnos', diet: 'Herbívoro', rarity: 'Incomum', temperament: 'Dócil', height: 1.9, length: 1.2, weight: 25, conservation: 'Estável', symbol: '✧', food: 'Néctar de flores noturnas e seiva de árvores antigas.', description: 'As suas asas parecem pergaminhos pintados com pó de luar. Quando descansa, pequenas partículas cintilantes flutuam em torno das suas antenas.', behavior: 'É ativa depois do pôr do sol, aproximando-se de grandes grupos de flores.', curiosity: 'As manchas nas asas diferem de indivíduo para indivíduo.', images: ['./assets/mariposa-lunar.svg'] },
  { id: 'demo-006', name: 'Corvo de Geada', species: 'Ave das terras frias', kingdom: 'Frostheim', habitat: 'Picos nevados e florestas de gelo', diet: 'Omnívoro', rarity: 'Comum', temperament: 'Curioso e oportunista', height: .75, length: 1.15, weight: 6.5, conservation: 'Estável', symbol: '❅', food: 'Frutos de inverno, insetos, pequenos animais e restos de alimento.', description: 'As penas azul-escuras possuem bordas claras que se confundem com cristais de gelo. O seu canto ressoa a grandes distâncias na neve.', behavior: 'Observa os viajantes e ocasionalmente segue caravanas em busca de alimento.', curiosity: 'Consegue esconder pequenas provisões debaixo de neve pouco compacta.', images: ['./assets/corvo-geada.svg'] }
];

const state = { animals: [], demo: false, service: null, admin: false, user: null, search: '', kingdom: '', diet: '', sort: 'name', edit: null, detailId: null };
const readyConfig = ['apiKey', 'authDomain', 'projectId', 'appId'].every((key) => {
  const value = String(firebaseConfig[key] || '');
  return value.trim() && !value.includes('COLOCA_AQUI');
});
const number = (value, digits=1) => Number(value || 0).toLocaleString('pt-PT', { maximumFractionDigits: digits });
const norm = (value) => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-PT');
const node = (tag, className = '', content = '') => { const result = document.createElement(tag); if (className) result.className = className; result.textContent = content; return result; };
const validImage = (url) => {
  try { const parsed = new URL(url, window.location.href); return ['https:', 'http:'].includes(parsed.protocol) && (url.startsWith('./assets/') || parsed.protocol === 'https:') ? parsed.href : null; }
  catch { return null; }
};
const shortDescription = (text) => (text || 'Uma criatura à espera de ser descoberta.');
const show = (dialog) => { if (!dialog.open) dialog.showModal(); };
const close = (dialog) => { if (dialog.open) dialog.close(); };

function toast(message) {
  const box = $('#toast'); box.textContent = message; box.classList.remove('hidden');
  clearTimeout(toast.timeout); toast.timeout = setTimeout(() => box.classList.add('hidden'), 3900);
}
function showError(message) { $('#app-notice').textContent = message; $('#app-notice').classList.remove('hidden'); }
function imageEl(url, alt, symbol = '✦') {
  const container = node('div', 'placeholder-image');
  const sigil = node('span', '', symbol || '✦'); container.append(sigil);
  const clean = url && validImage(url);
  if (!clean) return container;
  const img = document.createElement('img'); img.src = clean; img.alt = alt;
  img.loading = 'lazy'; img.decoding = 'async';
  img.onerror = () => { if (img.parentNode) img.replaceWith(container); };
  return img;
}
function filteredAnimals() {
  let list = state.animals.filter((animal) => {
    if (state.kingdom && animal.kingdom !== state.kingdom) return false;
    if (state.diet && animal.diet !== state.diet) return false;
    if (!state.search) return true;
    return [animal.name, animal.species, animal.kingdom, animal.habitat, animal.diet, animal.description, animal.food]
      .some((value) => norm(value).includes(norm(state.search)));
  });
  return list.sort((a, b) => {
    switch (state.sort) {
      case 'height-desc': return Number(b.height || 0) - Number(a.height || 0);
      case 'height-asc': return Number(a.height || 0) - Number(b.height || 0);
      case 'weight-desc': return Number(b.weight || 0) - Number(a.weight || 0);
      case 'newest': return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
      default: return String(a.name).localeCompare(String(b.name), 'pt');
    }
  });
}
function refreshStats() {
  $('#stat-animals').textContent = String(state.animals.length).padStart(2, '0');
  $('#stat-kingdoms').textContent = String(new Set(state.animals.map((item) => item.kingdom).filter(Boolean)).size).padStart(2, '0');
  $('#stat-diets').textContent = String(new Set(state.animals.map((item) => item.diet).filter(Boolean)).size).padStart(2, '0');
}
function refreshKingdoms() {
  const select = $('#kingdom-filter'); const before = select.value;
  select.replaceChildren(new Option('Todos os reinos', ''));
  [...new Set(state.animals.map((item) => item.kingdom).filter(Boolean))].sort((a,b) => a.localeCompare(b,'pt'))
    .forEach((kingdom) => select.add(new Option(kingdom, kingdom)));
  select.value = [...select.options].some(o=>o.value===before) ? before : '';
  state.kingdom = select.value;
}
function renderCards() {
  const items = filteredAnimals(); const grid = $('#animal-grid'); grid.replaceChildren();
  $('#result-count').textContent = `${items.length} ${items.length === 1 ? 'CRIATURA ENCONTRADA' : 'CRIATURAS ENCONTRADAS'}`;
  $('#empty-state').classList.toggle('hidden', Boolean(items.length));
  for (const animal of items) {
    const card = node('article', 'animal-card'); card.tabIndex = 0; card.setAttribute('role','button'); card.setAttribute('aria-label', `Consultar ${animal.name}`);
    const visual = node('div', 'animal-image'); visual.append(imageEl(animal.images?.[0], `Imagem de ${animal.name}`, animal.symbol));
    visual.append(node('span', 'rarity', animal.rarity || 'Não classificado'));
    if ((animal.images || []).length > 1) visual.append(node('span','image-counter',`+${animal.images.length - 1} imagens`));
    const info = node('div','animal-info');
    const overline = node('div','animal-overline'); overline.append(node('span','',animal.kingdom||'Reino desconhecido'), node('span','',animal.diet||'—'));
    info.append(overline,node('h3','',animal.name),node('span','animal-species',animal.species||'Espécie não classificada'),node('p','animal-summary',shortDescription(animal.description)));
    const meta = node('div','animal-meta');const measure = node('span','measure');measure.append(node('strong','',number(animal.height,2)+' m'),document.createTextNode(' de altura'));
    meta.append(measure,node('span','card-link','LER REGISTO ↗'));info.append(meta);card.append(visual,info);
    card.addEventListener('click', () => openDetail(animal.id));
    card.addEventListener('keydown', (ev) => {if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();openDetail(animal.id);}});
    grid.append(card);
  }
}
function resetFilters() {
  state.search = state.diet = state.kingdom = ''; state.sort = 'name';
  $('#search-input').value = ''; $('#kingdom-filter').value = ''; $('#sort-filter').value = 'name';
  $$('.filter-pill').forEach((pill) => { pill.classList.toggle('selected', pill.dataset.diet === '');pill.setAttribute('aria-pressed', String(pill.dataset.diet === '')); });
  renderCards();
}
function detailSection(title, text) {if (!text) return null; const area=node('section','detail-text');area.append(node('h3','',title),node('p','',text));return area;}
function openDetail(id, updateUrl=true) {
  const animal = state.animals.find((item) => item.id === id); if (!animal) return;
  state.detailId = id;
  const root=$('#animal-detail');root.replaceChildren();
  const cover=node('div','detail-cover'); const first=imageEl(animal.images?.[0],`Imagem de ${animal.name}`,animal.symbol);first.id='detail-main-image';cover.append(first);root.append(cover);
  const body=node('div','detail-body');const header=node('div','detail-header');const htxt=node('div');
  htxt.append(node('span','detail-overline',`${animal.kingdom||'ORIGEM DESCONHECIDA'} · REGISTO ${String(animal.id).slice(-6).toUpperCase()}`),node('h2','',animal.name),node('p','',animal.species||'Espécie desconhecida'));
  header.append(htxt,node('span','detail-rarity',animal.rarity||'Não classificado'));body.append(header);
  if ((animal.images||[]).length>1) {
    const gallery=node('div','detail-gallery'); animal.images.forEach((image,index) => {
      const thumb=node('button',`detail-thumb${index===0?' active':''}`);thumb.type='button';thumb.setAttribute('aria-label',`Ver imagem ${index+1}`);thumb.append(imageEl(image,`Imagem ${index+1} de ${animal.name}`,animal.symbol));
      thumb.addEventListener('click',()=>{cover.replaceChildren();cover.append(imageEl(image,`Imagem ${index+1} de ${animal.name}`,animal.symbol));gallery.querySelectorAll('button').forEach(x=>x.classList.remove('active'));thumb.classList.add('active');});gallery.append(thumb);
    });body.append(gallery);
  }
  const stats=node('div','detail-stats');[
    ['ALTURA',animal.height!=null?`${number(animal.height,2)} m`:'—'],['COMPRIMENTO',animal.length!=null?`${number(animal.length,2)} m`:'—'],['PESO',animal.weight!=null?`${number(animal.weight,2)} kg`:'—'],['DIETA',animal.diet||'—']
  ].forEach(([label,value])=>{const item=node('div','detail-stat');item.append(node('span','',label),node('strong','',value));stats.append(item);});body.append(stats);
  const fields=[['Sobre a criatura',animal.description],['Onde vive',animal.habitat],['O que come',animal.food],['Comportamento',animal.behavior],['Temperamento',animal.temperament],['Estado de conservação',animal.conservation],['Curiosidades & lendas',animal.curiosity]];
  fields.forEach(([title,content])=>{const part=detailSection(title,content);if(part)body.append(part);});
  if (state.admin) {
    const actions=node('div','detail-admin-actions'); const edit=node('button','btn btn-secondary','Editar ficha');const del=node('button','btn btn-danger','Eliminar criatura');
    edit.addEventListener('click',()=>{close($('#animal-dialog'));openEditor(animal);});
    del.addEventListener('click',()=>removeAnimal(animal));actions.append(edit,del);body.append(actions);
  }
  root.append(body);show($('#animal-dialog'));
  if (updateUrl) {const url=new URL(window.location.href);url.searchParams.set('animal',id);history.replaceState(null,'',url);}
}
function refreshCompare() {
  const a=$('#compare-a'),b=$('#compare-b'),items=[...state.animals].sort((x,y)=>x.name.localeCompare(y.name,'pt'));
  const prevA=a.value,prevB=b.value;a.replaceChildren();b.replaceChildren();
  items.forEach((item)=>{a.add(new Option(item.name,item.id));b.add(new Option(item.name,item.id));});
  if(items.length){a.value=items.some(item=>item.id===prevA)?prevA:items[0].id;b.value=items.some(item=>item.id===prevB)?prevB:items[Math.min(1,items.length-1)].id;}
  drawComparison();
}
function drawComparison() {
  const ids=[$('#compare-a').value,$('#compare-b').value];const items=ids.map(id=>state.animals.find(x=>x.id===id)).filter(Boolean);
  const graph=$('#compare-visual'),facts=$('#compare-facts');graph.replaceChildren();facts.replaceChildren();
  if (!items.length){graph.append(node('p','','Adiciona criaturas para poderes comparar as suas medidas.'));return;}
  const max=Math.max(1.7,...items.map(a=>Math.max(.01,Number(a.height)||.01)));
  const first=items[0], second=items[1]||items[0];
  [first,{name:'Pessoa adulta',height:1.7,human:true},second].forEach((a)=>{
    const figure=node('div','comparison-figure');const tall=Math.max(2,Math.round((Number(a.height)/max)*233));
    figure.append(node('span','compare-figure-height',`${number(a.height,2)} m`));
    const bar=node('div',`comparison-bar${a.human?' human':''}`);bar.style.height=`${tall}px`;
    figure.append(bar,node('span','compare-figure-name',a.name));graph.append(figure);
  });
  const diff=Math.abs(Number(first.height)-Number(second.height));const taller=Number(first.height)===Number(second.height)?'Têm a mesma altura':`${Number(first.height)>Number(second.height)?first.name:second.name} é mais alto`;
  [['DIFERENÇA DE ALTURA',`${number(diff,2)} m`],['COMPARAÇÃO',taller]].forEach(([label,value])=>{const card=node('div','compare-fact');card.append(node('span','',label),node('strong','',value));facts.append(card);});
}
function openEditor(animal=null) {
  if (!state.admin) return;
  state.edit=animal;const form=$('#animal-form');form.reset();$('#editor-error').classList.add('hidden');
  $('#editor-title').replaceChildren(document.createTextNode(animal?'Editar ':'Nova '),node('em','', 'criatura'));
  $('#editor-save').textContent=animal?'✦ Guardar alterações':'✦ Publicar criatura';
  if(animal){Object.entries(animal).forEach(([key,value])=>{const input=form.elements.namedItem(key);if(input&&typeof value!=='object')input.value=value??'';});form.elements.namedItem('imageUrls').value=(animal.images||[]).join('\n');}
  show($('#editor-dialog'));
}
async function removeAnimal(animal) {
  if(!state.admin||!state.service)return;
  if(!window.confirm(`Tens a certeza de que queres eliminar «${animal.name}»? Esta ação não pode ser anulada.`))return;
  try {await state.service.deleteAnimal(animal);close($('#animal-dialog'));toast('O registo foi eliminado.');}
  catch(error){toast('Não foi possível eliminar: '+friendlyError(error));}
}
function friendlyError(error) {
  const code=error?.code||'';
  if(code.includes('permission-denied')||code.includes('unauthorized'))return 'Acesso negado. Confirma o UID e as regras do Firebase.';
  if(code.includes('wrong-password')||code.includes('invalid-credential')||code.includes('user-not-found'))return 'E-mail ou palavra-passe incorretos.';
  if(code.includes('too-many-requests'))return 'Demasiadas tentativas. Tenta novamente mais tarde.';
  if(code.includes('storage/'))return 'Falha no Storage. Verifica o plano Blaze, as regras e o bucket.';
  return error?.message || 'Ocorreu um erro desconhecido.';
}
async function saveFromForm(event) {
  event.preventDefault();if(!state.admin||!state.service)return;
  const form=event.currentTarget, errorBox=$('#editor-error'),button=$('#editor-save');errorBox.classList.add('hidden');
  const raw=new FormData(form);const get=(key)=>String(raw.get(key)||'').trim();
  const inputUrls=get('imageUrls').split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
  if (inputUrls.some(x=>!validImage(x)|| !(x.startsWith('./assets/') || validImage(x).startsWith('https://')))) {errorBox.textContent='Usa links HTTPS válidos ou caminhos ./assets/nome-da-imagem.jpg.';errorBox.classList.remove('hidden');return;}
  const files=[...$('#image-files').files];
  if (inputUrls.length+files.length>6) {errorBox.textContent='Usa no máximo 6 imagens por criatura.';errorBox.classList.remove('hidden');return;}
  if(files.some(file=>!['image/png','image/jpeg','image/webp','image/gif'].includes(file.type)||file.size>=5*1024*1024)) {errorBox.textContent='Cada ficheiro deve ser PNG, JPG, WEBP ou GIF, com menos de 5 MB.';errorBox.classList.remove('hidden');return;}
  const height=Number(get('height'));if(!Number.isFinite(height)||height<=0){errorBox.textContent='A altura deve ser um número maior que zero.';errorBox.classList.remove('hidden');return;}
  const animal={name:get('name'),species:get('species'),kingdom:get('kingdom'),habitat:get('habitat'),diet:get('diet'),rarity:get('rarity'),temperament:get('temperament'),symbol:get('symbol')||'✦',height,length:get('length')===''?null:Number(get('length')),weight:get('weight')===''?null:Number(get('weight')),conservation:get('conservation'),food:get('food'),description:get('description'),behavior:get('behavior'),curiosity:get('curiosity'),images:[...new Set(inputUrls)]};
  button.disabled=true;button.textContent=files.length?'A carregar imagens…':'A guardar…';
  try {await state.service.saveAnimal(animal,files,state.edit);close($('#editor-dialog'));toast(state.edit?'A criatura foi atualizada.':'A criatura foi publicada no bestiário!');}
  catch(error){errorBox.textContent=friendlyError(error);errorBox.classList.remove('hidden');}
  finally {button.disabled=false;button.textContent=state.edit?'✦ Guardar alterações':'✦ Publicar criatura';}
}
function hydrateAnimals(items) {
  state.animals=items;
  refreshStats();refreshKingdoms();renderCards();refreshCompare();
  const fromUrl=new URLSearchParams(window.location.search).get('animal');
  if (fromUrl && !$('#animal-dialog').open && items.some(x=>x.id===fromUrl)) openDetail(fromUrl,false);
  if (state.detailId&&$('#animal-dialog').open) openDetail(state.detailId,false);
}
function setupListeners() {
  $('#footer-year').textContent=new Date().getFullYear();
  $('#search-input').addEventListener('input',e=>{state.search=e.target.value.trim();renderCards();});
  $('#kingdom-filter').addEventListener('change',e=>{state.kingdom=e.target.value;renderCards();});
  $('#sort-filter').addEventListener('change',e=>{state.sort=e.target.value;renderCards();});
  $$('.filter-pill').forEach(pill=>{
    pill.setAttribute('aria-pressed',String(pill.dataset.diet===''));
    pill.addEventListener('click',()=>{state.diet=pill.dataset.diet;$$('.filter-pill').forEach(x=>{x.classList.toggle('selected',x===pill);x.setAttribute('aria-pressed',String(x===pill));});renderCards();});
  });
  $('#clear-filters').addEventListener('click',resetFilters);
  $('#compare-a').addEventListener('change',drawComparison);$('#compare-b').addEventListener('change',drawComparison);
  $$('[data-close]').forEach(button=>button.addEventListener('click',()=>close(document.getElementById(button.dataset.close))));
  $$('.app-dialog').forEach(dialog=>{
    dialog.addEventListener('click',(event)=>{if(event.target===dialog)dialog.close();});
  });
  $('#animal-dialog').addEventListener('close',()=>{state.detailId=null;const url=new URL(window.location.href);url.searchParams.delete('animal');history.replaceState(null,'',url);});
  $('#admin-btn').addEventListener('click',()=>{
    if(state.demo){toast('Para entrar como guardião, configura primeiro o Firebase. Consulta o README.');return;}
    $('#login-form').classList.toggle('hidden',state.admin);
    $('#logout-btn').classList.toggle('hidden',!state.admin);
    $('#login-title').replaceChildren(document.createTextNode(state.admin?'Guardião ':'Acesso do '),node('em','',state.admin?'ligado':'Guardião'));
    $('#login-error').classList.add('hidden');show($('#login-dialog'));
  });
  $('#login-form').addEventListener('submit',async(event)=>{
    event.preventDefault();const button=$('#login-submit');button.disabled=true;$('#login-error').classList.add('hidden');
    try {const result=await state.service.login($('#login-email').value,$('#login-password').value);if(result.user.uid!==ADMIN_UID){await state.service.logout();throw new Error('Esta conta não está autorizada como guardião.');}$('#login-password').value='';close($('#login-dialog'));toast('Sessão iniciada. Bem-vindo ao arquivo.');}
    catch(error){$('#login-error').textContent=friendlyError(error);$('#login-error').classList.remove('hidden');}
    finally{button.disabled=false;}
  });
  $('#logout-btn').addEventListener('click',async()=>{if(!state.service)return;await state.service.logout();close($('#login-dialog'));toast('Sessão terminada.');});
  $('#add-animal-btn').addEventListener('click',()=>openEditor());
  $('#editor-cancel').addEventListener('click',()=>close($('#editor-dialog')));
  $('#animal-form').addEventListener('submit',saveFromForm);
}
async function start() {
  setupListeners();
  if(!readyConfig){state.demo=true;$('#demo-banner').classList.remove('hidden');hydrateAnimals(demoAnimals);return;}
  try {
    const {createFirebaseService}=await import('./firebase-service.js');
    state.service=await createFirebaseService(firebaseConfig);
    state.service.observeAnimals((items)=>{hydrateAnimals(items);$('#app-notice').classList.add('hidden');},(error)=>showError('Não foi possível ler os animais no Firestore: '+friendlyError(error)));
    state.service.observeAuth(async(user)=>{
      state.user=user;
      const allowed=Boolean(user&&ADMIN_UID&&!ADMIN_UID.includes('COLOCA_AQUI')&&user.uid===ADMIN_UID);
      if(user&&!allowed){await state.service.logout();toast('Esta conta não está autorizada como guardião.');return;}
      state.admin=allowed;$('#add-animal-btn').classList.toggle('hidden',!allowed);$('#admin-btn').title=allowed?'Guardião autenticado':'Área do guardião';renderCards();
      if(state.detailId&&$('#animal-dialog').open)openDetail(state.detailId,false);
    });
  }catch(error){showError('Não foi possível ligar ao Firebase. Verifica a configuração, a ligação à internet e as regras. Detalhes: '+friendlyError(error));$('#result-count').textContent='O arquivo não está disponível';}
}
start();
