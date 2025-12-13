async function loadData() {
  const res = await fetch("./data.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load data.json");
  return res.json();
}

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") node.className = v;
    else if (k === "text") node.textContent = v;
    else node.setAttribute(k, v);
  }
  for (const child of children) node.appendChild(child);
  return node;
}

function setText(id, value) {
  const n = document.getElementById(id);
  if (n) n.textContent = value ?? "";
}

function renderAbout(text) {
  const root = document.getElementById("about");
  root.innerHTML = "";

  // Split on blank lines into paragraphs
  const paragraphs = (text || "").split(/\n\s*\n/).map(s => s.trim()).filter(Boolean);

  for (const p of paragraphs) {
    root.appendChild(el("p", { text: p }));
  }
}

function renderLinks(links) {
  const root = document.getElementById("links");
  root.innerHTML = "";
  for (const link of links || []) {
    const a = el("a", {
      class: "btn",
      href: link.url,
      target: "_blank",
      rel: "noopener noreferrer"
    });
    a.appendChild(el("span", { text: link.label }));
    a.appendChild(el("span", { text: "↗", class: "muted" }));
    root.appendChild(a);
  }
}

function renderSkills(skills) {
  const root = document.getElementById("skills");
  root.innerHTML = "";
  for (const s of skills || []) root.appendChild(el("span", { class: "chip", text: s }));
}

function renderProjects(projects) {
  const root = document.getElementById("projects");
  root.innerHTML = "";
  for (const p of projects || []) {
    const title = el("a", {
      href: p.url,
      target: "_blank",
      rel: "noopener noreferrer",
      text: p.name
    });
    const desc = el("p", { class: "muted", text: p.description || "" });

    const tagsWrap = el("div", { class: "tags" });
    for (const t of (p.tags || [])) tagsWrap.appendChild(el("span", { class: "chip", text: t }));

    root.appendChild(el("div", { class: "project" }, [
      title,
      desc,
      tagsWrap
    ]));
  }
}

(async () => {
  try {
    const data = await loadData();
    setText("name", data.name);
    setText("tagline", data.tagline);
    setText("location", data.location ? `📍 ${data.location}` : "");
    renderAbout(data.about);

    renderLinks(data.links);
    renderSkills(data.skills);
    renderProjects(data.projects);

    document.getElementById("year").textContent = new Date().getFullYear();
  } catch (e) {
    document.body.innerHTML = `<pre style="padding:20px;color:#fff;">${e}</pre>`;
  }
})();