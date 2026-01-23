import { useRequirements } from '../../hooks/useRequirements';
import type { RequirementStatus } from '../../types';
import styles from './CoverageSummary.module.css';

export function CoverageSummary() {
  const { coverageStats, statusFilter, setStatusFilter } = useRequirements();

  const handleStatusClick = (status: RequirementStatus) => {
    // Toggle filter: if already selected, clear it; otherwise set it
    setStatusFilter(statusFilter === status ? null : status);
  };

  if (coverageStats.totalRequirements === 0) {
    return (
      <div className={styles.container}>
        <span className={styles.label}>No requirements yet</span>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.progressWrapper}>
        <div className={styles.progressLabel}>
          <span className={styles.label}>Coverage</span>
          <span className={styles.percentage}>{coverageStats.coveragePercentage}%</span>
        </div>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${coverageStats.coveragePercentage}%` }}
          />
        </div>
        <div className={styles.stats}>
          <span>
            {coverageStats.requirementsWithImplementation} / {coverageStats.totalRequirements} mapped
          </span>
        </div>
      </div>

      <div className={styles.statusBreakdown}>
        <button
          onClick={() => handleStatusClick('not-started')}
          className={`${styles.statusButton} ${statusFilter === 'not-started' ? styles.active : ''}`}
        >
          <span className={`${styles.statusDot} ${styles.notStarted}`} />
          <span className={styles.statusLabel}>Not Started</span>
          <span className={styles.statusCount}>{coverageStats.byStatus['not-started']}</span>
        </button>
        <button
          onClick={() => handleStatusClick('in-progress')}
          className={`${styles.statusButton} ${statusFilter === 'in-progress' ? styles.active : ''}`}
        >
          <span className={`${styles.statusDot} ${styles.inProgress}`} />
          <span className={styles.statusLabel}>In Progress</span>
          <span className={styles.statusCount}>{coverageStats.byStatus['in-progress']}</span>
        </button>
        <button
          onClick={() => handleStatusClick('complete')}
          className={`${styles.statusButton} ${statusFilter === 'complete' ? styles.active : ''}`}
        >
          <span className={`${styles.statusDot} ${styles.complete}`} />
          <span className={styles.statusLabel}>Complete</span>
          <span className={styles.statusCount}>{coverageStats.byStatus.complete}</span>
        </button>
        <button
          onClick={() => handleStatusClick('blocked')}
          className={`${styles.statusButton} ${statusFilter === 'blocked' ? styles.active : ''}`}
        >
          <span className={`${styles.statusDot} ${styles.blocked}`} />
          <span className={styles.statusLabel}>Blocked</span>
          <span className={styles.statusCount}>{coverageStats.byStatus.blocked}</span>
        </button>
      </div>
    </div>
  );
}
