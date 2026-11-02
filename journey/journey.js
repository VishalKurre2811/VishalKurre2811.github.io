import * as THREE from 'three';

// ─── Story ──────────────────────────────────────────────────────────
// `at` is the road point the chapter's building sits beside.
const CHAPTERS = [
  {
    id: 'intro', short: 'Start', at: 0, intro: true,
    when: 'Hi there', title: "I'm Vishal.",
    where: 'Software Engineer · Houston, TX',
    body: 'Scroll to walk with me from my first degree to my desk at J.P. Morgan. Each stop is a chapter.',
    sky: 0xf6c9a8,
  },
  {
    id: 'btech', short: 'BTech', at: 1, kind: 'college', color: 0xd9a066, chip: '#C67B2E',
    when: 'Graduated 2018 · India', title: 'BTech, Computer Science',
    where: 'Aurora Technological Research Institute',
    list: ['Bachelor of Technology in Computer Science and Engineering.'],
    sky: 0xf9d9b8,
  },
  {
    id: 'realcom', short: 'Realcom', at: 2, kind: 'startup', color: 0xe8664a, chip: '#E0533A',
    when: 'Mar 2018 – Aug 2020', title: 'Software Developer',
    where: 'Realcom Infocom · early-stage startup',
    list: [
      'Managed a team of four.',
      'Built Java Spring applications and REST APIs integrating third-party services.',
      'Added JWT and OAuth2 auth; designed PostgreSQL and MySQL schemas.',
    ],
    sky: 0xbfe0f7,
  },
  {
    id: 'amazon', short: 'Amazon', at: 3, kind: 'warehouse', color: 0xf0a030, chip: '#D98A0F',
    when: 'Sep 2020 – Aug 2021', title: 'Python Developer',
    where: 'Amazon',
    list: [
      'Python microservices and FastAPI/Flask REST APIs for e-commerce data processing, 40% faster responses.',
      'Serverless pipelines on AWS Lambda and API Gateway with SQS and SNS.',
    ],
    sky: 0xa9d4f5,
  },
  {
    id: 'move', short: 'To the US', at: 4.5, kind: 'none',
    when: '2021', title: 'Next stop: grad school in the US',
    where: 'Crossing over to Oregon',
    body: 'Packed up and headed to Corvallis for a master’s in Computer Science.',
    sky: 0x9ccbf2,
  },
  {
    id: 'osu', short: 'Oregon State', at: 6, kind: 'campus', color: 0xb5523b, chip: '#D73F09',
    when: 'Sep 2021 – Jun 2023 · Corvallis, OR', title: 'MS Computer Science, minor in AI',
    where: 'Oregon State University · Graduate Research Assistant',
    list: [
      'Built an OpenCV road cross-section analysis tool; deployed its ML models on SageMaker and Vertex AI.',
      'FastAPI APIs that cut data retrieval time by 40%.',
      'Transportation web app with OAuth2, API Gateway and Power BI/Tableau dashboards.',
    ],
    sky: 0x9fd0e8,
  },
  {
    id: 'microsoft', short: 'Microsoft', at: 7, kind: 'glass', color: 0x3ba7d9, chip: '#0A84D0',
    when: 'Aug 2023 – Jun 2025', title: 'Software Engineer',
    where: 'Microsoft',
    list: [
      'Integrated Azure OpenAI for multi-turn Q&A, intent detection and summarization.',
      'REST and GraphQL APIs with 35% lower latency.',
      'NLP microservices on AKS; Kafka and Event Hubs pipelines, 50% more efficient.',
    ],
    sky: 0xb7d3f0,
  },
  {
    id: 'jpm', short: 'J.P. Morgan', at: 8, kind: 'bank', color: 0x2c3e66, chip: '#3A5BA0',
    when: 'Jul 2025 – now · Houston, TX', title: 'Software Engineer',
    where: 'J.P. Morgan · network automation',
    list: [
      'Built and maintain the Executor Microservice: a Python, FastAPI and Kafka workflow engine with 15+ connectors.',
      'Traced a proxy-alert flood to one root cause and closed 1,500 ServiceNow incidents.',
      'Drove team-wide GitHub Copilot adoption with repo-level guardrails and MCP integrations.',
    ],
    sky: 0xf2b38c,
  },
  {
    id: 'next', short: 'Next', at: 9, kind: 'next', color: 0x7a5cff, chip: '#7A5CFF',
    when: 'What’s next', title: 'Let’s build something.',
    where: 'Open to Python backend, network automation and AI engineering roles',
    body: 'Houston or remote in the US.',
    cta: true,
    sky: 0x7d6fb0,
  },
];

