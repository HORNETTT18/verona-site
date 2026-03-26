/* ============================================================
   NAVIGATION — scroll state & burger menu
   ============================================================ */
(function () {
  const nav    = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const menu   = document.getElementById('menu');

  // Scrolled class on nav
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 30);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // Burger toggle
  burger.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', isOpen);
    if (isOpen) {
      burger.children[0].style.transform = 'translateY(7px) rotate(45deg)';
      burger.children[1].style.opacity   = '0';
      burger.children[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      burger.children[0].style.transform = '';
      burger.children[1].style.opacity   = '';
      burger.children[2].style.transform = '';
    }
  });

  // Close menu on link click
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      burger.children[0].style.transform = '';
      burger.children[1].style.opacity   = '';
      burger.children[2].style.transform = '';
    });
  });
})();

/* ============================================================
   SMOOTH SCROLL — offset for fixed nav
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH   = document.getElementById('nav').offsetHeight;
    const top    = target.getBoundingClientRect().top + window.scrollY - navH - 12;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
(function () {
  const items = document.querySelectorAll(
    '.forwho__card, .service-card, .case-card, .process__step, .about__text, .about__img, .section-title, .section-label'
  );

  items.forEach(el => el.setAttribute('data-reveal', ''));

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 60);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(el => io.observe(el));
})();

/* ============================================================
   FAQ ACCORDION
   ============================================================ */
document.querySelectorAll('.faq__q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item     = btn.closest('.faq__item');
    const isOpen   = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq__item.open').forEach(o => {
      o.classList.remove('open');
      o.querySelector('.faq__q').setAttribute('aria-expanded', 'false');
    });

    // Toggle clicked
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

/* ============================================================
   CONTACT FORM — validation + Netlify submit
   ============================================================ */
(function () {
  const form        = document.getElementById('contactForm');
  const nameInput   = document.getElementById('name');
  const contactInput = document.getElementById('contact-field');
  const msgInput    = document.getElementById('message');
  const nameError   = document.getElementById('nameError');
  const contactError = document.getElementById('contactError');
  const msgError    = document.getElementById('messageError');
  const successMsg  = document.getElementById('formSuccess');
  const failMsg     = document.getElementById('formFail');
  const submitBtn   = document.getElementById('submitBtn');

  function clearErrors() {
    [nameInput, contactInput, msgInput].forEach(f => f.classList.remove('error'));
    [nameError, contactError, msgError].forEach(e => e.textContent = '');
  }

  function validate() {
    let valid = true;

    if (!nameInput.value.trim()) {
      nameInput.classList.add('error');
      nameError.textContent = "Будь ласка, введіть ваше ім'я";
      valid = false;
    }

    const contactVal = contactInput.value.trim();
    if (!contactVal) {
      contactInput.classList.add('error');
      contactError.textContent = 'Вкажіть Telegram або email';
      valid = false;
    } else {
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const tgRe    = /^@[\w]{4,}$/;
      if (!emailRe.test(contactVal) && !tgRe.test(contactVal) && contactVal.length < 3) {
        contactInput.classList.add('error');
        contactError.textContent = 'Введіть коректний контакт';
        valid = false;
      }
    }

    if (!msgInput.value.trim()) {
      msgInput.classList.add('error');
      msgError.textContent = 'Розкажіть про свій запит';
      valid = false;
    }

    return valid;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();
    successMsg.style.display = 'none';
    failMsg.style.display    = 'none';

    if (!validate()) return;

    submitBtn.disabled    = true;
    submitBtn.textContent = 'Надсилаю…';

    try {
      const data = new FormData(form);
      const res  = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data).toString(),
      });

      if (res.ok) {
        form.reset();
        successMsg.style.display = 'block';
        submitBtn.style.display  = 'none';
      } else {
        throw new Error('Network response not ok');
      }
    } catch {
      failMsg.style.display = 'block';
      submitBtn.disabled    = false;
      submitBtn.textContent = 'Надіслати заявку';
    }
  });

  // Live clear errors
  [nameInput, contactInput, msgInput].forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('error');
    });
  });
})();
