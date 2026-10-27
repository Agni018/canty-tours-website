"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useJourneys } from "@/components/JourneyProvider";
import { Brand } from "@/components/ui/Brand";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cx } from "@/lib/utils";
import styles from "./Header.module.css";

/**
 * Header fixed to the top of every page. See-through over the photo at the top of the page,
 * then solid once the page scrolls. The menu collapses below 800px. Links point at the home
 * page sections, so they work from journey pages too.
 */
export function Header() {
  const { showRegion } = useJourneys();
  const [menuOpen, setMenuOpen] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const update = () => setSolid(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header className={cx(styles.bar, solid && styles.solid)}>
      <div className={cx(styles.header, "wrap")}>
        <Brand logo href="/" aria-label="Canty Tours home" />
        <button
          type="button"
          id="menu-toggle"
          className={styles.menuToggle}
          aria-label="Menu"
          aria-expanded={menuOpen}
          aria-controls="navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className={styles.menuLabel}>Menu</span> <Icon name="menu" />
        </button>
        <nav
          id="navigation"
          aria-label="Main navigation"
          className={menuOpen ? styles.open : undefined}
          onClick={(e) => {
            if ((e.target as Element).closest("a")) setMenuOpen(false);
          }}
        >
          <Link href="/#destinations">Discover Kerala</Link>
          <Link href="/#journeys" onClick={() => showRegion("Kerala")}>
            Kerala journeys
          </Link>
          <Link href="/#beyond-kerala">Beyond Kerala</Link>
          <Link href="/#faq">Good to know</Link>
        </nav>
        <Button
          href="/#plan"
          variant={solid ? "orange" : "ghost"}
          small
          arrow
          className={styles.navCta}
        >
          Plan my trip
        </Button>
      </div>
    </header>
  );
}
