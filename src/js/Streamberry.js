/**
 * Streamberry — Bottom Navigation Bar v5
 * Inject via Jellyfin Dashboard → General → Custom JavaScript
 */

/* ═══════════════════════════════════════════════════════════
   BOTTOM NAV BAR
   ═══════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  const NAV_ITEMS = [
    { id: "home",    label: "Home",      icon: "home",       hash: "#!/home.html" },
    { id: "movies",  label: "Movies",    icon: "movie",      hash: "#!/movies.html" },
    { id: "tv",      label: "TV",        icon: "tv",         hash: "#!/tv.html" },
    { id: "search",  label: "Search",    icon: "search",     hash: "#!/search.html" },
    { id: "more",    label: "My Vault",  icon: "more_horiz", hash: null },
  ];

  const MORE_ITEMS = [
    { id: "profile",      label: "Profile",       icon: "person",      action: "profile" },
    { id: "quickconnect", label: "Quick Connect",  icon: "qr_code",     action: "quickconnect" },
    { id: "favorites",    label: "Favorites",      icon: "favorite",    hash: "#!/home.html?tab=1" },
    { id: "requests",     label: "Requests",       icon: "add_circle",  action: "requests" },
    { id: "settings",     label: "Settings",       icon: "settings",    hash: "#!/mypreferencesmenu.html" },
    { id: "signout",      label: "Sign Out",       icon: "logout",      action: "signout" },
  ];

  /* ── Drawer suppression (safe — no panel selector) ──────── */
  function closeJellyfinDrawer() {
    document.querySelectorAll(".mainDrawer, #mainDrawer, .mainDrawerPanel").forEach(el => {
      el.classList.remove("mainDrawer-open");
      el.style.transform = "translateX(-100%)";
      el.style.visibility = "hidden";
    });
    document.body.classList.remove("skinBody-overflowHidden");
  }

  /* ── Navigation with overlay ─────────────────────────────── */
  function navigateTo(hash) {
    const overlay = document.getElementById("sbTransitionOverlay");
    closeJellyfinDrawer();
    if (overlay) {
      overlay.style.transition = "none";
      overlay.style.opacity = "1";
      overlay.style.pointerEvents = "auto";
      setTimeout(() => {
        location.hash = hash;
        setTimeout(() => {
          overlay.style.transition = "opacity 0.25s ease";
          overlay.style.opacity = "0";
          setTimeout(() => { overlay.style.pointerEvents = "none"; }, 250);
        }, 300);
      }, 50);
    } else {
      location.hash = hash;
    }
  }

  /* ── Panel ───────────────────────────────────────────────── */
  function openMore() {
    injectPanelHeader();
    document.body.classList.add("sbMoreOpen");
    setActive("more");
  }

  function closeMore() {
    document.body.classList.remove("sbMoreOpen");
    updateActiveTab();
  }

  function isMoreOpen() {
    return document.body.classList.contains("sbMoreOpen");
  }

  /* ── Active tab ──────────────────────────────────────────── */
  function setActive(id) {
    document.querySelectorAll(".sbNavBtn").forEach(btn => {
      btn.classList.toggle("sbNavBtn--active", btn.dataset.navId === id);
    });
  }

  function updateActiveTab() {
    const hash = location.hash || "";
    const match = hash.match(/\/([^/?#]+\.html)/);
    const page = match ? match[1] : "";
    let active = "home";
    if (page === "movies.html") active = "movies";
    else if (page === "tv.html") active = "tv";
    else if (page === "search.html") active = "search";
    setActive(active);
  }

  /* ── Visibility ──────────────────────────────────────────── */
  function shouldHideNav() {
    if (document.getElementById("loginPage")) return true;
    const playerPages = ["videoOsdPage", "nowPlayingPage", "htmlvideoplayer"];
    return playerPages.some(id => {
      const el = document.getElementById(id);
      return el && !el.classList.contains("hide");
    }) || !!document.querySelector(".videoOsdBottom:not(.hide)")
       || !!document.querySelector(".fullscreenVideo");
  }

  function updateVisibility() {
    const nav = document.getElementById("sbBottomNav");
    if (!nav) return;
    nav.style.display = shouldHideNav() ? "none" : "";
  }

  /* ── More actions ────────────────────────────────────────── */
  function handleMoreAction(item) {
    closeMore();
    setTimeout(() => {
      if (item.action === "signout") {
        ApiClient.logout().then(() => navigateTo("#!/login.html"));
      } else if (item.action === "quickconnect") {
        navigateTo("#!/quickconnect.html");
      } else if (item.action === "profile") {
        navigateTo(`#!/userprofile?userId=${ApiClient.getCurrentUserId()}`);
      } else if (item.action === "requests") {
        const trigger = document.querySelector(".jellyfinenhanced.requests");
        if (trigger) trigger.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
      } else if (item.hash) {
        navigateTo(item.hash);
      }
    }, 50);
  }

  /* ── Build DOM ───────────────────────────────────────────── */
  function buildNav() {
    if (document.getElementById("sbBottomNav")) return;

    const overlay = document.createElement("div");
    overlay.id = "sbTransitionOverlay";
    document.body.appendChild(overlay);

    const scrim = document.createElement("div");
    scrim.id = "sbMoreScrim";
    scrim.addEventListener("click", closeMore);
    document.body.appendChild(scrim);

    const panel = document.createElement("div");
    panel.id = "sbMorePanel";

    MORE_ITEMS.forEach(item => {
      const row = document.createElement("div");
      row.className = "sbMoreItem";
      row.setAttribute("data-nav-id", item.id);
      row.innerHTML = `
        <span class="sbMoreIcon material-icons">${item.icon}</span>
        <span>${item.label}</span>
        <span class="sbMoreChevron material-icons">chevron_right</span>
      `;
      row.addEventListener("click", (e) => {
        e.stopPropagation();
        handleMoreAction(item);
      });
      panel.appendChild(row);
    });

    document.body.appendChild(panel);

    const nav = document.createElement("nav");
    nav.id = "sbBottomNav";

    NAV_ITEMS.forEach(item => {
      const btn = document.createElement("div");
      btn.className = "sbNavBtn";
      btn.setAttribute("data-nav-id", item.id);
      btn.innerHTML = `
        <span class="sbNavIcon material-icons">${item.icon}</span>
        <span>${item.label}</span>
      `;
      if (item.id === "more") {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          isMoreOpen() ? closeMore() : openMore();
        });
      } else {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          setActive(item.id);
          navigateTo(item.hash);
        });
      }
      nav.appendChild(btn);
    });

    document.body.appendChild(nav);
    updateActiveTab();
  }

  /* ── Avatar ──────────────────────────────────────────────── */
  function loadUserAvatar() {
    if (typeof ApiClient === "undefined" || !ApiClient.getCurrentUserId()) {
      setTimeout(loadUserAvatar, 500);
      return;
    }
    const userId = ApiClient.getCurrentUserId();
    const avatarUrl = ApiClient.getUserImageUrl(userId, { type: "Primary", width: 80 });
    const moreBtn = document.querySelector(".sbNavBtn[data-nav-id='more']");
    if (moreBtn) {
      const iconEl = moreBtn.querySelector(".sbNavIcon, .sbNavAvatar");
      if (iconEl) {
        iconEl.innerHTML = "";
        iconEl.className = "sbNavAvatar";
        iconEl.style.cssText = "width:1.8em;height:1.8em;min-width:1.8em;overflow:hidden;border-radius:50%;";
        const img = document.createElement("img");
        img.src = avatarUrl;
        img.style.cssText = "width:1.8em;height:1.8em;max-width:1.8em;max-height:1.8em;border-radius:50%;object-fit:cover;display:block;";
        img.onerror = () => {
          iconEl.className = "sbNavIcon material-icons";
          iconEl.textContent = "account_circle";
        };
        iconEl.appendChild(img);
      }
    }
    window._sbUserData = { userId };
    ApiClient.getCurrentUser().then(user => {
      window._sbUserData.name = user.Name;
    });
  }

  function injectPanelHeader() {
    if (document.getElementById("sbMoreHeader")) return;
    const panel = document.getElementById("sbMorePanel");
    if (!panel || !window._sbUserData) return;
    const { userId, name } = window._sbUserData;
    if (!userId) return;
    const headerAvatarUrl = ApiClient.getUserImageUrl(userId, { type: "Primary", width: 80 });
    const header = document.createElement("div");
    header.id = "sbMoreHeader";
    header.innerHTML = `
      <img src="${headerAvatarUrl}"
           style="width:2.75em;height:2.75em;max-width:2.75em;max-height:2.75em;border-radius:50%;object-fit:cover;display:block;"
           onerror="this.style.display='none'" />
      <span>${name || ""}</span>
    `;
    panel.insertBefore(header, panel.firstChild);
  }

  /* ── Search placeholder ──────────────────────────────────── */
  function injectSearchPlaceholder() {
    if (document.getElementById("sbSearchPlaceholder")) return;
    const searchPage = document.getElementById("searchPage");
    if (!searchPage) return;
    const placeholder = document.createElement("div");
    placeholder.id = "sbSearchPlaceholder";
    placeholder.innerHTML = `
      <p class="sbSearchTitle">Search your library</p>
      <p class="sbSearchSub">Find movies and TV shows across your library</p>
    `;
    searchPage.appendChild(placeholder);
    const input = searchPage.querySelector("input");
    if (input) {
      input.addEventListener("input", () => {
        placeholder.style.display = input.value.length > 0 ? "none" : "";
      });
    }
  }

  /* ── Init ────────────────────────────────────────────────── */
  function init() {
    buildNav();
    updateActiveTab();
    updateVisibility();

    window.addEventListener("hashchange", () => {
      updateActiveTab();
      updateVisibility();
    });

    const ours = new Set(["sbBottomNav","sbMorePanel","sbMoreScrim","sbTransitionOverlay","sbMoreHeader"]);
    new MutationObserver((mutations) => {
      const relevant = mutations.some(m => !ours.has(m.target.id));
      if (relevant) updateVisibility();
    }).observe(document.body, {
      childList: true, subtree: true,
      attributes: true, attributeFilter: ["class"]
    });

    new MutationObserver(injectSearchPlaceholder)
      .observe(document.body, { childList: true, subtree: true });

    if (!window._sbAvatarLoaded) {
      window._sbAvatarLoaded = true;
      setTimeout(loadUserAvatar, 1000);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    setTimeout(init, 300);
  }
})();

