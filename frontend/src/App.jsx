import { useMemo, useState } from 'react';

const defaultJD = `We are looking for a strong frontend engineer with experience in React, JavaScript, TypeScript, HTML, CSS, and API integration. The ideal candidate is comfortable building responsive interfaces, working with Node.js and Express, collaborating with product teams, and communicating clearly with stakeholders. Experience with MongoDB, REST APIs, and modern frontend tooling is a plus.`;

export default function App() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState(defaultJD);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const scoreLabel = useMemo(() => {
    if (!result) return 'Awaiting analysis';
    if (result.score >= 80) return 'Strong fit';
    if (result.score >= 60) return 'Promising fit';
    if (result.score >= 40) return 'Partial match';
    return 'Needs work';
  }, [result]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!resumeFile) {
      setError('Please upload a resume PDF before running the comparison.');
      return;
    }

    if (!jobDescription.trim()) {
      setError('Please provide a job description for the comparison.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('jobDescription', jobDescription);

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/compare', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'The resume comparison failed.');
      }

      setResult(data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <header className="site-header">
        <div className="brand" aria-label="Zero-to-Shipped logo">
          <span className="brand-mark"><span>0</span></span>
          Zero-to-Shipped
        </div>
        <div className="header-note">
          <span className="status-dot" aria-hidden="true" />
          Resume parser demo
        </div>
      </header>

      <main className="page-shell">
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">0 to shipped resume parser</span>
            <h1>
              Match your <span>resume</span> to the role.
            </h1>
            <p className="hero-description">
              Upload a resume PDF and compare it with a job description to spot the score,
              the skills that are present, and the gaps that still need work.
            </p>
          </div>

          <div className="analysis-layout">
            <aside className="upload-card">
              <div className="card-topline">
                <span className="section-eyebrow">Resume input</span>
                <span className="card-badge">PDF + JD</span>
              </div>

              <form className="analysis-form" onSubmit={handleSubmit}>
                <div className="field-group">
                  <label htmlFor="resume-upload" className="form-label">
                    Upload resume PDF
                  </label>
                  <input
                    id="resume-upload"
                    className="file-picker"
                    type="file"
                    accept="application/pdf"
                    onChange={(event) => setResumeFile(event.target.files?.[0] ?? null)}
                  />
                  <small className="helper-text">
                    {resumeFile ? resumeFile.name : 'Text-based PDF only, up to 10 MB'}
                  </small>
                </div>

                <div className="field-group">
                  <label htmlFor="job-description" className="form-label">
                    Job description
                  </label>
                  <textarea
                    id="job-description"
                    className="textarea"
                    value={jobDescription}
                    onChange={(event) => setJobDescription(event.target.value)}
                    maxLength={20000}
                    placeholder="Paste the job description here"
                  />
                  <small className="helper-text">Maximum 20,000 characters</small>
                </div>

                {error ? <p className="error-message">{error}</p> : null}

                <button type="submit" className="primary-button" disabled={isLoading}>
                  {isLoading ? 'Analyzing…' : 'Analyze resume'}
                </button>
              </form>
            </aside>

            <section className="report-card">
              <div className="report-heading">
                <div>
                  <span className="section-eyebrow">Match report</span>
                  <h2>{result ? result.filename : 'No analysis yet'}</h2>
                </div>
                <span className={`score-pill ${result ? 'is-ready' : ''}`}>
                  {result ? `${result.score}%` : '—'}
                </span>
              </div>

              {result ? (
                <>
                  <div className="score-row">
                    <div
                      className="score-ring"
                      style={{ '--score': result.score }}
                      aria-label={`Match score ${result.score}`}
                    >
                      <div>
                        <strong>{result.score}</strong>
                        <span>%</span>
                      </div>
                    </div>

                    <div className="score-meta">
                      <span className="eyebrow score-eyebrow">{scoreLabel}</span>
                      <p>{result.summary}</p>
                    </div>
                  </div>

                  <div className="skill-grid">
                    <div className="skill-panel">
                      <h3>Skills present</h3>
                      <ul className="skill-list">
                        {result.matchedSkills.length ? (
                          result.matchedSkills.map((skill) => (
                            <li key={skill} className="skill-pill present">
                              {skill}
                            </li>
                          ))
                        ) : (
                          <li className="empty-copy">No clear matches found.</li>
                        )}
                      </ul>
                    </div>

                    <div className="skill-panel">
                      <h3>Skills missing</h3>
                      <ul className="skill-list">
                        {result.missingSkills.length ? (
                          result.missingSkills.map((skill) => (
                            <li key={skill} className="skill-pill missing">
                              {skill}
                            </li>
                          ))
                        ) : (
                          <li className="empty-copy">Everything looks covered.</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </>
              ) : (
                <div className="empty-state">
                  <p>
                    Upload the candidate resume and job description to see a score, the skills that
                    match, and the missing requirements.
                  </p>
                </div>
              )}
            </section>
          </div>
        </section>
      </main>
    </>
  );
}