// Road control points (x, z). Index matches CHAPTERS[].at.
const ROAD = [
  [0, 14], [0, 0], [16, -34], [-8, -68], [0, -96], [0, -134],
  [-16, -164], [12, -198], [-10, -232], [0, -262], [0, -276],
];
const OCEAN = { zFrom: -100, zTo: -130 };

// ─── DOM ────────────────────────────────────────────────────────────
const cardsEl = document.getElementById('cards');
const railEl = document.getElementById('rail');
const trackEl = document.getElementById('track');
const barEl = document.getElementById('bar');
const hintEl = document.getElementById('hint');

function esc(s) {
  return s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

CHAPTERS.forEach((c, i) => {
  const card = document.createElement('article');
  card.className = 'card glass' + (c.intro ? ' intro' : '');
  card.id = 'card-' + c.id;
  if (c.chip) card.style.setProperty('--chip', c.chip);
  card.innerHTML =
    `<div class="when">${esc(c.when)}</div>` +
    `<h2>${esc(c.title)}</h2>` +
    `<p class="where">${esc(c.where)}</p>` +
    (c.body ? `<p>${esc(c.body)}</p>` : '') +
    (c.list ? `<ul>${c.list.map(l => `<li>${esc(l)}</li>`).join('')}</ul>` : '') +
    (c.cta ? `<div class="actions">
        <a class="p-button p-button-primary p-button-touch-large" href="mailto:vishalkurre2811@gmail.com">Email me</a>
        <a class="p-button p-button-secondary p-button-touch-large" href="https://www.linkedin.com/in/vishal-pradh/" target="_blank" rel="noopener">LinkedIn</a>
        <a class="p-button p-button-tinted p-button-touch-large" href="../">Portfolio</a>
      </div>` : '');
  cardsEl.appendChild(card);

  const b = document.createElement('button');
  b.innerHTML = `<span class="dot"></span><span class="label">${esc(c.short)}</span>`;
  b.setAttribute('aria-label', c.short);
  b.addEventListener('click', () => scrollToChapter(i));
  railEl.appendChild(b);
});

// ─── WebGL check ────────────────────────────────────────────────────
const canvas = document.getElementById('scene');
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
} catch (e) {
  document.body.classList.add('no-webgl');
  throw e;
}
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
const skyColor = new THREE.Color(CHAPTERS[0].sky);
scene.background = skyColor;
scene.fog = new THREE.Fog(skyColor, 40, 140);

const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 400);

// Lights
const hemi = new THREE.HemisphereLight(0xffffff, 0x6b8f5a, 1.1);
scene.add(hemi);
const sun = new THREE.DirectionalLight(0xffffff, 1.6);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -30, right: 30, top: 30, bottom: -30, near: 1, far: 120 });
scene.add(sun, sun.target);

const mat = (color, opts = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.85, ...opts });

// ─── Road ───────────────────────────────────────────────────────────
const curve = new THREE.CatmullRomCurve3(ROAD.map(([x, z]) => new THREE.Vector3(x, 0, z)), false, 'centripetal');
const SAMPLES = 800;
const samplePts = curve.getSpacedPoints(SAMPLES);

// t on the curve for a fractional ROAD index (e.g. 4.5 = between points 4 and 5)
function tForIndex(idx) {
  const a = ROAD[Math.floor(idx)], b = ROAD[Math.min(Math.ceil(idx), ROAD.length - 1)];
  const f = idx - Math.floor(idx);
  const target = new THREE.Vector3(a[0] + (b[0] - a[0]) * f, 0, a[1] + (b[1] - a[1]) * f);
  let best = 0, bestD = Infinity;
  samplePts.forEach((p, i) => { const d = p.distanceToSquared(target); if (d < bestD) { bestD = d; best = i; } });
  return best / SAMPLES;
}
CHAPTERS.forEach(c => { c.t = tForIndex(c.at); });
CHAPTERS[0].t = 0;

