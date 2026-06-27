'use client';
import React, { useState } from 'react';
import { Award, BookOpen, Clock, Check, ArrowLeft, FileText, Scale, Shield, AlertTriangle, Users, RefreshCw, Languages } from 'lucide-react';
import Link from 'next/link';

const AWARDS = [
  { emoji: '🥇', rank: '1st Rank', prize: '₹15,000 Scholarship', hi_rank: 'पहला स्थान' },
  { emoji: '🥈', rank: '2nd Rank', prize: '₹12,000 Scholarship', hi_rank: 'दूसरा स्थान' },
  { emoji: '🥉', rank: '3rd Rank', prize: '₹10,000 Scholarship', hi_rank: 'तीसरा स्थान' },
  { emoji: '🏅', rank: '4th–10th Rank', prize: '₹5,000 Scholarship each', hi_rank: '4थी से 10वीं रैंक' },
  { emoji: '🏅', rank: '11th–200th Rank', prize: 'Flat ₹15,000 Course Discount', hi_rank: '11वीं से 200वीं रैंक' },
];

const EXAM_SUBJECTS = [
  { sub: 'Mathematics', hi_sub: 'गणित (Mathematics)', q: 30, m: 30 },
  { sub: 'Reasoning & Aptitude', hi_sub: 'तर्कशक्ति (Reasoning)', q: 30, m: 30 },
  { sub: 'General Knowledge', hi_sub: 'सामान्य ज्ञान (General Knowledge)', q: 25, m: 25 },
  { sub: 'Current Affairs', hi_sub: 'करेंट अफेयर्स (Current Affairs)', q: 20, m: 20 },
  { sub: 'Science', hi_sub: 'विज्ञान (Science)', q: 15, m: 15 },
  { sub: 'History', hi_sub: 'इतिहास (History)', q: 10, m: 10 },
  { sub: 'Geography', hi_sub: 'भूगोल (Geography)', q: 10, m: 10 },
  { sub: 'Indian Constitution & Civics', hi_sub: 'भारतीय संविधान और नागरिक शास्त्र', q: 10, m: 10 },
];

