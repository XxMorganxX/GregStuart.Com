'use client'

import Header from '../../components/Header'
import styles from './page.module.css'

export default function Perspective() {
  const perspectives = [
    { id: 'bettercmos', label: 'Building Better CMOs' },
    { id: 'decodingai', label: 'Decoding AI for Marketing' },
    { id: 'mansavesdog', label: 'Man Saves Dog Blog' },
    { id: 'whatsticks', label: 'What Sticks Book' },
  ]

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className={styles.pageWrapper}>
      {/* Header */}
      <div className={styles.headerWrapper}>
        <Header />
      </div>

      {/* Background Image */}
      <div className={styles.backgroundContainer}>
        <img 
          src="/bg.jpg" 
          alt="Background" 
          className={styles.backgroundImage}
        />
      </div>

      {/* Main Content */}
      <main className={styles.mainContainer}>
        <div className={styles.contentArea}>
          {/* Page Introduction */}
          <div className={styles.pageIntro}>
            <h1 className={styles.pageTitle}>
              My <span className={styles.highlight}>Perspective</span>
            </h1>
            <p className={styles.introText}>
              The following are my points of view, rooted in more than 3 decades of constantly 
              questioning what we in marketing do, or to be blunt, could do better.
            </p>
          </div>

          {/* Quick Navigation */}
          <nav className={styles.quickNav}>
            {perspectives.map((item) => (
              <button 
                key={item.id}
                className={styles.navButton}
                onClick={() => scrollToSection(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Sections Grid */}
          <div className={styles.sectionsGrid}>
            {/* Section 1: Building Better CMOs Podcast */}
            <article id="bettercmos" className={styles.perspectiveSection}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionTag}>Podcast</span>
                <h2 className={styles.sectionTitle}>
                  Building Better <span className={styles.highlight}>CMOs</span>
                </h2>
              </div>
              
              <div className={styles.sectionContent}>
                <div className={styles.mediaPreview}>
                  <img 
                    src="/assets/podcast1/episode_1_Tressie_Lieberman.png" 
                    alt="Building Better CMOs Podcast"
                    className={styles.previewImage}
                  />
                </div>
                <div className={styles.sectionText}>
                  <p>
                    Hosted by Greg Stuart, this podcast offers actionable insights, research, and 
                    strategies to empower Chief Marketing Officers in driving marketing excellence 
                    and organizational growth.
                  </p>
                  <a 
                    href="https://bettercmos.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.ctaButton}
                  >
                    Listen to the Podcast
                    <span className={styles.arrow}>→</span>
                  </a>
                </div>
              </div>
            </article>

            {/* Section 2: Decoding AI for Marketing Podcast */}
            <article id="decodingai" className={styles.perspectiveSection}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionTag}>Podcast</span>
                <h2 className={styles.sectionTitle}>
                  Decoding <span className={styles.highlight}>AI</span> for Marketing
                </h2>
              </div>
              
              <div className={styles.sectionContent}>
                <div className={styles.mediaPreview}>
                  <img 
                    src="/assets/podcast2/episode_45_Sid_Sudhakaran.jpg" 
                    alt="Decoding AI for Marketing Podcast"
                    className={styles.previewImage}
                  />
                </div>
                <div className={styles.sectionText}>
                  <p>
                    Co-hosted by Greg Stuart and Rex Briggs, this platform explores AI's transformative 
                    potential in marketing, providing practical strategies and expert insights for marketers.
                  </p>
                  <a 
                    href="https://www.decodingaiformarketing.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.ctaButton}
                  >
                    Explore AI Marketing Insights
                    <span className={styles.arrow}>→</span>
                  </a>
                </div>
              </div>
            </article>

            {/* Section 3: Man Saves Dog Blog */}
            <article id="mansavesdog" className={styles.perspectiveSection}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionTag}>Blog</span>
                <h2 className={styles.sectionTitle}>
                  Man Saves <span className={styles.highlight}>Dog</span>
                </h2>
              </div>
              
              <div className={styles.sectionContent}>
                <div className={styles.mediaPreview}>
                  <div className={styles.blogPlaceholder}>
                    <span className={styles.blogIcon}>📝</span>
                    <span className={styles.blogLabel}>Blog</span>
                  </div>
                </div>
                <div className={styles.sectionText}>
                  <p>
                    Authored by Greg Stuart, this blog shares insights and perspectives on the media 
                    and advertising industry, reflecting his extensive experience and passion for the business.
                  </p>
                  <a 
                    href="https://mansavesdog.wordpress.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.ctaButton}
                  >
                    Read the Blog
                    <span className={styles.arrow}>→</span>
                  </a>
                </div>
              </div>
            </article>

            {/* Section 4: What Sticks Book */}
            <article id="whatsticks" className={styles.perspectiveSection}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionTag}>Book</span>
                <h2 className={styles.sectionTitle}>
                  What <span className={styles.highlight}>Sticks</span>
                </h2>
              </div>
              
              <div className={styles.sectionContent}>
                <div className={styles.mediaPreview}>
                  <div className={styles.bookPlaceholder}>
                    <span className={styles.bookIcon}>📚</span>
                    <span className={styles.bookLabel}>What Sticks</span>
                  </div>
                </div>
                <div className={styles.sectionText}>
                  <p>
                    Co-authored by Rex Briggs and Greg Stuart, <em>What Sticks</em> analyzes over $1 billion 
                    in advertising to uncover why most campaigns fail and how to ensure success. Based on 
                    five years of research with 24 leading brands, the book introduced unique insights 
                    derived from a revolutionary marketing measurement approach—multi-touch attribution (MTA).
                  </p>
                  <div className={styles.bookHighlight}>
                    <p>
                      <strong>Ad Age</strong> named it the <em>"number one of 10 books you should have read."</em>
                    </p>
                  </div>
                  <p className={styles.bookNote}>
                    Learn more about the creation of MTA in the <a href="/projects#mta">Projects</a> section.
                  </p>
                  <a 
                    href="https://www.amazon.com/What-Sticks-Advertising-Guarantee-Succeeds/dp/1419584332" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.ctaButton}
                  >
                    Get the Book on Amazon
                    <span className={styles.arrow}>→</span>
                  </a>
                </div>
              </div>
            </article>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.mainFooter}>
        <nav className={styles.footerNav}>
          <a href="#about">About Me</a>
          <span className={styles.dot}>●</span>
          <a href="#media">Media Kit</a>
          <span className={styles.dot}>●</span>
          <a href="#contact">Contact Me</a>
          <span className={styles.dot}>●</span>
          <a href="#news">News &amp; Press</a>
        </nav>
        
        <div className={styles.footerRight}>
          <div className={styles.socialIcons}>
            <a href="#" className={`${styles.socialIcon} ${styles.facebook}`} aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="#" className={`${styles.socialIcon} ${styles.twitter}`} aria-label="Twitter">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"/></svg>
            </a>
            <a href="#" className={`${styles.socialIcon} ${styles.linkedin}`} aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="#" className={`${styles.socialIcon} ${styles.other}`} aria-label="More">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 15v-4H8l4-6v4h3l-4 6z"/></svg>
            </a>
          </div>
          <span className={styles.copyright}>© Greg Stuart</span>
        </div>
      </footer>
    </div>
  )
}
