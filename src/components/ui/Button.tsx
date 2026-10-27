import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import Link from "next/link";
import { cx } from "@/lib/utils";
import { Icon } from "./Icon";
import styles from "./Button.module.css";

type Common = {
  /**
   * dark (default), orange for the main call to action, outline for a low-key action, ghost for
   * a light see-through button on photos and dark backgrounds.
   */
  variant?: "dark" | "orange" | "outline" | "ghost";
  /**
   * Adds depth (sheen, shadow, lift on hover). Only for the one main action of a screen or
   * dialog, the one that completes the task; every other button stays flat.
   */
  raised?: boolean;
  small?: boolean;
  /** Adds the ↗ arrow after the label. */
  arrow?: boolean;
  className?: string;
  children: ReactNode;
};
type AsButton = Common &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type AsLink = Common &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

/** Primary call-to-action. Renders a link when `href` is given, otherwise a button. */
export function Button({
  variant = "dark",
  raised,
  small,
  arrow,
  className,
  children,
  ...rest
}: AsButton | AsLink) {
  const classes = cx(
    styles.button,
    variant === "orange" && styles.orange,
    variant === "outline" && styles.outline,
    variant === "ghost" && styles.ghost,
    raised && styles.raised,
    small && styles.small,
    className,
  );
  const content = (
    <>
      {children}
      {arrow && (
        <>
          {" "}
          <Icon name="arrow" />
        </>
      )}
    </>
  );
  if (rest.href !== undefined) {
    // next/link adds the site's base path to links between pages; outside links pass through.
    const { href, ...linkProps } = rest as AsLink;
    return (
      <Link href={href} className={classes} {...linkProps}>
        {content}
      </Link>
    );
  }
  const { type = "button", ...buttonProps } =
    rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type={type} className={classes} {...buttonProps}>
      {content}
    </button>
  );
}
