export default function TermsPage() {
  const sections = [
    { title: 'Acceptance of Terms', content: 'By using JobAdda.in, you agree to these terms. If you do not agree, please do not use our services.' },
    { title: 'Account Responsibilities', content: 'You are responsible for maintaining the security of your account credentials. You must provide accurate information during registration. Accounts found to be fraudulent will be permanently banned.' },
    { title: 'Job Listings', content: 'JobAdda.in verifies job listings but cannot guarantee the accuracy of all employer-provided information. Users should exercise due diligence before applying. Report suspicious listings to our team.' },
    { title: 'Referral Program', content: 'The referral bonus (₹50) is credited when a referred user completes their first job application. Fraudulent referrals will result in account termination and forfeiture of all earned rewards.' },
    { title: 'Prohibited Activities', content: 'Users may not scrape, spam, post false information, or use the platform for any illegal activity. Violations will result in immediate account termination.' },
    { title: 'Termination', content: 'We reserve the right to terminate accounts that violate these terms. Users may also delete their own accounts at any time from account settings.' },
    { title: 'Changes to Terms', content: 'We may update these terms periodically. Continued use of JobAdda.in after changes constitutes acceptance of the new terms.' },
  ];

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '5rem 0' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="badge badge-primary" style={{ marginBottom: '1.5rem' }}>Legal</div>
        <h1 style={{ marginBottom: '0.5rem' }}>Terms of <span className="text-gradient">Service</span></h1>
        <p style={{ color: 'var(--text-3)', marginBottom: '3rem' }}>Last updated: April 2026</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {sections.map(s => (
            <div key={s.title} className="card card-p">
              <h3 style={{ marginBottom: '0.75rem' }}>{s.title}</h3>
              <p style={{ lineHeight: '1.8', color: 'var(--text-2)', margin: 0 }}>{s.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
