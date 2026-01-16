'use client'

import { useEffect, useRef } from 'react'
import Header from '../../components/Header'
import styles from './page.module.css'

export default function Projects() {
  const mainRef = useRef(null)
  const contentRef = useRef(null)

  const projects = [
    { id: 'iab', label: 'IAB Turnaround' },
    { id: 'mma', label: 'MMA Global CEO' },
    { id: 'mta', label: 'Multi-Touch Attribution' },
    { id: 'adstandard', label: 'Ad Impression Standard' },
    { id: 'marcaps', label: 'MarCaps Framework' },
    { id: 'bap', label: 'Brand as Performance' },
  ]

  const scrollToProject = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  useEffect(() => {
    const runId = 'pre-fix'
    const mainEl = mainRef.current
    const contentEl = contentRef.current
    const docEl = document.documentElement
    const bodyEl = document.body
    const getStyles = (el) => (el ? window.getComputedStyle(el) : null)

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/97160d50-94b0-4df7-9bab-b0b05996f7b7', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId,hypothesisId:'H1',location:'app/projects/page.js:29',message:'mount: elements present',data:{hasMain:!!mainEl,hasContent:!!contentEl},timestamp:Date.now()})}).catch(()=>{});
    // #endregion

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/97160d50-94b0-4df7-9bab-b0b05996f7b7', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId,hypothesisId:'H2',location:'app/projects/page.js:33',message:'computed overflow styles',data:{contentOverflowY:getStyles(contentEl)?.overflowY,contentHeight:getStyles(contentEl)?.height,mainOverflow:getStyles(mainEl)?.overflow,mainHeight:getStyles(mainEl)?.height,bodyOverflow:getStyles(bodyEl)?.overflow,htmlOverflow:getStyles(docEl)?.overflow},timestamp:Date.now()})}).catch(()=>{});
    // #endregion

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/97160d50-94b0-4df7-9bab-b0b05996f7b7', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId,hypothesisId:'H3',location:'app/projects/page.js:37',message:'scroll metrics',data:{contentScrollHeight:contentEl?.scrollHeight,contentClientHeight:contentEl?.clientHeight,mainClientHeight:mainEl?.clientHeight,windowInnerHeight:window.innerHeight,bodyScrollHeight:bodyEl?.scrollHeight,htmlScrollHeight:docEl?.scrollHeight},timestamp:Date.now()})}).catch(()=>{});
    // #endregion

    const onContentScroll = () => {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/97160d50-94b0-4df7-9bab-b0b05996f7b7', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId,hypothesisId:'H4',location:'app/projects/page.js:44',message:'content scroll event',data:{scrollTop:contentEl?.scrollTop,scrollHeight:contentEl?.scrollHeight,clientHeight:contentEl?.clientHeight},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
    }

    const onWindowScroll = () => {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/97160d50-94b0-4df7-9bab-b0b05996f7b7', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId,hypothesisId:'H5',location:'app/projects/page.js:50',message:'window scroll event',data:{scrollY:window.scrollY},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
    }

    if (contentEl) {
      contentEl.addEventListener('scroll', onContentScroll)
    }
    window.addEventListener('scroll', onWindowScroll)

    return () => {
      if (contentEl) {
        contentEl.removeEventListener('scroll', onContentScroll)
      }
      window.removeEventListener('scroll', onWindowScroll)
    }
  }, [])

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

      {/* Main Layout Container */}
      <main ref={mainRef} className={styles.mainContainer}>
        {/* Left Sidebar - Project Navigation */}
        <aside className={styles.leftSidebar}>
          <h3 className={styles.sidebarTitle}>Major Projects</h3>
          <nav className={styles.sidebarNav}>
            {projects.map((project) => (
              <button 
                key={project.id}
                className={styles.navItem}
                onClick={() => scrollToProject(project.id)}
              >
                <span className={styles.navLabel}>{project.label}</span>
                <span className={styles.navArrow}>›</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Center Content Area */}
        <section ref={contentRef} className={styles.contentArea}>
          {/* Page Introduction */}
          <div className={styles.pageIntro}>
            <h1 className={styles.pageTitle}>
              Projects That <span className={styles.highlight}>Changed Marketing</span>
            </h1>
            <p className={styles.introText}>
              The following are my major projects that have dramatically, in some cases, 
              changed marketing forever. It was a privilege to be early and in a position 
              of influence to impact the business I happened to love.
            </p>
          </div>

          {/* Project 1: IAB Turnaround */}
          <article id="iab" className={styles.projectSection}>
            <div className={styles.projectHeader}>
              <span className={styles.projectYear}>2001</span>
              <h2 className={styles.projectTitle}>
                Turnaround of <span className={styles.highlight}>IAB</span> — Interactive Advertising Bureau
              </h2>
            </div>
            
            <div className={styles.projectContent}>
              <div className={styles.projectStory}>
                <p>
                  In 2001, the Chair of the IAB, Shelby Bonnie (co-founder and CEO of CNET), asked if I, 
                  as a board member, would step in to run the IAB until the board figured out what to do 
                  with a then failing trade association.
                </p>
                <p className={styles.quote}>
                  "I told him I would step in for 3-6 months, but that's it. I didn't want to run a non-profit—
                  as I said at that time, 'that would be the dumbest f'ing thing I could do.' So much for 
                  knowing what is best for me."
                </p>
                <p>
                  Four months later, I agreed to assume longer-term leadership. At the time, the IAB had only 
                  <strong> 29 members</strong> and <strong>$1 million in revenue</strong>. Today it's approximately 
                  650 members with $25M in revenue.
                </p>
              </div>

              <div className={styles.milestonesSection}>
                <h3 className={styles.milestonesTitle}>Key Milestones Achieved</h3>
                <ol className={styles.milestonesList}>
                  <li>
                    <strong>Secured Financial Support for Turnaround:</strong> In an exceptionally unusual move 
                    for a non-profit, we raised $5.8 million in funding to accelerate the growth of online 
                    advertising, which was around $8B total in 2001.
                  </li>
                  <li>
                    <strong>Developed and Validated Multi-Touch Attribution (MTA):</strong> Through the Cross Media 
                    Optimization Study (XMOS) project, we developed MTA to accurately measure the effectiveness 
                    of internet advertising within the broader marketing mix.
                  </li>
                  <li>
                    <strong>Set Optimal Digital Ad Spend for Marketers:</strong> Via MTA powered XMOS series we 
                    proved that internet advertising should constitute over 25% of marketing budgets (vs. the 5% 
                    marketers were spending).
                  </li>
                  <li>
                    <strong>Established Standardized Ad Formats:</strong> Within 18 months, we moved the whole 
                    industry from a painful 900 disparate ad sizes to four standardized IAB ad units accounting 
                    for 85% of inventory.
                  </li>
                  <li>
                    <strong>Developed Technical Standard for Ad Impression Measurement:</strong> Wrote the technical 
                    specs that removed the insane and untrusted flux in the industry 'currency' for ad impressions, 
                    now known as viewability.
                  </li>
                  <li>
                    <strong>Strengthened Financial Foundation:</strong> Annual membership dues from Yahoo, Microsoft, 
                    and AOL moved from $50,000 to $500,000 in just five years.
                  </li>
                  <li>
                    <strong>Developed Licensing Framework for Global Expansion:</strong> Now supports IABs in 42 countries.
                  </li>
                </ol>
              </div>

              <div className={styles.projectOutcome}>
                <p>
                  I left in 2006 to go back to my Silicon Valley roots and invest in, join boards, work with 
                  Sand Hill Road VCs, and guide early-stage businesses. It was a bet innovation would continue—
                  I was right as the businesses I supported eventually transacted for <strong>$5.5 billion</strong>.
                </p>
              </div>
            </div>
          </article>

          {/* Project 2: MMA Global */}
          <article id="mma" className={styles.projectSection}>
            <div className={styles.projectHeader}>
              <span className={styles.projectYear}>Current</span>
              <h2 className={styles.projectTitle}>
                Turnaround of <span className={styles.highlight}>MMA Global</span> as CEO
              </h2>
            </div>
            
            <div className={styles.projectContent}>
              <div className={styles.projectStory}>
                <p>
                  When I assumed leadership as CEO, MMA had $4.7 million in annual revenue and focused on Mobile. 
                  Today, we are approaching <strong>$20 million</strong>, reflecting significant growth and impact 
                  for CMOs in adapting to the future.
                </p>
                <p>
                  MMA Global is a worldwide trade association empowering Chief Marketing Officers from large 
                  enterprises such as <strong>GM, AT&T, Uber, Kellanova, Novartis, AB InBev</strong>, and many more. 
                  Representing over 800 corporate members, MMA unites leading brands, tech platforms, data providers, 
                  social media companies, and agencies to transform modern marketing (including Meta, Google, Amazon, 
                  Snap, X, etc.).
                </p>
              </div>

              <div className={styles.impactGrid}>
                <div className={styles.impactCard}>
                  <span className={styles.impactNumber}>800+</span>
                  <span className={styles.impactLabel}>Corporate Members</span>
                </div>
                <div className={styles.impactCard}>
                  <span className={styles.impactNumber}>16</span>
                  <span className={styles.impactLabel}>Countries</span>
                </div>
                <div className={styles.impactCard}>
                  <span className={styles.impactNumber}>4x</span>
                  <span className={styles.impactLabel}>Revenue Growth</span>
                </div>
              </div>

              <div className={styles.projectOutcome}>
                <p className={styles.missionStatement}>
                  Mission: <em>"Make marketing matter, much more."</em>
                </p>
                <p>
                  MMA operates in 16 countries, with a team spread across key regional global hubs, including 
                  Singapore, London, São Paulo, and Istanbul.
                </p>
              </div>
            </div>
          </article>

          {/* Project 3: Multi-Touch Attribution */}
          <article id="mta" className={styles.projectSection}>
            <div className={styles.projectHeader}>
              <span className={styles.projectYear}>2000-2005</span>
              <h2 className={styles.projectTitle}>
                Co-Founder of <span className={styles.highlight}>Multi-Touch Attribution</span> (MTA)
              </h2>
            </div>
            
            <div className={styles.projectContent}>
              <div className={styles.projectStory}>
                <p>
                  In 2000, Microsoft approached Rex Briggs, a leading expert and inventor in marketing measurement, 
                  with a question: could the internet be accurately measured as part of the overall marketing mix? 
                  At the time, no such method existed.
                </p>
                <p>
                  Rex initially requested $50,000 to explore the concept and later returned with a revolutionary 
                  new approach to marketing mix measurement, estimating that each study would require collecting 
                  over 10,000 consumer responses and cost $125,000.
                </p>
                <p>
                  <strong>Unilever and Toyota</strong> became the first brands to commit to this groundbreaking effort. 
                  Their involvement laid the foundation for what would later be known as Multi-Touch Attribution (MTA).
                </p>
              </div>

              <div className={styles.highlightBox}>
                <h4>The Ford F-150 Study</h4>
                <p>
                  The Ford study, centered on the F-150, revolutionized our understanding of the internet's role in 
                  the marketing mix. It demonstrated that including internet advertising in the mix 
                  <strong> increased F-150 sales by approximately 25%</strong>.
                </p>
                <p>
                  Key finding: Ads running on the homepages of platforms like Yahoo, AOL, and Microsoft produced more 
                  reach in a single day than television could.
                </p>
              </div>

              <div className={styles.projectStory}>
                <p>
                  Between 2002 and 2005, several major brands participated in XMOS (Cross-Media Optimization Studies), 
                  including <strong>Colgate-Palmolive, ING, Universal, Philips, and Ford</strong>. These studies provided 
                  groundbreaking insights into how to optimize the media mix for maximum marketing effectiveness.
                </p>
                <p>
                  While Rex is clearly the technical wizard behind MTA, he has pointed out that without my support 
                  in resources, solicitation of marketers, garnering industry adoption, and leveraging the IAB's 
                  event platform, MTA would not have achieved the impact it has today.
                </p>
              </div>

              <div className={styles.projectOutcome}>
                <p>
                  As of 2024, MTA is used by <strong>52% of major marketers</strong> and is the only approach that allows 
                  marketers to "find veins of gold" in their go-to-market campaigns. The culmination of this effort was 
                  captured in the book <a href="#" className={styles.bookLink}>"What Sticks: Why Most Advertising Fails 
                  and How to Guarantee Yours Succeeds"</a>, based on over $1 billion in advertising research.
                </p>
              </div>
            </div>
          </article>

          {/* Project 4: Ad Impression Standard */}
          <article id="adstandard" className={styles.projectSection}>
            <div className={styles.projectHeader}>
              <span className={styles.projectYear}>2004</span>
              <h2 className={styles.projectTitle}>
                Developed <span className={styles.highlight}>Digital Ad Impression Standard</span>
              </h2>
            </div>
            
            <div className={styles.projectContent}>
              <div className={styles.projectStory}>
                <p>
                  In May 2004, the Interactive Advertising Bureau (IAB), in collaboration with the Advertising Research 
                  Foundation (ARF), introduced the first standardized guidelines for measuring online advertising impressions. 
                  These guidelines aimed to establish a consistent framework for counting online ad impressions, thereby 
                  enhancing trust and transparency between advertisers and publishers.
                </p>
                <p>
                  Prior to these guidelines, ad impression counts could swing from <strong>–50% to +100%</strong> on the same 
                  campaign, leaving buyers with no idea what they actually bought. It was a mess and denigrated internet advertising.
                </p>
              </div>

              <div className={styles.highlightBox}>
                <h4>Industry Collaboration</h4>
                <p>
                  Todd Teresi, then at Yahoo, was instrumental in getting this done and accepted by the world. It was said 
                  this required the install of 1,000s of new servers, would cost $5M in cap ex and might lower Yahoo revenue 
                  by $30-50M. To his and Wenda Harris Millard's foresight, they knew it was the right thing to do.
                </p>
              </div>

              <div className={styles.projectStory}>
                <p>
                  The development of these standards involved collaboration among key industry bodies, including the MRC and 
                  the Advertising Research Foundation (ARF). In Europe, ESOMAR supported the initiative, contributing to a 
                  unified approach to online ad measurement.
                </p>
                <p>
                  The adoption was widespread, with support from major online publishers and approximately <strong>29 major 
                  online advertising server technologies worldwide</strong>, simplifying the buying and selling process for 
                  advertisers, marketers, and publishers.
                </p>
              </div>

              <div className={styles.projectOutcome}>
                <p>
                  In 2014, the standard was updated to include viewability metrics, further refining the measurement of ad 
                  impressions by assessing whether an ad was actually in view, thereby improving the accuracy and effectiveness 
                  of digital advertising measurements.
                </p>
              </div>
            </div>
          </article>

          {/* Project 5: MarCaps Framework */}
          <article id="marcaps" className={styles.projectSection}>
            <div className={styles.projectHeader}>
              <span className={styles.projectYear}>8 Years Ago</span>
              <h2 className={styles.projectTitle}>
                Led Development of <span className={styles.highlight}>MarCaps Framework</span>
              </h2>
            </div>
            
            <div className={styles.projectContent}>
              <div className={styles.projectStory}>
                <p>
                  As CEO of MMA Global, I have had the privilege of collaborating with MarCaps LLC, led by esteemed marketing 
                  professors <strong>Dr. Omar Rodríguez Vilá, Dr. Neil Morgan, and Dr. Sundar Bharadwaj</strong>, to advance the 
                  effectiveness of marketing organizations conducted under the MMA's Marketing Organization Strategy Think Tank (MOSTT).
                </p>
                <p>
                  This initiative, launched at the behest of <strong>The Coca-Cola Company</strong>, focuses on aligning marketing 
                  capabilities with a firm's growth strategy to enhance performance and drive business success.
                </p>
              </div>

              <div className={styles.frameworkGrid}>
                <div className={styles.frameworkCard}>
                  <h4>6 Value Areas</h4>
                  <ul>
                    <li><strong>Customer Value:</strong> Exchange, Experience, Engagement</li>
                    <li><strong>Company Value:</strong> Strategic, Operational, Knowledge</li>
                  </ul>
                </div>
                <div className={styles.frameworkCard}>
                  <h4>90 Capabilities</h4>
                  <p>Specific marketing capabilities mapped to guide organizations in capability development</p>
                </div>
              </div>

              <div className={styles.highlightBox}>
                <h4>Proven Impact</h4>
                <p>
                  Firms with high alignment between their marketing capabilities and growth strategies report significantly 
                  higher satisfaction with growth and superior financial outcomes. Companies with high marketing-capability fit 
                  have reported <strong>3x the level of growth satisfaction</strong> compared to those with low fit.
                </p>
              </div>

              <div className={styles.projectOutcome}>
                <p className={styles.personalNote}>
                  This line of work, initiated by me based on a request by The Coca-Cola Company, is considered 
                  <strong> among the most important in my career</strong>.
                </p>
              </div>
            </div>
          </article>

          {/* Project 6: Brand as Performance */}
          <article id="bap" className={styles.projectSection}>
            <div className={styles.projectHeader}>
              <span className={styles.projectYear}>Recent</span>
              <h2 className={styles.projectTitle}>
                Led Development of <span className={styles.highlight}>Brand as Performance</span> (BaP)
              </h2>
            </div>
            
            <div className={styles.projectContent}>
              <div className={styles.projectStory}>
                <p>
                  The Brand as Performance (BaP) Research Initiative by MMA Global addresses the critical challenge of 
                  balancing long-term brand-building with short-term performance marketing—a top concern for Chief Marketing 
                  Officers (CMOs) over the past five years. Developed by <strong>Joel Rubinson</strong>, BaP introduces a 
                  novel methodology to provide scientific evidence guiding marketers in optimizing this balance.
                </p>
              </div>

              <div className={styles.participatingBrands}>
                <h4>Participating Brands</h4>
                <div className={styles.brandsList}>
                  <span className={styles.brandTag}>Ally Financial</span>
                  <span className={styles.brandTag}>Kroger</span>
                  <span className={styles.brandTag}>Campbell's</span>
                  <span className={styles.brandTag}>AT&T</span>
                </div>
              </div>

              <div className={styles.methodologySection}>
                <h4>Research Methodology</h4>
                <ul className={styles.methodologyList}>
                  <li>
                    <strong>Extensive Consumer Tracking:</strong> Monitoring media exposure, brand attitudes, and sales 
                    data of approximately 600,000 consumers over a 12-month period.
                  </li>
                  <li>
                    <strong>Brand Favorability Analysis:</strong> Assessing how consumers with high brand favorability 
                    are more likely to convert, and determining the longevity of this effect.
                  </li>
                  <li>
                    <strong>Media Tactic Evaluation:</strong> Creating leaderboards of media tactics based on their 
                    short-term and long-term contributions to brand-building and performance outcomes.
                  </li>
                  <li>
                    <strong>Targeting Strategies:</strong> Identifying optimal consumer segments for media targeting 
                    to enhance both immediate returns and sustained growth.
                  </li>
                </ul>
              </div>

              <div className={styles.highlightBox}>
                <h4>Key Findings</h4>
                <p>
                  Consumers with high brand favorability are significantly more likely to convert, with this effect 
                  persisting over time, indicating a <strong>long-term annuity rather than a short-lived impact</strong>. 
                  The "Movable Middle" consumer segments show higher responsiveness to targeted media efforts, offering 
                  opportunities for enhanced return on ad spend.
                </p>
              </div>

              <div className={styles.projectOutcome}>
                <p>
                  The BaP initiative provides marketers with a data-driven framework to effectively balance brand-building 
                  and performance marketing. This comprehensive approach may contribute to the development of a new growth 
                  framework for brands, maximizing multi-year returns.
                </p>
              </div>
            </div>
          </article>
        </section>

        {/* Right Sidebar - Impact Track Record */}
        <aside className={styles.rightSidebar}>
          <h3 className={styles.sidebarHeading}>Impact Track Record</h3>
          
          <div className={styles.achievementItem}>
            <span className={styles.achievementNumber}>$5.5B</span>
            <div className={styles.achievementDetails}>
              <p className={styles.achievementTitle}>Business Transactions</p>
              <p className={styles.achievementSubtitle}>From supported startups</p>
            </div>
          </div>

          <div className={styles.achievementItem}>
            <span className={styles.achievementNumber}>52%</span>
            <div className={styles.achievementDetails}>
              <p className={styles.achievementTitle}>MTA Adoption</p>
              <p className={styles.achievementSubtitle}>Of major marketers (2024)</p>
            </div>
          </div>

          <div className={styles.achievementItem}>
            <span className={styles.achievementNumber}>42</span>
            <div className={styles.achievementDetails}>
              <p className={styles.achievementTitle}>Countries</p>
              <p className={styles.achievementSubtitle}>With IAB presence</p>
            </div>
          </div>

          <div className={styles.achievementItem}>
            <span className={styles.achievementNumber}>800+</span>
            <div className={styles.achievementDetails}>
              <p className={styles.achievementTitle}>MMA Members</p>
              <p className={styles.achievementSubtitle}>Corporate members</p>
            </div>
          </div>

          <div className={styles.achievementItem}>
            <span className={styles.achievementNumber}>3x</span>
            <div className={styles.achievementDetails}>
              <p className={styles.achievementTitle}>Growth Satisfaction</p>
              <p className={styles.achievementSubtitle}>MarCaps high-fit firms</p>
            </div>
          </div>

          <div className={styles.achievementItem}>
            <span className={styles.achievementNumber}>600K</span>
            <div className={styles.achievementDetails}>
              <p className={styles.achievementTitle}>Consumers Tracked</p>
              <p className={styles.achievementSubtitle}>In BaP research</p>
            </div>
          </div>

          <div className={styles.achievementItem}>
            <span className={styles.achievementNumber}>$1B+</span>
            <div className={styles.achievementDetails}>
              <p className={styles.achievementTitle}>Ad Research</p>
              <p className={styles.achievementSubtitle}>For "What Sticks" book</p>
            </div>
          </div>
        </aside>
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
