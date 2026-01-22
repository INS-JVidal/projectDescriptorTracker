import { useState } from 'react';
import type { NodeType } from '../../types';
import styles from './AddNodeModal.module.css';

interface Props {
  parentId: string | null;
  onAdd: (data: { type: NodeType; name: string; notes: string | null }) => void;
  onClose: () => void;
}

export function AddNodeModal({ parentId, onAdd, onClose }: Props) {
  const [type, setType] = useState<NodeType>('directory');
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd({
        type,
        name: name.trim(),
        notes: notes.trim() || null,
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>
            {parentId ? 'Add Child Node' : 'Add Node'}
          </h3>
          <button onClick={onClose} className={styles.closeBtn}>
            x
          </button>
        </div>

        <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as NodeType)}
              className={styles.select}
            >
              <option value="directory">Directory</option>
              <option value="file">File</option>
              <option value="class">Class</option>
              <option value="method">Method</option>
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
              placeholder={getPlaceholder(type)}
              autoFocus
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={styles.textarea}
              placeholder="Additional notes about this node..."
              rows={3}
            />
          </div>

          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.btnCancel}>
              Cancel
            </button>
            <button type="submit" className={styles.btnAdd}>
              Add Node
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function getPlaceholder(type: NodeType): string {
  switch (type) {
    case 'directory':
      return 'e.g., /src/components';
    case 'file':
      return 'e.g., UserService.ts';
    case 'class':
      return 'e.g., UserService';
    case 'method':
      return 'e.g., getUserById()';
  }
}
