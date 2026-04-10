const state = {
  currentUser: "我（示例）",
  q: "",
  cat: "全部",
  selectedId: null,
  carouselIndex: 0,
  messagesByItemId: {},
  items: [
    {
      id: "i-001",
      title: "高数教材（上册）",
      category: "书籍",
      image: "./高数教材.avif",
      price: 12,
      condition: "九成新",
      location: "图书馆门口",
      time: "2026-04-10 10:05",
      seller: "同学A",
      contact: "wx: math-123",
      desc: "基本无笔记，封面轻微磨损。"
    },
    {
      id: "i-002",
      title: "有线键盘（静音）",
      category: "数码",
      image: "./有线键盘.webp",
      price: 0,
      condition: "八成新",
      location: "二教一楼",
      time: "2026-04-10 09:30",
      seller: "同学B",
      contact: "QQ: 987654",
      desc: "功能正常，换新键盘后闲置。"
    },
    {
      id: "i-003",
      title: "小台灯（可调亮度）",
      category: "生活用品",
      image: "./小台灯.jpg",
      price: 15,
      condition: "九成新",
      location: "宿舍楼下快递点",
      time: "2026-04-09 21:10",
      seller: "同学C",
      contact: "wx: lamp-456",
      desc: "学习用台灯，灯罩无破损。"
    },
    {
      id: "i-004",
      title: "口红（全新未拆）",
      category: "美妆",
      image: "./口红.jpg",
      price: 30,
      condition: "全新",
      location: "一食堂门口",
      time: "2026-04-09 18:40",
      seller: "同学D",
      contact: "wx: beauty-888",
      desc: "颜色不适合，未拆封。"
    },
    {
      id: "i-005",
      title: "U 盘 32G",
      category: "数码",
      image: "./U盘.jpg",
      price: 10,
      condition: "九成新",
      location: "机房门口",
      time: "2026-04-09 12:15",
      seller: "同学E",
      contact: "tel: 138****0000",
      desc: "读取写入正常，外壳有轻微划痕。"
    },
    {
      id: "i-006",
      title: "宿舍收纳箱（大号）",
      category: "生活用品",
      image: "./收纳箱.jpg",
      price: 8,
      condition: "八成新",
      location: "北门",
      time: "2026-04-08 20:30",
      seller: "同学F",
      contact: "wx: box-777",
      desc: "可叠放，适合放衣物。"
    }
  ]
};

const el = {
  q: document.getElementById("q"),
  btnSearch: document.getElementById("btnSearch"),
  btnReset: document.getElementById("btnReset"),
  chips: Array.from(document.querySelectorAll(".chip")),
  latestList: document.getElementById("latestList"),
  hotList: document.getElementById("hotList"),
  detail: document.getElementById("detail"),
  detailGrid: document.getElementById("detailGrid"),
  btnCloseDetail: document.getElementById("btnCloseDetail"),
  btnBackTop: document.getElementById("btnBackTop"),
  btnShowContact: document.getElementById("btnShowContact"),
  contact: document.getElementById("contact"),
  contactValue: document.getElementById("contactValue"),
  btnCopyContact: document.getElementById("btnCopyContact"),
  btnGoPublish: document.getElementById("btnGoPublish"),
  btnFloatPublish: document.getElementById("btnFloatPublish"),
  btnFloatTop: document.getElementById("btnFloatTop"),
  publishForm: document.getElementById("publishForm"),
  fCategory: document.getElementById("fCategory"),
  fTitle: document.getElementById("fTitle"),
  fPrice: document.getElementById("fPrice"),
  fCondition: document.getElementById("fCondition"),
  fLocation: document.getElementById("fLocation"),
  fContact: document.getElementById("fContact"),
  fDesc: document.getElementById("fDesc"),
  fImage: document.getElementById("fImage"),
  btnFillDemo: document.getElementById("btnFillDemo"),
  btnPrev: document.getElementById("btnPrev"),
  btnNext: document.getElementById("btnNext"),
  carouselTag: document.getElementById("carouselTag"),
  carouselTitle: document.getElementById("carouselTitle"),
  carouselDesc: document.getElementById("carouselDesc"),
  btnGoHot: document.getElementById("btnGoHot"),
  btnGoLatest: document.getElementById("btnGoLatest")
};

el.message = document.getElementById("message");
el.messageHint = document.getElementById("messageHint");
el.messageList = document.getElementById("messageList");
el.messageForm = document.getElementById("messageForm");
el.messageInput = document.getElementById("messageInput");

el.currentUserName = document.getElementById("currentUserName");
el.myList = document.getElementById("myList");

function formatPrice(price) {
  if (price === 0) return { text: "免费", free: true };
  return { text: `¥${price}`, free: false };
}

