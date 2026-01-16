import Link from 'next/link'
import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.siteHeader}>
      <nav className={styles.headerNav}>
        <Link href="/" className={`${styles.navLink} ${styles.logo}`} aria-label="Greg Stuart - Home"></Link>
        <Link href="/perspective" className={`${styles.navLink} ${styles.perspective}`} aria-label="Perspective - Book, Blog, Blah-blah-blah"></Link>
        <Link href="/projects" className={`${styles.navLink} ${styles.projects}`} aria-label="Projects - Busy, Busy, Busy"></Link>
        <Link href="/proposed" className={`${styles.navLink} ${styles.proposed}`} aria-label="Proposed - Could be, Might be."></Link>
      </nav>
    </header>
  )
}






