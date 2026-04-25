export default function PrivacyPage() {
  const sections = [
    { title: 'Information We Collect', content: 'We collect information you provide during registration (name, email, password), profile data (bio, skills, education, experience), and usage data (jobs viewed, applications submitted, referrals made).' },
    { title: 'How We Use Your Information', content: 'Your data is used to match you with relevant job opportunities, power the referral system, improve our platform, and send important notifications about your applications.' },
    { title: 'Data Security', content: 'All passwords are hashed using bcrypt. We use HTTPS encryption for all data transmission. We never sell your personal information to third parties.' },
    { title: 'Referral Data', content: 'When you use a referral link, we record the referral relationship to credit bonuses accurately. Referrer names are not disclosed to the referred user.' },
    { title: 'Your Rights', content: 'You may request deletion of your account and all associated data at any time by contacting support@jobadda.in. We will process your request within 30 days.' },
    { title: 'Contact', content: 'For privacy-related queries, contact us at privacy@jobadda.in or visit our Contact page.' },
  ];

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '5rem 0' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="badge badge-primary" style={{ marginBottom: '1.5rem' }}>Legal</div>
        <h1 style={{ marginBottom: '0.5rem' }}>Privacy <span className="text-gradient">Policy</span></h1>
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
