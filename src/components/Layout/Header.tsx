import { useState, useRef } from 'react';
import { useProjects } from '../../hooks/useProjects';
import styles from './Header.module.css';

export function Header() {
  const {
    projects,
    currentProject,
    selectedProjectId,
    createProject,
    selectProject,
    exportCurrentProject,
    importProject,
  } = useProjects();

  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      createProject(newProjectName.trim());
      setNewProjectName('');
      setIsCreating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreateProject();
    } else if (e.key === 'Escape') {
      setIsCreating(false);
      setNewProjectName('');
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await importProject(file);
      e.target.value = ''; // Reset input
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <h1>DesTrack</h1>
      </div>

      <div className={styles.projectSelector}>
        <select
          value={selectedProjectId || ''}
          onChange={(e) => selectProject(e.target.value || null)}
          className={styles.select}
        >
          <option value="">Select a project...</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.actions}>
        {isCreating ? (
          <div className={styles.createForm}>
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Project name..."
              className={styles.input}
              autoFocus
            />
            <button onClick={handleCreateProject} className={styles.btnPrimary}>
              Create
            </button>
            <button
              onClick={() => {
                setIsCreating(false);
                setNewProjectName('');
              }}
              className={styles.btnSecondary}
            >
              Cancel
            </button>
          </div>
        ) : (
          <>
            <button onClick={() => setIsCreating(true)} className={styles.btnPrimary}>
              + New Project
            </button>
            <button onClick={handleImportClick} className={styles.btnSecondary}>
              Import
            </button>
            {currentProject && (
              <button onClick={exportCurrentProject} className={styles.btnSecondary}>
                Export
              </button>
            )}
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>
    </header>
  );
}
