import { useMemo } from 'react';
import { useProjectStore } from '../store/projectStore';
import { downloadJson, generateExportFilename, readFileAsText, parseJsonSafe, validateExportData } from '../utils/exportImport';
import type { ExportData } from '../types';

export function useProjects() {
  const {
    projects,
    ui,
    addProject,
    updateProject,
    deleteProject,
    selectProject,
    exportToJson,
    importFromJson,
  } = useProjectStore();

  const currentProject = useMemo(() => {
    if (!ui.selectedProjectId) return null;
    return projects.find((p) => p.id === ui.selectedProjectId) || null;
  }, [projects, ui.selectedProjectId]);

  const sortedProjects = useMemo(() => {
    return [...projects].sort((a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }, [projects]);

  const createProject = (name: string, description: string = '') => {
    addProject(name, description);
  };

  const renameProject = (id: string, name: string) => {
    updateProject(id, { name });
  };

  const updateDescription = (id: string, description: string) => {
    updateProject(id, { description });
  };

  const removeProject = (id: string) => {
    if (window.confirm('Are you sure you want to delete this project? This will delete all categories, requirements, and implementation mappings.')) {
      deleteProject(id);
    }
  };

  const exportCurrentProject = () => {
    if (!currentProject) return;
    const json = exportToJson();
    if (json) {
      const filename = generateExportFilename(currentProject.name);
      downloadJson(json, filename);
    }
  };

  const importProject = async (file: File): Promise<boolean> => {
    try {
      const text = await readFileAsText(file);
      const data = parseJsonSafe<ExportData>(text);

      if (!data || !validateExportData(data)) {
        alert('Invalid file format. Please select a valid DesTrack export file.');
        return false;
      }

      const success = importFromJson(text);
      if (!success) {
        alert('Failed to import project. The file may be corrupted.');
        return false;
      }

      return true;
    } catch {
      alert('Failed to read file.');
      return false;
    }
  };

  return {
    projects: sortedProjects,
    currentProject,
    selectedProjectId: ui.selectedProjectId,
    createProject,
    renameProject,
    updateDescription,
    removeProject,
    selectProject,
    exportCurrentProject,
    importProject,
  };
}

export type UseProjectsReturn = ReturnType<typeof useProjects>;
