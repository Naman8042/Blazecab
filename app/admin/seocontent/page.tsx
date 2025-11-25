"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  Plus,
  Save,
  Trash2,
  Search,
  FileText,
  HelpCircle,
  Loader2,
  LayoutDashboard,
} from "lucide-react";

/*************** TYPES *****************/

interface FAQ {
  question: string;
  answer: string;
}

interface SEOListItem {
  slug: string;
}

interface SEOGetResponse {
  success: boolean;
  data: {
    seoContent: string;
    faqs: FAQ[];
  };
}

interface SEOListResponse {
  success: boolean;
  data: SEOListItem[];
}

/****************************************/

export default function SEODashboard() {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [selectedSlug, setSelectedSlug] = useState("");
  const [seoContent, setSeoContent] = useState("");
  const [faqs, setFaqs] = useState<FAQ[]>([]);

  // Inputs
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Loading States
  const [loadingList, setLoadingList] = useState(true);
  const [loadingContent, setLoadingContent] = useState(false);
  const [saving, setSaving] = useState(false);

  /****************************************
   * Fetch Slugs
   ****************************************/
  useEffect(() => {
    fetchSlugs();
  }, []);

  const fetchSlugs = async () => {
    try {
      const res = await axios.get<SEOListResponse>("/api/seo/list");
      setSlugs(res.data.data.map((item) => item.slug));
    } catch {
      toast.error("Failed to load slugs");
    } finally {
      setLoadingList(false);
    }
  };

  /****************************************
   * Load SEO Content by Slug
   ****************************************/
  const loadSEO = async (slug: string) => {
    setSelectedSlug(slug);
    setLoadingContent(true);
    try {
      const res = await axios.get<SEOGetResponse>(`/api/seo/${slug}/get`);
      setSeoContent(res.data.data.seoContent || "");
      setFaqs(res.data.data.faqs || []);
    } catch {
      toast.error("Failed to load content");
    } finally {
      setLoadingContent(false);
    }
  };

  /****************************************
   * Create New Slug
   ****************************************/
  const createNewSlug = async () => {
    if (!newSlug.trim()) return toast.error("Slug cannot be empty");

    try {
      await axios.post("/api/seo/create", {
        slug: newSlug,
        seoContent: "",
        faqs: [],
      });

      toast.success("New SEO route created!");

      setSlugs((prev) => [...prev, newSlug]);
      loadSEO(newSlug);
      setNewSlug("");
    } catch {
      toast.error("Failed to create slug");
    }
  };

  /****************************************
   * Update SEO Main Content
   ****************************************/
  const updateSEO = async () => {
    if (!selectedSlug) return;
    setSaving(true);
    try {
      await axios.post(`/api/seo/${selectedSlug}/update`, { seoContent });
      toast.success("Main content updated!");
    } catch {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  /****************************************
   * Add FAQ
   ****************************************/
  const addFAQ = async () => {
    if (!newQuestion || !newAnswer)
      return toast.error("Fill both fields");

    const newFaqItem: FAQ = { question: newQuestion, answer: newAnswer };
    const prevFaqs = [...faqs];
    setFaqs([...faqs, newFaqItem]);
    setNewQuestion("");
    setNewAnswer("");

    try {
      await axios.post(`/api/seo/${selectedSlug}/faq/add`, newFaqItem);
      toast.success("FAQ added");
    } catch {
      setFaqs(prevFaqs);
      toast.error("Failed to add FAQ");
    }
  };

  /****************************************
   * Delete FAQ
   ****************************************/
  const deleteFAQ = async (question: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;

    const prevFaqs = [...faqs];
    setFaqs(faqs.filter((f) => f.question !== question));

    try {
      await axios.post(`/api/seo/${selectedSlug}/faq/delete`, { question });
      toast.success("FAQ deleted");
    } catch {
      setFaqs(prevFaqs);
      toast.error("Failed to delete FAQ");
    }
  };

  /****************************************
   * Filter Slugs
   ****************************************/
  const filteredSlugs = slugs.filter((s) =>
    s.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /****************************************
   * UI
   ****************************************/
  return (
    <div className="flex h-screen bg-slate-0 text-slate-900 font-sans w-full">

      {/* SIDEBAR */}
      <aside className="w-80 bg-white border-r border-slate-200 flex flex-col h-full shadow-sm z-10">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-2 text-indigo-600 mb-6">
            <LayoutDashboard size={24} />
            <h1 className="text-xl font-bold tracking-tight">SEO Admin</h1>
          </div>

          <div className="flex gap-2">
            <input
              value={newSlug}
              onChange={(e) => setNewSlug(e.target.value)}
              placeholder="new-page-slug"
              className="flex-1 bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={createNewSlug}
              className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-md transition-colors"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        <div className="p-4 flex-1 overflow-hidden flex flex-col">
          <div className="relative mb-4">
            <Search
              className="absolute left-3 top-2.5 text-slate-400"
              size={16}
            />
            <input
              placeholder="Filter slugs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 pr-2 custom-scrollbar">
            {loadingList ? (
              <div className="flex justify-center p-4">
                <Loader2 className="animate-spin text-slate-400" />
              </div>
            ) : (
              filteredSlugs.map((slug) => (
                <button
                  key={slug}
                  onClick={() => loadSEO(slug)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-3
                      ${
                        selectedSlug === slug
                          ? "bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100"
                          : "text-slate-600 hover:bg-slate-100 border border-transparent"
                      }`}
                >
                  <FileText
                    size={16}
                    className={
                      selectedSlug === slug ? "text-indigo-500" : "text-slate-400"
                    }
                  />
                  <span className="truncate">{slug}</span>
                </button>
              ))
            )}
          </div>
        </div>
      </aside>

      {/* =========== MAIN CONTENT ============= */}
      <main className="flex-1 flex flex-col h-full overflow-hidden w-full">

        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm shrink-0 ">
          <h2 className="text-lg font-semibold text-slate-800">
            {selectedSlug ? (
              <>
                Editing:{" "}
                <span className="text-indigo-600 font-mono bg-indigo-50 px-2 py-1 rounded">
                  {selectedSlug}
                </span>
              </>
            ) : (
              <span className="text-slate-400">Select a page to edit</span>
            )}
          </h2>
          {selectedSlug && (
            <button
              onClick={updateSEO}
              disabled={saving}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-lg font-medium transition-all disabled:opacity-50"
            >
              {saving ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              Save Changes
            </button>
          )}
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
          {selectedSlug && !loadingContent && (
            <div className="max-w-4xl mx-auto flex flex-col gap-8 pb-20">

              {/* SEO Content Editor */}
              <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-4 border-b pb-4">
                  <FileText className="text-indigo-500" size={20} />
                  <h3 className="font-semibold text-slate-800">Page Content</h3>
                </div>
                <textarea
                  value={seoContent}
                  onChange={(e) => setSeoContent(e.target.value)}
                  placeholder="Write your HTML or Markdown content here..."
                  className="w-full h-[400px] p-4 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm resize-none"
                />
              </div>

              {/* FAQ Manager */}
              <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-4 border-b pb-4">
                  <HelpCircle className="text-purple-500" size={20} />
                  <h3 className="font-semibold text-slate-800">FAQs</h3>
                </div>

                {/* Add New */}
                <div className="bg-slate-50 p-5 rounded-lg mb-6 border border-slate-200">
                  <h4 className="text-sm font-semibold text-slate-600 mb-3">
                    Add New FAQ
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      placeholder="Question?"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm focus:outline-indigo-500"
                    />
                    <input
                      value={newAnswer}
                      onChange={(e) => setNewAnswer(e.target.value)}
                      placeholder="Answer..."
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm focus:outline-indigo-500"
                    />
                  </div>
                  <button
                    onClick={addFAQ}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md text-sm font-medium transition-colors flex justify-center items-center gap-2"
                  >
                    <Plus size={16} /> Add to List
                  </button>
                </div>

                {/* List */}
                <div className="space-y-3">
                  {faqs.length === 0 && (
                    <p className="text-center text-slate-400 text-sm py-8">
                      No FAQs added yet.
                    </p>
                  )}

                  {faqs.map((faq, i) => (
                    <div
                      key={i}
                      className="group flex items-start justify-between bg-white border border-slate-200 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="pr-8">
                        <h4 className="font-semibold text-slate-800 text-sm mb-1">
                          Q: {faq.question}
                        </h4>
                        <p className="text-slate-600 text-sm leading-relaxed">
                          A: {faq.answer}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteFAQ(faq.question)}
                        className="text-slate-300 hover:text-red-500 transition-colors p-1"
                        title="Delete FAQ"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Loading */}
          {loadingContent && (
            <div className="h-full flex items-center justify-center text-slate-400 gap-2">
              <Loader2 className="animate-spin" /> Loading content...
            </div>
          )}

          {/* No slug selected */}
          {!selectedSlug && (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-4">
              <LayoutDashboard size={64} className="opacity-20" />
              <p>Select a route from the sidebar to start editing</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