const TERMS_EN = {
  eligibility: {
    title: "Eligibility Criteria",
    points: [
      "Any student, job seeker, or individual interested in skill development and career growth may apply for the JobAdda.in Scholarship Exam.",
      "Each candidate is allowed to submit only one application.",
      "Multiple registrations by the same candidate may lead to disqualification."
    ]
  },
  fee: {
    title: "Registration Fee Policy & Refund Policy",
    points: [
      "Payment of the prescribed registration fee is mandatory to participate in the Scholarship Exam.",
      "The registration fee will be refunded only if the Scholarship Exam is officially canceled by JobAdda.in.",
      "No refund will be provided if a candidate remains absent, voluntarily withdraws, or is disqualified due to violation of exam rules."
    ]
  },
  merit: {
    title: "Merit & Tie-Breaking Rules",
    points: [
      "Scholarships will be awarded strictly based on merit and exam performance.",
      "In case two or more candidates secure the same score, ranking will be determined based on: \n• Higher score in Reasoning \n• Higher score in Mathematics \n• Higher score in Current Affairs \n• Earlier application submission date and time"
    ]
  },
  result: {
    title: "Result & Verification Process",
    points: [
      "The examination results will be declared on the official date announced by JobAdda.in.",
      "Scholarship awards are subject to successful document verification.",
      "Candidates may be required to submit a valid ID proof, bank account details, photograph, and any other documents requested by JobAdda.in.",
      "Any false information, forged documents, or misleading details may result in immediate cancellation of the scholarship."
    ]
  },
  awards: {
    title: "Scholarship Awards",
    note: "11th–200th rank holders get a Flat ₹15,000 Discount on Data Analyst & Business Analyst Courses, offered by Microsoft Education Partner."
  },
  payment: {
    title: "Scholarship Payment Terms",
    points: [
      "Scholarship amounts will be disbursed only through Cheque or NEFT/Bank Transfer.",
      "The scholarship amount will be paid according to the candidate's final rank.",
      "After receiving the scholarship amount, winners are free to enroll in any institute, academy, training center, or educational program of their choice.",
      "The scholarship amount will be transferred directly to the winner or through an approved payment process as decided by JobAdda.in.",
      "No additional claims beyond the announced scholarship amount will be entertained."
    ]
  },
  examRules: {
    title: "Examination Rules",
    points: [
      "The Scholarship Exam may be conducted in both Online and Offline modes.",
      "Candidates may choose to appear from home (Online Mode) or at an assigned examination center (Offline Mode), subject to availability.",
      "Depending on the number of applicants, JobAdda.in may establish District-Wise Examination Centers.",
      "Any form of cheating, impersonation, use of unfair means, multiple registrations, or violation of examination rules will result in immediate disqualification.",
      "Disqualified candidates will not be eligible for any scholarship benefits or registration fee refund."
    ]
  },
  cancellation: {
    title: "Exam Cancellation & Refund Policy",
    points: [
      "If the Scholarship Exam is canceled by JobAdda.in due to administrative, technical, legal, or unavoidable circumstances, the registration fee paid by the candidate will be fully refunded.",
      "No refund will be provided to candidates who are disqualified due to cheating, misconduct, false information, or violation of exam rules."
    ]
  },
  publicity: {
    title: "Publicity & Consent",
    points: [
      "Scholarship winners agree that their name, photograph, district, score, and achievement may be published on JobAdda.in's website, social media platforms, certificates, advertisements, and promotional materials.",
      "Participation in the Scholarship Exam shall be deemed as consent for such publication."
    ]
  },
  forceMajeure: {
    title: "Force Majeure & Legal Jurisdiction",
    points: [
      "JobAdda.in reserves the right to postpone, reschedule, modify, or cancel the examination due to natural disasters, government orders, technical issues, public emergencies, internet disruptions, or any unforeseen circumstances.",
      "Any dispute arising out of the Scholarship Program shall be subject to the jurisdiction of the courts located in Noida, India.",
      "JobAdda.in reserves the right to modify the Scholarship Amount, Exam Pattern, Eligibility Criteria, Number of Winners, Exam Date, Registration Fee, or any Terms & Conditions at any time without prior notice.",
      "The decision of JobAdda.in shall be final and binding in all matters related to the Scholarship Program."
    ]
  },
  pattern: {
    title: "Scholarship Exam Pattern"
  },
  details: {
    title: "Exam Details"
  },
  declaration: {
    title: "Declaration",
    text: "\"I hereby declare that all the information provided by me is true and accurate. I have read and understood all the Terms and Conditions of the JOBADDA.IN Scholarship Exam 2026 and agree to abide by them in their entirety.\""
  }
};

