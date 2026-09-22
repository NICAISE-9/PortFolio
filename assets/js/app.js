// =========================================
// Portfolio QA — Nicaise Keou — app Vue.js
// =========================================

/* Clé d'accès Web3Forms (gratuite) : va sur https://web3forms.com/,
   entre ton email et récupère ta clé, puis colle-la ici. */
const WEB3FORMS_ACCESS_KEY = '8e24a668-139e-481c-8a24-a0115028fa63';

const app = Vue.createApp({
  data() {
    return {
      isScrolled: false,
      scrollProgress: 0,
      menuOpen: false,
      activeSection: 'accueil',
      navSections: ['accueil', 'apropos', 'competences', 'experience', 'projets', 'certifications'],

      typedText: '',
      roles: ['QA Manuel', 'Automatisation', 'CI/CD & Qualité'],

      stats: [
        { label: "Mois d'expérience", target: 6, suffix: '+', current: 0 },
        { label: 'Cas de tests rédigés', target: 700, suffix: '+', current: 0 },
        { label: 'Réduction du temps de régression', target: 80, suffix: '%', current: 0 },
        { label: 'Bugs identifiés & suivis', target: 300, suffix: '+', current: 0 },
      ],

      form: { name: '', email: '', subject: '', message: '' },
      formNote: '',
      sending: false,

      currentYear: new Date().getFullYear(),
    };
  },

  mounted() {
    window.addEventListener('scroll', this.onScroll, { passive: true });
    this.onScroll();
    this.startTyping();
  },

  beforeUnmount() {
    window.removeEventListener('scroll', this.onScroll);
  },

  methods: {
    /* Navbar background + progress bar as the page scrolls */
    onScroll() {
      this.isScrolled = window.scrollY > 20;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      this.scrollProgress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
      this.updateActiveSection();
    },

    /* Détermine quelle section est actuellement visible pour surligner le bon lien du header */
    updateActiveSection() {
      const offset = 120; // hauteur navbar + marge
      let current = this.navSections[0];
      for (const id of this.navSections) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top - offset <= 0) {
          current = id;
        }
      }
      this.activeSection = current;
    },

    /* Mobile burger menu */
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
    closeMenu() {
      this.menuOpen = false;
    },

    /* Typed role effect in the hero title */
    startTyping() {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        this.typedText = this.roles[0];
        return;
      }

      let roleIndex = 0;
      let charIndex = 0;
      let deleting = false;

      const loop = () => {
        const current = this.roles[roleIndex];

        if (!deleting) {
          charIndex++;
          this.typedText = current.slice(0, charIndex);
          if (charIndex === current.length) {
            deleting = true;
            setTimeout(loop, 1400);
            return;
          }
        } else {
          charIndex--;
          this.typedText = current.slice(0, charIndex);
          if (charIndex === 0) {
            deleting = false;
            roleIndex = (roleIndex + 1) % this.roles.length;
          }
        }
        setTimeout(loop, deleting ? 45 : 90);
      };

      setTimeout(loop, 600);
    },

    /* Animated stat counters, triggered once the hero stats scroll into view */
    startCounting() {
      const duration = 1200;
      const start = performance.now();
      const targets = this.stats.map((s) => s.target);

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        this.stats.forEach((stat, i) => {
          stat.current = Math.round(eased * targets[i]);
        });
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    },

    /* Contact form: envoie réellement l'email via Web3Forms (pas d'app mail requise) */
    async submitForm() {
      const subject = this.form.subject || 'Contact depuis le portfolio';

      // Si la clé n'a pas encore été configurée, on retombe sur mailto (ouvre le client mail local)
      if (!WEB3FORMS_ACCESS_KEY || WEB3FORMS_ACCESS_KEY === 'COLLE_TA_CLE_WEB3FORMS_ICI') {
        const body = encodeURIComponent(
          `Nom: ${this.form.name}\nEmail: ${this.form.email}\n\n${this.form.message}`
        );
        window.location.href = `mailto:ninenicaisekeou@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
        this.formNote = "Votre client mail va s'ouvrir pour envoyer le message ✓";
        return;
      }

      this.sending = true;
      this.formNote = 'Envoi en cours…';

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: WEB3FORMS_ACCESS_KEY,
            subject,
            from_name: this.form.name,
            email: this.form.email,
            replyto: this.form.email,
            message: this.form.message,
          }),
        });
        const result = await response.json();

        if (result.success) {
          this.formNote = 'Message envoyé avec succès ✓ (vérifie tes spams si tu ne le vois pas)';
          this.form = { name: '', email: '', subject: '', message: '' };
        } else {
          // On affiche le vrai message renvoyé par l'API pour pouvoir diagnostiquer un futur échec
          this.formNote = `Échec de l'envoi : ${result.message || 'erreur inconnue'}`;
        }
      } catch (err) {
        this.formNote = "Échec de l'envoi (connexion). Réessaie plus tard.";
      } finally {
        this.sending = false;
      }
    },
  },
});

/* Custom directive: reveals an element (adds .visible) once it scrolls into view */
app.directive('reveal', {
  mounted(el) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    io.observe(el);
  },
});

/* Custom directive: calls the bound method once when the element scrolls into view */
app.directive('count-in-view', {
  mounted(el, binding) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            binding.value();
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    io.observe(el);
  },
});

app.mount('#app');
