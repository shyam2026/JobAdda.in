import type { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://jobadda.in';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/jobs`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${baseUrl}/register`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/login`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/companies`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/refer`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/resume`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/salary`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  // Dynamic job pages
  let jobPages: MetadataRoute.Sitemap = [];
  try {
    const jobs = await prisma.job.findMany({
      where: { status: 'OPEN' },
      select: { id: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
      take: 5000, // Google sitemap limit per file is 50k, keep reasonable
    });

    jobPages = jobs.map((job: any) => ({
      url: `${baseUrl}/jobs/${job.id}`,
      lastModified: job.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch (e) {
    console.error('Sitemap: Failed to fetch jobs', e);
  }

  // Dynamic company pages
  let companyPages: MetadataRoute.Sitemap = [];
  try {
    const companies = await prisma.companyUser.findMany({
      where: { isActive: true, slug: { not: null } },
      select: { slug: true, updatedAt: true },
      take: 2000,
    });

    companyPages = companies
      .filter((c: any) => c.slug)
      .map((company: any) => ({
        url: `${baseUrl}/companies/${company.slug}`,
        lastModified: company.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
  } catch (e) {
    console.error('Sitemap: Failed to fetch companies', e);
  }

  return [...staticPages, ...jobPages, ...companyPages];
}