const TERMS_HI = {
  eligibility: {
    title: "पात्रता मानदंड (Eligibility Criteria)",
    points: [
      "कोई भी छात्र, नौकरी चाहने वाला, या कौशल विकास और करियर में उन्नति के इच्छुक व्यक्ति JobAdda.in स्कॉलरशिप परीक्षा के लिए आवेदन कर सकता है।",
      "प्रत्येक उम्मीदवार को केवल एक ही आवेदन जमा करने की अनुमति है।",
      "एक ही उम्मीदवार द्वारा एक से अधिक पंजीकरण करने पर उम्मीदवारी रद्द (Disqualify) की जा सकती है।"
    ]
  },
  fee: {
    title: "पंजीकरण शुल्क एवं रिफंड नीति (Registration Fee Policy)",
    points: [
      "स्कॉलरशिप परीक्षा में भाग लेने के लिए निर्धारित पंजीकरण शुल्क का भुगतान अनिवार्य है।",
      "पंजीकरण शुल्क केवल तभी वापस किया जाएगा जब JobAdda.in द्वारा स्कॉलरशिप परीक्षा आधिकारिक तौर पर रद्द कर दी जाए।",
      "यदि कोई उम्मीदवार अनुपस्थित रहता है, स्वेच्छा से परीक्षा से हट जाता है, या परीक्षा नियमों के उल्लंघन के कारण अयोग्य घोषित कर दिया जाता है, तो उसे कोई रिफंड नहीं दिया जाएगा।"
    ]
  },
  merit: {
    title: "मेरिट और टाई-ब्रेकिंग नियम (Merit & Tie-Breaking Rules)",
    points: [
      "स्कॉलरशिप पूरी तरह से मेरिट और परीक्षा में प्रदर्शन के आधार पर प्रदान की जाएगी।",
      "यदि दो या दो से अधिक उम्मीदवार समान अंक प्राप्त करते हैं, तो रैंकिंग निम्न आधार पर तय की जाएगी: \n• रीज़निंग (Reasoning) में अधिक अंक \n• गणित (Mathematics) में अधिक अंक \n• करेंट अफेयर्स (Current Affairs) में अधिक अंक \n• आवेदन जमा करने की तिथि और समय (जो पहले आवेदन करेगा, उसे प्राथमिकता मिलेगी)"
    ]
  },
  result: {
    title: "परिणाम और सत्यापन प्रक्रिया (Result & Verification Process)",
    points: [
      "परीक्षा परिणाम JobAdda.in द्वारा निर्धारित आधिकारिक तिथि पर घोषित किए जाएंगे।",
      "स्कॉलरशिप पुरस्कार दस्तावेज़ों के सफल सत्यापन (Document Verification) के बाद ही दिए जाएंगे।",
      "उम्मीदवारों को एक वैध आईडी प्रमाण, बैंक खाता विवरण, फोटो और JobAdda.in द्वारा अनुरोधित कोई अन्य दस्तावेज़ जमा करने की आवश्यकता हो सकती है।",
      "कोई भी गलत जानकारी, जाली दस्तावेज़, या भ्रामक विवरण पाए जाने पर स्कॉलरशिप को तत्काल रद्द किया जा सकता है।"
    ]
  },
  awards: {
    title: "स्कॉलरशिप पुरस्कार (Scholarship Awards)",
    note: "11वीं से 200वीं रैंक प्राप्त करने वालों को माइक्रोसॉफ्ट एजुकेशन पार्टनर द्वारा प्रस्तुत डेटा एनालिस्ट और बिजनेस एनालिस्ट कोर्सेज पर ₹15,000 की फ्लैट छूट दी जाएगी।"
  },
  payment: {
    title: "स्कॉलरशिप भुगतान की शर्तें (Payment Terms)",
    points: [
      "स्कॉलरशिप राशि का भुगतान केवल चेक (Cheque) या NEFT/बैंक ट्रांसफर के माध्यम से किया जाएगा।",
      "स्कॉलरशिप राशि का भुगतान उम्मीदवार की अंतिम रैंक के अनुसार किया जाएगा।",
      "स्कॉलरशिप राशि प्राप्त करने के बाद, विजेता अपनी पसंद के किसी भी संस्थान, अकादमी, प्रशिक्षण केंद्र या शैक्षिक कार्यक्रम में दाखिला लेने के लिए स्वतंत्र हैं।",
      "स्कॉलरशिप राशि सीधे विजेता को या JobAdda.in द्वारा तय की गई अनुमोदित भुगतान प्रक्रिया के माध्यम से हस्तांतरित की जाएगी।",
      "घोषित स्कॉलरशिप राशि के अलावा किसी भी अतिरिक्त दावे पर विचार नहीं किया जाएगा।"
    ]
  },
  examRules: {
    title: "परीक्षा नियम (Examination Rules)",
    points: [
      "स्कॉलरशिप परीक्षा ऑनलाइन और ऑफलाइन दोनों मोड में आयोजित की जा सकती है।",
      "उम्मीदवार घर से (ऑनलाइन मोड) या आवंटित परीक्षा केंद्र पर (ऑफ़लाइन मोड) परीक्षा देना चुन सकते हैं, जो सीटों की उपलब्धता के अधीन है।",
      "आवेदकों की संख्या के आधार पर, JobAdda.in जिला-वार परीक्षा केंद्र स्थापित कर सकता है।",
      "किसी भी प्रकार की धोखाधड़ी, प्रतिरूपण (किसी और की जगह परीक्षा देना), अनुचित साधनों का उपयोग, एक से अधिक पंजीकरण, या परीक्षा नियमों का उल्लंघन तत्काल अयोग्यता का कारण बनेगा।",
      "अयोग्य घोषित किए गए उम्मीदवार किसी भी स्कॉलरशिप लाभ या पंजीकरण शुल्क वापसी के हकदार नहीं होंगे।"
    ]
  },
  cancellation: {
    title: "परीक्षा रद्द करने और रिफंड नीति (Cancellation Policy)",
    points: [
      "यदि प्रशासनिक, तकनीकी, कानूनी या अपरिहार्य परिस्थितियों के कारण JobAdda.in द्वारा स्कॉलरशिप परीक्षा रद्द कर दी जाती है, तो उम्मीदवार द्वारा भुगतान किया गया पंजीकरण शुल्क पूरी तरह से वापस कर दिया जाएगा।",
      "धोखाधड़ी, दुराचार, गलत जानकारी या परीक्षा नियमों के उल्लंघन के कारण अयोग्य घोषित किए गए उम्मीदवारों को कोई रिफंड नहीं दिया जाएगा।"
    ]
  },
  publicity: {
    title: "प्रचार और सहमति (Publicity & Consent)",
    points: [
      "स्कॉलरशिप विजेता इस बात से सहमत हैं कि उनका नाम, तस्वीर, जिला, स्कोर और उपलब्धि JobAdda.in की वेबसाइट, सोशल मीडिया प्लेटफॉर्म, प्रमाण पत्र, विज्ञापन और प्रचार सामग्री पर प्रकाशित की जा सकती है।",
      "स्कॉलरशिप परीक्षा में भाग लेना ऐसे प्रकाशन के लिए सहमति माना जाएगा।"
    ]
  },
  forceMajeure: {
    title: "अप्रत्याशित घटना और कानूनी क्षेत्राधिकार (Legal Jurisdiction)",
    points: [
      "JobAdda.in प्राकृतिक आपदाओं, सरकारी आदेशों, तकनीकी समस्याओं, सार्वजनिक आपात स्थितियों, इंटरनेट व्यवधानों या किसी भी अप्रत्याशित परिस्थिति के कारण परीक्षा को स्थगित, पुनर्निर्धारित, संशोधित या रद्द करने का अधिकार सुरक्षित रखता है।",
      "स्कॉलरशिप कार्यक्रम से उत्पन्न कोई भी विवाद नोएडा, भारत में स्थित न्यायालयों के अधिकार क्षेत्र के अधीन होगा।",
      "JobAdda.in बिना किसी पूर्व सूचना के किसी भी समय स्कॉलरशिप राशि, परीक्षा पैटर्न, पात्रता मानदंड, विजेताओं की संख्या, परीक्षा तिथि, पंजीकरण शुल्क या किसी भी नियम व शर्तों को संशोधित करने का अधिकार सुरक्षित रखता है।",
      "स्कॉलरशिप कार्यक्रम से संबंधित सभी मामलों में JobAdda.in का निर्णय अंतिम और बाध्यकारी होगा।"
    ]
  },
  pattern: {
    title: "स्कॉलरशिप परीक्षा पैटर्न (Exam Pattern)"
  },
  details: {
    title: "परीक्षा का विवरण (Exam Details)"
  },
  declaration: {
    title: "घोषणा (Declaration)",
    text: "\"मैं एतद्द्वारा घोषणा करता/करती हूं कि मेरे द्वारा दी गई सभी जानकारी सत्य और सटीक है। मैंने JOBADDA.IN स्कॉलरशिप परीक्षा 2026 के सभी नियम और शर्तों को पढ़ लिया है, समझ लिया है और मैं उनका पूरी तरह से पालन करने के लिए सहमत हूं।\""
  }
};

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: '2.5rem' }}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-1)', borderBottom: '1px solid var(--border)', paddingBottom: '0.6rem', marginBottom: '1.25rem' }}>
        {icon}{title}
      </h2>
      {children}
    </section>
  );
}