const inOcean = z => z < OCEAN.zFrom && z > OCEAN.zTo;

// Ground and ocean
const ground = new THREE.Mesh(new THREE.PlaneGeometry(600, 600), mat(0x8cc47a));
ground.rotation.x = -Math.PI / 2;
ground.position.set(0, 0, -130);
ground.receiveShadow = true;
scene.add(ground);

const ocean = new THREE.Mesh(
  new THREE.PlaneGeometry(600, OCEAN.zFrom - OCEAN.zTo),
  mat(0x3d8fd1, { roughness: 0.25, metalness: 0.1 })
);
ocean.rotation.x = -Math.PI / 2;
ocean.position.set(0, 0.03, (OCEAN.zFrom + OCEAN.zTo) / 2);
ocean.receiveShadow = true;
scene.add(ocean);

// Road ribbon
function ribbon(width, y, color) {
  const pos = [], idx = [];
  const up = new THREE.Vector3(0, 1, 0);
  samplePts.forEach((p, i) => {
    const tan = curve.getTangentAt(i / SAMPLES);
    const side = new THREE.Vector3().crossVectors(up, tan).normalize().multiplyScalar(width / 2);
    pos.push(p.x + side.x, y, p.z + side.z, p.x - side.x, y, p.z - side.z);
    if (i < SAMPLES) { const k = i * 2; idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); }
  });
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  const m = new THREE.Mesh(g, mat(color, { side: THREE.DoubleSide }));
  m.receiveShadow = true;
  return m;
}
scene.add(ribbon(4.2, 0.06, 0xe9dcc4));   // path
scene.add(ribbon(0.18, 0.08, 0xffffff));  // centre line

// Bridge rails over the ocean
{
  const postGeo = new THREE.BoxGeometry(0.2, 0.9, 0.2);
  const postMat = mat(0x8a6a4a);
  const up = new THREE.Vector3(0, 1, 0);
  for (let i = 0; i <= SAMPLES; i += 4) {
    const p = samplePts[i];
    if (!inOcean(p.z)) continue;
    const tan = curve.getTangentAt(i / SAMPLES);
    const side = new THREE.Vector3().crossVectors(up, tan).normalize().multiplyScalar(2.3);
    [1, -1].forEach(s => {
      const post = new THREE.Mesh(postGeo, postMat);
      post.position.set(p.x + side.x * s, 0.5, p.z + side.z * s);
      post.castShadow = true;
      scene.add(post);
    });
  }
}

// ─── Labels ─────────────────────────────────────────────────────────
const labels = [];
function label(title, sub, accent = '#007AFF') {
  const c = document.createElement('canvas');
  c.width = 640; c.height = 200;
  const g = c.getContext('2d');
  g.fillStyle = 'rgba(255,255,255,0.92)';
  g.beginPath(); g.roundRect(10, 10, 620, 180, 40); g.fill();
  g.fillStyle = accent;
  g.beginPath(); g.roundRect(10, 10, 16, 180, [40, 0, 0, 40]); g.fill();
  g.fillStyle = '#1d1d1f';
  g.font = '600 64px -apple-system, Helvetica, Arial, sans-serif';
  g.fillText(title, 56, 95);
  g.fillStyle = '#6e6e73';
  g.font = '400 40px -apple-system, Helvetica, Arial, sans-serif';
  g.fillText(sub, 56, 150);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthWrite: false }));
  s.scale.set(9, 2.8, 1);
  labels.push(s);
  return s;
}

// ─── Buildings ──────────────────────────────────────────────────────
function box(w, h, d, color, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color));
  m.position.set(x, y + h / 2, z);
  m.castShadow = m.receiveShadow = true;
  return m;
}
function windows(group, w, h, z, rows, cols, y0, color = 0xcfe8ff) {
  const wm = mat(color, { emissive: 0x223344, emissiveIntensity: 0.15, roughness: 0.3 });
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const win = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.6 / cols, h * 0.5 / rows), wm);
    win.position.set(-w / 2 + (c + 0.5) * w / cols, y0 + (r + 0.5) * h / rows, z + 0.01);
    group.add(win);
  }
}

