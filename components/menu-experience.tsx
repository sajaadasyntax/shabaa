"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import QRCode from "qrcode";
import {
  ArrowRight,
  Check,
  Coffee,
  Languages,
  Minus,
  Plus,
  QrCode,
  Search,
  ShoppingBag,
  X,
} from "lucide-react";
import type { MenuCategory, MenuItem } from "@/lib/menu";

type Language = "en" | "ar";

const text = {
  en: {
    menu: "Our menu",
    tagline: "Only the best",
    search: "Search the menu...",
    noItems: "No items found. Try another search or category.",
    available: "Made fresh for you",
    add: "Add",
    items: "items",
    item: "item",
    review: "Your selection",
    scan: "Scan for our menu",
    download: "Download print-ready card",
    close: "Close",
    qrHint: "A print-ready card with our logo and menu QR code.",
    priceNote: "Prices shown as listed on our printed menu.",
    admin: "Admin",
    loading: "Loading menu...",
    menuError: "The menu could not be loaded. Please try again shortly.",
    all: "All",
  },
  ar: {
    menu: "قائمة الأصناف",
    tagline: "الأفضل فقط",
    search: "ابحث في القائمة...",
    noItems: "لا توجد أصناف. جرّب البحث أو القسم مرة أخرى.",
    available: "طازج لأجلك",
    add: "أضف",
    items: "أصناف",
    item: "صنف",
    review: "طلبك",
    scan: "امسح لعرض القائمة",
    download: "تحميل بطاقة QR للطباعة",
    close: "إغلاق",
    qrHint: "بطاقة جاهزة للطباعة مع شعارنا ورمز القائمة.",
    priceNote: "الأسعار كما وردت في القائمة المطبوعة.",
    admin: "الإدارة",
    loading: "جارٍ تحميل القائمة...",
    menuError: "تعذر تحميل القائمة. يرجى المحاولة لاحقاً.",
    all: "الكل",
  },
} as const;

const amount = (value: number) =>
  new Intl.NumberFormat("en", { maximumFractionDigits: 2 }).format(value);

const categoryPhotos: Record<string, string[]> = {
  "hot-drinks": [
    "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85",
  ],
  "fresh-juices": [
    "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1513558161293-cdaf765edfd7?auto=format&fit=crop&w=900&q=85",
  ],
  milkshakes: [
    "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=900&q=85",
  ],
  "cakes-desserts": [
    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=85&sat=-20",
    "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=85",
  ],
  "cool-drinks": [
    "https://images.unsplash.com/photo-1513558161293-cdaf765edfd7?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=85",
  ],
};

function imageForItem(item: MenuItem) {
  if (item.image_url) return item.image_url;
  const photos = categoryPhotos[item.category_id] ?? categoryPhotos["hot-drinks"];
  const itemHash = [...item.id].reduce((hash, character) => hash + character.charCodeAt(0), 0);
  return photos[itemHash % photos.length];
}

function loadImage(source: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not load the Shahbaa logo for the print card."));
    image.src = source;
  });
}

