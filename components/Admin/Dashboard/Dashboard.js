import Link from "next/link";
import utilities from "../../../styles/utilities.module.css";
import styles from "./Dashboard.premium.module.css";

const Dashboard = ({ stats, recentActivity }) => {
  // Default values to prevent errors if props are undefined
  const safeStats = stats || { projects: 0, fypProjects: 0 };
  const safeRecentActivity = recentActivity || [];

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Dashboard</h1>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>Research Projects</h3>
          <p>{safeStats.projects}</p>
        </div>
        <div className={styles.statCard}>
          <h3>FYP Supervisions</h3>
          <p>{safeStats.fypProjects || 0}</p>
        </div>
      </div>

      <div className={styles.bottomGrid}>
        <div className={styles.recentActivity}>
          <h2>Recent Activity</h2>
          <ul>
            {safeRecentActivity.map((item) => (
              <li key={item._id}>
                <span>{item.title}</span>
                <small>{new Date(item.updatedAt).toLocaleDateString()}</small>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.quickActions}>
          <h2>Quick Actions</h2>
          <Link href="/admin/projects/new" passHref>
            <button className={styles.quickButton}>
              New Project
            </button>
          </Link>
          <Link href="/admin/fyp/new" passHref>
            <button className={styles.quickButton}>
              New FYP Record
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
