"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";

/* ─── Config ─── */
const WA = "923222635439";
const DELIVERY = 200;

/* ─── Pexels image helper (verified working URLs) ─── */
const px = (id: number, w = 800, h = 1000) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&fit=crop`;

/* ─── Product Data ─── */
type Soap = {
  id: string;
  name: string;
  line: string;
  price: number;
  weight: string;
  skin: string[];
  benefits: string[];
  ingredients: string;
  img: string;
  color: string;
  badge?: string;
};

const SOAPS: Soap[] = [
  {
    id: "rice-niacinamide",
    name: "Rice & Niacinamide Soap (Double Power)",
    line: "Double-strength pure niacinamide (Vitamin B3) and organic rice milk extract.",
    price: 550,
    weight: "125 g",
    skin: ["brightening", "acne"],
    benefits: [
      "Pores tightening",
      "Dual skin control",
      "Strong skin barrier",
      "Hydrates skin",
    ],
    ingredients:
      "Organic rice milk, pure niacinamide (B3), cold-pressed olive oil, virgin coconut oil, unrefined shea butter, sweet almond oil.",
    img: "/images/soap-pic-1.jpeg",
    color: "#e8dcbe",
    badge: "Double Power",
  },
  {
    id: "rice-turmeric",
    name: "Rice & Turmeric Soap",
    line: "Raw wild kasturi turmeric, fresh organic rice milk, kokum butter & sweet orange.",
    price: 550,
    weight: "125 g",
    skin: ["brightening", "acne"],
    benefits: [
      "Skin tightening and glowing",
      "Reduces pimple marks and acne",
      "Soft and supple skin",
    ],
    ingredients:
      "Organic rice milk, wild kasturi turmeric, virgin coconut oil, cold-pressed olive oil, raw kokum butter, orange peel essential oil.",
    img: "/images/soap-pic-3.jpeg",
    color: "#d19e38",
    badge: "Tightening & Glow",
  },
  {
    id: "coffee-cocoa",
    name: "Coffee & Cocoa Soap",
    line: "Freshly ground Arabica coffee, pure raw cocoa butter & unrefined brown sugar.",
    price: 500,
    weight: "125 g",
    skin: ["exfoliating", "brightening"],
    benefits: [
      "Skin glowing and nourishing",
      "Soft and smooth skin",
      "Gentle exfoliation",
    ],
    ingredients:
      "Cold-pressed olive oil, virgin coconut oil, pure cocoa butter, ground Arabica coffee, raw brown sugar, vanilla bean extract.",
    img: "/images/soap-pic-4.jpeg",
    color: "#5c3d2e",
    badge: "Glowing & Nourishing",
  },
  {
    id: "kojic-arbutin",
    name: "Kojic Acid Skin Whitening Soap",
    line: "Pure kojic acid, alpha arbutin, cold-pressed olive oil & sweet orange.",
    price: 550,
    weight: "125 g",
    skin: ["brightening", "acne"],
    benefits: [
      "Reduces two-tone skin",
      "Reduces acne and pimple marks",
      "Removes dark spots",
      "Anti-aging",
    ],
    ingredients:
      "Cold-pressed olive oil, virgin coconut oil, pure kojic acid, alpha arbutin, unrefined shea butter, sweet orange peel essential oil.",
    img: "/images/soap-pic-2.png",
    color: "#e69c44",
    badge: "Skin Whitening",
  },
];

const FILTERS = [
  { key: "all", label: "All Bars" },
  { key: "brightening", label: "Whitening & Glow" },
  { key: "acne", label: "Pores & Acne Control" },
  { key: "exfoliating", label: "Gentle Exfoliation" },
];

const rs = (n: number) => "Rs " + n.toLocaleString("en-PK");

/* ─── Reveal on scroll (subtle opacity fade only) ─── */
function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("is-visible"); io.disconnect(); } },
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} data-reveal className={className}>{children}</div>;
}

/* ═══════════════════════════ PAGE ═══════════════════════════ */

export default function Home() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [loaded, setLoaded] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [addedId, setAddedId] = useState<string | null>(null);
  const [quickViewSoap, setQuickViewSoap] = useState<Soap | null>(null);
  const [name, setName] = useState("");
  const [area, setArea] = useState("");
  const [errors, setErrors] = useState<{ name?: string; area?: string }>({});
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => { document.documentElement.classList.add("js"); }, []);
  useEffect(() => {
    try { const r = localStorage.getItem("lumiora-cart") || localStorage.getItem("lumiaura-cart") || localStorage.getItem("no-cart"); if (r) setCart(JSON.parse(r)); } catch {}
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded) try { localStorage.setItem("lumiora-cart", JSON.stringify(cart)); } catch {}
  }, [cart, loaded]);
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDrawerOpen(false);
        setQuickViewSoap(null);
      }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  const items = useMemo(() => SOAPS.filter((s) => (cart[s.id] ?? 0) > 0), [cart]);
  const count = items.reduce((a, s) => a + (cart[s.id] ?? 0), 0);
  const subtotal = items.reduce((a, s) => a + (cart[s.id] ?? 0) * s.price, 0);
  const delivery = count > 0 ? DELIVERY : 0;
  const total = subtotal + delivery;
  const visible = filter === "all" ? SOAPS : SOAPS.filter((s) => s.skin.includes(filter));

  const add = useCallback((soap: Soap) => {
    setCart((c) => ({ ...c, [soap.id]: (c[soap.id] ?? 0) + 1 }));
    setAddedId(soap.id);
    setTimeout(() => setAddedId((cur) => (cur === soap.id ? null : cur)), 1400);
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setCart((c) => {
      const next = { ...c };
      if (qty <= 0) delete next[id]; else next[id] = qty;
      return next;
    });
  }, []);

  async function getLiveLocation() {
    if (!navigator.geolocation) {
      setLocError("Location is not supported by your browser.");
      return;
    }
    setLocLoading(true);
    setLocError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));
        setLocation({ lat, lng });

        // Auto reverse-geocode to get the readable Karachi address (Nominatim + Photon proximity fallback)
        try {
          const [nomRes, photonRes] = await Promise.allSettled([
            fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=en`,
              { headers: { Accept: "application/json" } }
            ).then((r) => (r.ok ? r.json() : null)),
            fetch(`https://photon.komoot.io/reverse?lat=${lat}&lon=${lng}`).then((r) =>
              r.ok ? r.json() : null
            ),
          ]);

          const nomData = nomRes.status === "fulfilled" ? nomRes.value : null;
          const nomAddr = nomData?.address || {};
          const photonFeature =
            photonRes.status === "fulfilled"
              ? photonRes.value?.features?.[0]?.properties
              : null;

          // Extract best house / plot number (Nominatim or Photon proximity search)
          const houseNumber =
            nomAddr.house_number ||
            photonFeature?.housenumber ||
            nomAddr.building ||
            "";

          const street =
            nomAddr.road ||
            nomAddr.pedestrian ||
            photonFeature?.street ||
            "";

          const neighborhood =
            nomAddr.neighbourhood ||
            nomAddr.suburb ||
            nomAddr.residential ||
            photonFeature?.locality ||
            "";

          const town =
            nomAddr.town ||
            nomAddr.city_district ||
            nomAddr.city ||
            photonFeature?.city ||
            "Karachi";

          // Deduplicate and combine into a clean Karachi address
          const seen = new Set<string>();
          const parts: string[] = [];
          for (const item of [houseNumber, street, neighborhood, town]) {
            if (item && !seen.has(item.toLowerCase().trim())) {
              seen.add(item.toLowerCase().trim());
              parts.push(item.trim());
            }
          }

          const resolvedAddress =
            parts.length > 0 ? parts.join(", ") : nomData?.display_name || `Location near ${lat}, ${lng}, Karachi`;

          setArea(resolvedAddress);
          setErrors((p) => ({ ...p, area: undefined }));
        } catch {
          setArea(`Location near ${lat}, ${lng}, Karachi`);
          setErrors((p) => ({ ...p, area: undefined }));
        } finally {
          setLocLoading(false);
        }
      },
      (err) => {
        setLocLoading(false);
        if (err.code === 1) {
          setLocError("Location permission denied. Please type your address manually.");
        } else {
          setLocError("Could not retrieve GPS. Please type your address manually.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  const whatsappUrl = useMemo(() => {
    const lines = items.map((s) => {
      const q = cart[s.id];
      return q > 1 ? `• ${q} × ${s.name} — ${rs(s.price)} each` : `• ${s.name} — ${rs(s.price)}`;
    });
    const customerInfo = [
      `Customer Name: ${name.trim()}`,
      `Delivery Address: ${area.trim()}`,
      location ? `📍 Google Maps Rider Link: https://maps.google.com/?q=${location.lat},${location.lng}` : "",
    ].filter(Boolean);

    const msgParts = [
      "Assalam-o-Alaikum,",
      "I'd like to place an order:",
      "",
      ...lines,
      "",
      `Subtotal: ${rs(subtotal)}`,
      `Delivery Charge: ${rs(delivery)} (Karachi)`,
      `Total: ${rs(total)}`,
      "",
      ...customerInfo,
    ];
    return `https://wa.me/${WA}?text=${encodeURIComponent(msgParts.join("\n"))}`;
  }, [items, cart, subtotal, delivery, total, name, area, location]);

  function handleOrderClick(e: React.MouseEvent) {
    const errs: { name?: string; area?: string } = {};
    if (!name.trim()) errs.name = "Full name is required.";
    if (!area.trim()) errs.area = "Delivery address & area in Karachi is required.";
    if (Object.keys(errs).length > 0) {
      e.preventDefault();
      setErrors(errs);
      return;
    }
    setErrors({});
    window.open(whatsappUrl, "_blank", "noopener");
  }

  return (
    <main className="min-h-screen">
      {/* ══════ HEADER ══════ */}
      <header className="sticky top-0 z-40 bg-cream/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-3.5">
          <a href="#top" className="group flex flex-col items-start leading-none">
            <span className="font-serif text-[23px] font-medium tracking-wide text-ink">
              LUMI<span className="text-terracotta font-normal">ORA</span>
            </span>
            <span className="text-[9px] font-medium uppercase tracking-[0.24em] text-ink-light mt-1">
              Handcrafted
            </span>
          </a>
          <nav className="hidden gap-8 text-[13px] font-medium tracking-wide text-ink-light sm:flex">
            <a href="#shop" className="hover:text-ink transition-colors">Shop</a>
            <a href="#about" className="hover:text-ink transition-colors">About</a>
            <a href="#faq" className="hover:text-ink transition-colors">FAQ</a>
          </nav>
          <button
            onClick={() => setDrawerOpen(true)}
            className="relative text-[13px] font-medium tracking-wide text-ink-light hover:text-ink transition-colors"
          >
            Bag{count > 0 && <span className="ml-1 text-terracotta">({count})</span>}
          </button>
        </div>
      </header>

      {/* ══════ HERO ══════ */}
      <section id="top" className="mx-auto grid max-w-[1200px] gap-0 lg:grid-cols-2 lg:min-h-[85vh]">
        <div className="relative aspect-[4/5] overflow-hidden bg-sand lg:aspect-auto">
          <Image
            src="/images/hero-kraft-box.jpg"
            alt="HOMEMADE Coffee and Rice Soap in handmade kraft packaging with natural cold-process bars"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <div className="flex flex-col justify-center px-6 py-16 lg:px-16 lg:py-24">
          <Reveal>
            <span className="text-[12px] font-medium uppercase tracking-[0.18em] text-terracotta">
              Handcrafted Cold-Process · Karachi
            </span>
            <h1 className="mt-4 font-serif text-[clamp(2.4rem,5vw,3.8rem)] font-light leading-[1.1] tracking-tight">
              Made slowly,<br />by hand.
            </h1>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink-light">
              Cold-process soap from a small kitchen in Karachi.
              Pure oils, whole botanicals, four weeks on a curing rack.
              Nothing artificial.
            </p>
            <div className="mt-10 flex items-center gap-6">
              <a
                href="#shop"
                className="border-b border-ink pb-1 text-[13px] font-medium tracking-wide hover:border-terracotta hover:text-terracotta transition-colors"
              >
                Shop the collection
              </a>
              <a
                href="#about"
                className="text-[13px] font-medium tracking-wide text-ink-light hover:text-ink transition-colors"
              >
                Our process
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════ SHOP ══════ */}
      <section id="shop" className="scroll-mt-16">
        <div className="mx-auto max-w-[1200px] px-6 pt-24 pb-6">
          <Reveal>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="font-serif text-3xl font-light">The Collection</h2>
              <div className="flex gap-2 overflow-x-auto pb-1 text-[12px] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap">
                {FILTERS.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setFilter(f.key)}
                    className={`shrink-0 rounded-full px-4 py-2 font-medium transition-colors ${
                      filter === f.key
                        ? "bg-ink text-cream"
                        : "bg-sand text-ink-light hover:text-ink"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mx-auto max-w-[1200px] px-6 pb-24">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
            {visible.map((soap) => {
              const qty = cart[soap.id] ?? 0;
              return (
                <Reveal key={soap.id} className="h-full flex flex-col">
                  <article className="group flex h-full flex-col bg-cream border border-rule/60 rounded-xl p-3.5 sm:p-4 hover:border-terracotta/40 hover:shadow-md transition-all duration-300">
                    <div
                      className="relative aspect-[4/5] overflow-hidden rounded-lg bg-sand cursor-pointer"
                      style={{ backgroundColor: soap.color }}
                      onClick={() => setQuickViewSoap(soap)}
                    >
                      <Image
                        src={soap.img}
                        alt={`${soap.name} — handmade cold-process soap bar`}
                        fill
                        className="img-zoom object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      {soap.badge && (
                        <span className="absolute top-2.5 left-2.5 z-10 rounded-full bg-cream/95 backdrop-blur-xs px-2.5 py-1 text-[10.5px] font-semibold text-ink shadow-2xs border border-rule/60">
                          {soap.badge}
                        </span>
                      )}
                      <span className="absolute top-2.5 right-2.5 z-10 rounded-full bg-cream/95 backdrop-blur-xs px-2 py-0.5 text-[10.5px] font-medium text-ink-light border border-rule/60">
                        {soap.weight}
                      </span>
                      {/* Quick View Hover Pill */}
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-ink/20 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                        <span className="rounded-full bg-cream/95 backdrop-blur-xs px-3.5 py-1.5 text-[11px] font-medium text-ink shadow-sm">
                          Quick View ↗
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col pt-3.5">
                      {/* Title with fixed min-height for uniform baseline */}
                      <div className="min-h-[50px] flex items-center">
                        <h3
                          onClick={() => setQuickViewSoap(soap)}
                          className="font-serif text-[18px] sm:text-[19px] font-medium leading-snug cursor-pointer hover:text-terracotta transition-colors line-clamp-2"
                        >
                          {soap.name}
                        </h3>
                      </div>

                      {/* Tagline with fixed min-height */}
                      <div className="min-h-[36px] mt-1">
                        <p className="text-[12px] sm:text-[12.5px] leading-snug text-ink-light line-clamp-2">
                          {soap.line}
                        </p>
                      </div>

                      {/* View full benefits & details trigger */}
                      <button
                        type="button"
                        onClick={() => setQuickViewSoap(soap)}
                        className="mt-3 mb-2 self-start text-[12px] font-medium text-terracotta hover:text-ink transition-colors flex items-center gap-1.5 cursor-pointer group/link"
                      >
                        <span className="border-b border-terracotta/40 group-hover/link:border-ink pb-0.5">
                          View benefits & ingredients
                        </span>
                        <span className="text-[11px] transition-transform group-hover/link:translate-x-0.5">→</span>
                      </button>

                      {/* Price, Weight & Add to Bag - Locked to Bottom Baseline */}
                      <div className="mt-auto flex items-center justify-between border-t border-rule/50 pt-3">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-serif text-[18px] font-medium tabular-nums text-ink">
                            {rs(soap.price)}
                          </span>
                          <span className="text-[11.5px] text-ink-light font-normal">
                            / {soap.weight}
                          </span>
                        </div>

                        <button
                          onClick={() => {
                            add(soap);
                            setDrawerOpen(true);
                          }}
                          className={`min-h-[40px] min-w-[96px] rounded-full border px-4 py-2 text-[12px] font-medium tracking-wide transition-all duration-200 active:scale-95 cursor-pointer ${
                            qty > 0
                              ? "border-ink bg-ink text-cream"
                              : "border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-cream"
                          }`}
                        >
                          {addedId === soap.id ? "Added ✓" : qty > 0 ? `In bag (${qty}) +` : "Add to bag"}
                        </button>
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
          {visible.length === 0 && (
            <p className="py-20 text-center text-sm text-ink-light">
              No soaps match this filter.{" "}
              <button onClick={() => setFilter("all")} className="underline hover:text-ink">Show all</button>
            </p>
          )}
        </div>
      </section>

      {/* ══════ EDITORIAL IMAGE BREAK ══════ */}
      <Reveal>
        <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
          <Image
            src="/images/soap-pic-4.jpeg"
            alt="Handcrafted Coffee Exfoliating Soap Bar with coffee beans"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-ink/30" />
          <div className="absolute inset-0 flex items-center justify-center px-6">
            <p className="max-w-lg text-center font-serif text-2xl font-light leading-relaxed text-white sm:text-3xl">
              "A soap's only job is to clean gently. We don't claim more than that."
            </p>
          </div>
        </div>
      </Reveal>

      {/* ══════ ABOUT / PROCESS ══════ */}
      <section id="about" className="scroll-mt-16 py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col justify-center">
            <Reveal>
              <p className="text-[12px] font-medium uppercase tracking-[0.15em] text-ink-light">How we make it</p>
              <h2 className="mt-4 font-serif text-3xl font-light leading-snug sm:text-4xl">
                Four steps. Four weeks.<br />No shortcuts.
              </h2>
              <div className="mt-8 space-y-6 text-[14px] leading-relaxed text-ink-light">
                <p>
                  We weigh cold-pressed olive oil, virgin coconut oil, and unrefined
                  shea butter to exact ratios. Everything is melted slowly, never above 45°C.
                </p>
                <p>
                  A carefully measured lye solution meets the oils. We stir by hand
                  until the mixture thickens to what soapmakers call <em>trace</em> —
                  thick as custard.
                </p>
                <p>
                  Botanicals go in last: crushed rose petals, raw turmeric, activated charcoal,
                  dried lavender. The loaf is poured into a pine mould, cut the next morning,
                  and set on a slatted rack to cure.
                </p>
                <p className="text-ink font-medium">
                  Twenty-eight days later, the bar is firm, mild, and ready. The waiting
                  is what makes it gentle.
                </p>
              </div>
            </Reveal>
          </div>
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-sand shadow-sm">
            <Image
              src="/images/real-gift-box.jpg"
              alt="Artisanal cold-process soap bars and custom gift box crafted in Karachi"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* ══════ ORIGIN ══════ */}
      <section className="bg-warm/40">
        <div className="mx-auto max-w-[720px] px-6 py-20 lg:py-28">
          <Reveal>
            <p className="text-[12px] font-medium uppercase tracking-[0.15em] text-ink-light">Our story</p>
            <h2 className="mt-4 font-serif text-3xl font-light leading-snug">
              It started because we couldn't find soap whose ingredients we could read out loud.
            </h2>
            <p className="mt-6 text-[14px] leading-relaxed text-ink-light">
              The first batch was made for our own family. In Karachi's humidity and hard
              tap water, every commercial bar left our skin tight and itchy. We started with
              one steel pot and a notebook of recipes. Neighbours asked for bars, then their
              families asked. Eight bars at a time became twelve, twelve became twenty.
              The kitchen shelf became a dedicated curing rack.
            </p>
            <p className="mt-4 text-[14px] leading-relaxed text-ink-light">
              We still pour every batch by hand. There is no factory, no machine, no plan
              to scale beyond what we can make honestly.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ══════ FAQ ══════ */}
      <section id="faq" className="scroll-mt-16">
        <div className="mx-auto max-w-[720px] px-6 py-20 lg:py-28">
          <Reveal><h2 className="font-serif text-3xl font-light">Common questions</h2></Reveal>
          <div className="mt-10 divide-y divide-rule/40">
            {[
              ["How do I order?", "Add bars to your bag, fill in your name and area, and tap 'Place order on WhatsApp'. We'll confirm your address and dispatch within 24 hours."],
              ["What does delivery cost?", `Fixed ${rs(DELIVERY)} anywhere in Karachi. Cash on delivery, JazzCash, or Easypaisa.`],
              ["How long does a bar last?", "Three to five weeks of daily use, if you keep it on a draining soap dish between washes. A bar sitting in water dissolves fast — that's the trade-off for keeping 100% natural glycerin inside."],
              ["Can I use these on my face?", "Yes. Every bar is mild enough for face and body. For very sensitive or reactive skin, start with the Rice & Niacinamide bar or Rice & Turmeric bar."],
              ["Do you deliver outside Karachi?", "Not yet. We're a small operation and want to get local delivery right first."],
            ].map(([q, a], i) => (
              <div key={q}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between py-5 text-left text-[15px] font-medium hover:text-terracotta transition-colors"
                  aria-expanded={openFaq === i}
                >
                  {q}
                  <span className="ml-4 text-ink-light">{openFaq === i ? "−" : "+"}</span>
                </button>
                <div className={`faq-body ${openFaq === i ? "open" : ""}`}>
                  <div><p className="pb-5 text-[13px] leading-relaxed text-ink-light">{a}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ FOOTER ══════ */}
      <footer>
        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-4 px-6 py-12 text-center text-[12px] text-ink-light sm:flex-row sm:justify-between sm:text-left">
          <div className="flex flex-col items-center sm:items-start leading-tight">
            <span className="font-serif text-[17px] font-medium text-ink">
              LUMI<span className="text-terracotta font-normal">ORA</span>
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-ink-light mt-1">
              Handcrafted Cold-Process Soaps · Karachi
            </span>
          </div>
          <a
            href={`https://wa.me/${WA}?text=${encodeURIComponent("Assalam-o-Alaikum, I have a question about your soaps.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ink transition-colors"
          >
            Ask us on WhatsApp →
          </a>
        </div>
      </footer>

      {/* ══════ FLOATING BAG ══════ */}
      {count > 0 && !drawerOpen && (
        <button
          onClick={() => setDrawerOpen(true)}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-40 flex items-center justify-center sm:justify-start gap-3 rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-cream shadow-2xl transition-all duration-200 hover:scale-[1.02] hover:bg-terracotta active:scale-[0.98]"
        >
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span>View bag · {count} item{count !== 1 ? "s" : ""}</span>
          <span className="tabular-nums font-semibold">({rs(total)})</span>
        </button>
      )}

      {/* ══════ CART DRAWER ══════ */}
      <div className={`fixed inset-0 z-50 ${drawerOpen ? "" : "pointer-events-none"}`}>
        <div
          onClick={() => setDrawerOpen(false)}
          className={`absolute inset-0 bg-ink/40 transition-opacity duration-300 ${drawerOpen ? "opacity-100" : "opacity-0"}`}
        />
        <aside
          role="dialog"
          aria-label="Your bag"
          aria-modal="true"
          className={`absolute right-0 top-0 flex h-full w-full max-w-[440px] flex-col bg-[#f7f2ea] shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex items-center justify-between border-b border-rule/60 bg-cream px-6 py-4">
            <h2 className="font-serif text-lg font-medium text-ink">Your bag</h2>
            <button onClick={() => setDrawerOpen(false)} className="text-xs text-ink-light hover:text-ink transition-colors p-1">Close ✕</button>
          </div>

          {count === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
              <p className="font-serif text-lg">Nothing here yet.</p>
              <p className="mt-2 text-[13px] text-ink-light">Start with the Rose bar — it's why most people come back.</p>
              <button onClick={() => setDrawerOpen(false)} className="mt-6 border-b border-ink pb-0.5 text-[13px] font-medium">Browse the collection</button>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {/* Card 1: Order Summary */}
              <div className="rounded-xl border border-rule/80 bg-white p-5 shadow-xs">
                <h3 className="text-base font-semibold text-ink">Order Summary</h3>

                {/* Items */}
                <div className="divide-y divide-rule/40 mt-3 pb-3">
                  {items.map((s) => {
                    const q = cart[s.id];
                    return (
                      <div key={s.id} className="py-3">
                        <div className="flex justify-between items-baseline gap-2">
                          <span className="text-[14px] font-medium text-ink">{s.name}</span>
                          <span className="text-[14px] font-medium text-ink tabular-nums">Rs. {(q * s.price).toFixed(2)}</span>
                        </div>

                        <div className="mt-2 flex items-center gap-2 text-xs text-ink-light">
                          <span>Qty:</span>
                          <div className="flex items-center gap-1 rounded border border-rule/80 bg-cream/30 px-1.5 py-0.5">
                            <button
                              onClick={() => setQty(s.id, q - 1)}
                              className="px-1 font-medium text-ink-light hover:text-ink transition-colors leading-none"
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>
                            <span className="w-4 text-center font-medium tabular-nums text-ink">{q}</span>
                            <button
                              onClick={() => setQty(s.id, q + 1)}
                              className="px-1 font-medium text-ink-light hover:text-ink transition-colors leading-none"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => setQty(s.id, 0)}
                            className="ml-1 text-red-600 hover:text-red-700 font-medium transition-colors"
                          >
                            Remove
                          </button>

                          <span className="text-ink-light/70">× Rs. {s.price.toFixed(2)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Subtotal, Delivery Charge, Total */}
                <div className="pt-3 space-y-2.5 border-t border-rule/60 text-[14px]">
                  <div className="flex justify-between">
                    <span className="font-medium text-ink">Subtotal</span>
                    <span className="font-semibold text-[#8c2d38] tabular-nums">Rs. {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-ink">Delivery Charge</span>
                    <span className="font-semibold text-[#8c2d38] tabular-nums">Rs. {delivery.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-1 font-bold">
                    <span className="text-ink">Total</span>
                    <span className="font-bold text-[#8c2d38] tabular-nums text-[15px]">Rs. {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Payment & Delivery Details */}
              <div className="rounded-xl border border-rule/80 bg-white p-5 shadow-xs">
                <h3 className="text-base font-semibold text-ink">Payment & Delivery</h3>
                <p className="mt-1 text-xs text-ink-light">Cash on delivery (Karachi)</p>

                <div className="mt-4 space-y-3">
                  {/* Name field */}
                  <div>
                    <label className="block text-[11px] font-medium text-ink-light mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
                      }}
                      placeholder="e.g. Ayesha Khan"
                      className={`w-full rounded-md border bg-cream/30 px-3 py-2.5 text-[16px] sm:text-xs outline-none transition-colors ${
                        errors.name ? "border-red-500 bg-red-50/40" : "border-rule/80 focus:border-ink focus:bg-white"
                      }`}
                    />
                    {errors.name && <p className="mt-1 text-[11px] text-red-600 font-medium">{errors.name}</p>}
                  </div>

                  {/* Delivery Address field */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <label className="text-[11px] font-medium text-ink-light">
                        Delivery Address in Karachi <span className="text-red-500">*</span>
                      </label>

                      {/* Professional Location Action */}
                      <button
                        type="button"
                        onClick={getLiveLocation}
                        disabled={locLoading}
                        className="inline-flex items-center gap-1.5 rounded-full border border-rule/90 bg-white px-2.5 py-1 text-[11px] font-medium text-ink shadow-2xs transition-all hover:border-ink/60 hover:bg-cream/40 active:scale-95 disabled:opacity-50 cursor-pointer"
                      >
                        {locLoading ? (
                          <>
                            <svg className="animate-spin h-3 w-3 text-terracotta" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                            <span className="text-ink-light">Detecting...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-3 h-3 text-terracotta" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="3" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v3m0 14v3M2 12h3m14 0h3" />
                            </svg>
                            <span>{location ? "Update location" : "Use current location"}</span>
                          </>
                        )}
                      </button>
                    </div>

                    <textarea
                      rows={2}
                      value={area}
                      onChange={(e) => {
                        setArea(e.target.value);
                        if (errors.area) setErrors((p) => ({ ...p, area: undefined }));
                      }}
                      placeholder="House / Flat #, Street, Area in Karachi..."
                      className={`w-full rounded-md border bg-cream/30 px-3 py-2.5 text-[16px] sm:text-xs outline-none transition-colors resize-none ${
                        errors.area ? "border-red-500 bg-red-50/40" : "border-rule/80 focus:border-ink focus:bg-white"
                      }`}
                    />

                    {/* Subtle status confirmation */}
                    {location && (
                      <div className="mt-1.5 space-y-1 text-[11px]">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1 text-olive font-medium">
                            <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Rider map navigation attached
                          </span>
                          <a
                            href={`https://maps.google.com/?q=${location.lat},${location.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10.5px] text-ink-light underline hover:text-ink transition-colors"
                          >
                            View Map ↗
                          </a>
                        </div>
                        <p className="text-[10.5px] text-ink-light/80">
                          Please verify your exact House / Flat # in the box above if needed.
                        </p>
                      </div>
                    )}

                    {errors.area && <p className="mt-1 text-[11px] text-red-600 font-medium">{errors.area}</p>}

                    {locError && (
                      <p className="mt-1.5 text-[10.5px] text-amber-800 bg-amber-50/80 p-1.5 rounded border border-amber-200/60">
                        {locError}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleOrderClick}
                  className="mt-5 w-full min-h-[48px] rounded-lg bg-[#25D366] py-3.5 text-center text-[15px] font-semibold text-white shadow-md transition-all hover:bg-[#20bd5a] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                  </svg>
                  <span>Place Order on WhatsApp</span>
                </button>
                <p className="mt-2 text-center text-[11px] text-ink-light">
                  Opens WhatsApp with your items, address & Google Maps pin.
                </p>
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* ══════ QUICK VIEW MODAL ══════ */}
      {quickViewSoap && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-4 sm:p-6 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setQuickViewSoap(null)}
          role="dialog"
          aria-modal="true"
          aria-label={quickViewSoap.name}
        >
          <div
            className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto sm:overflow-visible rounded-2xl bg-cream border border-rule/80 shadow-2xl p-5 sm:p-7 [scrollbar-width:none]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setQuickViewSoap(null)}
              className="absolute top-3.5 right-3.5 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-sand/90 text-ink-light hover:bg-ink hover:text-cream transition-colors cursor-pointer"
              aria-label="Close details"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div className="grid gap-6 md:grid-cols-2 items-center">
              {/* Product Photo */}
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-sand shadow-xs">
                <Image
                  src={quickViewSoap.img}
                  alt={quickViewSoap.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 360px"
                />
                {quickViewSoap.badge && (
                  <span className="absolute top-3 left-3 rounded-full bg-cream/95 backdrop-blur-xs px-3 py-1 text-[11px] font-semibold text-ink border border-rule/60 shadow-xs">
                    {quickViewSoap.badge}
                  </span>
                )}
                <span className="absolute top-3 right-3 rounded-full bg-cream/95 backdrop-blur-xs px-2.5 py-0.5 text-[10.5px] font-medium text-ink-light border border-rule/60">
                  {quickViewSoap.weight}
                </span>
              </div>

              {/* Product Info */}
              <div className="flex flex-col justify-center">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-terracotta">
                  Cold-Process Atelier Bar
                </span>
                <h3 className="mt-1 font-serif text-2xl font-medium leading-tight text-ink">
                  {quickViewSoap.name}
                </h3>
                <p className="mt-1 text-[12.5px] leading-relaxed text-ink-light">
                  {quickViewSoap.line}
                </p>

                {/* Price & Weight */}
                <div className="mt-2.5 flex items-baseline gap-2 pb-2.5 border-b border-rule/50">
                  <span className="font-serif text-2xl font-medium tabular-nums text-ink">
                    {rs(quickViewSoap.price)}
                  </span>
                  <span className="text-[12px] text-ink-light">
                    / {quickViewSoap.weight} · 4-Week Cured
                  </span>
                </div>

                {/* Real Benefits - Exactly What The User Provided */}
                <div className="my-3.5 rounded-xl bg-sand/70 border border-rule/60 p-3.5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-terracotta block mb-2">
                    Key Skin Benefits
                  </span>
                  <ul className="space-y-1.5">
                    {quickViewSoap.benefits.map((b, i) => (
                      <li key={i} className="flex items-center gap-2 text-[12.5px] font-medium text-ink leading-snug">
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-terracotta/15 text-terracotta text-[9.5px] font-bold">
                          ✓
                        </span>
                        <span className="capitalize">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Botanical Ingredients */}
                <p className="text-[11.5px] text-ink-light leading-relaxed">
                  <span className="font-semibold text-ink">Natural ingredients: </span>
                  {quickViewSoap.ingredients}
                </p>

                {/* Action CTA */}
                <div className="mt-4 pt-3 border-t border-rule/50">
                  <button
                    onClick={() => {
                      add(quickViewSoap);
                      setDrawerOpen(true);
                      setQuickViewSoap(null);
                    }}
                    className="w-full min-h-[46px] rounded-full bg-ink text-cream text-[13px] font-medium tracking-wide hover:bg-ink/90 active:scale-95 transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Add to Bag</span>
                    <span>·</span>
                    <span>{rs(quickViewSoap.price)}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
