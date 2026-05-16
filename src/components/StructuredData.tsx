import React from 'react';

// Organization schema - tells Google/AI who you are
export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'JobAdda.in',
    url: 'https://jobadda.in',
    logo: 'https://jobadda.in/logosq.png',
    description: "India's fastest growing job portal. Search 50,000+ verified jobs, build professional resumes, and refer friends to earn money.",
    foundingDate: '2025',
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      url: 'https://jobadda.in/contact',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// WebSite schema with SearchAction - enables Google search box
export function WebSiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'JobAdda.in',
    url: 'https://jobadda.in',
    description: "India's fastest growing job portal with 50,000+ verified job openings.",
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://jobadda.in/jobs?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// JobPosting schema for individual job pages
export function JobPostingSchema({ job }: { job: any }) {
  if (!job) return null;

  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    datePosted: job.createdAt,
    validThrough: new Date(new Date(job.createdAt).getTime() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    employmentType: job.employmentType?.toUpperCase().replace('-', '_') || 'FULL_TIME',
    hiringOrganization: {
      '@type': 'Organization',
      name: job.company?.companyName || 'Company',
      sameAs: job.company?.website || undefined,
      logo: job.company?.logo || 'https://jobadda.in/logosq.png',
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location || 'India',
        addressCountry: 'IN',
      },
    },
    applicantLocationRequirements: job.location?.toLowerCase().includes('remote')
      ? { '@type': 'Country', name: 'India' }
      : undefined,
    jobLocationType: job.location?.toLowerCase().includes('remote') ? 'TELECOMMUTE' : undefined,
  };

  // Add salary if available
  if (job.salary) {
    const salaryMatch = job.salary.match(/(\d[\d,]*)/);
    if (salaryMatch) {
      schema.baseSalary = {
        '@type': 'MonetaryAmount',
        currency: 'INR',
        value: {
          '@type': 'QuantitativeValue',
          value: salaryMatch[1].replace(/,/g, ''),
          unitText: 'YEAR',
        },
      };
    }
  }

  // Add skills/requirements
  if (job.skills) {
    schema.skills = job.skills.split(',').map((s: string) => s.trim());
  }
  if (job.education) {
    schema.educationRequirements = {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: job.education,
    };
  }
  if (job.experience) {
    schema.experienceRequirements = job.experience;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// BreadcrumbList schema
export function BreadcrumbSchema({ items }: { items: { name: string; url: string }[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// FAQ schema - great for AI and Google featured snippets
export function FAQSchema({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
