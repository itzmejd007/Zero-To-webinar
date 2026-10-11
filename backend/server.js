import app from './app.js';

const port = Number(process.env.PORT || 5000);

if (process.env.VERCEL !== '1') {
  app.listen(port, () => {
    console.log(`Resume parser backend running on http://localhost:${port}`);
  });
}

export default app;
