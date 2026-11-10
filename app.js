(function(){
  var S = window.SHOP || {items:[]};
  var $ = function(id){ return document.getElementById(id); };
  function esc(s){ return String(s).replace(/[&<>"']/g,function(ch){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]; }); }
  function slug(s){ return String(s).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""); }
  var items = (S.items || []).map(function(it,i){
    it._i = i;
    it._pics = (it.images && it.images.length) ? it.images.slice() : (it.image ? [it.image] : []);
    it._slug = slug(it.name);
    it._fit = it.fit || ((it.category||"") === "Art" ? "contain" : "cover");
    return it;
  });
  var fmt = new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0});
  var c = S.contact || {};
  var hasContact = !!(c.sms || c.email);
  var anyAsk = items.some(function(it){ return it.price==null && !it.sold; });
  var anySold = items.some(function(it){ return it.sold; });

  // masthead
  document.title = S.title || "For Sale";
  var t = S.title || "For Sale", m = t.match(/^(.*?)(\s+(?:Blankets|Art|Knits|Crochet|Paintings|Shop|Sale)\b.*)$/i);
  $("title").innerHTML = m ? esc(m[1]) + "<em>" + esc(m[2].trim()) + "</em>" : esc(t);
  $("tagline").textContent = S.tagline || "";
  if (S.eyebrow) $("eyebrow").textContent = S.eyebrow;
  var avail0 = items.filter(function(it){ return !it.sold; }).length;
  $("meta").innerHTML = (c.location ? '<span class="pill loc"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.6"/></svg>Local pickup in ' + esc(c.location) + '</span>' : "") +
    '<span class="pill count"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-7.5-10A4.2 4.2 0 0 1 12 8a4.2 4.2 0 0 1 7.5 2.5c0 5.4-7.5 10-7.5 10z"/></svg>' + avail0 + ' pieces</span>' +
    '<button type="button" class="btn ghost" id="shareShop">Share</button>';
  if (anyAsk || !hasContact){
    $("notice").hidden = false;
    $("notice").className = "notice";
    $("notice").innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg><span>' +
      (anyAsk && !hasContact ? "Prices and contact details are being added. Browse now and check back soon to claim a piece." :
       anyAsk ? "Prices are being finalized. Tap any piece and send a message to ask." :
       "Contact details are being added. Check back soon to claim a piece.") + "</span>";
  }

  var cats = [];
  items.forEach(function(it){ var k = it.category || "Other"; if (cats.indexOf(k) < 0) cats.push(k); });
  var avail = items.filter(function(it){ return !it.sold; });
  $("soldWrap").hidden = !anySold;

  // chips
  var cat = "All", q = "";
  function catSlug(k){ return k === "All" ? "" : k === "__saved" ? "saved" : k === "__sold" ? "sold" : slug(k); }
  function catFromSlug(h){ if (h === "saved") return favs.size ? "__saved" : null; if (h === "sold") return anySold ? "__sold" : null; var hit = cats.filter(function(k){ return slug(k) === h; })[0]; return hit || null; }
  var FAVKEY = "carlys-favs";
  function loadFavs(){ try { return new Set(JSON.parse(localStorage.getItem(FAVKEY) || "[]")); } catch (e) { return new Set(); } }
  var favs = loadFavs();
  function saveFavs(){ try { localStorage.setItem(FAVKEY, JSON.stringify(Array.from(favs))); } catch (e) {} }
  function toggleFav(it){ if (favs.has(it._slug)) favs.delete(it._slug); else favs.add(it._slug); saveFavs(); if (cat === "__saved" && !favs.size) cat = "All"; chips(); render(); if (cur && cur === it) openSheet(it, idx); }
  function matches(it){ if (!q) return true; var hay = (it.name + " " + (it.description||"") + " " + (it.category||"") + " " + (it.condition||"")).toLowerCase(); return q.split(/\s+/).every(function(w){ return hay.indexOf(w) >= 0; }); }
  function visibleBase(){ return items.filter(function(it){ return admin || !(anySold && $("hideSold").checked && it.sold); }); }
  var CHIPICON = {
    "All": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-7.5-10A4.2 4.2 0 0 1 12 8a4.2 4.2 0 0 1 7.5 2.5c0 5.4-7.5 10-7.5 10z"/></svg>',
    "Blankets": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 6h16v10H4zM4 16c0 2 1.5 3 3 3h10c1.5 0 3-1 3-3M8 6v10M12 6v10M16 6v10"/></svg>',
    "Wearables": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 4 4 7l2 4 2-1v10h8V10l2 1 2-4-5-3a3 3 0 0 1-6 0z"/></svg>',
    "Home & Cats": '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="7" cy="9" r="2.2"/><circle cx="12" cy="6.5" r="2.2"/><circle cx="17" cy="9" r="2.2"/><path d="M12 11c-3.5 0-6.5 2.8-6.5 5.5 0 1.6 1.2 2.5 2.7 2.5 1.3 0 2.3-.9 3.8-.9s2.5.9 3.8.9c1.5 0 2.7-.9 2.7-2.5C18.5 13.8 15.5 11 12 11z"/></svg>',
    "Art": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a9 9 0 1 0 0 18c1.5 0 2-1 2-2s-1-1.5-1-2.5 1-1.5 2-1.5h2a4 4 0 0 0 4-4c0-4.5-4-8-9-8z"/><circle cx="7.5" cy="11" r="1.2" fill="currentColor"/><circle cx="10" cy="7.5" r="1.2" fill="currentColor"/><circle cx="14.5" cy="7.5" r="1.2" fill="currentColor"/></svg>',
    "Cards": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="6" width="18" height="13" rx="2.5"/><path d="m3.5 8 8.5 6 8.5-6"/></svg>'
  };
  function chips(){
    var base = visibleBase();
    var h = '<button class="chip" aria-pressed="' + (cat==="All") + '" data-cat="All">' + CHIPICON.All + 'All<small>' + base.length + '</small></button>';
    cats.forEach(function(k){
      var n = base.filter(function(it){ return (it.category||"Other")===k; }).length;
      h += '<button class="chip" aria-pressed="' + (cat===k) + '" data-cat="' + esc(k) + '">' + (CHIPICON[k] || "") + esc(k) + '<small>' + n + '</small></button>';
    });
    if (favs.size) h += '<button class="chip" aria-pressed="' + (cat==="__saved") + '" data-cat="__saved"><span class="hv" aria-hidden="true"></span>Saved<small>' + base.filter(function(it){ return favs.has(it._slug); }).length + '</small></button>';
    if (anySold) h += '<button class="chip" aria-pressed="' + (cat==="__sold") + '" data-cat="__sold">Sold<small>' + items.filter(function(it){ return it.sold; }).length + '</small></button>';
    $("chips").innerHTML = h;
    Array.prototype.forEach.call($("chips").children, function(ch, k){ ch.style.setProperty("--k", k); });
  }
  function backToGrid(){ var bar = document.querySelector(".bar"), g = $("grid"); var top = g.getBoundingClientRect().top - bar.getBoundingClientRect().height - 24; if (top < -40) window.scrollBy({ top: top, behavior: reduce ? "auto" : "smooth" }); }
  $("chips").addEventListener("click", function(e){ var b = e.target.closest(".chip"); if(!b) return; cat = b.getAttribute("data-cat"); chips(); render(); backToGrid(); var cs = catSlug(cat); history.replaceState(null, "", location.pathname + location.search + (cs ? "#" + cs : "")); });

  function contactHref(item){
    var msg = "Hi! Is the \"" + item.name + "\"" + (item.price != null && item.price > 0 ? " (" + priceText(item.price) + ")" : "") + " still available? " + itemUrl(item);
    if (c.sms) return "sms:" + c.sms + "?&body=" + encodeURIComponent(msg);
    if (c.email) return "mailto:" + c.email + "?subject=" + encodeURIComponent("Interested: " + item.name) + "&body=" + encodeURIComponent(msg);
    return "";
  }
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  try { if (localStorage.getItem("carlys-motion") === "off"){ document.documentElement.setAttribute("data-motion", "off"); reduce = true; } } catch (e) {}
  function fadeIn(img){ var show = function(){ img.classList.add("in"); }; img.addEventListener("load", show); img.addEventListener("error", show); if (img.complete && img.naturalWidth) show(); }
  function heartBurst(x, y){
    if (reduce) return;
    var h = document.createElement("div"); h.className = "heartburst";
    for (var i = 0; i < 10; i++){
      var sp = document.createElement("span"); var a = (Math.PI * 2) * (i / 10) + Math.random() * .5, d = 40 + Math.random() * 50;
      sp.style.left = x + "px"; sp.style.top = y + "px";
      sp.style.setProperty("--dx", Math.cos(a) * d + "px"); sp.style.setProperty("--dy", Math.sin(a) * d - 30 + "px"); sp.style.setProperty("--rot", (Math.random() * 90 - 45) + "deg");
      sp.style.animationDelay = (Math.random() * .08) + "s"; h.appendChild(sp);
    }
    document.body.appendChild(h); setTimeout(function(){ h.remove(); }, 1000);
  }
  document.addEventListener("click", function(e){ var b = e.target.closest(".btn, .chip, .pickup"); if (b) heartBurst(e.clientX || (b.getBoundingClientRect().left + b.offsetWidth/2), e.clientY || (b.getBoundingClientRect().top + b.offsetHeight/2)); });
  document.addEventListener("pointermove", function(e){
    if (reduce || e.pointerType === "touch") return;
    var card = e.target.closest(".card"); if (!card) return;
    var r = card.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
    card.classList.add("tilt"); card.style.transform = "perspective(900px) rotateX(" + (-py * 6) + "deg) rotateY(" + (px * 6) + "deg) translateY(-4px)";
  });
  document.addEventListener("pointerout", function(e){ var card = e.target.closest(".card"); if (card && !card.contains(e.relatedTarget)){ card.style.transform = ""; card.classList.remove("tilt"); } });
  var WEBP = (function(){ try { return document.createElement("canvas").toDataURL("image/webp").indexOf("data:image/webp") === 0; } catch (e) { return false; } })();
  function isLocal(src){ return /^images\/[^/]+\.jpe?g$/i.test(src); }
  function ext(src){ return WEBP ? src.replace(/\.jpe?g$/i, ".webp") : src; }
  function variant(src, dir){ return isLocal(src) ? ext(src.replace(/^images\//, "images/" + dir + "/")) : src; }
  function thumb(src){ return isLocal(src) ? variant(src, "thumbs") : ""; }
  function full(src){ return isLocal(src) ? ext(src) : src; }
  function setSrc(img, src){ if (!isLocal(src)){ img.src = src; img.removeAttribute("srcset"); return; } img.src = variant(src, "thumbs"); img.srcset = variant(src, "small") + " 360w, " + variant(src, "thumbs") + " 600w, " + full(src) + " 1200w"; }
  function priceText(p){ return p==null ? "Ask us" : (p===0 ? "Free" : fmt.format(p)); }
  var PAY = S.payments || {};
  var ACCEPTED = (PAY.accepted && PAY.accepted.length) ? PAY.accepted : ["Cash", "Venmo"];
  function claimText(it){
    var name = $("cName").value.trim(), when = $("cWhen").value, pay = ($("cPay").querySelector("input:checked") || {}).value || "", note = $("cNote").value.trim();
    var lines = it._bundle ? ["Hi! I'd like to claim these pieces" + (it.price > 0 ? " (" + priceText(it.price) + " together)" : "") + ":", it.description, ""] : ["Hi! I'd like to claim the \"" + it.name + "\"" + (it.price > 0 ? " (" + priceText(it.price) + ")" : "") + ".", ""];
    if (name) lines.push("Name: " + name);
    lines.push("Pickup: " + when + (c.location ? " in " + c.location : ""));
    if (pay) lines.push("Paying with: " + pay);
    if (note) lines.push("", note);
    lines.push("", itemUrl(it));
    return { subject: (it._bundle ? "Claim: " : "Claim: ") + it.name + (it.price > 0 ? " (" + priceText(it.price) + ")" : ""), body: lines.join("\n") };
  }
  function claimHref(it){ var t = claimText(it); if (c.sms) return "sms:" + c.sms + "?&body=" + encodeURIComponent(t.body); return "mailto:" + c.email + "?subject=" + encodeURIComponent(t.subject) + "&body=" + encodeURIComponent(t.body); }
  function showClaim(it){
    var f = $("claim"); f.hidden = false; f.dataset.slug = it._slug;
    $("cPay").innerHTML = '<span class="lbl">Paying with</span>' + ACCEPTED.map(function(m, i){ return '<label><input type="radio" name="cpay" value="' + esc(m) + '"' + (i === 0 ? " checked" : "") + '>' + esc(m) + '</label>'; }).join("");
    setTimeout(function(){ $("cName").focus({preventScroll:false}); f.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest" }); }, 50);
  }
  $("claim").addEventListener("submit", function(e){ e.preventDefault(); if (!cur || !hasContact) return; var href = claimHref(cur); window.location.href = href; toast("Opening your " + (c.sms ? "messages" : "email") + " app…"); });
  $("cCopy").addEventListener("click", function(){ if (!cur) return; var t = claimText(cur), txt = "To: " + (c.sms || c.email) + "\nSubject: " + t.subject + "\n\n" + t.body; var done = function(){ toast("Request copied. Paste it into any message to " + (c.sms || c.email) + "."); }; if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done, function(){ prompt("Copy this:", txt); }); else prompt("Copy this:", txt); });
  function payLinks(it){
    var out = [], amt = it.price, note = it.name + " (Carly's Handmade)";
    if (!(amt > 0)) return out;
    if (PAY.venmo) out.push({ name: "Venmo", href: "https://venmo.com/u/" + encodeURIComponent(PAY.venmo.replace(/^@/, "")) + "?txn=pay&amount=" + amt + "&note=" + encodeURIComponent(note), cls: "venmo" });
    if (PAY.cashapp) out.push({ name: "Cash App", href: "https://cash.app/$" + encodeURIComponent(PAY.cashapp.replace(/^\$/, "")) + "/" + amt, cls: "cashapp" });
    if (PAY.paypal) out.push({ name: "PayPal", href: "https://paypal.me/" + encodeURIComponent(PAY.paypal.replace(/^@/, "")) + "/" + amt + "USD", cls: "paypal" });
    return out;
  }
  function buyHref(it){ return (!it.sold && it.buy) ? it.buy : ""; }
  function pv(it){ return it.price==null ? Infinity : it.price; }

  function render(){
    var sort = $("sort").value;
    var list = visibleBase();
    if (cat === "__sold") list = items.filter(function(it){ return it.sold; });
    else if (cat === "__saved") list = list.filter(function(it){ return favs.has(it._slug); });
    else if (cat !== "All") list = list.filter(function(it){ return (it.category||"Other")===cat; });
    list = list.filter(matches);
    if (sort==="price-asc") list.sort(function(a,b){ return pv(a)-pv(b); });
    else if (sort==="price-desc") list.sort(function(a,b){ var x=pv(a),y=pv(b); if(x===Infinity&&y===Infinity)return 0; if(x===Infinity)return 1; if(y===Infinity)return -1; return y-x; });
    else if (sort==="name") list.sort(function(a,b){ return a.name.localeCompare(b.name); });
    else list.sort(function(a,b){ return (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || a._i-b._i; });

    lastList = list.slice();
    var sb = $("savedBar"); if (cat === "__saved" && list.length > 1){ var tot = list.reduce(function(a, b){ return a + (b.price > 0 ? b.price : 0); }, 0); sb.hidden = false; sb.innerHTML = '<span>' + list.length + ' saved pieces' + (tot ? ' · ' + fmt.format(tot) + ' together' : '') + '</span><button type="button" class="btn" id="claimAll">Claim all ' + list.length + '</button>'; $("claimAll").addEventListener("click", function(){ var bundle = { name: list.length + " saved pieces", category: "Saved", price: tot || null, condition: "", description: list.map(function(b){ return "• " + b.name + (b.price > 0 ? " · " + priceText(b.price) : ""); }).join("\n"), _pics: list.map(function(b){ return b._pics[0]; }).filter(Boolean), _slug: "saved", _fit: "cover", _bundle: true, _i: -1 }; openSheet(bundle, 0); showClaim(bundle); }); } else { sb.hidden = true; sb.innerHTML = ""; }
    $("results").textContent = (list.length === items.length ? "Showing all " + list.length + " pieces" : "Showing " + list.length + " of " + items.length) + (cat === "__saved" ? " · Saved" : cat === "__sold" ? " · Sold" : cat !== "All" ? " · " + cat : "") + (q ? ' · "' + q + '"' : "");
    var grid = $("grid"); grid.innerHTML = "";
    if (!list.length){
      var allSold = items.length && items.every(function(it){ return it.sold; });
      var msg = q ? "No pieces match \"" + esc(q) + "\". Try another word." : cat === "__saved" ? "Nothing saved yet. Tap the heart on a piece to keep it here." : allSold ? "Every piece has found a home. Thank you! Ask about a custom order below." : "Nothing here right now.";
      grid.innerHTML = '<div class="empty"><svg viewBox="0 0 120 80" aria-hidden="true"><path d="M20 78 L28 46 L48 58 Z M100 78 L92 46 L72 58 Z" fill="var(--lavender)"/><circle cx="60" cy="56" r="30" fill="var(--lavender)"/><path d="M26 44 L30 14 L52 30 Z M94 44 L90 14 L68 30 Z" fill="var(--lavender)"/><path d="M34 40 L36 22 L48 32 Z M86 40 L84 22 L72 32 Z" fill="var(--pink)"/><path d="M46 54 q5 -6 10 0 M64 54 q5 -6 10 0" stroke="var(--ink)" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M60 60 l-4 -4 q4 -3 8 0 z" fill="var(--heart)"/><path d="M60 60 q-4 5 -8 2 M60 60 q4 5 8 2" stroke="var(--ink)" stroke-width="2.4" fill="none" stroke-linecap="round"/><rect x="0" y="72" width="120" height="8" rx="4" fill="var(--pink)" opacity=".6"/></svg><p>' + msg + '</p>' + (q || cat !== "All" ? '<button type="button" class="btn ghost" id="clearFilters">Show everything</button>' : "") + '</div>';
      var cf = $("clearFilters"); if (cf) cf.addEventListener("click", function(){ q = ""; $("q").value = ""; cat = "All"; chips(); render(); history.replaceState(null, "", location.pathname + location.search); });
      if (allSold && S.custom && !q && cat === "All"){ /* keep the custom-orders card reachable */ }
      return;
    }
    list.forEach(function(it){
      var card = document.createElement("article");
      card.className = "card" + (it.sold ? " sold" : "");
      card.style.setProperty("--i", Math.min(grid.children.length, 11));
      var ph = document.createElement("button"); ph.className = "ph" + (it._fit==="contain" ? " contain" : ""); ph.type="button"; ph.setAttribute("aria-label","Open details for " + it.name + ", " + priceText(it.price));
      var frame = document.createElement("span"); frame.className = "frame"; ph.appendChild(frame);
      var lq = (window.LQIP || {})[it._pics[0]]; if (lq){ frame.style.backgroundImage = "url(" + lq + ")"; frame.style.backgroundSize = "cover"; frame.style.backgroundPosition = "center"; }
      var im = null, shown = 0;
      if (it._pics.length){ im = document.createElement("img"); fadeIn(im); setSrc(im, it._pics[0]); im.alt = it.name; im.loading = grid.children.length < (window.innerWidth < 560 ? 2 : 4) ? "eager" : "lazy"; if (grid.children.length === 0) im.setAttribute("fetchpriority", "high"); im.decoding = "async"; im.sizes = "(max-width:560px) 50vw, (max-width:1100px) 33vw, 280px"; frame.appendChild(im); ph.addEventListener("click", function(){ openSheet(it, shown); }); }
      else { frame.innerHTML = '<span class="noimg">Photo coming</span>'; ph.disabled = true; }
      var pt = document.createElement("span"); pt.className = "pt" + (it.price==null ? " ask" : ""); pt.textContent = priceText(it.price); pt.style.setProperty("--i", grid.children.length); ph.appendChild(pt);
      if (it.sold){ var b = document.createElement("span"); b.className="badge"; b.textContent="SOLD"; ph.appendChild(b); }
      else if (it.featured){ card.classList.add("featured"); var fw = document.createElement("span"); fw.className = "sash-wrap"; fw.innerHTML = '<span class="sash"><span class="sash-in"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="7" cy="9" r="2.2"/><circle cx="12" cy="6.5" r="2.2"/><circle cx="17" cy="9" r="2.2"/><path d="M12 11c-3.5 0-6.5 2.8-6.5 5.5 0 1.6 1.2 2.5 2.7 2.5 1.3 0 2.3-.9 3.8-.9s2.5.9 3.8.9c1.5 0 2.7-.9 2.7-2.5C18.5 13.8 15.5 11 12 11z"/></svg>' + esc(S.featuredLabel || "Carly's pick") + '</span></span><i class="sp sp1" aria-hidden="true"></i><i class="sp sp2" aria-hidden="true"></i><i class="sp sp3" aria-hidden="true"></i>'; ph.appendChild(fw); }
      card.appendChild(ph);
      if (admin){ var mk = document.createElement("button"); mk.type = "button"; mk.className = "mark"; var cur_sold = soldEdits.hasOwnProperty(it._slug) ? soldEdits[it._slug] : !!it.sold; mk.setAttribute("aria-pressed", cur_sold); mk.textContent = cur_sold ? "Sold ✓" : "Mark sold"; mk.addEventListener("click", function(e){ e.stopPropagation(); soldEdits[it._slug] = !cur_sold; render(); }); ph.appendChild(mk); }
      if (it._pics.length > 1 && im && matchMedia("(hover:hover)").matches){
        var peekTimer; card.addEventListener("mouseenter", function(){ peekTimer = setTimeout(function(){ if (shown === 0) swapImg(im, it._pics[1]); }, 450); });
        card.addEventListener("mouseleave", function(){ clearTimeout(peekTimer); if (shown === 0) swapImg(im, it._pics[0]); });
      }
      var fav = document.createElement("button"); fav.type = "button"; fav.className = "fav"; fav.setAttribute("aria-pressed", favs.has(it._slug)); fav.setAttribute("aria-label", favs.has(it._slug) ? "Remove from saved" : "Save this piece");
      fav.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-7.5-10A4.2 4.2 0 0 1 12 8a4.2 4.2 0 0 1 7.5 2.5c0 5.4-7.5 10-7.5 10z"/></svg>';
      fav.addEventListener("click", function(e){ e.stopPropagation(); toggleFav(it); heartBurst(e.clientX, e.clientY); });
      card.appendChild(fav);

      if (it._pics.length > 1){
        var strip = document.createElement("div"); strip.className="thumbs";
        it._pics.forEach(function(src,k){
          var tb = document.createElement("button"); tb.type="button"; tb.setAttribute("aria-label","Photo " + (k+1) + " of " + it._pics.length); if(k===0) tb.setAttribute("aria-current","true");
          var ti = document.createElement("img"); ti.src = thumb(src) || src; ti.alt=""; ti.loading="lazy"; ti.decoding="async"; tb.appendChild(ti);
          tb.addEventListener("click", function(){ swapImg(im, src); shown = k; Array.prototype.forEach.call(strip.children,function(x){ x.removeAttribute("aria-current"); }); tb.setAttribute("aria-current","true"); });
          strip.appendChild(tb);
        });
        card.appendChild(strip);
      }

      var body = document.createElement("div"); body.className="body";
      var name = document.createElement("h2"); name.className="name";
      var nb = document.createElement("button"); nb.type="button"; nb.textContent = it.name; nb.addEventListener("click", function(){ openSheet(it, shown); }); name.appendChild(nb); body.appendChild(name);
      if (it.condition){ var cd = document.createElement("div"); cd.className="cond"; cd.textContent = it.condition; body.appendChild(cd); }
      if (it.description){ var d = document.createElement("p"); d.className="desc"; d.textContent = it.description; body.appendChild(d); }
      var act = document.createElement("div"); act.className="actions";
      var href = contactHref(it), buy = buyHref(it);
      if (it.sold){ var sb = document.createElement("span"); sb.className="btn"; sb.textContent="Sold"; sb.setAttribute("aria-disabled","true"); act.appendChild(sb); }
      else if (buy){ var ba = document.createElement("a"); ba.className="btn buy"; ba.href=buy; ba.target="_blank"; ba.rel="noopener"; ba.textContent="Buy now"; act.appendChild(ba); }
      else if (href){ var a = document.createElement("button"); a.type="button"; a.className="btn"; a.textContent="I'm interested"; a.addEventListener("click", function(){ openSheet(it, shown); showClaim(it); }); act.appendChild(a); }
      var det = document.createElement("button"); det.type="button"; det.className="btn ghost"; det.textContent="Details"; det.addEventListener("click", function(){ openSheet(it, shown); }); act.appendChild(det);
      body.appendChild(act);
      card.appendChild(body);
      grid.appendChild(card);
    });
    if (S.custom && cat === "All" && !q){
      var cc = document.createElement("article"); cc.className = "card custom"; cc.style.setProperty("--i", Math.min(grid.children.length, 11));
      var href = c.sms ? "sms:" + c.sms + "?&body=" + encodeURIComponent("Hi! I'd love to ask about a custom piece.") : c.email ? "mailto:" + c.email + "?subject=" + encodeURIComponent("Custom piece") : "";
      cc.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-8-5.3-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.7-8 11-8 11z"/><path d="M8.5 9.5c1.2-1 2.6-1 3.5 0"/></svg><h2>' + esc(S.custom.title || "Want something custom?") + '</h2><p>' + esc(S.custom.text || "") + '</p>' +
        (hasContact ? '<button type="button" class="btn" data-custom>Request a custom piece</button>' : '<button type="button" class="btn" data-soon>Ask Carly</button>');
      grid.appendChild(cc);
    }
  }
  var lastList = [];
  var cdlg = $("customDlg");
  function openCustom(preset){ if (preset){ var sel = $("cdWhat"); Array.prototype.forEach.call(sel.options, function(o){ if (o.text.toLowerCase().indexOf(preset) >= 0) sel.value = o.text; }); } if (sheet.open){ fromPop = true; sheet.close(); fromPop = false; } if (typeof cdlg.showModal === "function" && !cdlg.open) cdlg.showModal(); $("cdTitle").focus && $("cdWhat").focus(); }
  document.addEventListener("click", function(e){ var b = e.target.closest("[data-custom]"); if (!b) return; e.preventDefault(); openCustom(b.getAttribute("data-custom") || ""); });
  $("cdx").addEventListener("click", function(){ cdlg.close(); }); cdlg.addEventListener("click", function(e){ if (e.target === cdlg) cdlg.close(); });
  function customText(){
    var what = $("cdWhat").value, det = $("cdDetails").value.trim(), bud = $("cdBudget").value, when = $("cdWhen").value, name = $("cdName").value.trim();
    var lines = ["Hi Carly! I'd love a custom piece.", "", "What: " + what, "Budget: " + bud, "Timing: " + when];
    if (det) lines.push("", "Details: " + det);
    if (name) lines.push("", "Name: " + name);
    return { subject: "Custom request: " + what, body: lines.join("\n") };
  }
  $("cform").addEventListener("submit", function(e){ e.preventDefault(); if (!hasContact) return; var t = customText(); window.location.href = c.sms ? "sms:" + c.sms + "?&body=" + encodeURIComponent(t.body) : "mailto:" + c.email + "?subject=" + encodeURIComponent(t.subject) + "&body=" + encodeURIComponent(t.body); toast("Opening your " + (c.sms ? "messages" : "email") + " app…"); });
  $("cdCopy").addEventListener("click", function(){ var t = customText(), txt = "To: " + (c.sms || c.email) + "\nSubject: " + t.subject + "\n\n" + t.body; var done = function(){ toast("Request copied."); }; if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done, function(){ prompt("Copy this:", txt); }); else prompt("Copy this:", txt); });
  document.addEventListener("click", function(e){ var b = e.target.closest("[data-soon]"); if (b) toast("Contact details are coming soon."); });

  // detail sheet
  var sheet = $("sheet"), cur = null, idx = 0;
  function openSheet(it, i){
    cur = it; idx = i >= 0 ? i : 0;
    $("shcat").textContent = it.category || "";
    $("shname").textContent = it.name;
    $("shprice").innerHTML = it.sold ? '<span style="color:var(--sold)">Sold</span>' : (it.price==null ? 'Price on request<small>' + (hasContact ? "Send a message and we'll get right back to you." : "Prices are being finalized.") + '</small>' : esc(priceText(it.price)));
    $("shdesc").textContent = it.description || "";
    var meta = "";
    if (it.condition) meta += "<dt>Condition</dt><dd>" + esc(it.condition) + "</dd>";
    if (c.location) meta += "<dt>Pickup</dt><dd>" + esc(c.location) + "</dd>";
    if (it._pics.length > 1) meta += "<dt>" + (it._bundle ? "Pieces" : "Photos") + "</dt><dd>" + it._pics.length + "</dd>";
    $("shmeta").innerHTML = meta;
    var href = contactHref(it), cta = "";
    var saved = !it._bundle && favs.has(it._slug);
    var buy = buyHref(it), pays = it.sold ? [] : payLinks(it);
    var tools = '<div class="row">' + (it.sold ? "" : buy ? '<a class="btn buy" href="' + esc(buy) + '" target="_blank" rel="noopener">Buy now · ' + esc(priceText(it.price)) + '</a>' : href ? '<button type="button" class="btn" id="shclaim">Claim this piece</button>' : "") +
      (buy && href ? '<a class="btn ghost" href="' + esc(href) + '">Ask</a>' : "") +
      (it._bundle ? "" : '<button type="button" class="btn ghost" id="shfav" aria-pressed="' + saved + '">' + (saved ? "♥ Saved" : "♡ Save") + '</button>') +
      '<button type="button" class="btn ghost" id="shshare">Share</button></div>';
    var payHtml = "";
    if (pays.length){
      payHtml = '<div class="pay"><div class="pay-title">' + (buy ? "Or pay directly" : "Pay " + esc(priceText(it.price))) + '</div><div class="pay-row">' + pays.map(function(l){ return '<a class="paybtn ' + l.cls + '" href="' + esc(l.href) + '" target="_blank" rel="noopener">' + esc(l.name) + '</a>'; }).join("") + '</div><p class="hint">' + esc(PAY.note || "Message first so we can confirm it's still available, then pay.") + '</p></div>';
    }
    if (it.sold) cta = tools + '<p class="hint">This one has found a home. Browse the rest, or ' + (hasContact ? '<a href="#" data-custom>ask for a custom piece</a>.' : 'check back for new pieces.') + '</p>';
    else if (buy) cta = tools + '<p class="hint">Secure checkout with card or Apple Pay. ' + (href ? 'Questions? <a href="' + esc(href) + '">Send a message</a>.' : '') + '</p>' + payHtml;
    else if (href) cta = tools + '<div class="accepted">We take ' + ACCEPTED.map(function(m){ return "<span>" + esc(m) + "</span>"; }).join("") + ' at pickup</div><p class="hint">Or reach out directly: <code>' + esc(c.sms || c.email) + '</code></p>' + payHtml;
    else cta = tools + '<p class="hint">Contact details are being added. Save it or share it for now.</p>' + payHtml;
    $("shcta").innerHTML = cta;
    $("shbar").innerHTML = it.sold ? "" : buy ? '<a class="btn buy" href="' + esc(buy) + '" target="_blank" rel="noopener">Buy now · ' + esc(priceText(it.price)) + '</a>' : href ? '<button type="button" class="btn" id="shbarclaim">Claim this piece · ' + esc(priceText(it.price)) + '</button>' : "";
    var sbc = $("shbarclaim"); if (sbc) sbc.addEventListener("click", function(){ showClaim(it); });
    var sc = $("shclaim"); if (sc) sc.addEventListener("click", function(){ showClaim(it); });
    var cf = $("claim"); if (cf.dataset.slug !== it._slug){ cf.hidden = true; $("cName").value = ""; $("cNote").value = ""; }
    var sf = $("shfav"); if (sf) sf.addEventListener("click", function(e){ toggleFav(it); heartBurst(e.clientX, e.clientY); });
    $("shshare").addEventListener("click", function(){ shareItem(it); });
    var rel = it._bundle ? [] : items.filter(function(x){ return x !== it && !x.sold && (x.category||"") === (it.category||"") }).slice(0, 4);
    if (!it._bundle && rel.length < 2) rel = rel.concat(items.filter(function(x){ return x !== it && !x.sold && rel.indexOf(x) < 0; }).slice(0, 4 - rel.length));
    $("shrelated").hidden = !rel.length;
    var row = $("shrelrow"); row.innerHTML = "";
    rel.forEach(function(x){ var b = document.createElement("button"); b.type = "button"; b.innerHTML = '<img src="' + esc(thumb(x._pics[0]) || x._pics[0] || "") + '" alt=""><span>' + esc(x.name) + '</span>'; b.addEventListener("click", function(){ openSheet(x, 0); $("shname").focus({preventScroll:true}); }); row.appendChild(b); });
    var pool = lastList.length ? lastList : items, pos = pool.indexOf(it);
    $("shPrevItem").hidden = $("shNextItem").hidden = it._bundle || pool.length < 2;
    $("shPrevItem").onclick = function(){ openSheet(pool[(pos - 1 + pool.length) % pool.length], 0); };
    $("shNextItem").onclick = function(){ openSheet(pool[(pos + 1) % pool.length], 0); };
    var th = $("shthumbs"); th.innerHTML = ""; th.hidden = it._pics.length < 2;
    it._pics.forEach(function(src,k){
      var b = document.createElement("button"); b.type="button"; b.setAttribute("aria-label","Photo " + (k+1));
      var im = document.createElement("img"); im.src = thumb(src) || src; im.alt = ""; im.decoding = "async"; b.appendChild(im);
      b.addEventListener("click", function(){ idx = k; showPic(); });
      th.appendChild(b);
    });
    $("shprev").hidden = $("shnext").hidden = it._pics.length < 2;
    showPic();
    var wasOpen = sheet.open;
    if (typeof sheet.showModal === "function" && !sheet.open) sheet.showModal();
    $("shname").focus({preventScroll:true});
    if (location.hash !== "#" + it._slug){ if (wasOpen || (history.state && history.state.sheet)) history.replaceState({sheet:true}, "", "#" + it._slug); else history.pushState({sheet:true}, "", "#" + it._slug); }
    else if (!(history.state && history.state.sheet)) history.replaceState({sheet:true}, "", "#" + it._slug);
  }
  function swapImg(img, src){
    var card = img.closest(".ph"); // card images keep their srcset; sheet image is full size only
    var apply = function(){ if (card) setSrc(img, src); else { img.removeAttribute("srcset"); img.src = full(src); } };
    if ((card ? (thumb(src) || src) : full(src)) === img.getAttribute("src")) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches){ apply(); return; }
    img.classList.add("swap");
    var pre = new Image(); pre.onload = pre.onerror = function(){ apply(); requestAnimationFrame(function(){ img.classList.remove("swap"); }); }; pre.src = card ? (thumb(src) || src) : full(src);
  }
  function showPic(){
    var img = $("shimg"); if (sheet.open) swapImg(img, cur._pics[idx] || ""); else { img.removeAttribute("srcset"); img.src = full(cur._pics[idx] || ""); } img.alt = cur.name + (cur._pics.length > 1 ? ", photo " + (idx+1) + " of " + cur._pics.length : "");
    Array.prototype.forEach.call($("shthumbs").children, function(b,k){ if (k===idx) b.setAttribute("aria-current","true"); else b.removeAttribute("aria-current"); });
  }
  function step(n){ if(!cur) return; idx = (idx + n + cur._pics.length) % cur._pics.length; showPic(); }
  $("shprev").addEventListener("click", function(){ step(-1); });
  $("shnext").addEventListener("click", function(){ step(1); });
  $("shx").addEventListener("click", function(){ sheet.close(); });
  sheet.addEventListener("click", function(e){ if (e.target === sheet) sheet.close(); });
  var fromPop = false;
  sheet.addEventListener("close", function(){ cur = null; if (fromPop) return; if (history.state && history.state.sheet){ history.back(); return; } var cs = catSlug(cat); history.replaceState(null, "", location.pathname + location.search + (cs ? "#" + cs : "")); });
  window.addEventListener("popstate", function(){ if (sheet.open){ fromPop = true; sheet.close(); fromPop = false; } if (!(history.state && history.state.sheet)){ var h = location.hash.replace(/^#/, ""); var k = h ? catFromSlug(h) : null; if (k !== null && k !== cat){ cat = k; chips(); render(); } else if (!h && cat !== "All"){ cat = "All"; chips(); render(); } } openFromHash(); });
  document.addEventListener("keydown", function(e){ if(!sheet.open) return; if(e.key==="ArrowLeft") step(-1); if(e.key==="ArrowRight") step(1); });
  (function(){
    var sy = null, sx0 = null, dragging = false, scroller = document.querySelector(".sh");
    sheet.addEventListener("touchstart", function(e){ if (e.touches.length !== 1 || !$("zoom").hidden) return; sy = e.touches[0].clientY; sx0 = e.touches[0].clientX; dragging = false; }, {passive:true});
    sheet.addEventListener("touchmove", function(e){ if (sy == null) return; var dy = e.touches[0].clientY - sy, dx = Math.abs(e.touches[0].clientX - sx0); if (!dragging && dy > 12 && dy > dx * 1.5 && scroller.scrollTop <= 0) dragging = true; if (dragging){ sheet.style.transition = "none"; sheet.style.transform = "translateY(" + Math.max(0, dy * .6) + "px)"; sheet.style.opacity = String(Math.max(.4, 1 - dy / 600)); } }, {passive:true});
    function end(e){ if (sy == null) return; var dy = dragging && e.changedTouches ? e.changedTouches[0].clientY - sy : 0; sy = null; if (!dragging) return; dragging = false; sheet.style.transition = "transform .25s ease, opacity .25s ease"; if (dy > 110){ sheet.style.transform = "translateY(100vh)"; sheet.style.opacity = "0"; setTimeout(function(){ sheet.close(); sheet.style.transition = ""; sheet.style.transform = ""; sheet.style.opacity = ""; }, 220); } else { sheet.style.transform = ""; sheet.style.opacity = ""; setTimeout(function(){ sheet.style.transition = ""; }, 260); } }
    sheet.addEventListener("touchend", end, {passive:true}); sheet.addEventListener("touchcancel", end, {passive:true});
  })();
  var sx = null;
  $("shimg").addEventListener("touchstart", function(e){ sx = e.touches[0].clientX; }, {passive:true});
  $("shimg").addEventListener("touchend", function(e){ if (sx==null) return; var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1); sx = null; }, {passive:true});
  function itemUrl(it){ var base = (S.url || (location.origin + location.pathname)).replace(/#.*$/, ""); if (S.url && !it._bundle) return base.replace(/\/?$/, "/") + "p/" + it._slug + "/"; return base + "#" + it._slug; }
  function shareItem(it){
    var url = itemUrl(it), title = it.name + " · " + (S.title || "");
    if (navigator.share){ navigator.share({ title: title, text: it.name + (it.price != null ? " · " + priceText(it.price) : ""), url: url }).catch(function(){}); return; }
    var done = function(){ toast("Link copied. Send it to someone who'd love this."); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, function(){ prompt("Copy this link:", url); });
    else prompt("Copy this link:", url);
  }
  var toastTimer;
  function toast(msg){ var t = $("toast"); t.textContent = msg; t.hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(function(){ t.hidden = true; }, 2600); }
  function openFromHash(){ var h = location.hash.replace(/^#/,""); if (!h) return; var it = items.filter(function(x){ return x._slug === h; })[0]; if (it){ openSheet(it, 0); return; } var k = catFromSlug(h); if (k){ cat = k; chips(); render(); } }

  // how it works + footer
  if (!hasContact){ $("step1b").textContent = "Pick a piece"; $("step1").textContent = "Contact details are coming soon. Until then, browse and tap any piece for photos and details."; }
  else { $("step1b").textContent = "Claim a piece"; $("step1").textContent = "Tap \"Claim this piece\", add your name and a pickup time, and it opens a" + (c.sms ? " text" : "n email") + " to us, ready to send."; }
  if (!S.payment) $("paytext").textContent = ACCEPTED.join(" or ") + " at pickup.";
  var cl = [];
  if (c.sms) cl.push('Text <code>' + esc(c.sms) + '</code>');
  if (c.email) cl.push('email <code>' + esc(c.email) + '</code>');
  $("contactline").innerHTML = cl.length ? "Prefer to reach out directly? " + cl.join(" or ") + "." : "";
  if (S.payment) $("paytext").textContent = S.payment;
  if (items.some(function(it){ return it.buy; })) { $("step1b").textContent = "Tap \"Buy now\""; $("step1").textContent = "Secure checkout with card or Apple Pay. One of each, so it's yours the moment you pay."; document.querySelector(".steps li:nth-child(2) b").textContent = "We'll be in touch"; document.querySelector(".steps li:nth-child(2) span").textContent = "You'll get a receipt by email and we'll arrange pickup" + (c.location ? " in " + c.location : "") + "."; }
  $("footer").innerHTML = esc(S.footer || "Made with") + ' <span class="heart" aria-label="love">&#9829;</span> ' + esc("by Carly") + (c.location ? " in " + esc(c.location) : "") + ".";

  $("sort").addEventListener("change", render);
  $("q").addEventListener("input", function(){ q = this.value.trim().toLowerCase(); render(); backToGrid(); });
  $("sort").addEventListener("change", backToGrid);
  (function(){
    var root = document.documentElement, KEY = "carlys-theme";
    try { var saved = localStorage.getItem(KEY); if (saved === "dark" || saved === "light") root.setAttribute("data-theme", saved); } catch (e) {}
    function isDark(){ var t = root.getAttribute("data-theme"); return t ? t === "dark" : matchMedia("(prefers-color-scheme: dark)").matches; }
    function label(){ $("theme").setAttribute("aria-label", isDark() ? "Switch to light mode" : "Switch to dark mode"); }
    $("theme").addEventListener("click", function(){ var next = isDark() ? "light" : "dark"; root.setAttribute("data-theme", next); try { localStorage.setItem(KEY, next); } catch (e) {} label(); });
    label();
  })();
  window.addEventListener("scroll", function(){ $("totop").hidden = window.scrollY < 700; }, {passive:true});
  (function(){
    var bar = document.querySelector(".bar"), sent = $("barSentinel");
    if ("IntersectionObserver" in window){ new IntersectionObserver(function(en){ var stuck = !en[0].isIntersecting; if (bar.classList.contains("stuck") !== stuck){ bar.classList.toggle("stuck", stuck); if (stuck) Array.prototype.forEach.call(bar.querySelectorAll(".chip"), function(ch, k){ ch.style.setProperty("--k", k); }); } }, {rootMargin: "-1px 0px 0px 0px", threshold: 0}).observe(sent); }
    document.querySelector(".minilogo").addEventListener("click", function(e){ e.preventDefault(); window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); });
  })();
  $("totop").addEventListener("click", function(){ window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); });
  (function(){
    var picks = [], seen = {};
    items.forEach(function(it){ var k = it.category || "Other"; if (!it.sold && it._pics.length && !seen[k] && picks.length < 3){ seen[k] = 1; picks.push(it); } });
    var col = $("collage"); col.innerHTML = "";
    if (!matchMedia("(min-width: 960px)").matches) return;
    picks.forEach(function(it){ var b = document.createElement("button"); b.type = "button"; b.setAttribute("aria-label", "Open " + it.name); b.innerHTML = '<img src="' + esc(thumb(it._pics[0]) || it._pics[0]) + '" alt="" loading="eager"><span>' + esc(it.name) + '</span>'; b.addEventListener("click", function(){ openSheet(it, 0); }); col.appendChild(b); });
  })();
  $("shimg").addEventListener("click", function(){ if (!cur) return; $("zoomimg").src = full(cur._pics[idx] || ""); $("zoomimg").alt = cur.name; $("zoom").hidden = false; });
  function closeZoom(){ $("zoom").hidden = true; }
  $("zoom").addEventListener("click", closeZoom); $("zoomx").addEventListener("click", function(e){ e.stopPropagation(); closeZoom(); });
  sheet.addEventListener("close", closeZoom);
  document.addEventListener("keydown", function(e){
    if (e.key === "Escape" && !$("zoom").hidden){ closeZoom(); e.preventDefault(); return; }
    if (e.key === "/" && !sheet.open && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)){ e.preventDefault(); $("q").focus(); }
    if (e.key === "Escape" && document.activeElement === $("q") && $("q").value){ $("q").value = ""; q = ""; render(); }
  });
  (function(){
    var btn = $("motion"), root = document.documentElement;
    function sync(){ var off = root.getAttribute("data-motion") === "off"; btn.setAttribute("aria-pressed", off); btn.textContent = off ? "Animations paused" : "Pause animations"; }
    btn.addEventListener("click", function(){ var off = root.getAttribute("data-motion") === "off"; if (off) root.removeAttribute("data-motion"); else root.setAttribute("data-motion", "off"); reduce = !off || matchMedia("(prefers-reduced-motion: reduce)").matches; try { localStorage.setItem("carlys-motion", off ? "on" : "off"); } catch (e) {} sync(); });
    sync();
  })();
  // structured data so search engines can read the catalog
  (function(){
    try {
      var base = (S.url || (location.origin + location.pathname)).replace(/#.*$/, "");
      var ld = { "@context": "https://schema.org", "@type": "ItemList", "name": S.title || "Shop", "url": base, "itemListElement": items.map(function(it, i){ return { "@type": "ListItem", "position": i + 1, "item": { "@type": "Product", "name": it.name, "description": it.description || "", "image": it._pics.map(function(p){ return base + p; }), "url": base + "#" + it._slug, "category": it.category || "", "offers": { "@type": "Offer", "priceCurrency": "USD", "price": it.price == null ? undefined : it.price, "availability": it.sold ? "https://schema.org/SoldOut" : "https://schema.org/InStock", "itemCondition": "https://schema.org/NewCondition" } } }; }) };
      var tag = document.createElement("script"); tag.type = "application/ld+json"; tag.textContent = JSON.stringify(ld); document.head.appendChild(tag);
    } catch (e) {}
  })();
  // offline + instant repeat visits (only on a real host, not when opened from disk)
  if ("serviceWorker" in navigator && location.protocol.indexOf("http") === 0 && !/claudeusercontent|claude\.ai/.test(location.hostname)) navigator.serviceWorker.register("sw.js").catch(function(){});
  // admin mode: #admin toggles Mark-sold buttons and a copy of the updated products.js
  var admin = false, soldEdits = {};
  function setAdmin(on){ admin = on; $("admin").hidden = !on; document.body.classList.toggle("is-admin", on); render(); if (on) toast("Admin mode. Mark pieces sold, then copy the updated file."); }
  if (location.hash === "#admin"){ history.replaceState(null, "", location.pathname + location.search); setAdmin(true); }
  var tapCount = 0, tapTimer; document.querySelector(".brand .logo").addEventListener("click", function(){ tapCount++; clearTimeout(tapTimer); tapTimer = setTimeout(function(){ tapCount = 0; }, 1500); if (tapCount >= 5){ tapCount = 0; setAdmin(!admin); } });
  $("adminOff").addEventListener("click", function(){ setAdmin(false); });
  $("adminCopy").addEventListener("click", function(){
    fetch("products.js", { cache: "no-store" }).then(function(r){ return r.text(); }).then(function(src){
      var out = src, n = 0;
      items.forEach(function(it){
        var sold = soldEdits.hasOwnProperty(it._slug) ? soldEdits[it._slug] : !!it.sold;
        var re = new RegExp('(name: "' + it.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + '",[\\s\\S]*?sold: )(true|false)');
        out = out.replace(re, function(m, a, b){ if ((b === "true") !== sold) n++; return a + (sold ? "true" : "false"); });
      });
      var done = function(){ toast(n ? "Copied with " + n + " change" + (n > 1 ? "s" : "") + ". Paste over products.js on GitHub and commit." : "Copied. No changes yet, tap Mark sold on a card first."); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(out).then(done, function(){ prompt("Copy this:", out); }); else prompt("Copy this:", out);
    }).catch(function(){ toast("Couldn't read products.js from this host."); });
  });
  $("shareShop").addEventListener("click", function(){
    var url = (S.url || (location.origin + location.pathname)).replace(/#.*$/, ""), title = S.title || "Shop";
    if (navigator.share){ navigator.share({ title: title, text: S.tagline || "", url: url }).catch(function(){}); return; }
    var done = function(){ toast("Shop link copied. Send it to someone who loves handmade."); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, function(){ prompt("Copy this link:", url); }); else prompt("Copy this link:", url);
  });
  if (!(S.about && (S.about.text || S.about.image))) $("about").hidden = true;
  if (S.about && (S.about.text || S.about.image)){
    if (S.about.title) $("aboutTitle").textContent = S.about.title;
    $("aboutText").textContent = S.about.text || "";
    if (hasContact && S.about.dibs !== false){ var d = $("dibs"); d.hidden = false; d.innerHTML = 'Want first dibs when new pieces are added? <a href="' + (c.sms ? "sms:" + c.sms + "?&body=" + encodeURIComponent("Hi! Please add me to the list for new pieces.") : "mailto:" + c.email + "?subject=" + encodeURIComponent("First dibs list") + "&body=" + encodeURIComponent("Hi! Please add me to the list for new pieces.")) + '">Say so here</a> and we\'ll let you know first.'; }
    if (S.about.image){ var ai = $("aboutImg"); setSrc(ai, S.about.image); ai.sizes = "(max-width:700px) 100vw, 300px"; ai.loading = "lazy"; ai.decoding = "async"; ai.alt = S.about.alt || "Carly"; } else $("aboutImg").parentNode.remove();
  }
  $("hideSold").addEventListener("change", function(){ chips(); render(); });
  chips(); render(); openFromHash();
  if (!reduce){
    var steps = document.querySelector(".steps");
    if ("IntersectionObserver" in window && steps){ var io = new IntersectionObserver(function(en){ en.forEach(function(x){ if (x.isIntersecting){ steps.classList.add("seen"); io.disconnect(); } }); }, {threshold:.2}); io.observe(steps); }
    else if (steps) steps.classList.add("seen");
  } else { var st = document.querySelector(".steps"); if (st) st.classList.add("seen"); }
})();