const BUILD = {
  college(c) {
    const g = new THREE.Group();
    g.add(box(10, 4, 6, c.color));
    g.add(box(11, 0.6, 7, 0xf2e6d0, 0, 4));
    for (let i = -2; i <= 2; i++) {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 4, 12), mat(0xf7f0e2));
      col.position.set(i * 2, 2, 3.4); col.castShadow = true; g.add(col);
    }
    const roof = new THREE.Mesh(new THREE.ConeGeometry(4.5, 2, 4), mat(0xa0522d));
    roof.position.set(0, 5.6, 0); roof.rotation.y = Math.PI / 4; roof.scale.z = 0.6; roof.castShadow = true;
    g.add(roof);
    return g;
  },
  startup(c) {
    const g = new THREE.Group();
    g.add(box(6, 5, 5, 0xf3ede4));
    g.add(box(6.4, 0.5, 5.4, c.color, 0, 5));
    windows(g, 6, 5, 2.5, 2, 3, 0.4);
    g.add(box(1.2, 2, 0.2, 0x5a4636, 0, 0, 2.55));
    return g;
  },
  warehouse(c) {
    const g = new THREE.Group();
    g.add(box(14, 4.5, 7, 0xd8d4cc));
    g.add(box(14.2, 0.8, 7.2, c.color, 0, 4.5));
    for (let i = -2; i <= 2; i++) g.add(box(2, 2.6, 0.2, 0x8e8a83, i * 2.6, 0, 3.55));
    return g;
  },
  campus(c) {
    const g = new THREE.Group();
    g.add(box(12, 5, 6, c.color));
    g.add(box(12.4, 0.5, 6.4, 0xe8dcc8, 0, 5));
    windows(g, 12, 5, 3, 2, 6, 0.5, 0xfff1d6);
    const tower = box(2.6, 10, 2.6, c.color, 0, 0, 0);
    tower.position.y = 5; g.add(tower);
    const clock = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.15, 24), mat(0xffffff));
    clock.rotation.x = Math.PI / 2; clock.position.set(0, 8.2, 1.36); g.add(clock);
    const cap = new THREE.Mesh(new THREE.ConeGeometry(2.1, 2.6, 4), mat(0xd73f09));
    cap.position.set(0, 11.3, 0); cap.rotation.y = Math.PI / 4; cap.castShadow = true; g.add(cap);
    return g;
  },
  glass(c) {
    const g = new THREE.Group();
    const gm = (h, x, z) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(3.6, h, 3.6),
        mat(c.color, { roughness: 0.15, metalness: 0.4, transparent: true, opacity: 0.92 }));
      m.position.set(x, h / 2, z); m.castShadow = true; g.add(m);
      for (let y = 1.5; y < h; y += 1.5) g.add(box(3.7, 0.08, 3.7, 0xe6f4fb, x, y, z));
    };
    gm(14, -2.2, 0); gm(10, 2.2, 0.6); gm(7, 0, 3.4);
    return g;
  },
  bank(c) {
    const g = new THREE.Group();
    g.add(box(8, 3, 6, 0xe8e4dc));
    for (let i = -3; i <= 3; i++) {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 3, 12), mat(0xf5f3ef));
      col.position.set(i * 1.1, 1.5, 3.3); col.castShadow = true; g.add(col);
    }
    const t = new THREE.Mesh(new THREE.BoxGeometry(5, 18, 5), mat(c.color, { roughness: 0.3, metalness: 0.3 }));
    t.position.set(0, 12, -0.5); t.castShadow = true; g.add(t);
    for (let y = 4; y < 21; y += 1.2) g.add(box(5.1, 0.12, 5.1, 0x9fb4d9, 0, y, -0.5));
    g.add(box(1.6, 2, 1.6, 0x9fb4d9, 0, 21, -0.5));
    return g;
  },
  next(c) {
    const g = new THREE.Group();
    const arch = new THREE.Mesh(new THREE.TorusGeometry(3.2, 0.35, 12, 40, Math.PI), mat(c.color, { emissive: c.color, emissiveIntensity: 0.25 }));
    arch.position.y = 0.2; arch.castShadow = true; g.add(arch);
    const glow = new THREE.Mesh(new THREE.CircleGeometry(3, 40, 0, Math.PI), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35 }));
    glow.position.y = 0.2; g.add(glow);
    g.userData.spin = arch;
    return g;
  },
};

