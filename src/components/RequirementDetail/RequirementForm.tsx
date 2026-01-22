import { useState } from 'react';
import type { Requirement, Priority, RequirementStatus } from '../../types';
import styles from './RequirementForm.module.css';

interface Props {
  requirement: Requirement;
  onSave: (updates: Partial<Omit<Requirement, 'id' | 'subcategoryId'>>) => void;
  onCancel: () => void;
}

export function RequirementForm({ requirement, onSave, onCancel }: Props) {
  const [code, setCode] = useState(requirement.code);
  const [title, setTitle] = useState(requirement.title);
  const [description, setDescription] = useState(requirement.description);
  const [priority, setPriority] = useState<Priority>(requirement.priority);
  const [status, setStatus] = useState<RequirementStatus>(requirement.status);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim() && title.trim()) {
      onSave({
        code: code.trim(),
        title: title.trim(),
        description: description.trim(),
        priority,
        status,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Code</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={styles.input}
            placeholder="e.g., REQ-001"
            required
          />
        </div>
        <div className={`${styles.field} ${styles.fieldLarge}`}>
          <label className={styles.label}>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.input}
            placeholder="Requirement title"
            required
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className={styles.select}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as RequirementStatus)}
            className={styles.select}
          >
            <option value="not-started">Not Started</option>
            <option value="in-progress">In Progress</option>
            <option value="complete">Complete</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={styles.textarea}
          placeholder="Detailed description of the requirement..."
          rows={4}
        />
      </div>

      <div className={styles.actions}>
        <button type="button" onClick={onCancel} className={styles.btnCancel}>
          Cancel
        </button>
        <button type="submit" className={styles.btnSave}>
          Save Changes
        </button>
      </div>
    </form>
  );
}