function itemMatches(item) {
  const q = state.q.trim().toLowerCase();
  const hitQ = !q || [item.title, item.category, item.location, item.condition].some(v => String(v).toLowerCase().includes(q));
  const hitCat = state.cat === "全部" || item.category === state.cat;
  const active = item.active !== false;
  return active && hitQ && hitCat;
}

function sortLatest(items) {
  // 简化：按 time 字符串倒序
  return [...items].sort((a, b) => (a.time < b.time ? 1 : -1));
}

function sortHot(items) {
  // 演示：按价格（免费优先）+ 最近程度混合，便于展示
  return [...items].sort((a, b) => {
    const af = a.price === 0 ? 1 : 0;
    const bf = b.price === 0 ? 1 : 0;
    if (af !== bf) return bf - af;
    if (a.time !== b.time) return a.time < b.time ? 1 : -1;
    return (a.price || 999) - (b.price || 999);
  });
}

function renderCard(item, { hot = false } = {}) {
  const price = formatPrice(item.price);
  const pillClass = price.free ? "pill pill--free" : "pill";
  const hotPill = hot ? `<span class="pill pill--hot">热门</span>` : "";

  const thumb = item.image
    ? `<img class="thumb__img" src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" loading="lazy" />`
    : `<div class="thumb__fallback" aria-hidden="true">${escapeHtml(item.category)}</div>`;

  return `
    <article class="card" role="button" tabindex="0" data-id="${item.id}" aria-label="查看物品详情：${escapeHtml(item.title)}">
      <div class="thumb">${thumb}</div>
      <div class="meta">
        <div class="title">${escapeHtml(item.title)}</div>
        <div class="row">
          <span class="${pillClass}">${escapeHtml(price.text)}</span>
          ${hotPill}
          <span class="pill">${escapeHtml(item.condition)}</span>
          <span class="pill">${escapeHtml(item.location)}</span>
        </div>
        <div class="row">
          <span>发布：${escapeHtml(item.time)}</span>
          <span>卖家：${escapeHtml(item.seller)}</span>
        </div>
      </div>
    </article>
  `;
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatTime(d) {
  const pad = (x) => String(x).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function getMessages(itemId) {
  const list = state.messagesByItemId[itemId];
  return Array.isArray(list) ? list : [];
}

function renderMessages() {
  if (!state.selectedId) {
    el.message.hidden = true;
    return;
  }

  el.message.hidden = false;
  const list = getMessages(state.selectedId);
  el.messageHint.textContent = `当前物品留言（${list.length}）`;

  el.messageList.innerHTML = list.length
    ? list.map(m => {
      return `
        <div class="message__item" role="listitem" aria-label="留言">
          <div class="message__meta">
            <span>${escapeHtml(m.author || "匿名")}</span>
            <span>${escapeHtml(m.time || "")}</span>
          </div>
          <div class="message__text">${escapeHtml(m.text || "")}</div>
        </div>
      `;
    }).join("")
    : `<div class="message__empty">还没有留言，来写第一条吧。</div>`;
}

function addMessageFromForm() {
  if (!state.selectedId) return;
  const text = String(el.messageInput.value || "").trim();
  if (!text) return;

  const list = getMessages(state.selectedId);
  list.unshift({
    id: `m-${Math.random().toString(16).slice(2, 8)}`,
    text,
    time: formatTime(new Date()),
    author: "我（示例）"
  });
  state.messagesByItemId[state.selectedId] = list;

  el.messageForm.reset();
  renderMessages();
  el.message.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function renderLists() {
  const filtered = state.items.filter(itemMatches);
  const latest = sortLatest(filtered);
  const hot = sortHot(filtered);

  el.latestList.innerHTML = latest.length
    ? latest.map(i => renderCard(i)).join("")
    : `<div style="color: var(--muted); font-size: 13px;">没有匹配的物品，换个关键词或分类试试。</div>`;

  el.hotList.innerHTML = hot.length
    ? hot.slice(0, 6).map(i => renderCard(i, { hot: true })).join("")
    : `<div style="color: var(--muted); font-size: 13px;">没有匹配的推荐内容。</div>`;

  wireCardHandlers();
}

function renderMyList() {
  if (!el.myList) return;
  const mine = state.items
    .filter(i => i.seller === state.currentUser)
    .sort((a, b) => (a.time < b.time ? 1 : -1));

  el.myList.innerHTML = mine.length
    ? mine.map(i => renderMyCard(i)).join("")
    : `<div style="color: var(--muted); font-size: 13px;">暂无我的发布。你可以在下方“发布闲置”里提交一条试试。</div>`;

  wireMyHandlers();
}

function renderMyCard(item) {
  const price = formatPrice(item.price);
  const pillClass = price.free ? "pill pill--free" : "pill";
  const off = item.active === false;
  const statusPill = off ? `<span class="pill pill--off">已下架</span>` : `<span class="pill">已上架</span>`;

  const thumb = item.image
    ? `<img class="thumb__img" src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" loading="lazy" />`
    : `<div class="thumb__fallback" aria-hidden="true">${escapeHtml(item.category)}</div>`;

  const downBtn = off
    ? `<button class="btn btn--sm" type="button" disabled aria-disabled="true">已下架</button>`
    : `<button class="btn btn--danger btn--sm" type="button" data-act="down" data-id="${item.id}">下架</button>`;

  return `
    <article class="card" data-id="${item.id}" aria-label="我的发布：${escapeHtml(item.title)}">
      <div class="thumb">${thumb}</div>
      <div class="meta">
        <div class="title">${escapeHtml(item.title)}</div>
        <div class="row">
          <span class="${pillClass}">${escapeHtml(price.text)}</span>
          ${statusPill}
          <span class="pill">${escapeHtml(item.condition)}</span>
          <span class="pill">${escapeHtml(item.location)}</span>
        </div>
        <div class="row">
          <span>发布：${escapeHtml(item.time)}</span>
        </div>
        <div class="row my__actions">
          <button class="btn btn--sm" type="button" data-act="view" data-id="${item.id}">查看</button>
          ${downBtn}
        </div>
      </div>
    </article>
  `;
}

function wireMyHandlers() {
  const buttons = Array.from(document.querySelectorAll('#myList [data-act]'));
  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const act = btn.getAttribute('data-act');
      const id = btn.getAttribute('data-id');
      if (!id) return;
      if (act === 'view') openDetail(id);
      if (act === 'down') downShelf(id);
    });
  });
}

