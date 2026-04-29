const fs = require('fs');

const replacements = [
  { path: 'src/app/about/page.tsx', replaces: [{ from: /India's/g, to: 'India&apos;s' }, { from: /We're/g, to: 'We&apos;re' }, { from: /Let's/g, to: 'Let&apos;s' }] },
  { path: 'src/app/admin/contact/page.tsx', replaces: [{ from: /haven't/g, to: 'haven&apos;t' }, { from: /We're/g, to: 'We&apos;re' }, { from: /Don't/g, to: 'Don&apos;t' }] },
  { path: 'src/app/company/(dashboard)/jobs/page.tsx', replaces: [{ from: /haven't/g, to: 'haven&apos;t' }] },
  { path: 'src/app/company/register/page.tsx', replaces: [{ from: /company's/g, to: 'company&apos;s' }, { from: /Let's/g, to: 'Let&apos;s' }, { from: /You're/g, to: 'You&apos;re' }] },
  { path: 'src/app/contact/page.tsx', replaces: [{ from: /Let's/g, to: 'Let&apos;s' }, { from: /We're/g, to: 'We&apos;re' }, { from: /won't/g, to: 'won&apos;t' }] },
  { path: 'src/app/forgot-password/page.tsx', replaces: [{ from: /We'll/g, to: 'We&apos;ll' }] },
  { path: 'src/app/jobs/[id]/page.tsx', replaces: [{ from: /company's/g, to: 'company&apos;s' }, { from: /Company's/g, to: 'Company&apos;s' }, { from: /Don't/g, to: 'Don&apos;t' }] },
  { path: 'src/app/not-found.tsx', replaces: [{ from: /can't/g, to: 'can&apos;t' }] },
  { path: 'src/app/refer/page.tsx', replaces: [{ from: /friend's/g, to: 'friend&apos;s' }, { from: /It's/g, to: 'It&apos;s' }] },
  { path: 'src/app/register/page.tsx', replaces: [{ from: /Let's/g, to: 'Let&apos;s' }, { from: /doesn't/g, to: 'doesn&apos;t' }] },
  { path: 'src/app/user/applied-jobs/page.tsx', replaces: [{ from: /haven't/g, to: 'haven&apos;t' }] },
  { path: 'src/components/Footer.tsx', replaces: [{ from: /India's/g, to: 'India&apos;s' }] },
];

replacements.forEach(r => {
  try {
    let content = fs.readFileSync(r.path, 'utf8');
    let changed = false;
    r.replaces.forEach(rep => {
      const newContent = content.replace(rep.from, rep.to);
      if (newContent !== content) {
        content = newContent;
        changed = true;
      }
    });
    if (changed) {
      fs.writeFileSync(r.path, content, 'utf8');
      console.log('Fixed:', r.path);
    }
  } catch(e) {
    console.error('Error on', r.path);
  }
});

