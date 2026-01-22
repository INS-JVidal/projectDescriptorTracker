import { Header } from './Header';
import { RequirementsTree } from '../RequirementsTree/RequirementsTree';
import { RequirementDetail } from '../RequirementDetail/RequirementDetail';
import { ImplementationTree } from '../ImplementationTree/ImplementationTree';
import { CoverageSummary } from '../Dashboard/CoverageSummary';
import { useProjects } from '../../hooks/useProjects';
import { useRequirements } from '../../hooks/useRequirements';
import styles from './ThreePanelLayout.module.css';

export function ThreePanelLayout() {
  const { currentProject } = useProjects();
  const { selectedRequirement } = useRequirements();

  return (
    <div className={styles.container}>
      <Header />

      <main className={styles.main}>
        {/* Left Panel - Requirements Tree */}
        <aside className={styles.leftPanel}>
          <div className={styles.panelHeader}>
            <h2>Requirements</h2>
          </div>
          <div className={styles.panelContent}>
            {currentProject ? (
              <RequirementsTree />
            ) : (
              <div className={styles.emptyState}>
                <p>Select or create a project to get started</p>
              </div>
            )}
          </div>
          {currentProject && (
            <div className={styles.panelFooter}>
              <CoverageSummary />
            </div>
          )}
        </aside>

        {/* Right Panel - Requirement Detail + Implementation */}
        <section className={styles.rightPanel}>
          {selectedRequirement ? (
            <>
              <div className={styles.detailSection}>
                <RequirementDetail />
              </div>
              <div className={styles.implementationSection}>
                <div className={styles.sectionHeader}>
                  <h3>Implementation Mapping</h3>
                </div>
                <div className={styles.sectionContent}>
                  <ImplementationTree />
                </div>
              </div>
            </>
          ) : currentProject ? (
            <div className={styles.emptyState}>
              <h3>No Requirement Selected</h3>
              <p>Select a requirement from the left panel to view its details and implementation mapping.</p>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <h3>Welcome to DesTrack</h3>
              <p>DesTrack helps you connect requirements to their code implementation.</p>
              <p>Create or select a project to begin mapping your requirements.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