export default function TermsClient() {
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const T = lang === 'hi' ? TERMS_HI : TERMS_EN;

  return (
    <div className="patriotic-bg-container" style={{ position: 'relative', minHeight: '100vh', width: '100%', overflow: 'hidden' }}>
      <style>{`
        .patriotic-bg-container::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url('/patriotic_bg.jpg');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          background-attachment: fixed;
          opacity: 0.75;
          z-index: 0;
          pointer-events: none;
        }
        .card {
          background: var(--bg-2) !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
        }
        .card:hover {
          transform: none !important;
        }
        .terms-container { max-width: 900px; margin: 0 auto; padding: 7rem 1.25rem 4rem; }
        .terms-hero { background: linear-gradient(135deg, rgba(249,115,22,0.1) 0%, rgba(34,197,94,0.07) 100%); border: 1px solid var(--border); border-radius: 24px; padding: 2.5rem 2rem; text-align: center; margin-bottom: 2.5rem; }
        .terms-body { background: var(--bg-2); border: 1px solid var(--border); border-radius: 22px; padding: 2.5rem; color: var(--text-2); font-size: 0.93rem; line-height: 1.8; }
        .terms-ol { padding-left: 1.5rem; margin: 0; display: flex; flex-direction: column; gap: 0.6rem; }
        .terms-ol li { color: var(--text-2); }
        .award-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 0.5rem; }
        .award-card { background: var(--bg-3); border: 1px solid var(--border); border-radius: 14px; padding: 1rem 1.25rem; display: flex; align-items: center; gap: 0.75rem; }
        .terms-table { width: 100%; border-collapse: collapse; }
        .terms-table th { background: var(--bg-3); padding: 0.75rem 1rem; text-align: left; font-weight: 800; color: var(--text-1); border-bottom: 2px solid var(--border); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.04em; }
        .terms-table td { padding: 0.7rem 1rem; border-bottom: 1px solid var(--border); }
        .terms-table tbody tr:last-child td { border-bottom: none; }
        .terms-table tfoot td { background: var(--bg-3); font-weight: 800; color: var(--text-1); border-top: 2px solid var(--border); }
        .exam-details-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; }
        .exam-detail-box { background: var(--bg-3); border: 1px solid var(--border); border-radius: 12px; padding: 1rem 1.25rem; }
        .lang-toggle { display: inline-flex; background: var(--bg-3); border: 1px solid var(--border); border-radius: 8px; padding: 0.25rem; margin-bottom: 1.5rem; align-items: center; }
        .lang-btn { padding: 0.4rem 1rem; font-size: 0.85rem; font-weight: 700; border-radius: 6px; cursor: pointer; border: none; background: transparent; color: var(--text-3); transition: all 0.2s; }
        .lang-btn.active { background: var(--primary); color: white; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        @media (max-width: 640px) {
          .terms-container { padding: 6rem 1rem 3rem; }
          .terms-body { padding: 1.5rem 1.25rem; }
          .terms-hero { padding: 2rem 1.25rem; }
        }
      `}</style>

      <div className="terms-container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Back and Language Toggle */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1.75rem', gap: '1rem' }}>
          <Link href="/scholarship" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-3)', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }}>
            <ArrowLeft size={16} /> {lang === 'hi' ? 'वापस जाएं (Back)' : 'Back to Scholarship'}
          </Link>

          <div className="lang-toggle">
            <span style={{ display: 'flex', alignItems: 'center', padding: '0 0.5rem', color: 'var(--text-3)' }}><Languages size={16} /></span>
            <button className={`lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>English</button>
            <button className={`lang-btn ${lang === 'hi' ? 'active' : ''}`} onClick={() => setLang('hi')}>हिंदी</button>
          </div>
        </div>

        {/* Hero */}
        <div className="terms-hero">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.25)', color: '#F97316', borderRadius: '9999px', padding: '0.35rem 1rem', fontSize: '0.75rem', fontWeight: 800, marginBottom: '1.25rem', letterSpacing: '0.04em' }}>
            INDEPENDENCE DAY SPECIAL 2026
          </div>
          <h1 style={{ fontSize: 'clamp(1.7rem, 5vw, 2.4rem)', fontWeight: 900, lineHeight: 1.2, margin: '0 0 0.5rem' }}>
            <span style={{ color: '#F97316' }}>Scholarship </span>
            <span style={{ color: 'var(--text-1)' }}>Test </span>
            <span style={{ color: '#22C55E' }}>{lang === 'hi' ? 'नियम व शर्तें' : 'Terms & Conditions'}</span>
          </h1>
          <p style={{ color: 'var(--text-3)', fontSize: '0.9rem', margin: 0 }}>
            {lang === 'hi' ? 'परीक्षा तिथि: 15 अगस्त 2026 • कृपया पंजीकरण से पहले सभी नियम ध्यानपूर्वक पढ़ें।' : 'Exam Date: 15th August 2026 • Please read all terms carefully before registering.'}
          </p>
        </div>

        {/* Main Body */}
        <div className="terms-body">

          <Section icon={<Users size={20} color="#6366F1" />} title={T.eligibility.title}>
            <ol className="terms-ol" start={1}>
              {T.eligibility.points.map((p, i) => <li key={i}>{p}</li>)}
            </ol>
          </Section>

          <Section icon={<RefreshCw size={20} color="#F97316" />} title={T.fee.title}>
            <ol className="terms-ol" start={4}>
              {T.fee.points.map((p, i) => <li key={i}>{p}</li>)}
            </ol>
          </Section>

          <Section icon={<Scale size={20} color="#10B981" />} title={T.merit.title}>
            <ol className="terms-ol" start={7}>
              <li>{T.merit.points[0]}</li>
              <li>
                {T.merit.points[1].split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i !== T.merit.points[1].split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </li>
            </ol>
          </Section>

          <Section icon={<FileText size={20} color="#8B5CF6" />} title={T.result.title}>
            <ol className="terms-ol" start={9}>
              {T.result.points.map((p, i) => <li key={i}>{p}</li>)}
            </ol>
          </Section>

          {/* Scholarship Awards highlighted section */}
          <Section icon={<Award size={20} color="#F59E0B" />} title={T.awards.title}>
            <div className="award-grid">
              {AWARDS.map((a, i) => (
                <div key={i} className="award-card">
                  <span style={{ fontSize: '1.75rem' }}>{a.emoji}</span>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-3)', fontWeight: 700 }}>{lang === 'hi' ? a.hi_rank : a.rank}</div>
                    <div style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-1)' }}>{a.prize}</div>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-3)', marginTop: '0.85rem', lineHeight: 1.5 }}>
              {T.awards.note}
            </p>
          </Section>

          <Section icon={<Shield size={20} color="#EC4899" />} title={T.payment.title}>
            <ol className="terms-ol" start={13}>
              {T.payment.points.map((p, i) => <li key={i}>{p}</li>)}
            </ol>
          </Section>

          <Section icon={<BookOpen size={20} color="#6366F1" />} title={T.examRules.title}>
            <ol className="terms-ol" start={18}>
              {T.examRules.points.map((p, i) => <li key={i}>{p}</li>)}
            </ol>
          </Section>

          <Section icon={<AlertTriangle size={20} color="#EF4444" />} title={T.cancellation.title}>
            <ol className="terms-ol" start={23}>
              {T.cancellation.points.map((p, i) => <li key={i}>{p}</li>)}
            </ol>
          </Section>

          <Section icon={<Users size={20} color="#10B981" />} title={T.publicity.title}>
            <ol className="terms-ol" start={25}>
              {T.publicity.points.map((p, i) => <li key={i}>{p}</li>)}
            </ol>
          </Section>

          <Section icon={<Shield size={20} color="#6366F1" />} title={T.forceMajeure.title}>
            <ol className="terms-ol" start={27}>
              {T.forceMajeure.points.map((p, i) => <li key={i}>{p}</li>)}
            </ol>
          </Section>

          {/* Exam Pattern Table */}
          <Section icon={<BookOpen size={20} color="#F59E0B" />} title={T.pattern.title}>
            <div style={{ border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden' }}>
              <table className="terms-table">
                <thead>
                  <tr>
                    <th>{lang === 'hi' ? 'विषय (Subject)' : 'Subject'}</th>
                    <th style={{ textAlign: 'center' }}>{lang === 'hi' ? 'प्रश्न' : 'Questions'}</th>
                    <th style={{ textAlign: 'center' }}>{lang === 'hi' ? 'अंक' : 'Marks'}</th>
                  </tr>
                </thead>
                <tbody>
                  {EXAM_SUBJECTS.map((s, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 600, color: 'var(--text-1)' }}>{lang === 'hi' ? s.hi_sub : s.sub}</td>
                      <td style={{ textAlign: 'center' }}>{s.q}</td>
                      <td style={{ textAlign: 'center' }}>{s.m}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td>{lang === 'hi' ? 'कुल (Total)' : 'Total'}</td>
                    <td style={{ textAlign: 'center' }}>150</td>
                    <td style={{ textAlign: 'center' }}>150</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Section>

          {/* Exam Details */}
          <Section icon={<Clock size={20} color="#8B5CF6" />} title={T.details.title}>
            <div className="exam-details-grid">
              {[
                { label: lang === 'hi' ? 'कुल प्रश्न' : 'Total Questions', val: '150 MCQs' },
                { label: lang === 'hi' ? 'अवधि' : 'Duration', val: lang === 'hi' ? '150 मिनट' : '150 Minutes' },
                { label: lang === 'hi' ? 'नेगेटिव मार्किंग' : 'Negative Marking', val: lang === 'hi' ? 'हाँ, 0.25 अंक' : 'Yes, 0.25 marks', warn: true },
                { label: lang === 'hi' ? 'परीक्षा मोड' : 'Exam Mode', val: lang === 'hi' ? 'ऑनलाइन और ऑफलाइन' : 'Online & Offline' },
              ].map((d, i) => (
                <div key={i} className="exam-detail-box">
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.3rem' }}>{d.label}</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: (d as any).warn ? '#EF4444' : 'var(--text-1)' }}>{d.val}</div>
                </div>
              ))}
            </div>
          </Section>

          {/* Declaration */}
          <div style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '14px', padding: '1.5rem', display: 'flex', gap: '0.75rem' }}>
            <Check size={22} color="var(--primary-light)" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
            <div>
              <h4 style={{ margin: '0 0 0.5rem', fontSize: '1rem', fontWeight: 800, color: 'var(--text-1)' }}>{T.declaration.title}</h4>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-2)', fontStyle: 'italic', lineHeight: 1.6 }}>
                {T.declaration.text}
              </p>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
