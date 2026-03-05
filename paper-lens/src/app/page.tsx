"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Upload, FileText, Loader2, Sparkles } from 'lucide-react';

import { useLanguage } from '@/lib/language-context';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { t } = useLanguage();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Analysis failed');

      const data = await res.json();
      const paperId = Math.random().toString(36).substring(7);
      
      // Store in localStorage for demo persistence
      localStorage.setItem(`paper_${paperId}`, JSON.stringify(data));
      
      router.push(`/paper/${paperId}`);
    } catch (error) {
      console.error(error);
      alert('Failed to analyze paper');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 max-w-2xl w-full text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-medium mb-6">
            <Sparkles size={16} className="text-yellow-400" />
            <span>{t('home.tagline')}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 mb-6">
            {t('home.title')}
          </h1>
          <p className="text-xl text-slate-300 max-w-lg mx-auto leading-relaxed">
            {t('home.subtitle')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl"
        >
          <div 
            className={`border-2 border-dashed rounded-2xl p-10 transition-all ${
              file ? 'border-blue-500 bg-blue-500/10' : 'border-slate-600 hover:border-slate-400 hover:bg-white/5'
            }`}
          >
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              id="pdf-upload"
            />
            <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center gap-4">
              {file ? (
                <>
                  <FileText className="w-16 h-16 text-blue-400" />
                  <div className="text-center">
                    <p className="text-lg font-medium text-white">{file.name}</p>
                    <p className="text-sm text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </>
              ) : (
                <>
                  <Upload className="w-16 h-16 text-slate-400" />
                  <div className="text-center">
                    <p className="text-lg font-medium text-white">{t('home.dropText')}</p>
                    <p className="text-sm text-slate-400">{t('home.browseText')}</p>
                  </div>
                </>
              )}
            </label>
          </div>

          <div className="mt-8">
            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                !file || loading
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg hover:shadow-blue-500/25'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" />
                  {t('home.analyzing')}
                </>
              ) : (
                <>
                  {t('home.generate')}
                  <Sparkles size={20} />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
