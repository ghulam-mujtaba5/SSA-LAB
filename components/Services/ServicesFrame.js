import React, { useRef, useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useScrollTrigger } from "../../hooks/useScrollAnimation";
import HoverLottie from "../Skills/HoverLottie";
import commonStyles from "./ServicesFrameCommon.module.css";
import lightStyles from "./ServicesFrame.module.css";
import darkStyles from "./ServicesFrameDark.module.css";

const ServicesFrame = () => {
  const { theme } = useTheme();
  const frameStyles = theme === "dark" ? darkStyles : lightStyles;
  const [visible, setVisible] = useState([]);
  const [activeCard, setActiveCard] = useState(null);
  const { ref: sectionRef, hasEntered: sectionEntered } = useScrollTrigger({ threshold: 0.1 });

  const skillCardRefs = useRef([]);

  const skillsData = [
    {
      id: "uiux",
      title: "UI & UX Designing",
      titleicon: "/ui-ux-design-service-icon.svg",
      illustration: "/ai-chatgpt/laptop-code-v1.webp",
      lottie: "/lottie/web-coding.json",
      skills: [
        {
          name: "Desktop Application",
          icon: "/desktop-application-icon-on-light.svg",
          darkIcon: "/desktop-application-icon-on-dark.svg",
        },
        { name: "Web Application", icon: "/web-application-icon.svg" },
        {
          name: "Mobile App",
          icon: "/mobile-application-icon-on-light.svg",
          darkIcon: "/mobile-application-icon-on-dark.svg",
        },
      ],
      cardClass: frameStyles.uiuxCard,
    },
    {
      id: "development",
      title: "Development",
      titleicon: "/software-development-service-icon.svg",
      illustration: "/ai-chatgpt/server-stack.webp",
      lottie: "/lottie/mobile-app.json",
      skills: [
        {
          name: "Desktop Application",
          icon: "/desktop-application-icon-on-light.svg",
          darkIcon: "/desktop-application-icon-on-dark.svg",
        },
        { name: "Web Application", icon: "/web-application-icon.svg" },
        {
          name: "Mobile App",
          icon: "/mobile-application-icon-on-light.svg",
          darkIcon: "/mobile-application-icon-on-dark.svg",
        },
      ],
      cardClass: frameStyles.developmentCard,
    },
    {
      id: "datascience",
      title: "Data Science & AI",
      titleicon: "/data-science-ai-service-icon.svg",
      illustration: "/ai-chatgpt/ai-brain-v1.webp",
      lottie: "/lottie/ai-brain.json",
      skills: [
        { name: "Data Scraping", icon: "/data-scraping-service-icon.svg" },
        { name: "Data Visualization", icon: "/data-visualization-service-icon.svg" },
        { name: "Big Data Analytics", icon: "/big-data-analytics-service-icon.svg" },
        { name: "AI Solution Development", icon: "/ai-solution-development-service-icon.svg" },
      ],
      cardClass: frameStyles.dataScienceCard,
    },
    {
      id: "security",
      title: "Cyber Security & Audits",
      titleicon: "/academic/illustrations/malware-vulnerability-defense.webp",
      illustration: "/academic/illustrations/security-inspection-overview.webp",
      lottie: "/academic/lottie/security-research.json",
      skills: [
        { name: "Vulnerability Audit", icon: "/academic/illustrations/repo-analyzed.webp" },
        { name: "Code Clone Analysis", icon: "/academic/illustrations/code-cloning.webp" },
        { name: "Automated Software Testing", icon: "/academic/illustrations/android-app-security.webp" },
      ],
      cardClass: frameStyles.dataScienceCard,
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const cardsVisible = skillCardRefs.current.map((ref) => {
        if (ref) {
          const { top, bottom } = ref.getBoundingClientRect();
          return bottom >= 0 && top <= window.innerHeight;
        }
        return false;
      });
      setVisible(cardsVisible);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`${commonStyles.skillFrame} ${frameStyles.skillFrame}`}
      aria-labelledby="Soft Built Services"
      style={{
        animation: sectionEntered ? 'fadeInUp 0.6s ease-out' : 'none',
        opacity: sectionEntered ? 1 : 0.7,
      }}
    >
      <h2
        id="Soft Built Services"
        className={`${commonStyles.skillsTitle} ${frameStyles.skillsTitle}`}
      >
        Our Services
      </h2>
      {skillsData.map((category, index) => (
        <article
          className={`${commonStyles.skillCard} ${frameStyles.skillCard} ${category.cardClass} ${visible[index] ? commonStyles.animateIn : ""}`}
          key={category.id || index}
          ref={(el) => (skillCardRefs.current[index] = el)}
          aria-labelledby={`${category.title.replace(/ /g, "-")}-title`}
          style={{
            animation: sectionEntered ? `fadeInUp 0.6s ease-out ${index * 100}ms both` : 'none',
            transition: 'all var(--duration-normal) var(--ease-out)',
            willChange: 'transform, opacity',
          }}
          onMouseEnter={(e) => {
            setActiveCard(category.id);
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
          }}
          onMouseLeave={(e) => {
            setActiveCard(null);
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <header className={`${commonStyles.header} ${frameStyles.header}`}>
            <img
              className={`${commonStyles.categoryIcon} ${frameStyles.categoryIcon}`}
              alt={`${category.title} icon`}
              src={category.titleicon}
            />
            <h3
              id={`${category.title.replace(/ /g, "-")}-title`}
              className={`${commonStyles.title} ${frameStyles.title}`}
            >
              {category.title}
            </h3>
          </header>

          {category.illustration && (
            <div className={commonStyles.cornerCardIllustrationBottomLeft}>
              {category.lottie ? (
                <div style={{ width: "90px", height: "90px", position: "relative" }}>
                  <HoverLottie
                    src={category.lottie}
                    active={activeCard === category.id}
                    className="serviceLottieAnim"
                  />
                </div>
              ) : (
                <img
                  src={category.illustration}
                  alt={`${category.title} Illustration`}
                  loading="lazy"
                />
              )}
            </div>
          )}

          {category.skills.map((skill, skillIndex) => (
            <div
              key={skillIndex}
              className={`${commonStyles.skillRow} ${frameStyles.skillRow}`}
              style={{
                animation: sectionEntered ? `fadeInUp 0.6s ease-out ${(index * 100) + (skillIndex * 30)}ms both` : 'none',
              }}
            >
              <img
                className={`${commonStyles.icon} ${frameStyles.icon}`}
                alt={`${skill.name} icon`}
                src={
                  theme === "dark" && skill.darkIcon
                    ? skill.darkIcon
                    : skill.icon
                }
              />
              <div
                className={`${commonStyles.skillNameContainer} ${frameStyles.skillNameContainer}`}
              >
                <div
                  className={`${commonStyles.skillName} ${frameStyles.skillName}`}
                >
                  {skill.name}
                </div>
              </div>
            </div>
          ))}
        </article>
      ))}
    </section>
  );
};

export default ServicesFrame;
