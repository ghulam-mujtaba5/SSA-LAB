import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import AcademicLottie from "../components/AcademicSite/AcademicLottie";
import styles from "./404.module.css";

export default function Custom500() {
  const { theme } = useTheme();

  return (
    <div className={styles.wrapper} data-theme={theme}>
      <Head>
        <title>Server Error — SSA Research Lab</title>
        <meta
          name="description"
          content="An unexpected error occurred. Please try again in a moment."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <motion.div
        className={styles.logoContainer}
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div style={{ width: "180px", height: "180px", margin: "0 auto 16px auto" }}>
          <AcademicLottie
            src="/lottie/cloud-devops.json"
            ariaLabel="500 Server Error Animation"
            speed={0.7}
            showControls={false}
          />
        </div>
        <Image
          src="/academic/ssa-research-group-full-logo.png"
          alt="SSA Research Lab — Software Security Assessment Lab"
          width={320}
          height={150}
          className={styles.logo}
          style={{ width: "auto", maxHeight: "120px", objectFit: "contain" }}
          priority
        />
      </motion.div>
      <motion.h1
        className={styles.title}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
      >
        500 - Something Went Wrong
      </motion.h1>
      <motion.p
        className={styles.description}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
      >
        An unexpected error occurred on the server. It&rsquo;s not you —
        <br />
        please refresh the page or try again in a few moments.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
      >
        <Link href="/" className={styles.homeLink} aria-label="Go back home">
          <span className={styles.homeBtnBg} />
          <span className={styles.homeBtnText}>Back to Safety</span>
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
