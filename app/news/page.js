import Header from '../../components/Header'
import styles from './page.module.css'

import pressItems from '../../data/news.json'
import pressMetadata from '../../data/data_collectors/google_news/news_articles.json'
import betterCmosItems from '../../data/podcast1.json'
import decodingAiItems from '../../data/podcast2.json'

export const metadata = {
  title: 'News & Press - Greg Stuart',
  description: 'Press coverage, interviews, and podcast episodes featuring Greg Stuart.',
}

const contentGroups = [
  {
    id: 'press',
    eyebrow: 'Press Coverage',
    title: 'Articles, announcements, and industry coverage',
    description:
      'Collected coverage of Greg Stuart, MMA Global, and the marketing effectiveness work shaping the industry.',
    items: pressItems.map((item, index) => ({
      ...item,
      type: 'Article',
      publisher: pressMetadata[index]?.publisher?.title || 'Press',
      publishedDate: pressMetadata[index]?.published_date,
    })),
  },
  {
    id: 'better-cmos',
    eyebrow: 'Better CMOs',
    title: 'Conversations with marketing leaders',
    description:
      'Recent episodes from Better CMOs, featuring practical conversations about measurement, trust, and marketing leadership.',
    items: betterCmosItems.map((item) => ({
      ...item,
      type: 'Podcast',
      publisher: 'Better CMOs',
    })),
  },
  {
    id: 'decoding-ai',
    eyebrow: 'Decoding AI for Marketing',
    title: 'AI and the future of marketing',
    description:
      'Episodes focused on how AI is changing discovery, strategy, personalization, and the marketing channel mix.',
    items: decodingAiItems.map((item) => ({
      ...item,
      type: 'Podcast',
      publisher: 'Decoding AI for Marketing',
    })),
  },
]

const featuredItem = contentGroups[0].items[0]
const totalItems = contentGroups.reduce((total, group) => total + group.items.length, 0)

function getItemHref(item) {
  return item.externalLink || item.link || '#'
}

function formatDate(dateString) {
  if (!dateString) return null

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateString))
}

export default function NewsPage() {
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
            <p className={styles.kicker}>News + Press</p>
            <h1>Greg Stuart in the news, on the record, and behind the mic.</h1>
            <p className={styles.heroText}>
              A living press room for articles, podcast episodes, and collected coverage across
              marketing effectiveness, AI, MMA Global, and the ideas Greg is pushing forward.
            </p>
            <div className={styles.heroStats} aria-label="News and press collection summary">
              <span>
                <strong>{totalItems}</strong>
                Collected items
              </span>
              <span>
                <strong>{contentGroups.length}</strong>
                Media types
              </span>
              <span>
                <strong>2026</strong>
                Latest coverage
              </span>
            </div>
          </div>

          {featuredItem && (
            <a
              className={styles.featuredCard}
              href={getItemHref(featuredItem)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className={styles.featuredLabel}>Featured</span>
              <img src={featuredItem.image} alt="" className={styles.featuredImage} />
              <div className={styles.featuredOverlay}>
                <span>{featuredItem.publisher}</span>
                <h2>{featuredItem.title}</h2>
                <p>Read the latest coverage</p>
              </div>
            </a>
          )}
        </section>

        <section className={styles.quickLinks} aria-label="News and press sections">
          {contentGroups.map((group) => (
            <a key={group.id} href={`#${group.id}`}>
              <span>{group.eyebrow}</span>
              <strong>{group.items.length} items</strong>
            </a>
          ))}
        </section>

        {contentGroups.map((group) => (
          <section key={group.id} id={group.id} className={styles.contentSection}>
            <div className={styles.sectionHeader}>
              <p className={styles.sectionEyebrow}>{group.eyebrow}</p>
              <div>
                <h2>{group.title}</h2>
                <p>{group.description}</p>
              </div>
            </div>

            <div className={styles.cardGrid}>
              {group.items
                .filter((item) => item.active)
                .map((item) => {
                  const publishedDate = formatDate(item.publishedDate)

                  return (
                    <a
                      key={item.id}
                      className={styles.mediaCard}
                      href={getItemHref(item)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className={styles.imageWrap}>
                        <img src={item.image} alt="" />
                        <span className={styles.typePill}>{item.type}</span>
                      </div>
                      <div className={styles.cardBody}>
                        <div className={styles.metaRow}>
                          <span>{item.publisher}</span>
                          {publishedDate && <time dateTime={item.publishedDate}>{publishedDate}</time>}
                        </div>
                        <h3>{item.title}</h3>
                        <span className={styles.readMore}>View item</span>
                      </div>
                    </a>
                  )
                })}
            </div>
          </section>
        ))}
      </main>

      <footer className={styles.mainFooter}>
        <nav className={styles.footerNav}>
          <a href="/about">About Me</a>
          <span className={styles.dot}>●</span>
          <a href="/media-kit">Media Kit</a>
          <span className={styles.dot}>●</span>
          <a href="/contact">Contact Me</a>
          <span className={styles.dot}>●</span>
          <a href="/">Home</a>
        </nav>

        <div className={styles.footerRight}>
          <a href="mailto:greg@gregstuart.com">greg@gregstuart.com</a>
          <span className={styles.copyright}>&copy; Greg Stuart</span>
        </div>
      </footer>
    </div>
  )
}
