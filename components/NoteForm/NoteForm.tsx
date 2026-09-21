'use client';

import { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '@/lib/api/clientApi';
import { CreateNoteDto } from '../../types/note'
import { useNoteStore, DraftNote } from '../../lib/store/noteStore';
import css from './NoteForm.module.css';

interface NoteFormProps {
  onClose?: () => void;
}

const ALLOWED_TAGS = [
  'Todo',
  'Work',
  'Personal',
  'Meeting',
  'Shopping',
] as const;

export function NoteForm({ onClose }: NoteFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const draft = useNoteStore(state => state.draft);
  const setDraft = useNoteStore(state => state.setDraft);
  const clearDraft = useNoteStore(state => state.clearDraft);

  const [errors, setErrors] = useState<{
    title?: string;
    content?: string;
    tag?: string;
  }>({});

  const mutation = useMutation({
    mutationFn: (newNote: CreateNoteDto) => createNote(newNote),
    onSuccess: () => {
      clearDraft();

      queryClient.invalidateQueries({ queryKey: ['notes'] });

      if (onClose) {
        onClose();
      } else {
        router.push('/notes/filter/all');
      }
    },
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setDraft({ [name]: value } as Partial<DraftNote>);
  };

  const handleSubmitAction = (formData: FormData) => {
    const title = (formData.get('title') as string) || '';
    const content = (formData.get('content') as string) || '';
    const tag = (formData.get('tag') as DraftNote['tag']) || 'Todo';

    const newErrors: { title?: string; content?: string; tag?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (title.length > 50) {
      newErrors.title = 'Title must be 50 characters or less';
    }

    if (content.length > 500) {
      newErrors.content = 'Content must be 500 characters or less';
    }

    if (!ALLOWED_TAGS.includes(tag)) {
      newErrors.tag = 'Invalid tag selected';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    mutation.mutate({ title, content, tag });
  };

  const handleCancel = () => {
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
  };

  return (
    <form action={handleSubmitAction} className={css.form}>
      <div className={css.fieldGroup}>
        <label htmlFor="title" className={css.label}>
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          className={css.input}
          placeholder="Enter note title..."
          value={draft.title}
          onChange={handleChange}
        />
        {errors.title && <span className={css.error}>{errors.title}</span>}
      </div>

      <div className={css.fieldGroup}>
        <label htmlFor="content" className={css.label}>
          Content (optional)
        </label>
        <textarea
          id="content"
          name="content"
          className={css.textarea}
          placeholder="Enter note content..."
          rows={4}
          value={draft.content}
          onChange={handleChange}
        />
        {errors.content && <span className={css.error}>{errors.content}</span>}
      </div>

      <div className={css.fieldGroup}>
        <label htmlFor="tag" className={css.label}>
          Tag
        </label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          value={draft.tag}
          onChange={handleChange}
        >
          {ALLOWED_TAGS.map(tag => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
        {errors.tag && <span className={css.error}>{errors.tag}</span>}
      </div>

      {mutation.isError && (
        <p className={css.error}>Failed to create note. Please try again.</p>
      )}

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancel}
          disabled={mutation.isPending}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Creating...' : 'Create Note'}
        </button>
      </div>
    </form>
  );
}
