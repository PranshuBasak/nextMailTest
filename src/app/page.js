'use client';
import { useState } from 'react';
import styles from "./page.module.css";

export default function Home() {
  const [toEmail, setToEmail] = useState('');
  const [toSubject, setToSubject] = useState('');
  const [htmlBody, setHtmlBody] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');

    try {
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ toEmail, htmlBody, toSubject }),
      });

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setStatus('success');
        setToEmail('');
        setToSubject('');
        setHtmlBody('');
      } else {
        setStatus('error');
        console.error('Server error:', data.error);
      }
    } catch (error) {
      setStatus('error');
      console.error('Client error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Email Sender</h1>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div>
            <label htmlFor="toEmail" className={styles.label}>
              To Email:
            </label>
            <input
              id="toEmail"
              type="email"
              value={toEmail}
              onChange={(e) => setToEmail(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          <div>
            <label htmlFor="toSubject" className={styles.label}>
              To Subject:
            </label>
            <input
              id="toSubject"
              type="text"
              value={toSubject}
              onChange={(e) => setToSubject(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          <div>
            <label htmlFor="htmlBody" className={styles.label}>
              Email Content (HTML):
            </label>
            <textarea
              id="htmlBody"
              value={htmlBody}
              onChange={(e) => setHtmlBody(e.target.value)}
              className={styles.textarea}
              placeholder="<h1>Hello</h1><p>Your message here...</p>"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`${styles.button} ${loading ? styles.buttonDisabled : styles.buttonEnabled}`}
          >
            {loading ? 'Sending...' : 'Send Email'}
          </button>

          {status === 'success' && (
            <p className={styles.successMessage}>Email sent successfully!</p>
          )}
          {status === 'error' && (
            <p className={styles.errorMessage}>Failed to send email. Please check all fields and try again.</p>
          )}
        </form>
      </main>
    </div>
  );
}