async function createPrintableCard(qrCode: string) {
  await document.fonts.ready;
  const [qrImage, logo] = await Promise.all([
    loadImage(qrCode),
    loadImage("/shahbaa-logo.jpg"),
  ]);
  const canvas = document.createElement("canvas");
  canvas.width = 1240;
  canvas.height = 1748;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Your browser could not prepare the printable image.");

  context.fillStyle = "#fffdf8";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = "#2b0908";
  context.lineWidth = 18;
  context.strokeRect(35, 35, canvas.width - 70, canvas.height - 70);
  context.strokeStyle = "#ed7b0b";
  context.lineWidth = 5;
  context.strokeRect(58, 58, canvas.width - 116, canvas.height - 116);

  context.fillStyle = "#2b0908";
  context.fillRect(64, 64, canvas.width - 128, 510);
  context.save();
  context.beginPath();
  context.arc(canvas.width / 2, 248, 148, 0, Math.PI * 2);
  context.fillStyle = "#fffdf8";
  context.fill();
  context.clip();
  context.drawImage(logo, canvas.width / 2 - 148, 100, 296, 296);
  context.restore();

  context.textAlign = "center";
  context.direction = "rtl";
  context.fillStyle = "#fffdf8";
  context.font = '600 52px "Noto Sans Arabic", Arial, sans-serif';
  context.fillText("شهبا كافيه", canvas.width / 2, 460);
  context.direction = "ltr";
  context.fillStyle = "#ffbd6b";
  context.font = '600 23px "DM Sans", Arial, sans-serif';
  context.fillText("SHAHBAA CAFE  ·  ONLY THE BEST", canvas.width / 2, 515);

  context.fillStyle = "#47110d";
  context.font = '600 41px "Noto Sans Arabic", Arial, sans-serif';
  context.direction = "rtl";
  context.fillText("امسح لعرض القائمة", canvas.width / 2, 655);
  context.direction = "ltr";
  context.fillStyle = "#81776d";
  context.font = '500 24px "DM Sans", Arial, sans-serif';
  context.fillText("SCAN TO VIEW OUR MENU", canvas.width / 2, 700);

  const qrSize = 750;
  const qrX = (canvas.width - qrSize) / 2;
  const qrY = 755;
  context.fillStyle = "#ffffff";
  context.fillRect(qrX - 25, qrY - 25, qrSize + 50, qrSize + 50);
  context.strokeStyle = "#e8dfd3";
  context.lineWidth = 2;
  context.strokeRect(qrX - 25, qrY - 25, qrSize + 50, qrSize + 50);
  context.drawImage(qrImage, qrX, qrY, qrSize, qrSize);

  context.fillStyle = "#ed7b0b";
  context.fillRect(450, 1578, 340, 5);
  context.fillStyle = "#47110d";
  context.direction = "rtl";
  context.font = '500 24px "Noto Sans Arabic", Arial, sans-serif';
  context.fillText("قهوة طيبة ومذاق يرضي الجميع", canvas.width / 2, 1640);
  context.direction = "ltr";
  context.fillStyle = "#81776d";
  context.font = '500 18px "DM Sans", Arial, sans-serif';
  context.fillText(window.location.host, canvas.width / 2, 1680);
  return canvas.toDataURL("image/png");
}

