'use strict';
const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const refs = ids => ids.map(id=>`<a href="#source-${id}" data-ref="${id}">[${id}]</a>`).join(' ');
const NODES = [
{id:'target',x:25,y:320,title:'靶点与产品目标',sub:'Target · 给药路径 · assay',input:'疾病机制、蛋白/细胞体系、已有结构与给药目标。',output:'有实验读数的设计问题，及允许的单体、环型与长度。',error:'靶点生物学错误、结构状态不对、把胞外结合问题误设为胞内可达问题。',question:'我们的功能读数能否验证目标机制？'},
{id:'library',x:250,y:80,title:'建库与展示筛选',sub:'mRNA / phage / encoded library',input:'单体、编码/翻译系统、闭环方案、靶标与反选条件。',output:'富集序列、筛选轮次与原始计数。',error:'扩增偏差、标签效应、非特异吸附；理论序列空间并非实际有效库容量。',question:'如何确认富集来自目标结合，而不是技术偏差？'},
{id:'hit',x:485,y:80,title:'确认 hit 与基序',sub:'脱标签重测 · 聚类 · SAR',input:'富集序列或既有实验活性分子。',output:'重合成后仍可确认的 hit、关键残基与初步结构假说。',error:'富集量不是 Kd；带标签时的结合可能不能转移到游离分子。',question:'是否保留了阴性、反选和 assay 干扰的信息？'},
{id:'motif',x:250,y:240,title:'已知配体 / motif',sub:'天然配体 · 线性肽 · 已有 hit',input:'结合基序、复合物、已知活性骨架或可编辑起始肽。',output:'固定/可变位置、药效团与化学修改边界。',error:'移植到新环骨架可能改变基序方向；缺少结构时要增加实验检查。',question:'保留的究竟是序列，还是关键原子的空间关系？'},
{id:'chem',x:485,y:240,title:'化学编辑 / 基序移植',sub:'环化 · NCAA · N-Me · RL',input:'化学定义、可修改位点、活性/性质目标与单体集合。',output:'明确的分子图、立体化学及候选系列；可能还需生成三维结构。',error:'序列合法不保证化学有效；奖励提升可能来自预测器偏差。',question:'修改后是否仍是同一预期环型、构型和药效团？'},
{id:'backbone',x:250,y:400,title:'靶向环骨架生成',sub:'Cyclic diffusion / 几何约束',input:'靶点结构、结合热点、环长和闭环约束。',output:'围绕靶点的候选骨架与设计条件。',error:'闭环距离达标不保证低应变；主链设计也未自动解决侧链、通透和合成。',question:'这个模型真正支持哪种闭环化学？'},
{id:'sequence',x:485,y:400,title:'序列 / 侧链设计',sub:'ProteinMPNN · inverse folding',input:'固定或可微调骨架、目标环境、位置限制。',output:'与骨架匹配的候选序列/侧链。',error:'常规蛋白逆折叠的词表与训练数据未必覆盖非天然单体。',question:'输入输出是否保留闭环原子和手性？'},
{id:'joint',x:250,y:560,title:'联合 / 全原子生成',sub:'序列 + 结构 · 模态 / 共价约束',input:'目标结构、分子模态与设计约束。',output:'分子身份与结构候选；具体模型也可能再做独立逆折叠。',error:'同为全原子框架不代表同样化学覆盖；通用蛋白结果不能自动外推环肽。',question:'能展示合法的环肽输入、输出及匹配实验吗？'},
{id:'conf',x:485,y:560,title:'构象与化学检查',sub:'RINGER · 环闭合 · 采样',input:'化学身份完整的分子、环境与必要的约束。',output:'多构象、几何/应变与立体化学检查。',error:'采到的构象不是自动带真实权重的 Boltzmann 分布；力场/采样仍会偏。',question:'水相、膜环境和结合态是否需要不同构象？'},
{id:'rank',x:735,y:320,title:'结构 / 性质排序',sub:'复合物 · Docking · MD / FEP',input:'候选分子与结构、assay 对齐的性质模型、计算预算。',output:'带置信范围和适用性说明的送测优先级。',error:'pLDDT 是结构置信；Docking 是姿态/打分假说；MM-GBSA 不是实测自由能；FEP 仍需收敛与适用域。',question:'预测差异是否大于误差？有没有多样性和简单基线？'},
{id:'make',x:975,y:320,title:'合成与身份确认',sub:'SPPS · 环化 · LC-MS / 纯度',input:'明确的分子定义、单体与合成路线。',output:'可测试实物、身份/纯度/产率与失败原因。',error:'未闭环、异构化、难溶、纯化损失；预测结构并不等于实际产物。',question:'分母是否包含所有尝试合成的候选？'},
{id:'bind',x:1215,y:320,title:'结合与选择性',sub:'SPR / BLI · 正交复测',input:'身份/浓度可确认的候选、靶标与对照。',output:'结合曲线、Kd 或动力学参数、反选结果。',error:'聚集、固定化、非特异吸附、质量传递；需要可解释的曲线而非单点信号。',question:'结合是否随浓度变化，并能在独立方法中复现？'},
{id:'function',x:1215,y:480,title:'功能与靶点作用',sub:'生化 / 细胞 · 靶点作用',input:'确认结合候选与目标相关功能体系。',output:'功能效应、机制/选择性支持、细胞可达性信息。',error:'结合不一定激活/抑制；细胞毒性可能伪装为目标功能。',question:'有无区分目标效应、递送不足和非特异毒性的对照？'},
{id:'adme',x:975,y:480,title:'可开发性与暴露',sub:'通透 · 溶解 · 稳定性 · PK',input:'候选、给药路径与明确 assay。',output:'多维性质与在体暴露证据。',error:'PAMPA、Caco-2 与胞质可达不等价；通透也不等于口服生物利用度。',question:'真正限制当前项目的是哪一个性质？'},
{id:'learn',x:735,y:680,title:'数据回流 / 主动学习',sub:'正负样本 · 版本 · 下一批选择',input:'计算、合成和实验全漏斗，包括失败和测量不确定性。',output:'校准后的模型/决策与下一轮实验批次。',error:'只保存成功样本、把预测当标签、骨架泄漏与批次漂移。',question:'新数据具体改变了哪个选择？相同预算下是否改善？'},
{id:'lead',x:1215,y:680,title:'进入 lead 优化',sub:'综合证据 · 逐级增加投入',input:'结合、功能与性质证据一致的候选系列。',output:'更明确的 lead 优化与转化验证计划。',error:'局部最优不能等于成药；PK、安全性与制造等仍需后续验证。',question:'哪些停止条件和继续投入条件已预先定义？'}
];
const EDGES = [
['t-l','target','library','M225 344 C238 344 235 120 250 120'],['l-h','library','hit','M450 120 H485'],['h-c','hit','chem','M585 160 V240'],
['t-m','target','motif','M225 354 C238 354 238 280 250 280'],['m-c','motif','chem','M450 280 H485'],
['t-b','target','backbone','M225 366 C237 366 238 440 250 440'],['b-s','backbone','sequence','M450 440 H485'],
['t-j','target','joint','M225 380 C238 380 235 600 250 600'],['j-q','joint','rank','M450 625 C470 665 720 665 720 625 V410 Q720 385 735 385'],
['c-f','chem','conf','M685 285 C714 285 714 600 685 600'],['f-q','conf','rank','M685 580 C710 580 710 375 735 375'],['s-q','sequence','rank','M685 440 C709 440 711 365 735 365'],
['c-y','chem','make','M685 270 C790 230 1075 230 1075 320'],
['q-y','rank','make','M935 360 H975'],['y-a','make','bind','M1175 360 H1215'],['a-u','bind','function','M1315 400 V480'],['a-d','bind','adme','M1245 400 C1245 448 1075 435 1075 480'],
['u-k','function','lead','M1315 560 V680'],['d-k','adme','lead','M1175 525 C1197 525 1190 720 1215 720'],
['a-i','bind','learn','M1415 360 H1440 Q1450 360 1450 375 V780 Q1450 795 1435 795 H850 Q835 795 835 780 V760','feedback'],
['d-i','adme','learn','M1075 560 C1075 650 935 650 935 710','feedback'],
['i-l','learn','library','M795 760 C795 810 10 810 10 750 V55 Q10 45 50 45 H350 V80','feedback'],
['i-b','learn','backbone','M735 710 H470 Q460 710 460 690 V500 Q460 490 440 490 H230 V440 H250','feedback'],
['i-c','learn','chem','M735 700 H720 Q705 700 705 685 V215 Q705 205 695 205 H585 V240','feedback'],
['i-j','learn','joint','M735 735 C570 770 350 775 350 640','feedback']
];
let selectedRoute='',primary='',secondary='',zoom=1;
const link=(name,url)=>`<a href="${esc(url)}" target="_blank" rel="noopener">${esc(name)} ↗</a>`;
function renderGraph(){
 const ns='http://www.w3.org/2000/svg';
 const svg=$('routeGraph');
 svg.innerHTML+='<defs>'+[['gray','#9aaea2'],['a','#315faa'],['b','#bf5c36'],['both','#8656a2']].map(([id,c])=>`<marker id="arrow-${id}" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 0 L8 4 L0 8 Z" fill="${c}"/></marker>`).join('')+'</defs><rect class="graph-bg" x="17" y="56" width="695" height="603" rx="14"/><text class="graph-heading" x="30" y="32">起点与候选产生</text><text class="graph-heading" x="745" y="32">计算与筛选</text><text class="graph-heading" x="984" y="32">实验与转化（性质可提前并行测）</text>';
 EDGES.forEach(([id,from,to,path,type])=>{let p=document.createElementNS(ns,'path');p.id='edge-'+id;p.setAttribute('d',path);p.setAttribute('class','edge '+(type||''));p.setAttribute('marker-end','url(#arrow-gray)');svg.appendChild(p)});
 NODES.forEach(n=>{let g=document.createElementNS(ns,'g');g.id='node-'+n.id;g.setAttribute('class','node');g.setAttribute('transform',`translate(${n.x},${n.y})`);g.setAttribute('role','button');g.setAttribute('tabindex','0');g.setAttribute('aria-label',n.title+'，查看输入输出与误差');g.innerHTML=`<rect width="200" height="80"/><text class="label" x="14" y="32">${esc(n.title)}</text><text class="sub" x="14" y="56">${esc(n.sub)}</text><circle class="wet-dot" cx="190" cy="8" r="6" style="display:none"/><title>${esc(n.title+'：'+n.output)}</title>`;g.addEventListener('click',()=>showStage(n.id));g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();showStage(n.id)}});svg.appendChild(g)});
}
function showStage(id){let n=NODES.find(n=>n.id===id);$('stageTitle').textContent=n.title;$('stageBody').innerHTML=`<div><b>输入</b><p>${esc(n.input)}</p></div><div><b>输出 / 用途</b><p>${esc(n.output)}</p></div><div><b>误差与边界</b><p>${esc(n.error)}</p></div><div><b>应该追问</b><p>${esc(n.question)}</p></div>`;document.querySelector('.stage-detail').open=true}
function projectDetail(p,cls=''){return `<article class="detail-card ${cls}"><span class="tag">${esc(p.kind)}</span><span class="tag">${esc(p.focus)}</span><h3>${esc(p.name)}</h3><p>${esc(p.method)}</p><dl>${[['输入',p.input],['输出',p.output],['化学范围',p.chem],['证据',p.evidence],['获取 / 许可',p.access]].map(([a,b])=>`<dt>${a}</dt><dd>${esc(b)}</dd>`).join('')}</dl><p class="key-point">${esc(p.limit)}</p><div class="links">${p.links.map(x=>link(...x)).join(' ')} ${refs(p.refs)}</div></article>`}
function selectProject(id){primary=id;secondary='';selectedRoute='';$('projectSelect').value=id;$('compareSelect').value='';update();$('map').scrollIntoView({behavior:'smooth',block:'start'})}
function update(){
 const a=primary?PROJECTS.find(p=>p.id===primary):selectedRoute?ROUTES.find(r=>r.id===selectedRoute):null;
 const b=secondary?PROJECTS.find(p=>p.id===secondary):null;
 const an=a?(a.core||a.nodes):[],bn=b?b.core:[];const ae=a?.edges||[],be=b?.edges||[];
 const cls=(aa,bb)=>aa&&bb?'selBoth':aa?'selA':bb?'selB':a||b?'dim':'';
 NODES.forEach(n=>{let g=$('node-'+n.id);g.setAttribute('class','node '+cls(an.includes(n.id),bn.includes(n.id))+((a?.scope==='adjacent'&&an.includes(n.id)||b?.scope==='adjacent'&&bn.includes(n.id))?' adjacent':''));g.querySelector('.wet-dot').style.display=(a?.wet?.includes(n.id)||b?.wet?.includes(n.id))?'':'none'});
 EDGES.forEach(([id,from,to,path,type])=>{let c=cls(ae.includes(id),be.includes(id));let p=$('edge-'+id);p.setAttribute('class','edge '+(type||'')+' '+c+((a?.scope==='adjacent'&&ae.includes(id)||b?.scope==='adjacent'&&be.includes(id))?' adjacent':''));p.setAttribute('marker-end','url(#arrow-'+({selA:'a',selB:'b',selBoth:'both'}[c]||'gray')+')')});
 $('selectionInfo').className='selection-info'+(b?' compare':'');
 if(primary){$('selectionInfo').innerHTML=projectDetail(a)+(b?projectDetail(b,'b'):'');$('graphCaption').textContent=`A：${a.name}${b?' · B：'+b.name:''}。${a.scope==='evaluation'?'结构评测工具：没有暗示生成或实测结合。':a.scope==='adjacent'?'相邻模态／任务，以淡色虚线显示；不代表环肽实验能力。':a.scope==='qualified'?'有待澄清：生成评估与KRAS SAR为分开的证据轨道，不能读成已证明的连续发现链。':'高亮表示公开描述的覆盖环节；不意味着独立复现。'}`}
 else if(a){$('selectionInfo').innerHTML=`<article class="detail-card"><span class="tag">路线类型 · 综合分析</span><h3>${esc(a.name)}</h3><p>${esc(a.summary)}</p><dl><dt>输入</dt><dd>${esc(a.input)}</dd><dt>输出</dt><dd>${esc(a.output)}</dd><dt>优势</dt><dd>${esc(a.advantage)}</dd><dt>主要风险</dt><dd>${esc(a.risk)}</dd></dl>${refs(a.refs)}</article>`;$('graphCaption').textContent=`路线：${a.name}。显示一种完整研发衔接方式，并非某个模型独立完成全流程。`}
 else{$('selectionInfo').innerHTML='<article class="detail-card"><h3>先看起点，再看汇合与反馈。</h3><p>左侧分支分别以实验库、已知配体/基序、靶向骨架与联合生成开始；化学/性质导向优化可以介入多个分支。候选随后进入共同的合成和实验验证链。</p><p>请选择一个项目定位它的实际贡献。仅做构象、性质或合成预测的工具，会只亮起少数节点，这正是它们与完整发现平台的区别。</p></article>';$('graphCaption').textContent='全景模式：实线从候选产生走向验证，下方虚线将实验信息送回设计。点击节点查看输入、输出及误差。'}
 document.querySelectorAll('[data-route]').forEach(el=>{const on=el.dataset.route===selectedRoute&&!primary;el.classList.toggle('active',on);el.setAttribute('aria-pressed',String(on))});
 document.querySelectorAll('[data-project]').forEach(el=>{const pa=el.dataset.project===primary,pb=el.dataset.project===secondary;el.classList.toggle('selected',pa||pb);el.classList.toggle('selected-b',pb);el.setAttribute('aria-pressed',String(pa||pb))});
 Array.from($('compareSelect').options).forEach(o=>{o.disabled=o.value&&o.value===primary});
 $('compareSelect').disabled=!primary;
}
function sourceCard(s){const local=s.file&&(!s.localOnly||location.protocol==='file:')?`<a href="literature/fulltext/${esc(s.file)}" target="_blank">本地全文 ↗</a><a href="literature/fulltext/${esc(s.file.replace(/\.(pdf|html)$/,'.txt'))}" target="_blank">纯文本 ↗</a>`:'';return `<article class="source" id="source-${s.id}" data-type="${s.type}" data-available="${!!s.file}" data-needed="${!!s.need}"><span class="tag">${s.id} · ${s.type==='review'?'综述类':'原始研究 / 报告'}</span><span class="tag">${esc(s.priority)}</span><h3>${esc(s.title)}</h3><div class="source-meta">${esc(s.authors)} · ${s.year} · ${esc(s.venue)}</div><p class="read-status ${s.file?'':'missing'}">${esc(s.read)}</p><p>${esc(s.note)}</p>${s.question?`<p class="question">阅读后思考：${esc(s.question)}</p>`:''}${s.need?`<p class="question">全文需求：${esc(s.need)}</p>`:''}<div class="links">${link(s.doi?'DOI / 原始来源':'原始来源',s.url)}${local}</div></article>`}
function filterSources(){let q=$('literatureSearch').value.trim().toLowerCase(),f=$('literatureFilter').value,count=0;SOURCES.forEach(s=>{let show=(!q||[s.title,s.authors,s.note,s.id,s.venue].join(' ').toLowerCase().includes(q))&&(f==='all'||f===s.type||(f==='available'&&s.file)||(f==='needed'&&s.need));$('source-'+s.id).hidden=!show;if(show)count++});$('sourceCount').textContent=`显示 ${count} / ${SOURCES.length} 条 · 已保存 ${SOURCES.filter(s=>s.file).length} 份全文 · 待补 ${SOURCES.filter(s=>s.need).length} 项`}
function funnel(){let a=Number($('attempted').value),t=Number($('tested').value),h=Number($('hits').value),c=Number($('cost').value);let out=$('funnelOutput');let valid=[a,t,h,c].every(Number.isFinite)&&[a,t,h].every(Number.isInteger)&&a>0&&t>=0&&h>=0&&c>=0&&a>=t&&t>=h;out.classList.toggle('error',!valid);if(!valid){out.textContent='请满足：送合成 ≥ 成功并送测 ≥ 确认结合 ≥ 0；数量为整数，送合成大于 0，成本非负。';return}out.textContent=`从送合成到结合：${(h/a*100).toFixed(1)}%　｜　送测后结合：${t?(h/t*100).toFixed(1)+'%':'无送测，不能计算'}　｜　每个确认 hit：${h?'¥'+Math.round(c/h).toLocaleString('zh-CN'):'无确认 hit，不能计算'}`}
function exportGraph(){let copy=$('routeGraph').cloneNode(true);copy.setAttribute('xmlns','http://www.w3.org/2000/svg');copy.setAttribute('width','1470');copy.setAttribute('height','870');copy.setAttribute('viewBox','0 0 1470 870');let style=document.createElementNS('http://www.w3.org/2000/svg','style');style.textContent='.node.adjacent rect{stroke-dasharray:5 4;fill:#f4f1e8}.edge.adjacent{stroke-dasharray:3 7;opacity:.5}text{font-family:Arial,"PingFang SC",sans-serif}.graph-bg{fill:#f1f3ed}.graph-heading{font-size:13px;fill:#62796a}.edge{fill:none;stroke:#9aaea2;stroke-width:1.8;opacity:.65}.feedback{stroke-dasharray:7 6}.dim{opacity:.18}.edge.selA{stroke:#315faa;stroke-width:3.5;opacity:1}.edge.selB{stroke:#bf5c36;stroke-width:3.5;opacity:1}.edge.selBoth{stroke:#8656a2;stroke-width:4;opacity:1}.node rect{fill:#fffefa;stroke:#a8bdb0;stroke-width:1.5;rx:9}.node.selA rect{fill:#eaf0fb;stroke:#315faa;stroke-width:2.5}.node.selB rect{fill:#fcf0e8;stroke:#bf5c36;stroke-width:2.5}.node.selBoth rect{fill:#f1eaf6;stroke:#8656a2;stroke-width:2.5}.label{font-size:17px;fill:#18302d;font-weight:600}.sub{font-size:12px;fill:#62796a}.wet-dot{fill:#16864e;stroke:white;stroke-width:2}';copy.prepend(style);let txt=document.createElementNS('http://www.w3.org/2000/svg','text');txt.setAttribute('x','25');txt.setAttribute('y','845');txt.setAttribute('font-size','14');txt.textContent='研究快照 2026-11-03 · '+$('graphCaption').textContent;copy.appendChild(txt);const url=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(copy)],{type:'image/svg+xml'}));let a=document.createElement('a');a.href=url;a.download='cyclic-peptide-route-'+(primary||selectedRoute||'overview')+(secondary?'-vs-'+secondary:'')+'.svg';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
// Initialization: all data is local, including literature metadata and route coverage.
$('routeButtons').innerHTML='<button data-route="" style="--route:#788e7e">全部路线</button>'+ROUTES.map(r=>`<button data-route="${r.id}" style="--route:${r.color}">${esc(r.name)}</button>`).join('');
ROUTES.forEach(r=>{let list=PROJECTS.filter(p=>p.route===r.id);for(const select of [$('projectSelect'),$('compareSelect')]){let g=document.createElement('optgroup');g.label=r.name;list.forEach(p=>{let o=new Option(p.name+' · '+p.kind,p.id);g.appendChild(o)});select.appendChild(g)}});
$('projectCards').innerHTML=PROJECTS.map(p=>`<button class="project-card" data-project="${p.id}"><strong>${esc(p.name)}</strong><span>${esc(p.kind)}</span><span>${esc(p.focus)}</span></button>`).join('');
document.querySelectorAll('[data-project]').forEach(el=>el.addEventListener('click',()=>selectProject(el.dataset.project)));
document.querySelectorAll('[data-route]').forEach(el=>el.addEventListener('click',()=>{selectedRoute=el.dataset.route;primary=secondary='';$('projectSelect').value=$('compareSelect').value='';update()}));
$('projectSelect').addEventListener('change',()=>{primary=$('projectSelect').value;selectedRoute='';if(primary===secondary||!primary){secondary='';$('compareSelect').value=''}update()});
$('compareSelect').addEventListener('change',()=>{secondary=$('compareSelect').value;update()});
$('reset').addEventListener('click',()=>{selectedRoute=primary=secondary='';zoom=1;$('routeGraph').style.width='100%';$('projectSelect').value=$('compareSelect').value='';update()});
$('zoomIn').addEventListener('click',()=>{zoom=Math.min(2.5,zoom+.25);$('routeGraph').style.width=zoom*100+'%'});$('zoomOut').addEventListener('click',()=>{zoom=Math.max(1,zoom-.25);$('routeGraph').style.width=zoom*100+'%'});
$('downloadGraph').addEventListener('click',exportGraph);$('print').addEventListener('click',()=>window.print());
$('sourceList').innerHTML=SOURCES.map(sourceCard).join('');$('literatureSearch').addEventListener('input',filterSources);$('literatureFilter').addEventListener('change',filterSources);
document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#source-"]');if(a){$('literatureSearch').value='';$('literatureFilter').value='all';filterSources()}});
['attempted','tested','hits','cost'].forEach(id=>$(id).addEventListener('input',funnel));
renderGraph();showStage('rank');update();filterSources();funnel();
if(location.hash.startsWith('#source-'))setTimeout(()=>document.querySelector(location.hash)?.scrollIntoView(),100);