const up = new THREE.Vector3(0, 1, 0);
const animated = [];
CHAPTERS.forEach((c, i) => {
  if (!c.kind || c.kind === 'none') return;
  const p = curve.getPointAt(c.t);
  const tan = curve.getTangentAt(c.t);
  const sideSign = c.kind === 'next' ? 0 : (i % 2 ? 1 : -1);
  const side = new THREE.Vector3().crossVectors(up, tan).normalize();
  const b = BUILD[c.kind](c);
  if (c.kind === 'next') {
    b.position.copy(p).add(tan.clone().multiplyScalar(6));
    b.lookAt(p);
  } else {
    b.position.copy(p).add(side.clone().multiplyScalar(sideSign * 11));
    b.lookAt(p.x, 0, p.z); // face the road
  }
  scene.add(b);
  c.bpos = b.position.clone();
  c.bh = { bank: 12, glass: 8, campus: 6, next: 2.5 }[c.kind] || 3;
  if (b.userData.spin) animated.push(b.userData.spin);

  const l = label(c.short === 'BTech' ? 'BTech · India' : c.short, c.when.split(' · ')[0], c.chip);
  l.position.copy(b.position).add(new THREE.Vector3(0, c.kind === 'bank' ? 24 : c.kind === 'glass' ? 16.5 : c.kind === 'campus' ? 14 : 9, 0));
  if (c.kind === 'next') l.position.y = 7.5;
  scene.add(l);
});

// "Off to Oregon" sign floating over the bridge
{
  const c = CHAPTERS.find(x => x.id === 'move');
  const s = label('Off to Oregon', '2021', '#0A84FF');
  const p = curve.getPointAt(c.t);
  s.position.set(p.x, 7.5, p.z - 12); // over the bridge, just ahead of the stop
  scene.add(s);
}

// Little plane looping over the ocean
const plane = new THREE.Group();
{
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.35, 2.2, 6, 12), mat(0xffffff));
  body.rotation.z = Math.PI / 2; plane.add(body);
  const wing = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.08, 3.6), mat(0x0a84ff)); plane.add(wing);
  const tail = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.8, 0.08), mat(0x0a84ff)); tail.position.set(-1.2, 0.4, 0); plane.add(tail);
  plane.traverse(o => { o.castShadow = true; });
  scene.add(plane);
}