export default function MenuExperience({
  categories,
  items,
  loadError = false,
}: {
  categories: MenuCategory[];
  items: MenuItem[];
  loadError?: boolean;
}) {
  const [language, setLanguage] = useState<Language>("ar");
  const [activeCategory, setActiveCategory] = useState("all");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [query, setQuery] = useState("");
  const [qrOpen, setQrOpen] = useState(false);
  const [printCard, setPrintCard] = useState("");
  const [qrError, setQrError] = useState("");
  const [reviewOpen, setReviewOpen] = useState(false);
  const labels = text[language];

  const visibleItems = useMemo(() => {
    const search = query.trim().toLocaleLowerCase();
    return items.filter((item) => {
      const inCategory = activeCategory === "all" || item.category_id === activeCategory;
      const matchesSearch =
        !search ||
        `${item.name_en} ${item.name_ar} ${item.description_en} ${item.description_ar}`
          .toLocaleLowerCase()
          .includes(search);
      return inCategory && matchesSearch;
    });
  }, [activeCategory, items, query]);

  const count = Object.values(cart).reduce((total, quantity) => total + quantity, 0);
  const total = items.reduce(
    (sum, item) => sum + item.price * (cart[item.id] ?? 0),
    0,
  );

  async function showQr() {
    setQrOpen(true);
    setQrError("");
    setPrintCard("");
    try {
      const qrCode = await QRCode.toDataURL(`${window.location.origin}/`, {
        width: 750,
        margin: 2,
        errorCorrectionLevel: "H",
        color: { dark: "#2b0908", light: "#ffffff" },
      });
      setPrintCard(await createPrintableCard(qrCode));
    } catch (error) {
      setQrError(
        error instanceof Error ? error.message : "Could not generate QR code.",
      );
    }
  }

  function changeQuantity(id: string, change: number) {
    setCart((current) => {
      const quantity = (current[id] ?? 0) + change;
      const next = { ...current };
      if (quantity <= 0) delete next[id];
      else next[id] = quantity;
      return next;
    });
  }

  return (
    <main className="menu-shell" dir={language === "ar" ? "rtl" : "ltr"}>
      <header className="menu-header">
        <Link className="logo-link" href="/" aria-label="Shahbaa Café">
          <Image
            src="/shahbaa-logo.jpg"
            alt="Shahbaa Café — Only the Best"
            width={100}
            height={100}
            priority
            className="logo-image"
          />
          <span className="logo-name">Shahbaa <small>CAFE</small></span>
        </Link>
        <div className="header-actions">
          <span className="brand-promise">{labels.tagline}</span>
          <button
            className="language-toggle"
            type="button"
            onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
            aria-label={language === "ar" ? "Switch to English" : "التبديل إلى العربية"}
          >
            <Languages size={16} />
            {language === "ar" ? "English" : "العربية"}
          </button>
          <button className="qr-trigger" type="button" onClick={showQr}>
            <QrCode size={16} />
            <span>{labels.scan}</span>
          </button>
        </div>
      </header>

      <section className="menu-content" aria-labelledby="menu-title">
        <div className="menu-heading">
          <div className="menu-title-wrap">
            <span className="menu-kicker">{language === "ar" ? "شهبا كافيه" : "SHAHBAA CAFÉ"}</span>
            <h1 id="menu-title">{labels.menu}</h1>
            <p>{language === "ar" ? "قهوة طيبة ومذاق يرضي الجميع" : "Good coffee. Something for everyone."}</p>
          </div>
          <span className="coffee-stamp" aria-hidden="true">
            <Coffee size={22} />
          </span>
        </div>

        {loadError ? (
          <div className="menu-message" role="alert">{labels.menuError}</div>
        ) : (
          <>
            <div className="menu-controls">
              <div className="category-tabs" role="tablist" aria-label={labels.menu}>
                <button
                  className={activeCategory === "all" ? "category-tab selected" : "category-tab"}
                  role="tab"
                  aria-selected={activeCategory === "all"}
                  type="button"
                  onClick={() => setActiveCategory("all")}
                >
                  {labels.all}
                </button>
                {categories.map((category) => (
                  <button
                    className={activeCategory === category.id ? "category-tab selected" : "category-tab"}
                    key={category.id}
                    role="tab"
                    aria-selected={activeCategory === category.id}
                    type="button"
                    onClick={() => setActiveCategory(category.id)}
                  >
                    {language === "ar" ? category.name_ar : category.name_en}
                  </button>
                ))}
              </div>
              <label className="menu-search">
                <Search size={16} />
                <input
                  type="search"
                  aria-label={labels.search}
                  placeholder={labels.search}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
                {query && (
                  <button type="button" aria-label={labels.close} onClick={() => setQuery("")}>
                    <X size={15} />
                  </button>
                )}
              </label>
            </div>

            {visibleItems.length ? (
              <div className="menu-grid">
                {visibleItems.map((item, index) => (
                  <article className="menu-item" key={item.id}>
                    <div
                      className="item-photo"
                      role="img"
                      aria-label={language === "ar" ? item.name_ar : item.name_en}
                      style={{ backgroundImage: `url("${imageForItem(item)}")` }}
                    >
                      <span className="item-index">{String(index + 1).padStart(2, "0")}</span>
                      <span className="item-photo-category">
                        {language === "ar"
                          ? categories.find((category) => category.id === item.category_id)?.name_ar
                          : categories.find((category) => category.id === item.category_id)?.name_en}
                      </span>
                    </div>
                    <div className="item-card-info">
                      <div className="item-name-row">
                        <h2>{language === "ar" ? item.name_ar : item.name_en}</h2>
                        <span className="item-price">{amount(item.price)}</span>
                      </div>
                      {(language === "ar" ? item.description_ar : item.description_en) && (
                        <p className="item-description">{language === "ar" ? item.description_ar : item.description_en}</p>
                      )}
                      <div className="item-card-bottom">
                        <span className="item-category">
                          {language === "ar" ? "طازج لأجلك" : labels.available}
                        </span>
                        <div className="quantity-control">
                          {cart[item.id] ? (
                            <>
                          <button
                            type="button"
                            aria-label={language === "ar" ? "إزالة صنف" : "Remove one"}
                            onClick={() => changeQuantity(item.id, -1)}
                          >
                            <Minus size={14} />
                          </button>
                          <span>{cart[item.id]}</span>
                          <button
                            type="button"
                            aria-label={language === "ar" ? "إضافة صنف" : "Add one"}
                            onClick={() => changeQuantity(item.id, 1)}
                          >
                            <Plus size={14} />
                          </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              aria-label={`${labels.add} ${language === "ar" ? item.name_ar : item.name_en}`}
                              onClick={() => changeQuantity(item.id, 1)}
                            >
                              <Plus size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="menu-message">{labels.noItems}</div>
            )}
          </>
        )}
        <div className="menu-note">
          <span>{labels.priceNote}</span>
          <span className="note-star">✦</span>
        </div>
      </section>

      <footer className="menu-footer">
        <Image src="/shahbaa-logo.jpg" alt="" width={45} height={45} className="footer-logo" />
        <span>{language === "ar" ? "شهبا كافيه · الأفضل فقط" : "Shahbaa Café · Only the Best"}</span>
        <a href="/admin">{labels.admin}</a>
      </footer>

      {count > 0 && (
        <div className="order-float" role="status">
          <ShoppingBag size={18} />
          <span>{count} {language === "ar" ? labels.items : count === 1 ? labels.item : labels.items}</span>
          <strong>{amount(total)}</strong>
          <button type="button" onClick={() => setReviewOpen(true)}>
            {labels.review} <ArrowRight size={15} />
          </button>
        </div>
      )}

      {(qrOpen || reviewOpen) && (
        <div
          className="modal-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setQrOpen(false);
              setReviewOpen(false);
            }
          }}
        >
          <section className="menu-modal" role="dialog" aria-modal="true">
            <button
              className="modal-dismiss"
              type="button"
              aria-label={labels.close}
              onClick={() => {
                setQrOpen(false);
                setReviewOpen(false);
              }}
            >
              <X size={18} />
            </button>
            {qrOpen ? (
              <>
                <QrCode size={25} className="modal-symbol" />
                <h2>{labels.scan}</h2>
                <p>{labels.qrHint}</p>
                {qrError ? <p className="modal-error">{qrError}</p> : null}
                {!qrError && !printCard && (
                  <p className="qr-card-loading">{language === "ar" ? "جارٍ تجهيز بطاقة الطباعة..." : "Preparing the print card..."}</p>
                )}
                {printCard && (
                  <>
                    <Image
                      className="print-card-preview"
                      src={printCard}
                      alt={language === "ar" ? "بطاقة قائمة شهبا جاهزة للطباعة مع رمز QR" : "Shahbaa Café print-ready menu QR card"}
                      width={248}
                      height={350}
                      unoptimized
                    />
                    <a className="download-qr" href={printCard} download="shahbaa-menu-print-card.png">
                      <QrCode size={15} /> {labels.download}
                    </a>
                  </>
                )}
              </>
            ) : (
              <>
                <ShoppingBag size={25} className="modal-symbol" />
                <h2>{labels.review}</h2>
                <div className="review-list">
                  {items.filter((item) => cart[item.id]).map((item) => (
                    <div key={item.id}>
                      <span>{language === "ar" ? item.name_ar : item.name_en} × {cart[item.id]}</span>
                      <strong>{amount(item.price * cart[item.id])}</strong>
                    </div>
                  ))}
                </div>
                <div className="review-total">
                  <span>{language === "ar" ? "الإجمالي" : "Total"}</span>
                  <strong>{amount(total)}</strong>
                </div>
                <p className="review-hint">
                  {language === "ar" ? "يرجى تقديم طلبك لفريقنا." : "Please place your order with our team."}
                </p>
              </>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