function downShelf(id) {
  const item = state.items.find(i => i.id === id);
  if (!item) return;
  if (item.seller !== state.currentUser) {
    alert('只能下架自己发布的物品（演示版）');
    return;
  }
  item.active = false;
  renderLists();
  renderMyList();
}

function wireCardHandlers() {
  const cards = Array.from(document.querySelectorAll(".card"));
  cards.forEach(card => {
    const activate = () => openDetail(card.getAttribute("data-id"));
    card.addEventListener("click", activate);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activate();
      }
    });
  });
}

function openDetail(id) {
  const item = state.items.find(i => i.id === id);
  if (!item) return;

  state.selectedId = id;
  el.detail.setAttribute("aria-hidden", "false");
  el.contact.style.display = "none";
  el.contactValue.textContent = "—";

  const price = formatPrice(item.price);
  const imageBlock = item.image
    ? `<div class="detail__image"><img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" loading="lazy" /></div>`
    : "";

  el.detailGrid.innerHTML = [
    imageBlock,
    `<div class="kv"><b>标题</b><div>${escapeHtml(item.title)}</div></div>`,
    `<div class="kv"><b>分类</b><div>${escapeHtml(item.category)}</div></div>`,
    `<div class="kv"><b>价格</b><div>${escapeHtml(price.text)}</div></div>`,
    `<div class="kv"><b>成色</b><div>${escapeHtml(item.condition)}</div></div>`,
    `<div class="kv"><b>自提地点</b><div>${escapeHtml(item.location)}</div></div>`,
    `<div class="kv"><b>发布时间</b><div>${escapeHtml(item.time)}</div></div>`,
    `<div class="kv"><b>卖家</b><div>${escapeHtml(item.seller)}</div></div>`,
    `<div class="kv"><b>描述</b><div>${escapeHtml(item.desc || "（无）")}</div></div>`
  ].join("");

  renderMessages();

  document.getElementById("detail").scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeDetail() {
  state.selectedId = null;
  el.detail.setAttribute("aria-hidden", "true");
  el.contact.style.display = "none";
  el.message.hidden = true;
}

function applySearch() {
  state.q = el.q.value || "";
  renderLists();
}

function resetAll() {
  state.q = "";
  state.cat = "全部";
  el.q.value = "";
  el.chips.forEach(c => c.setAttribute("aria-pressed", c.dataset.cat === "全部" ? "true" : "false"));
  closeDetail();
  renderLists();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function setCategory(cat) {
  state.cat = cat;
  el.chips.forEach(c => c.setAttribute("aria-pressed", c.dataset.cat === cat ? "true" : "false"));
  renderLists();
}

function showContact() {
  if (!state.selectedId) return;
  const item = state.items.find(i => i.id === state.selectedId);
  if (!item) return;
  el.contactValue.textContent = item.contact;
  el.contact.style.display = "grid";
  el.contact.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

async function copyContact() {
  const text = el.contactValue.textContent || "";
  if (!text || text === "—") return;
  try {
    await navigator.clipboard.writeText(text);
    el.btnCopyContact.textContent = "已复制";
    setTimeout(() => (el.btnCopyContact.textContent = "复制联系方式"), 900);
  } catch {
    // Clipboard 可能受限，降级提示
    alert("复制失败：请手动选中复制联系方式");
  }
}

function goTo(id) {
  const target = document.getElementById(id);
  if (!target) return;
  target.scrollIntoView({ behavior: "smooth", block: "start" });
}

function validatePrice(value) {
  const n = Number(String(value).trim());
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n);
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("read_failed"));
    reader.readAsDataURL(file);
  });
}