// ─── Scenery ────────────────────────────────────────────────────────
function nearRoad(x, z, r) {
  for (let i = 0; i <= SAMPLES; i += 8) {
    const p = samplePts[i];
    if ((p.x - x) ** 2 + (p.z - z) ** 2 < r * r) return true;
  }
  return false;
}
const buildingSpots = CHAPTERS.filter(c => c.kind && c.kind !== 'none').map(c => {
  const p = curve.getPointAt(c.t); return p;
});
{
  const trunkGeo = new THREE.CylinderGeometry(0.18, 0.25, 1.2, 6);
  const leafGeo = new THREE.ConeGeometry(1.1, 2.6, 7);
  const trunkMat = mat(0x7a5a3a);
  const leafMats = [mat(0x3f8f4f), mat(0x4fa35c), mat(0x2f7a43)];
  let rnd = 7;
  const rand = () => (rnd = (rnd * 16807) % 2147483647) / 2147483647;
  for (let n = 0; n < 420; n++) {
    const x = (rand() - 0.5) * 120, z = 20 - rand() * 300;
    if (inOcean(z) || z > OCEAN.zFrom + 4 && z < OCEAN.zFrom + 0 || nearRoad(x, z, 4.5)) continue;
    if (inOcean(z + 3) || inOcean(z - 3)) continue;
    if (buildingSpots.some(p => (p.x - x) ** 2 + (p.z - z) ** 2 < 17 ** 2)) continue;
    const t = new THREE.Group();
    const trunk = new THREE.Mesh(trunkGeo, trunkMat); trunk.position.y = 0.6;
    const leaf = new THREE.Mesh(leafGeo, leafMats[n % 3]); leaf.position.y = 2.4;
    trunk.castShadow = leaf.castShadow = true;
    t.add(trunk, leaf);
    const s = 0.7 + rand() * 0.9;
    t.scale.set(s, s, s);
    t.position.set(x, 0, z);
    scene.add(t);
  }
}
const clouds = [];
{
  const cm = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, transparent: true, opacity: 0.92 });
  for (let n = 0; n < 22; n++) {
    const c = new THREE.Group();
    for (let k = 0; k < 4; k++) {
      const s = new THREE.Mesh(new THREE.SphereGeometry(1.4 + Math.random() * 1.2, 10, 8), cm);
      s.position.set(k * 1.6 - 2.4, Math.random() * 0.6, Math.random() * 0.8);
      c.add(s);
    }
    c.position.set((Math.random() - 0.5) * 140, 22 + Math.random() * 10, 10 - Math.random() * 290);
    clouds.push(c);
    scene.add(c);
  }
}

// ─── Avatar ─────────────────────────────────────────────────────────
function makeAvatar() {
  const g = new THREE.Group();
  const skin = mat(0xc68863), shirt = mat(0x2f6fed), pants = mat(0x2b2f3a), hair = mat(0x1b1b1b), shoe = mat(0x16161a);
  const part = (geo, m, x, y, z, parent = g) => {
    const mesh = new THREE.Mesh(geo, m); mesh.position.set(x, y, z); mesh.castShadow = true; parent.add(mesh); return mesh;
  };
  part(new THREE.CapsuleGeometry(0.34, 0.55, 6, 14), shirt, 0, 1.3, 0);              // torso
  part(new THREE.CylinderGeometry(0.11, 0.11, 0.18, 10), skin, 0, 1.78, 0);           // neck
  const head = part(new THREE.SphereGeometry(0.3, 20, 16), skin, 0, 2.05, 0);         // head
  const hairCap = part(new THREE.SphereGeometry(0.315, 20, 16, 0, Math.PI * 2, 0, Math.PI / 2.1), hair, 0, 2.08, -0.01);
  hairCap.rotation.x = -0.25;
  [-0.1, 0.1].forEach(x => part(new THREE.SphereGeometry(0.035, 8, 6), mat(0x111111), x, 2.08, 0.27)); // eyes
  part(new THREE.BoxGeometry(0.42, 0.5, 0.2), mat(0x1f3b70), 0, 1.35, -0.38);         // backpack

  const limb = (x, y, len, r, m, footM) => {
    const pivot = new THREE.Group(); pivot.position.set(x, y, 0); g.add(pivot);
    part(new THREE.CapsuleGeometry(r, len, 4, 10), m, 0, -len / 2 - r, 0, pivot);
    if (footM) part(new THREE.BoxGeometry(0.2, 0.12, 0.34), footM, 0, -len - r * 2 + 0.02, 0.06, pivot);
    return pivot;
  };
  const lLeg = limb(-0.15, 0.95, 0.55, 0.12, pants, shoe);
  const rLeg = limb(0.15, 0.95, 0.55, 0.12, pants, shoe);
  const lArm = limb(-0.45, 1.62, 0.5, 0.095, shirt);
  const rArm = limb(0.45, 1.62, 0.5, 0.095, shirt);
  // hands
  [lArm, rArm].forEach(a => part(new THREE.SphereGeometry(0.1, 10, 8), skin, 0, -0.76, 0, a));
  return { g, head, lLeg, rLeg, lArm, rArm };
}
const avatar = makeAvatar();
scene.add(avatar.g);

