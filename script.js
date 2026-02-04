const $ = (sel, parent = document) => parent.querySelector(sel);
const $$ = (sel, parent = document) => Array.from(parent.querySelectorAll(sel));

/* Mobile nav */
const navToggle = $("#navToggle");
const navMenu = $("#navMenu");

function closeMenu() {
  if (!navMenu) return;
  navMenu.classList.remove("open");
  navToggle?.setAttribute("aria-expanded", "false");
}

navToggle?.addEventListener("click", (e) => {
  e.stopPropagation();
  if (!navMenu) return;
  const isOpen = navMenu.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

$$(".nav__link, .btn", navMenu || document).forEach((a) => {
  a.addEventListener("click", () => closeMenu());
});

document.addEventListener("click", (e) => {
  if (!navMenu || !navToggle) return;
  if (!navMenu.classList.contains("open")) return;
  const inside = navMenu.contains(e.target) || navToggle.contains(e.target);
  if (!inside) closeMenu();
});

/* مهم: لو كبّرت الشاشة بعد ما كانت المنيو مفتوحة */
window.addEventListener("resize", () => {
  if (window.innerWidth > 720) closeMenu();
});

/* Active section highlight */
const sections = ["home","services","why","about","faq","contact"]
  .map(id => document.getElementById(id))
  .filter(Boolean);

const links = $$(".nav__link");

if ("IntersectionObserver" in window && sections.length && links.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      links.forEach(l => l.classList.toggle("active", l.getAttribute("href") === `#${id}`));
    });
  }, { rootMargin: "-40% 0px -55% 0px", threshold: 0.01 });

  sections.forEach(s => io.observe(s));
}

/* Back to top */
const toTop = $("#toTop");
window.addEventListener("scroll", () => {
  if (!toTop) return;
  toTop.classList.toggle("show", window.scrollY > 500);
});
toTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

/* Copy phone */
$("#copyPhone")?.addEventListener("click", async () => {
  const phone = "0919632606";
  try{
    await navigator.clipboard.writeText(phone);
    toast("تم نسخ رقم الهاتف ✅");
  }catch{
    toast("تعذر النسخ تلقائيًا — انسخ الرقم يدويًا");
  }
});

/* Accordion */
const accordion = $("#accordion");
if (accordion) {
  $$(".accordion__btn", accordion).forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".accordion__item");
      const panel = item?.querySelector(".accordion__panel");
      if (!item || !panel) return;

      const isOpen = item.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(isOpen));

      $$(".accordion__item", accordion).forEach((other) => {
        if (other !== item) {
          other.classList.remove("is-open");
          $(".accordion__btn", other)?.setAttribute("aria-expanded", "false");
          const otherPanel = $(".accordion__panel", other);
          if (otherPanel) otherPanel.style.maxHeight = "0px";
        }
      });

      panel.style.maxHeight = isOpen ? panel.scrollHeight + 18 + "px" : "0px";
    });
  });
}

/* Footer year */
$("#year") && ($("#year").textContent = String(new Date().getFullYear()));

/* Tiny toast */
let toastTimer = null;
function toast(text){
  clearTimeout(toastTimer);
  let el = $("#toast");
  if (!el){
    el = document.createElement("div");
    el.id = "toast";
    el.style.position = "fixed";
    el.style.bottom = "16px";
    el.style.right = "16px";
    el.style.padding = "12px 14px";
    el.style.borderRadius = "16px";
    el.style.border = "1px solid rgba(15,23,42,.14)";
    el.style.background = "rgba(255,255,255,.95)";
    el.style.color = "rgba(15,23,42,.90)";
    el.style.backdropFilter = "blur(12px)";
    el.style.boxShadow = "0 18px 55px rgba(2,6,23,.12)";
    el.style.zIndex = "999";
    el.style.fontWeight = "900";
    el.style.opacity = "0";
    el.style.transform = "translateY(10px)";
    el.style.transition = "opacity .2s ease, transform .2s ease";
    document.body.appendChild(el);
  }
  el.textContent = text;
  requestAnimationFrame(() => {
    el.style.opacity = "1";
    el.style.transform = "translateY(0)";
  });
  toastTimer = setTimeout(() => {
    el.style.opacity = "0";
    el.style.transform = "translateY(10px)";
  }, 2200);
}
