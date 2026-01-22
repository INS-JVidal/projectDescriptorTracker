import { useRequirements } from '../../hooks/useRequirements';
import styles from './CoverageSummary.module.css';

export function CoverageSummary() {
  const { coverageStats } = useRequirements();

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
        <div className={styles.statusItem}>
          <span className={`${styles.statusDot} ${styles.notStarted}`} />
          <span className={styles.statusCount}>{coverageStats.byStatus['not-started']}</span>
        </div>
        <div className={styles.statusItem}>
          <span className={`${styles.statusDot} ${styles.inProgress}`} />
          <span className={styles.statusCount}>{coverageStats.byStatus['in-progress']}</span>
        </div>
        <div className={styles.statusItem}>
          <span className={`${styles.statusDot} ${styles.complete}`} />
          <span className={styles.statusCount}>{coverageStats.byStatus.complete}</span>
        </div>
        <div className={styles.statusItem}>
          <span className={`${styles.statusDot} ${styles.blocked}`} />
          <span className={styles.statusCount}>{coverageStats.byStatus.blocked}</span>
        </div>
      </div>
    </div>
  );
}