// Ground shadow blob for soft contact
const blob = new THREE.Mesh(new THREE.CircleGeometry(0.6, 24), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.18, depthWrite: false }));
blob.rotation.x = -Math.PI / 2;
scene.add(blob);

// ─── Scroll → progress ──────────────────────────────────────────────
const SCROLL_PER_CHAPTER = 1.1; // viewport heights
function layoutTrack() {
  trackEl.style.height = `${(CHAPTERS.length - 1) * SCROLL_PER_CHAPTER * 100 + 100}vh`;
}
layoutTrack();
const maxScroll = () => Math.max(1, document.documentElement.scrollHeight - innerHeight);

// Map scroll fraction to curve t so each chapter gets an equal share of scrolling,
// with a short dwell at every stop so the card can be read.
const stops = CHAPTERS.map(c => c.t);
function scrollToT(f) {
  const seg = (CHAPTERS.length - 1) * f;
  const i = Math.min(Math.floor(seg), CHAPTERS.length - 2);
  let k = seg - i;
  const dwell = 0.22; // fraction of each segment spent standing at a stop
  k = k < dwell ? 0 : (k - dwell) / (1 - dwell);
  k = k * k * (3 - 2 * k); // ease in and out between stops
  return stops[i] + (stops[i + 1] - stops[i]) * k;
}
function scrollToChapter(i) {
  const f = i / (CHAPTERS.length - 1);
  window.scrollTo({ top: f * maxScroll(), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
}

// ─── Loop ───────────────────────────────────────────────────────────
let tNow = 0, phase = 0, activeIdx = -1;
const camPos = new THREE.Vector3(0, 6, 24);
const camLook = new THREE.Vector3();
const skyA = new THREE.Color(), skyB = new THREE.Color();
const clock = new THREE.Clock();

function resize() {
  const w = innerWidth, h = innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.fov = w < 720 ? 62 : 50;
  camera.updateProjectionMatrix();
}
addEventListener('resize', () => { resize(); layoutTrack(); });
resize();

function frame() {
  const dt = Math.min(clock.getDelta(), 0.05);
  const f = Math.min(1, Math.max(0, scrollY / maxScroll()));
  const target = scrollToT(f);
  const prev = tNow;
  tNow += (target - tNow) * Math.min(1, dt * 3.2);
  if (Math.abs(target - tNow) < 1e-5) tNow = target;
  const speed = Math.abs(tNow - prev) / Math.max(dt, 1e-3); // t per second

  // Avatar on the road
  const p = curve.getPointAt(Math.min(tNow, 0.9999));
  const tan = curve.getTangentAt(Math.min(tNow, 0.9999));
  const walking = Math.min(1, speed * 40);
  phase += dt * (4 + speed * 260);
  const swing = Math.sin(phase) * 0.7 * walking;
  avatar.lLeg.rotation.x = swing;
  avatar.rLeg.rotation.x = -swing;
  avatar.lArm.rotation.x = -swing * 0.8;
  avatar.rArm.rotation.x = swing * 0.8;
  const idle = Math.sin(clock.elapsedTime * 2) * 0.02 * (1 - walking);
  avatar.g.position.set(p.x, 0.1 + Math.abs(Math.sin(phase)) * 0.08 * walking + idle, p.z);
  // Nearest stop and how strongly we are "at" it (0 walking between, 1 standing there)
  let near = 0, nd = Infinity;
  CHAPTERS.forEach((c, j) => { const d = Math.abs(c.t - tNow); if (d < nd) { nd = d; near = j; } });
  const stopC = CHAPTERS[near];
  const atStop = stopC.bpos ? Math.max(0, 1 - nd / 0.035) ** 2 : 0;
  const toB = stopC.bpos ? new THREE.Vector3(stopC.bpos.x - p.x, 0, stopC.bpos.z - p.z).normalize() : tan.clone();

  // Face direction of travel (backwards when scrolling up), turning toward the building at a stop
  const dir = target >= tNow - 1e-4 ? 1 : -1;
  const face = tan.clone().multiplyScalar(dir).lerp(toB, atStop * 0.85).normalize();
  avatar.g.lookAt(p.x + face.x, avatar.g.position.y, p.z + face.z);
  blob.position.set(p.x, 0.09, p.z);

  // Camera: behind and above while walking; over the shoulder toward the building at a stop
  const narrow = innerWidth < 720;
  const back = tan.clone().multiplyScalar(-10);
  const side = new THREE.Vector3().crossVectors(up, tan).normalize().multiplyScalar(4);
  const walkPos = new THREE.Vector3(p.x + back.x + side.x, 6.5, p.z + back.z + side.z);
  const walkLook = new THREE.Vector3(p.x + tan.x * 6, 2.2, p.z + tan.z * 6);
  let wantPos = walkPos, wantLook = walkLook;
  if (atStop > 0) {
    const across = new THREE.Vector3().crossVectors(up, toB).multiplyScalar(narrow ? 2.5 : 5);
    // Phone: the card covers the lower half, so aim below the scene to lift it into the top half
    const dist = narrow ? 22 + stopC.bh * 1.1 : 13 + stopC.bh * 1.0;
    const camY = narrow ? 9 + stopC.bh * 0.5 : 6 + stopC.bh * 0.45;
    const stopPos = new THREE.Vector3(p.x - toB.x * dist + across.x, camY, p.z - toB.z * dist + across.z);
    const stopLook = new THREE.Vector3(
      (p.x + stopC.bpos.x) / 2, narrow ? -4 : stopC.bh * 0.8, (p.z + stopC.bpos.z) / 2
    );
    wantPos = walkPos.clone().lerp(stopPos, atStop);
    wantLook = walkLook.clone().lerp(stopLook, atStop);
  }
  // Catch up faster when far behind (e.g. after jumping chapters from the rail)
  camPos.lerp(wantPos, Math.min(1, dt * (2.5 + camPos.distanceTo(wantPos) * 0.15)));
  camera.position.copy(camPos);
  camLook.lerp(wantLook, Math.min(1, dt * (3 + camLook.distanceTo(wantLook) * 0.15)));
  camera.lookAt(camLook);

  // Sun follows the avatar so shadows stay sharp
  sun.position.set(p.x + 18, 30, p.z + 12);
  sun.target.position.set(p.x, 0, p.z);

  // Sky: blend between chapter colours
  let i = 0;
  while (i < CHAPTERS.length - 2 && tNow > CHAPTERS[i + 1].t) i++;
  const span = CHAPTERS[i + 1].t - CHAPTERS[i].t || 1;
  const k = Math.min(1, Math.max(0, (tNow - CHAPTERS[i].t) / span));
  skyA.setHex(CHAPTERS[i].sky); skyB.setHex(CHAPTERS[i + 1].sky);
  scene.background.copy(skyA).lerp(skyB, k);
  scene.fog.color.copy(scene.background);

  // Card for the nearest stop, shown only when close
  const show = nd < 0.025 ? near : -1;
  if (show !== activeIdx) {
    activeIdx = show;
    cardsEl.querySelectorAll('.card').forEach((el, j) => el.classList.toggle('show', j === show));
  }
  railEl.querySelectorAll('button').forEach((b, j) => b.classList.toggle('active', j === near));
  barEl.style.width = (f * 100).toFixed(1) + '%';
  hintEl.style.opacity = f > 0.02 ? 0 : 1;

  // Fade labels that are right next to the camera
  labels.forEach(l => { l.material.opacity = Math.min(1, Math.max(0, (l.position.distanceTo(camera.position) - 9) / 8)); });

  // Ambient motion
  const time = clock.elapsedTime;
  clouds.forEach((c, j) => { c.position.x += dt * (0.4 + (j % 3) * 0.2); if (c.position.x > 80) c.position.x = -80; });
  animated.forEach(a => { a.material.emissiveIntensity = 0.25 + Math.sin(time * 2) * 0.15; });
  const oz = (OCEAN.zFrom + OCEAN.zTo) / 2;
  plane.position.set(Math.cos(time * 0.4) * 22, 12 + Math.sin(time) * 0.5, oz + Math.sin(time * 0.4) * 10);
  plane.rotation.y = -time * 0.4 + Math.PI;
  plane.rotation.x = 0.25;

  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
