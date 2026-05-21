async function main() {
  try {
    const res = await fetch('http://localhost:3000/api/jobs?limit=3');
    const data = await res.json();
    console.log('API RESPONSE JOBS:', JSON.stringify(data.jobs, null, 2));
  } catch (e) {
    console.error('Error fetching API:', e);
  }
}
main();
