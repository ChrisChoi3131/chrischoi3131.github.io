(() => {
  'use strict';
  const navbar = document.querySelector('#navbar');
  const navbarLogo = document.querySelector('.navbar__logo');
  const navbarMenu = document.querySelector('.navbar__menu');
  const heightNavbar = navbar.getBoundingClientRect().height;
  const sections = document.querySelectorAll('section');
  const footerRight = document.querySelector('#footerRight');
  const footerLeft = document.querySelector('#footerLeft');
  const switchFixHeader = document.querySelector('#switchFixHeader');
  const btnHamburger = document.querySelector('.navbar_Hamburger');
  const hamburgerMenu = document.querySelector('.body__hamburgerMenu');
  const hamburgerMenuBlur = document.querySelector('.body__hamburgerMenuBlur');
  let lastScrollY = 0;
  let isFixedHeader = true;
  const widthMobile = 900;

  window.addEventListener('load', () => {
    setTimeout(() => {
      document.body.classList.remove('before-load');
      document.querySelector('.loading').addEventListener('transitionend', e => {
        e.currentTarget.style.display = 'none';
      });
    }, 300);

    window.addEventListener('resize', () => {
      if (window.innerWidth <= widthMobile) {
        setTimeout(() => {
          // navbarMenu.style.display = 'none';
        }, 1500);
      } else {
        // navbarMenu.style.display = 'flex';
      }
    });
  });
  document.addEventListener('scroll', () => {
    if (isFixedHeader === true) return;
    if (lastScrollY < window.scrollY) {
      if (heightNavbar < window.scrollY) {
        navbar.classList.add('navbar__hide');
        lastScrollY = window.scrollY;
      }
    } else if (lastScrollY > window.scrollY) {
      navbar.classList.remove('navbar__hide');
      lastScrollY = window.scrollY;
    }
  });
  document.addEventListener('scroll', () => {
    if (window.innerHeight - sections[sections.length - 1].getBoundingClientRect().y > 30) {
      footerRight.style.color = 'white';
      for (const child of footerLeft.children) {
        child.style.color = 'white';
      }
    } else {
      footerRight.style.color = 'var(--color-pink)';
      for (const child of footerLeft.children) {
        child.style.color = 'var(--color-grey)';
      }
    }
  });
  switchFixHeader.addEventListener('click', e => {
    if (e.target.tagName !== 'INPUT') return;
    if (e.target.checked) isFixedHeader = true;
    else isFixedHeader = false;
  });
  navbarLogo.addEventListener('click', () => {
    const element = document.getElementById('home');
    const top = element.getBoundingClientRect().top - document.body.getBoundingClientRect().top - 100;
    window.scrollTo({ top, behavior: 'smooth' });
  });
  navbarMenu.addEventListener('click', e => {
    let target = e.target;
    target.tagName !== 'LI' ? (target = target.parentElement) : null;
    if (!target.dataset.link) return;
    const element = document.getElementById(target.dataset.link);
    const top = element.getBoundingClientRect().top - document.body.getBoundingClientRect().top - 100;
    window.scrollTo({ top, behavior: 'smooth' });
  });
  const sectionsId = Array.from(sections).map(section => section.id);
  const navItems = new Map(
    sectionsId.map((sectionId, idx) => [
      sectionId,
      { idx, element: document.querySelector(`[data-link="${sectionId}"]`) },
    ])
  );
  btnHamburger.addEventListener('click', () => {
    hamburgerMenu.classList.add('active');
    hamburgerMenuBlur.classList.add('active');
    document.body.classList.add('blur');
  });
  hamburgerMenuBlur.addEventListener('click', () => {
    hamburgerMenu.classList.remove('active');
    hamburgerMenuBlur.classList.remove('active');
    document.body.classList.remove('blur');
  });

  const mapEntries = new Map();
  const callbackObserver = entries => {
    if (entries.length > 1) {
      const currEntries = [];
      entries.forEach(entry => {
        const currentRatio = entry.intersectionRatio;
        const target = entry.target.id;
        if (currentRatio > 0) {
          currEntries.push({ target, currentRatio, idx: navItems.get(target).idx });
          mapEntries.set(target, navItems.get(target).idx);
        } else {
          mapEntries.delete(target);
        }
      });
      currEntries.sort((a, b) => {
        if (b.currentRatio > a.currentRatio) {
          return 1;
        } else if (b.currentRatio < a.currentRatio) {
          return -1;
        } else {
          if (a.idx < b.idx) {
            return -1;
          } else {
            return 1;
          }
        }
      });
      footerRight.innerText = currEntries[0].target;
    } else {
      const entry = entries[0];
      const isIntersecting = entry.isIntersecting;
      const boundingClientRect = entry.boundingClientRect;
      const target = entry.target.id;
      const idx = sectionsId.indexOf(target);
      if (isIntersecting) {
        mapEntries.set(target, idx);
        const [sectionName, sectionIdx] = [...mapEntries].sort((a, b) => {
          return b[1] - a[1];
        })[0];

        footerRight.innerText = sectionName;
      } else if (!isIntersecting) {
        mapEntries.delete(target);
        if (boundingClientRect.y > 0) {
          const sectionName = idx !== 0 ? sectionsId[idx - 1] : sectionsId[idx];
          footerRight.innerText = sectionName;
        }
      }
    }
  };
  const optionsObserver = {
    threshold: 0.2,
  };
  const observer = new IntersectionObserver(callbackObserver, optionsObserver);
  sections.forEach(section => observer.observe(section));
})();
