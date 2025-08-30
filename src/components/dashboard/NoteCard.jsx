
"use client";
import React from 'react';

export default function NoteCard({ note, onEdit, onDelete }) {
  const formattedDate = new Date(note.updatedAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-5 flex flex-col justify-between transition-transform hover:scale-105">
      <div>
        <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-2 truncate">{note.title}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 whitespace-pre-wrap break-words">
          {note.content.substring(0, 100)}{note.content.length > 100 && '...'}
        </p>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-auto">
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">Last updated: {formattedDate}</p>
        <div className="flex justify-end space-x-2">
          <button onClick={onEdit} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Edit</button>
          <button onClick={onDelete} className="text-sm font-medium text-red-600 hover:text-red-500">Delete</button>
        </div>
      </div>
    </div>
  );
}