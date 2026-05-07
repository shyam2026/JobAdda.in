import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Fetch jobs from the last 7 days
    const recentJobs = await prisma.job.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
        status: 'OPEN',
      },
      select: {
        title: true,
      },
      take: 50, // Limit to 50 for processing
    });

    if (recentJobs.length === 0) {
      // Fallback if no recent jobs
      return NextResponse.json({ 
        tags: [
          { label: 'React Developer', q: 'react' },
          { label: 'Marketing', q: 'marketing' },
          { label: 'Data Analyst', q: 'data' }
        ] 
      });
    }

    // Count occurrences of titles
    const counts: Record<string, number> = {};
    recentJobs.forEach((job: any) => {
      const title = job.title.trim();
      counts[title] = (counts[title] || 0) + 1;
    });

    // Sort by count and take top 3
    const topTags = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([title]) => ({
        label: title,
        q: title.toLowerCase()
      }));

    return NextResponse.json({ tags: topTags });
  } catch (error) {
    console.error("POPULAR_TAGS_ERROR", error);
    return NextResponse.json({ 
      tags: [
        { label: 'React Developer', q: 'react' },
        { label: 'Marketing', q: 'marketing' },
        { label: 'Data Analyst', q: 'data' }
      ] 
    });
  }
}
