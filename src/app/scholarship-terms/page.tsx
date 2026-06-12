import React from 'react';
import { GraduationCap, Award, BookOpen, Clock, Check, Sun } from 'lucide-react';
import WavingIndianFlag from '@/components/WavingIndianFlag';

export const metadata = {
  title: 'Scholarship Test Terms & Conditions | JobAdda',
  description: 'Terms and Conditions for JobAdda Scholarship Exam 2026',
};

export default function ScholarshipTermsPage() {
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
          opacity: 0.75; /* More visible background */
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
      `}</style>
      <div style={{ position: 'relative', maxWidth: '900px', margin: '7rem auto 4rem', padding: '0 1.5rem', zIndex: 1 }} className="anim-fade-up">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          {/* Independence Day Special Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 1rem', borderRadius: '9999px', backgroundColor: '#FFFFFF', border: '1px solid rgba(249,115,22,0.15)', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', marginBottom: '1.25rem' }}>
            <Sun size={16} color="#F97316" fill="#F97316" />
            <span style={{ color: '#F97316', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.05em' }}>INDEPENDENCE DAY SPECIAL</span>
          </div>

          {/* Title */}
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.65rem', letterSpacing: '-0.03em', lineHeight: 1.2 }}>
            <span style={{ color: '#F97316' }}>Scholarship </span>
            <span style={{ color: '#FFFFFF' }}>Test </span>
            <span style={{ color: '#22C55E' }}>2026</span>
          </h1>

          {/* Subtitle / Test Date with Saffron and Green Dashes */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.65rem', fontSize: '1.05rem', fontWeight: 700 }}>
            <span style={{ display: 'inline-flex', gap: '4px' }}>
              <span style={{ width: '12px', height: '3px', borderRadius: '2px', backgroundColor: '#F97316' }}></span>
              <span style={{ width: '12px', height: '3px', borderRadius: '2px', backgroundColor: '#22C55E' }}></span>
            </span>
            <span style={{ color: '#818CF8' }}>Additional Terms & Conditions — Test Date: 15th August 2026</span>
            <span style={{ display: 'inline-flex', gap: '4px' }}>
              <span style={{ width: '12px', height: '3px', borderRadius: '2px', backgroundColor: '#22C55E' }}></span>
              <span style={{ width: '12px', height: '3px', borderRadius: '2px', backgroundColor: '#F97316' }}></span>
            </span>
          </div>
        </div>

        <div className="card card-p" style={{ padding: '2.5rem', color: 'var(--text-2)', lineHeight: 1.8, fontSize: '0.95rem' }}>
        
        {/* Eligibility Criteria */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-1)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
            Eligibility Criteria
          </h2>
          <ol style={{ paddingLeft: '1.25rem', margin: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}>Any student, job seeker, or individual interested in skill development and career growth may apply for the JobAdda.in Scholarship Exam.</li>
            <li style={{ marginBottom: '0.5rem' }}>Each candidate is allowed to submit only one application.</li>
            <li style={{ marginBottom: '0.5rem' }}>Multiple registrations by the same candidate may lead to disqualification.</li>
          </ol>
        </section>

        {/* Registration & Refund Policy */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-1)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
            Registration Fee Policy & Refund Policy
          </h2>
          <ol start={4} style={{ paddingLeft: '1.25rem', margin: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}>Payment of the prescribed registration fee is mandatory to participate in the Scholarship Exam.</li>
            <li style={{ marginBottom: '0.5rem' }}>The registration fee will be refunded only if the Scholarship Exam is officially canceled by JobAdda.in</li>
            <li style={{ marginBottom: '0.5rem' }}>No refund will be provided if a candidate remains absent, voluntarily withdraws, or is disqualified due to violation of exam rules.</li>
          </ol>
        </section>

        {/* Merit & Tie-Breaking Rules */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-1)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
            Merit & Tie-Breaking Rules
          </h2>
          <ol start={7} style={{ paddingLeft: '1.25rem', margin: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}>Scholarships will be awarded strictly based on merit and exam performance.</li>
            <li style={{ marginBottom: '0.5rem' }}>
              In case two or more candidates secure the same score, ranking will be determined based on:
              <ul style={{ listStyleType: 'disc', paddingLeft: '1.25rem', marginTop: '0.25rem' }}>
                <li>Higher score in Reasoning</li>
                <li>Higher score in Mathematics</li>
                <li>Higher score in Current Affairs</li>
                <li>Earlier application submission date and time</li>
              </ul>
            </li>
          </ol>
        </section>

        {/* Result & Verification Process */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-1)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
            Result & Verification Process
          </h2>
          <ol start={9} style={{ paddingLeft: '1.25rem', margin: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}>The examination results will be declared on the official date announced by JobAdda.in</li>
            <li style={{ marginBottom: '0.5rem' }}>Scholarship awards are subject to successful document verification.</li>
            <li style={{ marginBottom: '0.5rem' }}>Candidates may be required to submit a valid ID proof, bank account details, photograph, and any other documents requested by JobAdda.in.</li>
            <li style={{ marginBottom: '0.5rem' }}>Any false information, forged documents, or misleading details may result in immediate cancellation of the scholarship.</li>
          </ol>
        </section>

        {/* Scholarship Awards */}
        <section style={{ marginBottom: '2.5rem', background: 'var(--bg-3)', padding: '1.5rem', borderRadius: '14px', border: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-1)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={22} color="var(--primary)" /> Scholarship Awards
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div style={{ background: 'var(--bg-1)', padding: '1rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.75rem', border: '1px solid var(--border)' }}>
              <span style={{ fontSize: '1.75rem' }}>🥇</span>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-3)', fontWeight: 600 }}>1st Rank Winner</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-1)' }}>₹15,000 Scholarship</div>
              </div>
            </div>
            <div style={{ background: 'var(--bg-1)', padding: '1rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.75rem', border: '1px solid var(--border)' }}>
              <span style={{ fontSize: '1.75rem' }}>🥈</span>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-3)', fontWeight: 600 }}>2nd Rank Winner</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-1)' }}>₹12,000 Scholarship</div>
              </div>
            </div>
            <div style={{ background: 'var(--bg-1)', padding: '1rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.75rem', border: '1px solid var(--border)' }}>
              <span style={{ fontSize: '1.75rem' }}>🥉</span>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-3)', fontWeight: 600 }}>3rd Rank Winner</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-1)' }}>₹10,000 Scholarship</div>
              </div>
            </div>
            <div style={{ background: 'var(--bg-1)', padding: '1rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.75rem', border: '1px solid var(--border)' }}>
              <span style={{ fontSize: '1.75rem' }}>🏅</span>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-3)', fontWeight: 600 }}>4th to 10th Rank Winners</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-1)' }}>₹5,000 Scholarship each</div>
              </div>
            </div>

            <div style={{ background: 'var(--bg-1)', padding: '1rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.75rem', border: '1px solid var(--border)' }}>
              <span style={{ fontSize: '1.75rem' }}>🏅</span>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-3)', fontWeight: 600 }}>11th to 200th Rank Winners</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-1)' }}>Get a Flat ₹15,000 Discount on Data Analyst & Business Analyst Courses, offered by Microsoft Education Partner.</div>
              </div>
            </div> 

          </div>
        </section>

        {/* Scholarship Payment Terms */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-1)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
            Scholarship Payment Terms
          </h2>
          <ol start={13} style={{ paddingLeft: '1.25rem', margin: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}>Scholarship amounts will be disbursed only through Cheque or NEFT/Bank Transfer.</li>
            <li style={{ marginBottom: '0.5rem' }}>The scholarship amount will be paid according to the candidate’s final rank.</li>
            <li style={{ marginBottom: '0.5rem' }}>After receiving the scholarship amount, winners are free to enroll in any institute, academy, training center, or educational program of their choice.</li>
            <li style={{ marginBottom: '0.5rem' }}>The scholarship amount will be transferred directly to the winner or through an approved payment process as decided by JobAdda.in.</li>
            <li style={{ marginBottom: '0.5rem' }}>No additional claims beyond the announced scholarship amount will be entertained.</li>
          </ol>
        </section>

        {/* Examination Rules */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-1)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
            Examination Rules
          </h2>
          <ol start={18} style={{ paddingLeft: '1.25rem', margin: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}>The Scholarship Exam may be conducted in both Online and Offline modes.</li>
            <li style={{ marginBottom: '0.5rem' }}>Candidates may choose to appear for the exam from home (Online Mode) or at an assigned examination center (Offline Mode), subject to availability.</li>
            <li style={{ marginBottom: '0.5rem' }}>Depending on the number of applicants, JobAdda.in may establish District-Wise Examination Centers.</li>
            <li style={{ marginBottom: '0.5rem' }}>Any form of cheating, impersonation, use of unfair means, multiple registrations, or violation of examination rules will result in immediate disqualification.</li>
            <li style={{ marginBottom: '0.5rem' }}>Disqualified candidates will not be eligible for any scholarship benefits or registration fee refund.</li>
          </ol>
        </section>

        {/* Exam Cancellation & Refund Policy */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-1)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
            Exam Cancellation & Refund Policy
          </h2>
          <ol start={23} style={{ paddingLeft: '1.25rem', margin: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}>If the Scholarship Exam is canceled by JobAdda.in due to administrative, technical, legal, or unavoidable circumstances, the registration fee paid by the candidate will be fully refunded.</li>
            <li style={{ marginBottom: '0.5rem' }}>No refund will be provided to candidates who are disqualified due to cheating, misconduct, false information, or violation of exam rules.</li>
          </ol>
        </section>

        {/* Publicity & Consent */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-1)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
            Publicity & Consent
          </h2>
          <ol start={25} style={{ paddingLeft: '1.25rem', margin: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}>Scholarship winners agree that their name, photograph, district, score, and achievement may be published on JobAdda.in’s website, social media platforms, certificates, advertisements, and promotional materials.</li>
            <li style={{ marginBottom: '0.5rem' }}>Participation in the Scholarship Exam shall be deemed as consent for such publication.</li>
          </ol>
        </section>

        {/* Force Majeure */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-1)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
            Force Majeure
          </h2>
          <ol start={27} style={{ paddingLeft: '1.25rem', margin: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}>JobAdda.in reserves the right to postpone, reschedule, modify, or cancel the examination due to natural disasters, government orders, technical issues, public emergencies, internet disruptions, or any unforeseen circumstances.</li>
          </ol>
        </section>

        {/* Legal Jurisdiction */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-1)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
            Legal Jurisdiction
          </h2>
          <ol start={28} style={{ paddingLeft: '1.25rem', margin: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}>Any dispute arising out of the Scholarship Program shall be subject to the jurisdiction of the courts located in Noida, India.</li>
          </ol>
        </section>

        {/* Rights Reserved */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-1)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
            Rights Reserved
          </h2>
          <ol start={29} style={{ paddingLeft: '1.25rem', margin: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}>JobAdda.in reserves the right to modify the Scholarship Amount, Exam Pattern, Eligibility Criteria, Number of Winners, Exam Date, Registration Fee, or any Terms & Conditions at any time without prior notice.</li>
            <li style={{ marginBottom: '0.5rem' }}>The decision of JobAdda.in shall be final and binding in all matters related to the Scholarship Program.</li>
          </ol>
        </section>

        {/* Scholarship Exam Pattern Table */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-1)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={20} color="var(--primary)" /> Scholarship Exam Pattern
          </h2>
          <div className="table-wrap" style={{ border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--bg-3)' }}>
                  <th style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)', color: 'var(--text-1)', fontWeight: 700 }}>Subject</th>
                  <th style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)', color: 'var(--text-1)', fontWeight: 700, textAlign: 'center' }}>Questions</th>
                  <th style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)', color: 'var(--text-1)', fontWeight: 700, textAlign: 'center' }}>Marks</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { sub: 'Mathematics', q: 30, m: 30 },
                  { sub: 'Reasoning & Aptitude', q: 30, m: 30 },
                  { sub: 'General Knowledge', q: 25, m: 25 },
                  { sub: 'Current Affairs', q: 20, m: 20 },
                  { sub: 'Science', q: 15, m: 15 },
                  { sub: 'History', q: 10, m: 10 },
                  { sub: 'Geography', q: 10, m: 10 },
                  { sub: 'Indian Constitution & Civics', q: 10, m: 10 }
                ].map((item, index) => (
                  <tr key={index} style={{ borderBottom: index === 7 ? 'none' : '1px solid var(--border)' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{item.sub}</td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>{item.q}</td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>{item.m}</td>
                  </tr>
                ))}
                <tr style={{ background: 'var(--bg-3)', fontWeight: 800, borderTop: '2px solid var(--border)' }}>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-1)' }}>Total</td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'center', color: 'var(--text-1)' }}>150</td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'center', color: 'var(--text-1)' }}>150</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Exam Details Cards */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-1)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={20} color="var(--primary)" /> Exam Details
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'var(--bg-3)', borderRadius: '10px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-3)', fontWeight: 600 }}>Total Questions</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-1)' }}>150 MCQs</div>
            </div>
            <div style={{ padding: '1rem', background: 'var(--bg-3)', borderRadius: '10px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-3)', fontWeight: 600 }}>Duration</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-1)' }}>120 Minutes</div>
            </div>
            <div style={{ padding: '1rem', background: 'var(--bg-3)', borderRadius: '10px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-3)', fontWeight: 600 }}>Negative Marking</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ef4444' }}>Yes, 0.25 marks</div>
            </div>
            <div style={{ padding: '1rem', background: 'var(--bg-3)', borderRadius: '10px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-3)', fontWeight: 600 }}>Exam Mode & Languages</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-1)' }}>Online & Offline<br />(English)</div>
            </div>
          </div>
        </section>

        {/* Declaration */}
        <section style={{ borderTop: '2px solid var(--border)', paddingTop: '2rem', marginTop: '2rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', background: 'rgba(99,102,241,0.05)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(99,102,241,0.1)' }}>
            <Check size={24} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '0.1rem' }} />
            <div>
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: 800, color: 'var(--text-1)' }}>Declaration</h4>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-2)', fontStyle: 'italic' }}>
                "I hereby declare that all information provided by me is true and accurate. I have read, understood, and agree to abide by all the Terms & Conditions of the JOBADDA.IN Scholarship Exam 2026."
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
    </div>
  );
}
