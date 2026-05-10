import Header from '../../components/Header'
import styles from './page.module.css'

export const metadata = {
  title: 'Media Kit - Greg Stuart',
  description: 'Official bios, speaker introduction, and Q&A prompts for Greg Stuart events.',
}

const shortBio = [
  'Greg Stuart is global CEO of Mobile Marketing Association and former CEO of IAB, where he led the digital media industry from $6B to $17B annually. His book, What Sticks: Why Most Advertising Fails and How to Guarantee Yours Succeeds, was ranked #1 in Ad Age\'s 2006 Book of Tens.',
  'Greg works with venture capitalists and serves on the boards of various digital media companies. Seven of his companies exited for over $1.6 billion in the last six years. He has 20+ years in Internet startups and traditional advertising, mostly in NYC and San Francisco. He resides in Bridgehampton, NY.',
]

const longBio = [
  'Greg Stuart is the current global CEO of Mobile Marketing Association, a nonprofit trade group with 700+ members in over 49 countries. He has grown MMA 2.5x in 2.5 years, and customers include Google, Weather Company, Coke and Colgate. Greg has 25+ years in startups and traditional marketing companies, mostly in NYC and San Francisco.',
  'Greg is a recognized thought leader in digital media and marketing and was selected by Ad Age as one of "10 Who Made Their Mark" in 2006, alongside Jay-Z and Chad Hurley. That same year, Ad Age also identified his book, What Sticks: Why Most Advertising Fails and How to Guarantee Yours Succeeds, as the #1 book in its Book of Tens.',
  'As former CEO of the Interactive Advertising Bureau (IAB), a trade group for the interactive advertising industry serving AOL, CNET, Google, Disney, Yahoo! and others, Greg led the industry from $6 billion to $17 billion annually while growing IAB\'s revenues +500% in four years.',
  'Greg has also been an active angel investor and advisor to 15+ venture-backed businesses in the digital media technology space, with exits to date of $1.6B and a 1600% return. He\'s primarily served as GM, CEO, head of ad sales and business development, plus more.',
  'Greg currently serves on the board of Livingly Media, backed by Menlo Ventures. He also served on the boards of Rapt, Inc., in San Francisco (sold to Microsoft) and Allyes in Shanghai (sold to Focus Media).',
  'As a member of the National Speakers Association, he often speaks on the failings and opportunities of advertising around the world, including speaking engagements in Istanbul, Israel, Germany, Canada, Mexico City, Sao Paulo, Switzerland, Zurich, Shanghai, Sydney, Barcelona, Monaco and Tokyo.',
  'Greg has a BA in economics from the University of Washington and completed Wharton\'s intense Advanced Management Program. He resides in Bridgehampton, NY, with his wife, Pamela, and his twin daughters and son.',
]

const introParagraphs = [
  'I want to thank Greg Stuart for joining us today. He is currently global CEO of the Mobile Marketing Association and was previously CEO of the Interactive Advertising Bureau in the U.S.',
  'In addition to nearly 20 years in digital media and advertising, Greg spent the first 10 years of his career in various New York ad agencies, where he always had a nagging feeling in his gut that the campaigns and his recommendations might be wrong. As a result of that, he coauthored the book, What Sticks, which Ad Age listed as the #1 book in its 2006 Book of Tens. Insights from the book, which he\'ll share with you today, were based on research against $1 billion in ad spending. As for that nagging feeling, it turns out he was right. HE WAS WRONG!',
  'Join me in THANKING Greg today...',
]

const questions = [
  'What has been the marketers\' internal company reaction to these studies?',
  'Why do (or why don\'t) the results here apply to other ad markets?',
  'What do the marketers think about your releasing all this data?',
  'What is the most surprising finding to you, personally?',
  'Does what you\'re saying - and the book - apply to small ad budgets or just big ones?',
]

export default function MediaKitPage() {
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.headerWrapper}>
        <Header />
      </div>

      <div className={styles.backgroundContainer}>
        <img src="/bg.jpg" alt="" className={styles.backgroundImage} />
      </div>

      <main className={styles.mainContainer}>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.kicker}>Media Kit</p>
            <h1>Materials for introducing Greg Stuart at your event.</h1>
            <p className={styles.heroText}>
              Use these approved bios, speaker introduction, and Q&amp;A prompts when promoting
              Greg Stuart or preparing the room before he speaks.
            </p>
          </div>

          <aside className={styles.heroCard} aria-label="Media kit highlights">
            <span>Event Ready</span>
            <strong>Bio, intro, and Q&amp;A copy</strong>
            <p>
              Designed for organizers, moderators, podcast hosts, and communications teams.
            </p>
          </aside>
        </section>

        <nav className={styles.quickLinks} aria-label="Media kit sections">
          <a href="#short-bio">
            <span>01</span>
            100-word bio
          </a>
          <a href="#speaker-intro">
            <span>02</span>
            Speaker intro
          </a>
          <a href="#long-bio">
            <span>03</span>
            Extended bio
          </a>
          <a href="#qa">
            <span>04</span>
            Q&amp;A prompts
          </a>
        </nav>

        <section id="short-bio" className={`${styles.copySection} ${styles.featuredSection}`}>
          <div className={styles.sectionLabel}>
            <span>Greg Stuart Bio</span>
            <strong>100 words</strong>
          </div>
          <div className={styles.copyCard}>
            {shortBio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section id="speaker-intro" className={styles.copySection}>
          <div className={styles.sectionLabel}>
            <span>Greg Stuart</span>
            <strong>Speaker Introduction</strong>
          </div>
          <div className={styles.copyCard}>
            <p className={styles.note}>
              When introducing Greg Stuart, you can use the following intro. Check with Greg if
              this should be updated or tailored for your event.
            </p>
            <div className={styles.scriptBlock}>
              {introParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>

        <section id="long-bio" className={styles.copySection}>
          <div className={styles.sectionLabel}>
            <span>Media Kit Continued</span>
            <strong>Bio under 400 words</strong>
          </div>
          <div className={styles.copyCard}>
            {longBio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section id="qa" className={styles.qaSection}>
          <div className={styles.qaHeader}>
            <p className={styles.kicker}>Moderator Help</p>
            <h2>Possible questions to kick off a post-presentation Q&amp;A</h2>
          </div>
          <ol className={styles.questionList}>
            {questions.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ol>
        </section>
      </main>

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
          <a href="mailto:greg@gregstuart.com">greg@gregstuart.com</a>
          <span className={styles.copyright}>&copy; Greg Stuart</span>
        </div>
      </footer>
    </div>
  )
}
