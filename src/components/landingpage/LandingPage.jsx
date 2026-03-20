// ── src/components/LandingPage/LandingPage.jsx ──
// The Whole Attitude — Landing Page React Component
// Requires: Google Fonts loaded in index.html or _document.js (see bottom of file)

import { getWaitlistCount, saveEmailToSupabase } from '../../lib/supabase';
import { useEffect, useState } from 'react';

import styles from './LandingPage.module.css';

// ── DATA ──────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    num: '01',
    icon: '🎬',
    title: 'Curated Music Video Access',
    body: 'Authenticated subscribers unlock an endless stream of hip-hop and rap music videos pulled from premium YouTube playlists — curated, not algorithmic. Culture-first, always.',
  },
  {
    num: '02',
    icon: '⚡',
    title: 'AI-Powered Digital Products',
    body: 'We sell intelligent web products engineered to perform — websites, platforms, and digital tools built with cutting-edge AI stacks that let your business operate on a different level.',
  },
  {
    num: '03',
    icon: '🔐',
    title: 'Subscription-Grade Security',
    body: 'Powered by Supabase Auth, Database, and Edge Functions — enterprise-level security and access control without the enterprise price tag.',
  },
  {
    num: '04',
    icon: '🌐',
    title: 'Expandable API Ecosystem',
    body: 'The YouTube Data API is just the beginning. The platform is architected to integrate additional data sources and APIs — built to scale with the culture.',
  },
  {
    num: '05',
    icon: '🛠',
    title: 'Production-Ready Architecture',
    body: 'Next.js preferred stack, Supabase backend, React frontend. Every layer built for real-world performance — not demos, not MVPs. Fully production-ready from day one.',
  },
  {
    num: '06',
    icon: '🎯',
    title: 'Invite-Only Launch',
    body: 'The Whole Attitude is not for everybody. The waitlist is the gate. Get in early, get in right — founding members set the tone for the entire community.',
  },
];

const STACK = [
  { tag: '// Frontend',    name: 'Next.js + React',    desc: 'Server-side rendering, optimized performance, and a component architecture that scales without friction.' },
  { tag: '// Backend',     name: 'Supabase',           desc: 'Auth, database, storage, and edge functions in one unified backend platform. Open source. Enterprise grade.' },
  { tag: '// Content API', name: 'YouTube Data API',   desc: 'Initial content layer pulling curated hip-hop playlists with room to expand into additional content pipelines.' },
  { tag: '// Intelligence',name: 'AI Layer',           desc: 'Expandable AI integration layer — intelligent curation, content recommendation, and automated digital product generation.' },
];

// ── WAITLIST FORM (reusable sub-component) ────────────────────────────────────

