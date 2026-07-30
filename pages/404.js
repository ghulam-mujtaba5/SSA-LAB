import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import styles from "./404.module.css";

export default function Custom404() {
  const { theme } = useTheme();

  return (
    <div className={styles.wrapper} data-theme={theme}>
      <Head>
        <title>Page Not Found — SCSA Research Lab</title>
        <meta
          name="description"
          content="This page does not exist. Explore Dr. Junaid Akram's research, publications, supervision, or contact information."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <motion.div
        className={styles.logoContainer}
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Image
          src="/academic/scsa-research-group-full-logo.png"
          alt="SCSA Research Lab — Software Security Assessment Lab"
          width={220}
          height={200}
          className={styles.logo}
          priority
        />
      </motion.div>
      <motion.h1
        className={styles.title}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
      >
        404 - Page Not Found
      </motion.h1>
      <motion.p
        className={styles.description}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
      >
        The page you are looking for does not exist or has been moved.
        <br />
        Return to the academic profile or explore the lab&apos;s work.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
      >
        <Link href="/" className={styles.homeLink} aria-label="Go back home">
          <span className={styles.homeBtnBg} />
          <span className={styles.homeBtnText}>Go Back Home</span>
        </Link>
      </motion.div>
      <motion.nav
        className={styles.quickLinks}
        aria-label="Popular destinations"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <Link href="/research" className={styles.quickLink}>
          View Research
        </Link>
        <Link href="/publications" className={styles.quickLink}>
          Publications
        </Link>
        <Link href="/contact" className={styles.quickLink}>
          Contact
        </Link>
      </motion.nav>
    </div>
  );
}
