
"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import NoteCard from '@/components/dashboard/NoteCard';
import NoteEditor from '@/components/dashboard/NoteEditor';

export default function DashboardPage() {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const router = useRouter();

  const fetchNotes = useCallback(async () => {
    setIsLoading(true);
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/');
      return;
    }

    try {
      const res = await fetch('/api/notes', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch notes.');
      const data = await res.json();
      setNotes(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    router.push('/');
  };

  const handleSaveNote = async (note) => {
    const token = localStorage.getItem('authToken');
    const endpoint = note._id ? `/api/notes/${note._id}` : '/api/notes';
    const method = note._id ? 'PUT' : 'POST';

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(note),
      });
      if (!res.ok) throw new Error('Failed to save note.');
      
      await fetchNotes(); // Re-fetch notes to update the list
      setIsEditorOpen(false);
      setEditingNote(null);
    } catch (err) {
      console.error(err);
      setError('Could not save the note. Please try again.');
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    const token = localStorage.getItem('authToken');
    try {
      const res = await fetch(`/api/notes/${noteId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete note.');
      setNotes(notes.filter(n => n._id !== noteId));
    } catch (err) {
      console.error(err);
      setError('Could not delete the note. Please try again.');
    }
  };

  const openEditorForNew = () => {
    setEditingNote(null);
    setIsEditorOpen(true);
  };

  const openEditorForEdit = (note) => {
    setEditingNote(note);
    setIsEditorOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 font-sans">
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">My Notes</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </nav>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="flex justify-end mb-6">
          <button
            onClick={openEditorForNew}
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-all"
          >
            + Add Note
          </button>
        </div>

        {isLoading && <p className="text-center text-gray-500">Loading notes...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        
        {!isLoading && !error && notes.length === 0 && (
          <div className="text-center py-16">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No notes found.</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Click "Add Note" to get started!</p>
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {notes.map(note => (
            <NoteCard 
              key={note._id} 
              note={note} 
              onEdit={() => openEditorForEdit(note)}
              onDelete={() => handleDeleteNote(note._id)}
            />
          ))}
        </div>
      </main>

      {isEditorOpen && (
        <NoteEditor
          note={editingNote}
          onSave={handleSaveNote}
          onClose={() => setIsEditorOpen(false)}
        />
      )}
    </div>
  );
}

