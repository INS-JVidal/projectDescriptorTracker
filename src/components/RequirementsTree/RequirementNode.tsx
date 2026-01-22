import { useRequirements } from '../../hooks/useRequirements';
import type { Requirement } from '../../types';
import { getStatusIcon } from '../../utils/treeHelpers';
import styles from './RequirementNode.module.css';

interface Props {
  requirement: Requirement;
}

export function RequirementNode({ requirement }: Props) {
  const {
    selectedRequirementId,
    selectRequirement,
    removeRequirement,
  } = useRequirements();

  const isSelected = selectedRequirementId === requirement.id;

  const handleClick = () => {
    selectRequirement(requirement.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeRequirement(requirement.id);
  };

  return (
    <div
      className={`${styles.container} ${isSelected ? styles.selected : ''}`}
      onClick={handleClick}
    >
      <span className={styles.statusIcon}>
        {getStatusIcon(requirement.status)}
      </span>
      <span className={styles.code}>{requirement.code}</span>
      <span className={styles.title}>{requirement.title}</span>
      <div className={styles.actions}>
        <button
          onClick={handleDelete}
          className={styles.actionBtn}
          title="Delete requirement"
        >
          x
        </button>
      </div>
    </div>
  );
}
