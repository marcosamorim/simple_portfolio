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
    const label = link.label || "Link";
    const url = link.url || "#";
    const isPdf = /\.pdf(\?|$)/i.test(url) || /cv/i.test(label);
    const isExternal = /^https?:\/\//i.test(url);
    let iconNode;

    if (isPdf) {
      iconNode = el("img", {
        class: "link-icon pdf",
        src: "./assets/pdf-icon.svg",
        alt: "PDF",
        loading: "lazy"
      });
    } else if (/github/i.test(label) || /github\.com/i.test(url)) {
      iconNode = el("img", {
        class: "link-icon",
        src: "./assets/github.png",
        alt: "GitHub",
        loading: "lazy"
      });
    } else if (isExternal) {
      let iconUrl = "";
      let altText = "";
      try {
        const { hostname } = new URL(url);
        if (/linkedin\.com/i.test(hostname) || /linkedin/i.test(label)) {
          iconUrl = "./assets/linkedin.png";
          altText = "LinkedIn";
        } else if (/rdrt\.uk/i.test(hostname) || /rdrt/i.test(label)) {
          iconUrl = "./assets/rdrt-icon.png";
          altText = "rdrt";
        }
      } catch {
        iconUrl = "";
      }
      if (iconUrl) {
        iconNode = el("img", {
          class: "link-icon",
          src: iconUrl,
          alt: altText,
          loading: "lazy"
        });
      } else {
        iconNode = el("span", { class: "link-icon emoji", text: "🔗" });
      }
    } else {
      iconNode = el("span", { class: "link-icon emoji", text: "🔗" });
    }

    const a = el("a", {
      class: "btn",
      href: url,
      target: "_blank",
      rel: "noopener noreferrer"
    });
    const content = el("span", { class: "btn-content" }, [
      iconNode,
      el("span", { text: label })
    ]);
    a.appendChild(content);
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
    const tagList = (p.tags || []).map(t => String(t).toLowerCase());
    const tagSet = new Set(tagList);
    const isFrontend = ["angular", "html", "css", "javascript"].some(t => tagSet.has(t));
    const isBackend = ["python", "django", "wagtail", "fastapi", "sqlalchemy", "alembic", "postgresql", "rest apis"].some(t => tagSet.has(t));
    const isInfra = ["docker", "kubernetes", "aws", "ci/cd", "heroku", "cloudflare pages"].some(t => tagSet.has(t));
    let themeClass = "project";
    if (isFrontend && isBackend) themeClass += " project--fullstack";
    else if (isBackend) themeClass += " project--backend";
    else if (isFrontend) themeClass += " project--frontend";
    else if (isInfra) themeClass += " project--infra";

    const header = el("div", { class: "project-header" }, [
      el("span", { class: "project-title", text: p.name })
    ]);

    const desc = el("p", { class: "muted", text: p.description || "" });

    const actions = el("div", { class: "project-actions" });

    if (p.links?.live) {
      actions.appendChild(
        el("a", {
          class: "badge live",
          href: p.links.live,
          target: "_blank",
          rel: "noopener noreferrer"
        }, [
          el("span", { class: "badge-content" }, [
            el("span", { text: "Live" }),
            el("img", {
              class: "badge-icon",
              src: "./assets/open-in-new.svg",
              alt: "Opens in a new tab",
              loading: "lazy"
            })
          ])
        ])
      );
    }

    if (p.links?.github) {
      actions.appendChild(
        el("a", {
          class: "badge github",
          href: p.links.github,
          target: "_blank",
          rel: "noopener noreferrer"
        }, [
          el("span", { class: "badge-content" }, [
            el("img", {
              class: "badge-icon",
              src: "./assets/github.png",
              alt: "GitHub",
              loading: "lazy"
            }),
            el("span", { text: "GitHub" })
          ])
        ])
      );
    }

    const tagsWrap = el("div", { class: "tags" });
    for (const t of p.tags || []) {
      tagsWrap.appendChild(el("span", { class: "chip", text: t }));
    }

    root.appendChild(
      el("div", { class: themeClass }, [
        header,
        desc,
        actions,
        tagsWrap
      ])
    );
  }
}

(async () => {
  try {
    const data = await loadData();
    setText("name", data.name);
    setText("tagline", data.tagline);
    setText("current", data.current ? `Currently: ${data.current}` : "");
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
