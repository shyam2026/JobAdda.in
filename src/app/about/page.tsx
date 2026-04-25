export default function AboutPage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '5rem 0' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="badge badge-primary" style={{ marginBottom: '1.5rem' }}>About Us</div>
        <h1 style={{ marginBottom: '1.5rem' }}>India's <span className="text-gradient">Next-Gen</span> Job Portal</h1>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.9', marginBottom: '2rem', color: 'var(--text-2)' }}>
          JobAdda.in was built with one mission: to make job hunting in India fast, fair, and rewarding. We combine verified job listings, a powerful resume builder, and a unique referral earning program — all in one platform.
        </p>
        <div className="grid-3" style={{ marginBottom: '3rem' }}>
          {[
            { val: '50,000+', lbl: 'Verified Jobs' },
            { val: '5L+', lbl: 'Registered Users' },
            { val: '₹50', lbl: 'Per Referral Earned' },
          ].map(s => (
            <div key={s.lbl} className="card card-p" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary-light)' }}>{s.val}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-3)', marginTop: '0.4rem' }}>{s.lbl}</div>
            </div>
          ))}
        </div>
        <div className="card card-p">
          <h3 style={{ marginBottom: '1rem' }}>Our Mission</h3>
          <p style={{ lineHeight: '1.8', color: 'var(--text-2)' }}>
            We believe every skilled professional deserves access to great opportunities, and every company deserves to find the right talent. JobAdda.in bridges this gap by providing a transparent, efficient, and rewarding hiring ecosystem for India's workforce.
          </p>
        </div>
      </div>
    </div>
  );
}
