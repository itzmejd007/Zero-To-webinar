import { PDFParse } from 'pdf-parse';
import { connectMongo } from '../config/db.js';
import { analyzeResume } from './aiService.js';

const maxJobDescriptionLength = 20_000;
const maxResumeTextLength = 50_000;

export async function compareResume(file, jobDescription) {
  if (!file) {
    throw Object.assign(new Error('Please upload a resume PDF file.'), { statusCode: 400 });
  }

  if (file.mimetype !== 'application/pdf') {
    throw Object.assign(new Error('Only PDF files are supported right now.'), { statusCode: 400 });
  }

  if (!Buffer.isBuffer(file.buffer) || file.buffer.subarray(0, 5).toString('ascii') !== '%PDF-') {
    throw Object.assign(new Error('The uploaded file is not a valid PDF.'), { statusCode: 400 });
  }

  if (typeof jobDescription !== 'string' || !jobDescription.trim()) {
    throw Object.assign(new Error('Please provide a job description for comparison.'), { statusCode: 400 });
  }

  if (jobDescription.length > maxJobDescriptionLength) {
    throw Object.assign(new Error('The job description must be 20,000 characters or fewer.'), { statusCode: 400 });
  }

  let parser;
  let resumeText;
  try {
    parser = new PDFParse({ data: file.buffer });
    const parsedPdf = await parser.getText();
    resumeText = parsedPdf.text;
  } catch {
    throw Object.assign(new Error('Could not read this PDF. Please upload a valid, unlocked PDF.'), {
      statusCode: 400,
    });
  } finally {
    await parser?.destroy();
  }

  if (!resumeText?.trim()) {
    throw Object.assign(new Error('Could not find readable text in the uploaded PDF.'), { statusCode: 400 });
  }

  if (resumeText.length > maxResumeTextLength) {
    throw Object.assign(new Error('The resume contains too much text to analyze. Please upload a shorter PDF.'), {
      statusCode: 400,
    });
  }

  const collection = await connectMongo();
  const analysis = await analyzeResume(resumeText, jobDescription);

  const payload = {
    filename: file.originalname,
    score: analysis.score,
    matchedSkills: analysis.matchedSkills,
    missingSkills: analysis.missingSkills,
    summary: analysis.summary,
    createdAt: new Date(),
  };

  await collection.insertOne(payload);

  return {
    success: true,
    filename: file.originalname,
    score: analysis.score,
    matchedSkills: analysis.matchedSkills,
    missingSkills: analysis.missingSkills,
    summary: analysis.summary,
  };
}
