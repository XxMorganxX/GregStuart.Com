'use client'

import { useState } from 'react'
import Header from '../../components/Header'
import styles from './page.module.css'

const CONTACT_EMAIL = 'greg@gregstuart.com'

const contactLinks = [
  {
    label: 'Email',
    value: CONTACT_EMAIL,
    href: `mailto:${CONTACT_EMAIL}`,
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/gregstuart',
    href: 'https://www.linkedin.com/in/gregstuart/',
  },
  {
    label: 'YouTube',
    value: '@GregStuart',
    href: 'https://www.youtube.com/@GregStuart',
  },
  {
    label: 'Facebook',
    value: 'facebook.com/gregnstuart',
    href: 'https://www.facebook.com/gregnstuart',
  },
]

const contactReasons = [
  'Speaking and podcast invitations',
  'Board, advisory, and investment conversations',
  'Marketing transformation and MMA-related opportunities',
  'Press, interviews, and media requests',
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    reason: 'Speaking and podcast invitations',
    message: '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const subject = `Website contact: ${formData.reason}`
    const body = [
      `Name: ${formData.name}`,
      `Email: ${formData.email}`,
      formData.organization ? `Organization: ${formData.organization}` : null,
      `Reason: ${formData.reason}`,
      '',
      formData.message,
    ]
      .filter(Boolean)
      .join('\n')

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

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
          <p className={styles.kicker}>Contact Greg Stuart</p>
          <h1>Let&apos;s start the right conversation.</h1>
          <p className={styles.heroText}>
            Reach out about speaking, podcast appearances, advisory work, board opportunities,
            marketing transformation, press, or a smart idea worth exploring.
          </p>
        </section>

        <section className={styles.contactGrid} aria-label="Contact information">
          <div className={styles.infoPanel}>
            <h2>Contact Information</h2>
            <p>
              The fastest way to reach Greg is through the email form. You can also connect
              through the channels below.
            </p>

            <div className={styles.contactCards}>
              {contactLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={styles.contactCard}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  <span>{link.label}</span>
                  <strong>{link.value}</strong>
                </a>
              ))}
            </div>

            <div className={styles.detailBox}>
              <h3>Good reasons to get in touch</h3>
              <ul>
                {contactReasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            </div>

            <div className={styles.locationBox}>
              <span>Based in</span>
              <strong>Brooklyn, New York</strong>
              <p>Available for select in-person and virtual conversations.</p>
            </div>
          </div>

          <form className={styles.emailForm} onSubmit={handleSubmit}>
            <div className={styles.formHeader}>
              <h2>Draft an Email</h2>
              <p>
                Fill this out and your email app will open with a ready-to-send draft addressed
                to Greg.
              </p>
            </div>

            <label>
              Your name
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                required
              />
            </label>

            <label>
              Your email
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </label>

            <label>
              Company or organization
              <input
                type="text"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                autoComplete="organization"
              />
            </label>

            <label>
              What is this about?
              <select name="reason" value={formData.reason} onChange={handleChange}>
                {contactReasons.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
                <option value="Something else">Something else</option>
              </select>
            </label>

            <label>
              Message
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="7"
                placeholder="A few sentences about what you would like to discuss..."
                required
              />
            </label>

            <button type="submit">Draft Email to Greg</button>
            <p className={styles.formNote}>
              This uses your own email app, so you can review and send the message before it leaves.
            </p>
          </form>
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
          <a href="/">Home</a>
        </nav>

        <div className={styles.footerRight}>
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          <span className={styles.copyright}>&copy; Greg Stuart</span>
        </div>
      </footer>
    </div>
  )
}