/* ═══════════════════════════════════════════════════════════
   HEADER TABS → DROPDOWN (mobile only)
   ═══════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  function isMobile() {
    return document.documentElement.classList.contains("layout-mobile");
  }

  function initTabDropdown(container) {
    if (container.dataset.dropdownInit) return;
    const tabsEl = container.querySelector(".emby-tabs");
    if (!tabsEl) return;
    const buttons = tabsEl.querySelectorAll(".emby-tab-button");
    if (buttons.length === 0) return;
    container.dataset.dropdownInit = "true";

    // Hide original slider on mobile only
    const slider = tabsEl.querySelector(".emby-tabs-slider");
    if (slider && isMobile()) slider.style.display = "none";

    if (!isMobile()) return;

    const wrapper = document.createElement("div");
    wrapper.className = "sbTabDropdownWrapper";

    const trigger = document.createElement("div");
    trigger.className = "sbTabDropdownTrigger";

    const menu = document.createElement("div");
    menu.className = "sbTabDropdownMenu";
    document.body.appendChild(menu); // Append to body to avoid clipping

    function getActiveLabel() {
      const active = tabsEl.querySelector(".emby-tab-button-active .emby-button-foreground");
      return active ? active.textContent.trim() : "Browse";
    }

    function updateTrigger() {
      trigger.innerHTML = `
        <span>${getActiveLabel()}</span>
        <span class="sbTabDropdownArrow material-icons">expand_more</span>
      `;
    }

    function buildMenu() {
      menu.innerHTML = "";
      tabsEl.querySelectorAll(".emby-tab-button").forEach(btn => {
        const label = btn.querySelector(".emby-button-foreground")?.textContent?.trim() || "";
        const isActive = btn.classList.contains("emby-tab-button-active");
        const item = document.createElement("div");
        item.className = "sbTabDropdownItem" + (isActive ? " sbTabDropdownItem--active" : "");
        item.innerHTML = `
          <span>${label}</span>
          ${isActive ? '<span class="sbTabDropdownCheck material-icons">check</span>' : ""}
        `;
        item.addEventListener("click", (e) => {
          e.stopPropagation();
          btn.click();
          closeMenu();
        });
        menu.appendChild(item);
      });
    }

    function openMenu() {
      buildMenu();
      const rect = trigger.getBoundingClientRect();
      menu.style.top = (rect.bottom + 6) + "px";
      menu.style.left = rect.left + "px";
      menu.style.display = "block";
      wrapper.classList.add("sbTabDropdown--open");
    }

    function closeMenu() {
      menu.style.display = "none";
      wrapper.classList.remove("sbTabDropdown--open");
      updateTrigger();
    }

    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      wrapper.classList.contains("sbTabDropdown--open") ? closeMenu() : openMenu();
    });

    document.addEventListener("click", (e) => {
      if (!wrapper.contains(e.target) && !menu.contains(e.target)) closeMenu();
    });

    // Update trigger label when active tab changes
    new MutationObserver(updateTrigger).observe(tabsEl, {
      attributes: true, subtree: true, attributeFilter: ["class"]
    });

    wrapper.appendChild(trigger);
    container.insertBefore(wrapper, container.firstChild);
    updateTrigger();
    menu.style.display = "none";
  }

  function scanForTabBars() {
    if (!isMobile()) return;
    document.querySelectorAll(".headerTabs.sectionTabs").forEach(container => {
      const hasWrapper = container.querySelector(".sbTabDropdownWrapper");
      if (!hasWrapper) {
        delete container.dataset.dropdownInit;
        const buttons = container.querySelectorAll(".emby-tab-button");
        if (buttons.length > 0) initTabDropdown(container);
      }
    });
  }

  new MutationObserver(scanForTabBars).observe(document.body, { childList: true, subtree: true });
  window.addEventListener("hashchange", () => {
    setTimeout(scanForTabBars, 500);
    setTimeout(scanForTabBars, 1200);
  });
  setTimeout(scanForTabBars, 800);
  setTimeout(scanForTabBars, 1500);
})();