async function addNewItemFromForm() {
  const price = validatePrice(el.fPrice.value);
  if (price === null) {
    alert("价格请输入非负数字（0 表示免费）");
    return;
  }

  const now = new Date();
  const pad = (x) => String(x).padStart(2, "0");
  const time = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

  const item = {
    id: `i-${Math.random().toString(16).slice(2, 8)}`,
    title: String(el.fTitle.value).trim(),
    category: el.fCategory.value,
    image: "",
    price,
    condition: String(el.fCondition.value).trim(),
    location: String(el.fLocation.value).trim(),
    time,
    seller: state.currentUser,
    contact: String(el.fContact.value).trim(),
    desc: String(el.fDesc.value || "").trim()
  };

  item.active = true;

  if (!item.title || !item.condition || !item.location || !item.contact) {
    alert("请把必填项填写完整");
    return;
  }

  const file = el.fImage && el.fImage.files ? el.fImage.files[0] : null;
  if (file) {
    // 避免过大图片导致页面卡顿（演示版限制 3MB）
    const maxBytes = 3 * 1024 * 1024;
    if (file.size > maxBytes) {
      alert("图片过大（建议小于 3MB），请换一张更小的图片再试");
      return;
    }
    try {
      item.image = await readFileAsDataUrl(file);
    } catch {
      alert("读取图片失败：请重新选择图片");
      return;
    }
  }

  state.items.unshift(item);
  renderLists();
  renderMyList();
  goTo("latest");
  el.publishForm.reset();
  el.fCategory.value = "书籍";
}

const slides = [
  {
    tag: "热门闲置",
    title: "热门推荐：更快找到校内好物",
    desc: "精选同学们更关注的闲置物品。演示版先用模拟热度，后续可接收藏/点赞。",
    action: () => goTo("hot")
  },
  {
    tag: "最新发布",
    title: "最新发布：抢先看到新上架",
    desc: "按发布时间倒序展示，避免群聊刷屏造成的信息丢失。",
    action: () => goTo("latest")
  },
  {
    tag: "快速发布",
    title: "发布闲置：一键填表，立刻出现在首页",
    desc: "不做支付/跨校/物流，只做校内信息匹配与联系，简单可用。",
    action: () => goTo("publish")
  }
];

function renderCarousel() {
  const s = slides[state.carouselIndex % slides.length];
  el.carouselTag.textContent = s.tag;
  el.carouselTitle.textContent = s.title;
  el.carouselDesc.textContent = s.desc;
}

function nextCarousel(delta) {
  state.carouselIndex = (state.carouselIndex + delta + slides.length) % slides.length;
  renderCarousel();
}

// 事件绑定
el.btnSearch.addEventListener("click", applySearch);
el.q.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    applySearch();
  }
});
el.btnReset.addEventListener("click", resetAll);

el.chips.forEach(chip => {
  chip.addEventListener("click", () => setCategory(chip.dataset.cat));
});

el.btnCloseDetail.addEventListener("click", closeDetail);
el.btnBackTop.addEventListener("click", () => goTo("top"));
el.btnShowContact.addEventListener("click", showContact);
el.btnCopyContact.addEventListener("click", copyContact);

el.btnGoPublish.addEventListener("click", () => goTo("publish"));
el.btnFloatPublish.addEventListener("click", () => goTo("publish"));
el.btnFloatTop.addEventListener("click", () => goTo("top"));

el.publishForm.addEventListener("submit", (e) => {
  e.preventDefault();
  void addNewItemFromForm();
});

el.btnFillDemo.addEventListener("click", () => {
  el.fCategory.value = "数码";
  el.fTitle.value = "耳机（九成新）";
  el.fPrice.value = "35";
  el.fCondition.value = "九成新";
  el.fLocation.value = "三教门口";
  el.fContact.value = "wx: demo-2026";
  el.fDesc.value = "功能正常，带收纳盒。";
  if (el.fImage) el.fImage.value = "";
});

el.btnPrev.addEventListener("click", () => nextCarousel(-1));
el.btnNext.addEventListener("click", () => nextCarousel(1));
el.btnGoHot.addEventListener("click", () => goTo("hot"));
el.btnGoLatest.addEventListener("click", () => goTo("latest"));

el.messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addMessageFromForm();
});

// 初始化
if (el.currentUserName) el.currentUserName.textContent = state.currentUser;
renderCarousel();
renderLists();
renderMyList();
el.message.hidden = true;
setInterval(() => nextCarousel(1), 6000);
