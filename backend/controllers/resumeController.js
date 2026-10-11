import { compareResume } from '../services/resumeService.js';
import { connectMongo } from '../config/db.js';

export async function healthCheck(_request, response, next) {
  try {
    await connectMongo();
    const aiConfigured = Boolean(process.env.GEMINI_API_KEY);
    const ready = aiConfigured;
    response.status(ready ? 200 : 503).json({
      success: ready,
      status: ready ? 'ok' : 'configuration-required',
      mongo: 'connected',
      gemini: aiConfigured ? 'configured' : 'missing GEMINI_API_KEY',
    });
  } catch (error) {
    next(error);
  }
}

export async function compareResumeController(request, response, next) {
  try {
    const result = await compareResume(request.file, request.body.jobDescription);
    response.json(result);
  } catch (error) {
    next(error);
  }
}
