async function test() {
  const endpoints = ['clients', 'plans', 'promotions', 'payments', 'sales', 'attendance', 'routines', 'equipment', 'products'];
  for (const ep of endpoints) {
    try {
      const res = await fetch('http://localhost:3001/api/' + ep);
      if (!res.ok) {
        console.log(`❌ ${ep} failed with status ${res.status}`);
        const text = await res.text();
        console.log(text);
      } else {
        console.log(`✅ ${ep} OK`);
      }
    } catch (err) {
      console.log(`❌ ${ep} fetch error:`, err.message);
    }
  }
}
test();
