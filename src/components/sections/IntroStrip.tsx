import { cx } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import styles from "./IntroStrip.module.css";

export function IntroStrip() {
  return (
    <div className={cx(styles.strip, "wrap")}>
      <span>Hills, backwaters &amp; beaches</span>
      <Icon name="spark" className={styles.spark} />
      <span>Room for your own rhythm</span>
      <Icon name="spark" className={styles.spark} />
      <span>A Kerala holiday shaped around you</span>
    </div>
  );
}