function WaitlistForm({ variant }) {
  const isCta = variant === 'cta';
  const [email, setEmail]       = useState('');
  const [status, setStatus]     = useState('idle'); // idle | loading | success | duplicate | error
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async () => {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    const result = await saveEmailToSupabase(email);

    if (result.success) {
      setStatus(result.duplicate ? 'duplicate' : 'success');
      setEmail('');
    } else {
      setErrorMsg('Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  const btnLabel =
    status === 'loading' ? '...' :
    status === 'success' || status === 'duplicate' ? '✓' :
    'JOIN';

  const succeeded = status === 'success' || status === 'duplicate';

  if (isCta) {
    return (
      <>
        <div className={styles.ctaForm}>
          <input
            className={styles.ctaInput}
            type="email"
            placeholder="YOUR EMAIL ADDRESS"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="email"
          />
          <button
            className={`${styles.ctaJoinBtn} ${succeeded ? styles.joinBtnSuccess : ''}`}
            onClick={handleSubmit}
            disabled={status === 'loading'}
          >
            {btnLabel}
          </button>
        </div>
        {status === 'error' && (
          <div className={styles.errorMsg}>{errorMsg}</div>
        )}
        {(status === 'success' || status === 'duplicate') && (
          <div className={styles.successMsg}>
            {status === 'duplicate'
              ? "✓ YOU'RE ALREADY ON THE LIST. WE GOT YOU."
              : "✓ YOU'RE IN. THE WHOLE ATTITUDE IS COMING."}
          </div>
        )}
      </>
    );
  }

{/*// Hero variant*/}
  return (
    <div className={styles.waitlistBlock}>
      <div className={styles.waitlistLabel}>// Exclusive Access</div>
      <div className={styles.waitlistTitle}>Secure Your Spot</div>
      <div className={styles.waitlistNote}>
        Zero sugar. No noise. Just pure curated culture on demand. Drop your email — we'll hit you when the doors open.
      </div>
      <div className={styles.inputRow}>
        <input
          className={styles.waitlistInput}
          type="email"
          placeholder="YOUR EMAIL ADDRESS"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="email"
        />
        <button
          className={`${styles.joinBtn} ${succeeded ? styles.joinBtnSuccess : ''}`}
          onClick={handleSubmit}
          disabled={status === 'loading'}
        >
          {btnLabel}
        </button>
      </div>
      {status === 'error' && (
        <div className={styles.errorMsg}>{errorMsg}</div>
      )}
      {(status === 'success' || status === 'duplicate') && (
        <div className={styles.successMsg}>
          {status === 'duplicate'
            ? "✓ YOU'RE ALREADY ON THE LIST. WE GOT YOU."
            : "✓ YOU'RE ON THE LIST. WE'LL BE IN TOUCH."}
        </div>
      )}
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [waitlistCount, setWaitlistCount] = useState(null);

  useEffect(() => {
    getWaitlistCount().then((count) => setWaitlistCount(count));
  }, []);

  return (
    <div className={styles.page}>
      {/* Grain overlay */}
      <div className={styles.grain} aria-hidden="true" />

      {/* ── STATUS BAR ── */}
      <div className={styles.statusBar}>
        <span>THE WHOLE ATTITUDE // DIGITAL PLATFORM</span>
        <span className={styles.live}>
          <span className={styles.liveDot} />
          WAITLIST NOW OPEN
        </span>
        <span>AI-POWERED // HIP-HOP // WEB</span>
      </div>

      {/* ── NAV ── */}
      <nav className={styles.nav}>
        <div className={styles.navLogo}>
          THE WHOLE ATTITUDE
          <span className={styles.navLogoSub}>ENERGY EVOLVED</span>
        </div>
        <div className={styles.navRight}>
          <a href="#features" className={styles.navLink}>Features</a>
          <a href="#vision"   className={styles.navLink}>Vision</a>
          <a href="#stack"    className={styles.navLink}>Stack</a>
          <a href="#join"     className={styles.navLink}>Join</a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <p className={`${styles.heroEyebrow} ${styles.fadeUp}`}>
            Launching Soon — Invite Only
          </p>
          <h1 className={`${styles.heroTitle} ${styles.fadeUp}`}>
            THE<br />
            <span className={styles.outline}>WHOLE</span><br />
            ATTITUDE
          </h1>
          <p className={`${styles.heroSub} ${styles.fadeUp}`}>Energy Evolved</p>
          <p className={`${styles.heroDesc} ${styles.fadeUp}`}>
            The subscription-grade digital platform fusing hip-hop culture, curated music video
            experiences, and AI-powered web technology — built for those who move different.
          </p>

          <WaitlistForm variant="hero" />

          {waitlistCount !== null && waitlistCount > 0 && (
            <div className={styles.counterNote}>
              // <strong>{waitlistCount}</strong> spots claimed
            </div>
          )}
        </div>

        {/* CAN VISUAL */}
        <div className={styles.heroRight}>
          <div className={styles.canVisual}>
            <div className={styles.canBrand}>TWA</div>
            <span className={styles.canBrandSub}>ATTITUDE</span>
            <div className={styles.canDivider} />
            <span className={styles.canFeature}>
              AI POWERED
              <span className={styles.canFeatureSub}>DIGITAL PRODUCTS</span>
            </span>
            <div className={styles.canDivider} />
            <span className={styles.canFeature}>
              ZERO LIMITS
              <span className={styles.canFeatureSub}>SUBSCRIPTION ACCESS</span>
            </span>
            <div className={styles.canDivider} />
            <span className={styles.canFeature}>
              NO BOUNDARIES
              <span className={styles.canFeatureSub}>HIP-HOP CULTURE</span>
            </span>
            <div className={styles.canDivider} />
            <div className={styles.canCaffeine}>
              100%
              <span className={styles.canCaffeineSub}>CURATED CONTENT</span>
            </div>
            <div className={styles.canBottom}>Energy Drink — Digital Edition</div>
          </div>
        </div>
      </section>

      {/* ── SPEC STRIP ── */}
      <div className={styles.specStrip}>
        {[
          { num: '01', label: 'Platform',      desc: 'Next.js + React — production-grade frontend with zero compromise.' },
          { num: '∞',  label: 'Music Videos',  desc: 'YouTube API-curated hip-hop playlists, no ads, no noise.' },
          { num: '0',  label: 'Gatekeeping',   desc: 'Authenticated access built on Supabase — your data, protected.' },
          { num: 'AI', label: 'Powered',       desc: 'Intelligent curation and expandable API ecosystem.' },
        ].map((s) => (
          <div key={s.label} className={styles.specItem}>
            <div className={styles.specNum}>{s.num}</div>
            <div className={styles.specLabel}>{s.label}</div>
            <div className={styles.specDesc}>{s.desc}</div>
          </div>
        ))}
      </div>

      {/* ── FEATURES ── */}
      <section className={styles.section} id="features">
        <div className={styles.sectionEyebrow}>Core Features</div>
        <h2 className={styles.sectionHeading}>
          BUILT <span className={styles.outline}>DIFFERENT</span>
        </h2>
        <div className={styles.featuresGrid}>
          {FEATURES.map((f) => (
            <div key={f.num} className={styles.featureCard}>
              <span className={styles.featureNum}>{f.num}</span>
              <span className={styles.featureIcon}>{f.icon}</span>
              <div className={styles.featureTitle}>{f.title}</div>
              <div className={styles.featureBody}>{f.body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── VISION ── */}
      <div className={styles.visionBlock} id="vision">
        <div className={styles.visionQuote}>
          WHERE HIP-HOP<br />
          <span className={styles.visionDim}>MEETS</span><br />
          WEB3 GRADE<br />
          <span className={styles.visionDim}>TECHNOLOGY</span>
        </div>
        <div className={styles.visionRight}>
          <p>
            The Whole Attitude is a subscription-based web platform built at the intersection of
            hip-hop culture and next-generation AI web technology. This isn't a music blog. This
            isn't a playlist app. This is a curated digital experience subscription — where
            authenticated users access premium content powered by intelligent infrastructure.
          </p>
          <p>
            Our AI-powered digital website products are engineered for businesses and creators who
            want web presence that moves with the same energy as the culture they represent. Every
            product we build carries the same standard: production-ready, scalable, and built for
            real impact.
          </p>
          <p>
            The waitlist is open now. When those doors open, the platform opens with them — zero
            sugar, no artificial hype. Just the whole attitude.
          </p>
        </div>
      </div>

      {/* ── STACK ── */}
      <section className={styles.section} id="stack">
        <div className={styles.sectionEyebrow}>Technology Stack</div>
        <h2 className={styles.sectionHeading}>
          BUILT ON <span className={styles.outline}>FACTS</span>
        </h2>
        <div className={styles.stackGrid}>
          {STACK.map((s) => (
            <div key={s.name} className={styles.stackCard}>
              <div className={styles.stackTag}>{s.tag}</div>
              <div className={styles.stackName}>{s.name}</div>
              <div className={styles.stackDesc}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.ctaSection} id="join">
        <div className={styles.ctaEyebrow}>// The Wait is Almost Over</div>
        <h2 className={styles.ctaHeading}>
          GET<br />
          <span style={{ WebkitTextStroke: '1px rgba(0,0,0,0.2)', color: 'transparent' }}>
            READY
          </span>
        </h2>
        <p className={styles.ctaSub}>
          The platform launches invite-only. Founding members get early access, founding pricing,
          and a seat at the table when culture meets technology.
        </p>
        <WaitlistForm variant="cta" />
      </section>

      {/* ── FOOTER ── */}
      <footer className={styles.footer}>
        <div className={styles.footerLogo}>TWA</div>
        <div className={styles.footerCopy}>© 2026 The Whole Attitude. All rights reserved.</div>
        <div className={styles.footerTagline}>Energy Evolved // Digital Products</div>
      </footer>
    </div>
  );
}

/*
─────────────────────────────────────────────────────────
  HOW TO USE IN YOUR REACT / NEXT.JS APP
─────────────────────────────────────────────────────────

  1. COPY THESE 3 FILES INTO YOUR PROJECT:
     src/lib/supabase.js
     src/components/LandingPage/LandingPage.jsx
     src/components/LandingPage/LandingPage.module.css

  2. ADD GOOGLE FONTS to your index.html <head> (Create React App)
     or pages/_document.js (Next.js):

     <link rel="preconnect" href="https://fonts.googleapis.com" />
     <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
     <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700;900&family=Barlow:wght@300;400;500&display=swap" rel="stylesheet" />

  3. USE THE COMPONENT in any page:

     // pages/index.js (Next.js)  OR  src/App.jsx (CRA)
     import LandingPage from '../components/LandingPage/LandingPage';
     export default function Home() {
       return <LandingPage />;
     }

  4. SUPABASE TABLE — make sure you have this table in your project:
     Table name: waitlist
     Columns:
       id        → int8, primary key, auto increment
       email     → text, UNIQUE
       joined_at → timestamptz, default: now()
       source    → text, nullable

  5. ROW LEVEL SECURITY — in Supabase dashboard:
     Authentication → Policies → waitlist table
     Add policy: Allow INSERT for anon role
─────────────────────────────────────────────────────────
*/
