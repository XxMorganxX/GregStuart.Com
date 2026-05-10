'use client'

import Header from '../../components/Header'
import styles from './page.module.css'

export default function Proposed() {
  const sections = [
    { id: 'addiction', label: 'Partnership to End Addiction' },
    { id: 'cap', label: 'AI Personalization (CAP)' },
    { id: 'speaker', label: 'Greg Stuart Speaker' },
    { id: 'investing', label: 'Angel Investing' },
    { id: 'tvshow', label: 'TV Show' },
    { id: 'realestate', label: 'Hamptons Real Estate' },
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
              <span className={styles.highlight}>Proposed</span> & In Development
            </h1>
            <p className={styles.introText}>
              The following are programs or prospective projects that are in development or are 
              just interesting to me. I am always looking for partners to develop new ideas. 
              Reach out to me with your idea if you think I could be helpful.
            </p>
          </div>

          {/* Quick Navigation */}
          <nav className={styles.quickNav}>
            {sections.map((item) => (
              <button 
                key={item.id}
                type="button"
                className={styles.navButton}
                onClick={() => scrollToSection(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Sections Grid */}
          <div className={styles.sectionsGrid}>
            {/* Section 1: Partnership to End Addiction */}
            <article id="addiction" className={styles.proposedSection}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionTag}>Board Member</span>
                <h2 className={styles.sectionTitle}>
                  Partnership to End <span className={styles.highlight}>Addiction</span>
                </h2>
              </div>
              
              <div className={styles.sectionContent}>
                <div className={styles.sectionText}>
                  <p>
                    Partnership to End Addiction is a national nonprofit dedicated to empowering 
                    families and providing personalized support to those impacted by addiction. 
                    Their mission focuses on transforming how the nation addresses addiction through 
                    prevention, treatment, and recovery resources.
                  </p>
                  <p className={styles.statHighlight}>
                    In the U.S., nearly <strong>50 million individuals</strong> aged 12 and older 
                    experienced a substance use disorder in the past year.
                  </p>
                  <p>
                    Besides their respected research into preventing addiction, they created the 
                    iconic <em>"Your Brain on Drugs"</em> campaign.
                  </p>
                  <p className={styles.personalNote}>
                    I joined their Board of Directors in 2024.
                  </p>
                  <div className={styles.buttonGroup}>
                    <a 
                      href="https://drugfree.org/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.ctaButton}
                    >
                      Donate Now
                      <span className={styles.arrow}>→</span>
                    </a>
                    <a 
                      href="https://www.youtube.com/watch?v=GOnENVylxPI" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.secondaryButton}
                    >
                      Watch "Your Brain on Drugs"
                    </a>
                  </div>
                </div>
              </div>
            </article>

            {/* Section 2: CAP - AI Personalization */}
            <article id="cap" className={styles.proposedSection}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionTag}>MMA Initiative</span>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.highlight}>AI</span> Personalization (CAP)
                </h2>
                <p className={styles.sectionSubtitle}>
                  Consortium for AI Personalization
                </p>
              </div>
              
              <div className={styles.sectionContent}>
                <div className={styles.sectionText}>
                  <p>
                    The MMA's Consortium for AI Personalization (CAP) is a major initiative launched 
                    in 2022, aiming to enhance marketing performance through AI-driven personalization.
                  </p>
                  <p>
                    CAP has collaborated with several major brands, including <strong>Progressive, 
                    General Motors, AT&T, Workday, ADT, Major League Baseball, Indeed,</strong> and 
                    <strong> Abbott</strong>, to test AI personalization technology across various channels.
                  </p>
                  <div className={styles.statBox}>
                    <span className={styles.statNumber}>+149%</span>
                    <span className={styles.statLabel}>Average improvement in KPIs</span>
                  </div>
                  <a 
                    href="https://www.mmaglobal.com/consortium-for-ai-personalization" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.ctaButton}
                  >
                    Learn More About CAP
                    <span className={styles.arrow}>→</span>
                  </a>
                </div>
              </div>
            </article>

            {/* Section 3: Greg Stuart Speaker */}
            <article id="speaker" className={styles.proposedSection}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionTag}>Speaking</span>
                <h2 className={styles.sectionTitle}>
                  Greg Stuart <span className={styles.highlight}>Speaker</span>
                </h2>
              </div>
              
              <div className={styles.sectionContent}>
                <div className={styles.sectionText}>
                  <p>
                    Greg Stuart is a seasoned speaker and author, renowned for his expertise in 
                    digital marketing and advertising. He has delivered keynote speeches globally, 
                    sharing insights on industry trends and strategies.
                  </p>
                  
                  <div className={styles.talkCard}>
                    <h4>Featured Talk: POSSIBLE Conference 2024</h4>
                    <p>
                      Greg delivered a compelling keynote challenging marketers to critically assess 
                      and improve their strategies, emphasizing that companies with improved marketing 
                      strategies can enhance their market valuation by approximately <strong>10%</strong>.
                    </p>
                    <div className={styles.quoteBox}>
                      <p>"That speech gave me goosebumps... I know marketing is wrong but you know exactly why it's wrong."</p>
                      <span className={styles.quoteAuthor}>— Gary Vaynerchuk</span>
                    </div>
                    <a 
                      href="https://www.youtube.com/watch?v=U5zkdoJf8t0&t=16s" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.secondaryButton}
                    >
                      Watch Keynote
                    </a>
                  </div>

                  <a 
                    href="https://gregstuartspeaker.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.ctaButton}
                  >
                    Book Greg to Speak
                    <span className={styles.arrow}>→</span>
                  </a>
                </div>
              </div>
            </article>

            {/* Section 4: Angel Investing */}
            <article id="investing" className={styles.proposedSection}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionTag}>Investments</span>
                <h2 className={styles.sectionTitle}>
                  Angel <span className={styles.highlight}>Investing</span>
                </h2>
                <p className={styles.sectionSubtitle}>
                  Early-stage investing and advisory
                </p>
              </div>
              
              <div className={styles.sectionContent}>
                <div className={styles.sectionText}>
                  <p>
                    I focus on early-stage digital media companies, particularly in internet and 
                    mobile sectors, providing strategic guidance, industry connections, and advisory 
                    insights. I've collaborated with over two dozen startups, supported by more than 
                    50 venture capital funds.
                  </p>
                  
                  <div className={styles.statBox}>
                    <span className={styles.statNumber}>$5.5B</span>
                    <span className={styles.statLabel}>Total transactions since 2005</span>
                  </div>

                  <p>
                    A former chief software architect once told me, <em>"I create value from nothing."</em> This 
                    encapsulates the essence of startups: solving problems, improving the world, and 
                    generating revenue that exceeds expenses before capital depletes.
                  </p>

                  <div className={styles.investmentHighlights}>
                    <h4>Notable Exits</h4>
                    <ul className={styles.investmentList}>
                      <li><strong>Rapt, Inc.</strong> — Sold to Microsoft</li>
                      <li><strong>Livingly Media</strong> — Sold to Axel Springer</li>
                      <li><strong>PubMatic</strong> — IPO'd 2020</li>
                      <li><strong>Buddy Media</strong> — Sold to Salesforce</li>
                      <li><strong>DataXu</strong> — Sold to Roku</li>
                      <li><strong>Vizu</strong> — Sold to Nielsen</li>
                    </ul>
                  </div>

                  <p className={styles.disclaimer}>
                    Given my role as CEO of MMA, I don't currently invest in marketing-oriented 
                    businesses, as it would be a conflict of interest. But reach out if you have 
                    a business you think I'd be interested in.
                  </p>
                </div>
              </div>
            </article>

            {/* Section 5: TV Show */}
            <article id="tvshow" className={styles.proposedSection}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionTag}>In Development</span>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.highlight}>TV Show</span>
                </h2>
                <p className={styles.sectionSubtitle}>
                  The Winning Pitch
                </p>
              </div>
              
              <div className={styles.sectionContent}>
                <div className={styles.sectionText}>
                  <p>
                    Before I took the MMA job, I was shopping around a sizzle tape for a TV show 
                    called <strong>"The Winning Pitch."</strong>
                  </p>
                  <p>
                    It follows the drama of major ad agencies and a few upstarts out to launch or 
                    re-launch their success by winning a $20 million advertising account. The show 
                    captures the fights, the backdoor dealings and the "creative flair" that is 
                    the modern world of advertising.
                  </p>
                  <p className={styles.acknowledgment}>
                    Thanks to Jon Bond for letting us shoot in Kirshenbaum Bond offices.
                  </p>
                  <div className={styles.buttonGroup}>
                    <a 
                      href="https://winningpitch.tv/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.ctaButton}
                    >
                      Visit WinningPitch.tv
                      <span className={styles.arrow}>→</span>
                    </a>
                    <a 
                      href="https://www.dropbox.com/scl/fi/xqs4isgnnoiavia5nr0q4/The-Winning-Pitch-Rough-Cut-090209.m4v?rlkey=q74m5cte9neced5ozvnbkrpl3&dl=0" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.secondaryButton}
                    >
                      Watch Sizzle Reel
                    </a>
                  </div>
                </div>
              </div>
            </article>

            {/* Section 6: Hamptons Real Estate */}
            <article id="realestate" className={styles.proposedSection}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionTag}>Recommendation</span>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.highlight}>Hamptons</span> Real Estate
                </h2>
              </div>
              
              <div className={styles.sectionContent}>
                <div className={styles.sectionText}>
                  <p>
                    If you are considering renting a summer house in the Hamptons or are interested 
                    in buying, the best person I know to represent you is my wife, <strong>Pamela Stuart</strong>, 
                    at Saunders.
                  </p>
                  <p>
                    From Amagansett to Southampton, no one is more committed to making sure each 
                    client gets it right, no matter how long it takes or how much effort is required. 
                    And she never misrepresents anything.
                  </p>
                  
                  <div className={styles.transactionsBox}>
                    <h4>Recent Transactions</h4>
                    <div className={styles.transactionsList}>
                      <a 
                        href="https://outeast.com/homes/1953-scuttle-hole-rd-bridgehampton/404421" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.transactionItem}
                      >
                        <span className={styles.transactionPrice}>$21M</span>
                        <span className={styles.transactionLocation}>Bridgehampton</span>
                      </a>
                      <a 
                        href="https://outeast.com/homes/11-east-harbor-dr-sag-harbor/412122" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.transactionItem}
                      >
                        <span className={styles.transactionPrice}>$5.2M</span>
                        <span className={styles.transactionLocation}>Sag Harbor</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.mainFooter}>
        <nav className={styles.footerNav}>
          <a href="/about">About Me</a>
          <span className={styles.dot}>●</span>
          <a href="/media-kit">Media Kit</a>
          <span className={styles.dot}>●</span>
          <a href="/contact">Contact Me</a>
          <span className={styles.dot}>●</span>
          <a href="/news">News &amp; Press</a>
        </nav>
        
        <div className={styles.footerRight}>
          <div className={styles.socialIcons}>
            <a href="https://www.facebook.com/gregnstuart" target="_blank" rel="noopener noreferrer" className={`${styles.socialIcon} ${styles.facebook}`} aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="https://www.youtube.com/@GregStuart" target="_blank" rel="noopener noreferrer" className={`${styles.socialIcon} ${styles.youtube}`} aria-label="YouTube">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
            <a href="https://www.linkedin.com/in/gregstuart/" target="_blank" rel="noopener noreferrer" className={`${styles.socialIcon} ${styles.linkedin}`} aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
          </div>
          <span className={styles.copyright}>© Greg Stuart</span>
        </div>
      </footer>
    </div>
  )
}
