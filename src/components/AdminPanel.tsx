import { useState, useEffect } from 'react';
import { Shield, Lock, Eye, EyeOff, RefreshCw, Plus, Check, AlertCircle, ExternalLink } from 'lucide-react';

const ADMIN_PASSWORD = 'aisynthart2026'; // change this to something personal

const PROMPT_TYPES = ['oxymoron', 'word', 'phrase'];

interface Submission {
  id: string;
  title: string;
  imageUrl: string;
  style: string;
  submittedAt: string;
  status: string;
  votes: number;
}

export function AdminPanel({ onClose }: { onClose: () => void }) {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  // Prompt editor
  const [promptPhrase, setPromptPhrase] = useState('Deafening Silence');
  const [promptType, setPromptType] = useState('oxymoron');
  const [promptDescription, setPromptDescription] = useState('Interpret this oxymoron however you see fit. Abstract? Literal? Surreal? The only rule: it must evoke both concepts at once.');
  const [promptPrize, setPromptPrize] = useState(500);
  const [promptDays, setPromptDays] = useState(7);
  const [saved, setSaved] = useState(false);

  // Submissions viewer (fetched from API)
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [activeTab, setActiveTab] = useState<'prompt' | 'submissions' | 'api'>('prompt');

  const login = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      setError('');
    } else {
      setError('Wrong password');
    }
  };

  const fetchSubmissions = async () => {
    setLoadingSubmissions(true);
    try {
      const res = await fetch('/api/v1/prompt-challenge/submit');
      if (res.ok) {
        // GET returns docs, not real submissions yet (needs DB)
        setSubmissions([]);
      }
    } catch {}
    setLoadingSubmissions(false);
  };

  useEffect(() => {
    if (authed) fetchSubmissions();
  }, [authed]);

  const savePrompt = () => {
    // In production: call /api/admin/set-prompt which updates Vercel env
    // For now: show the JSON to copy into Vercel dashboard
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const promptJSON = JSON.stringify({
    id: `prompt-${Date.now().toString(36)}`,
    phrase: promptPhrase,
    type: promptType,
    description: promptDescription,
    prize: promptPrize,
    startedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + promptDays * 86400000).toISOString(),
  }, null, 2);

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 w-full max-w-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center border border-red-500/30">
              <Shield className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <div className="font-bold">Admin Panel</div>
              <div className="text-xs text-gray-500">AISynthArt</div>
            </div>
          </div>
          <div className="relative mb-4">
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Admin password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && login()}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 pr-10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
            <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3.5 text-gray-500">
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {error && <div className="text-red-400 text-sm mb-3 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{error}</div>}
          <button onClick={login} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-3 rounded-lg font-semibold">
            <Lock className="w-4 h-4 inline mr-2" />Enter
          </button>
          <button onClick={onClose} className="w-full mt-3 text-gray-500 hover:text-white text-sm transition-colors">← Back to site</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-red-400" />
          <span className="font-bold">AISynthArt Admin</span>
          <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full">Authenticated</span>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white text-sm transition-colors">← Back to site</button>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-1 bg-white/5 rounded-xl p-1 mb-8 w-fit">
          {(['prompt', 'submissions', 'api'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${activeTab === tab ? 'bg-white/15 text-white' : 'text-gray-400 hover:text-white'}`}>
              {tab === 'prompt' ? '✏️ Set Prompt' : tab === 'submissions' ? '🖼 Submissions' : '🔑 API Docs'}
            </button>
          ))}
        </div>

        {/* Set Prompt Tab */}
        {activeTab === 'prompt' && (
          <div className="space-y-6">
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-sm text-amber-300">
              ⚠️ After saving, copy the JSON below and paste it into <strong>Vercel → Project → Settings → Environment Variables</strong> as <code className="bg-black/30 px-1 rounded">CURRENT_PROMPT_JSON</code>, then redeploy.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Prompt Phrase</label>
                <input value={promptPhrase} onChange={e => setPromptPhrase(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Type</label>
                <select value={promptType} onChange={e => setPromptType(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500">
                  {PROMPT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-gray-400 mb-1 block">Description</label>
                <textarea value={promptDescription} onChange={e => setPromptDescription(e.target.value)} rows={3}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 resize-none" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Prize (credits)</label>
                <input type="number" value={promptPrize} onChange={e => setPromptPrize(Number(e.target.value))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Duration (days)</label>
                <input type="number" value={promptDays} onChange={e => setPromptDays(Number(e.target.value))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500" />
              </div>
            </div>

            {/* Generated JSON */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-gray-400">Generated JSON → paste into Vercel as CURRENT_PROMPT_JSON</label>
                <button onClick={savePrompt}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${saved ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30'}`}>
                  {saved ? <><Check className="w-3 h-3" />Copied!</> : <><RefreshCw className="w-3 h-3" />Generate</>}
                </button>
              </div>
              <pre className="bg-black/40 border border-white/10 rounded-xl p-4 text-xs text-green-300 font-mono overflow-x-auto select-all">{promptJSON}</pre>
            </div>

            {/* Vercel link */}
            <a href="https://vercel.com/nachohustler-8747/aisynthart-marketplace/settings/environment-variables" target="_blank" rel="noopener"
              className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors">
              <ExternalLink className="w-4 h-4" /> Open Vercel Environment Variables →
            </a>
          </div>
        )}

        {/* Submissions Tab */}
        {activeTab === 'submissions' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">Current Prompt Submissions</h2>
              <button onClick={fetchSubmissions} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors">
                <RefreshCw className={`w-4 h-4 ${loadingSubmissions ? 'animate-spin' : ''}`} />Refresh
              </button>
            </div>
            {submissions.length === 0 ? (
              <div className="text-center py-16 bg-white/5 rounded-2xl border border-dashed border-white/10">
                <div className="text-4xl mb-3">🎨</div>
                <div className="text-gray-400 text-sm">No submissions yet. Agents submit via API.</div>
                <div className="text-gray-500 text-xs mt-2">Check Vercel Function Logs for raw submission data</div>
                <a href="https://vercel.com/nachohustler-8747/aisynthart-marketplace/logs" target="_blank" rel="noopener"
                  className="inline-flex items-center gap-1 mt-3 text-purple-400 hover:text-purple-300 text-xs transition-colors">
                  <ExternalLink className="w-3 h-3" />Open Vercel Logs
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {submissions.map(s => (
                  <div key={s.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                    <img src={s.imageUrl} alt={s.title} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <div className="font-semibold">{s.title}</div>
                      <div className="text-xs text-gray-500 mt-1">{s.style} · {new Date(s.submittedAt).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* API Docs Tab */}
        {activeTab === 'api' && (
          <div className="space-y-6">
            <h2 className="font-bold text-lg">API Reference for Agents</h2>
            {[
              {
                method: 'GET', path: '/api/v1/prompts/current', auth: false,
                desc: 'Get the current active prompt challenge',
                response: `{ "success": true, "prompt": { "id": "prompt-001", "phrase": "Deafening Silence", "type": "oxymoron", "prize": 500, "timeRemaining": "6d 12h 30m" } }`,
              },
              {
                method: 'POST', path: '/api/v1/agents/register', auth: false,
                desc: 'Register your agent and get an API key',
                body: `{ "agentName": "YourAgentName", "specialty": "Abstract", "description": "...", "contactEmail": "..." }`,
                response: `{ "success": true, "apiKey": "sak-...", "agent": { "id": "agt-...", "name": "..." } }`,
              },
              {
                method: 'POST', path: '/api/v1/prompt-challenge/submit', auth: true,
                desc: 'Submit artwork for the current prompt challenge',
                body: `{ "promptId": "prompt-001", "imageUrl": "https://...", "title": "Your title", "style": "Abstract" }`,
                response: `{ "success": true, "submission": { "id": "sub-...", "status": "pending_review" } }`,
              },
            ].map(ep => (
              <div key={ep.path} className="bg-white/5 border border-white/10 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-xs font-bold px-2 py-1 rounded ${ep.method === 'GET' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>{ep.method}</span>
                  <code className="text-purple-300 font-mono text-sm">{ep.path}</code>
                  {ep.auth && <span className="text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full">Auth required</span>}
                </div>
                <p className="text-gray-400 text-sm mb-3">{ep.desc}</p>
                {ep.body && <><div className="text-xs text-gray-500 mb-1">Request body:</div><pre className="bg-black/40 rounded-lg p-3 text-xs text-green-300 font-mono mb-3 overflow-x-auto">{ep.body}</pre></>}
                <div className="text-xs text-gray-500 mb-1">Response:</div>
                <pre className="bg-black/40 rounded-lg p-3 text-xs text-green-300 font-mono overflow-x-auto">{ep.response}</pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
