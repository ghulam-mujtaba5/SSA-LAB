import React from "react";
import { render } from "@testing-library/react";
import Breadcrumbs, { generateBreadcrumbsFromPath } from "../components/Breadcrumbs/Breadcrumbs";
import {
  personSchema,
  organizationSchema,
  clientServicesSchema,
  breadcrumbSchema,
  faqSchema,
  speakableSchema,
} from "../components/SEO";

describe("SEO & Breadcrumbs Validation", () => {
  describe("generateBreadcrumbsFromPath", () => {
    test("returns empty array for root and empty paths", () => {
      expect(generateBreadcrumbsFromPath("/")).toEqual([]);
      expect(generateBreadcrumbsFromPath("")).toEqual([]);
      expect(generateBreadcrumbsFromPath(null)).toEqual([]);
    });

    test("generates single level breadcrumbs for standard top-level routes", () => {
      const aboutCrumbs = generateBreadcrumbsFromPath("/about");
      expect(aboutCrumbs).toEqual([{ label: "About", href: null }]);

      const researchCrumbs = generateBreadcrumbsFromPath("/research");
      expect(researchCrumbs).toEqual([{ label: "Research", href: null }]);

      const teamCrumbs = generateBreadcrumbsFromPath("/team");
      expect(teamCrumbs).toEqual([{ label: "Research Team", href: null }]);
    });

    test("generates multi-level breadcrumbs for supervision project case studies", () => {
      const crumbs = generateBreadcrumbsFromPath(
        "/supervision/projects/software-vulnerability-detection-llm-model",
        "Software Vulnerability Detection using LLM Model | Case Study"
      );
      expect(crumbs).toHaveLength(3);
      expect(crumbs[0]).toEqual({ label: "Supervision", href: "/supervision" });
      expect(crumbs[1]).toEqual({ label: "Projects", href: "/supervision?tab=running" });
      expect(crumbs[2].label).toBe("Software Vulnerability Detection using LLM Model");
      expect(crumbs[2].href).toBeUndefined();
    });

    test("generates multi-level breadcrumbs for supervision opportunities", () => {
      const crumbs = generateBreadcrumbsFromPath(
        "/supervision/opportunities/llm-patch-synthesis",
        "LLM Patch Synthesis — Open Opportunity"
      );
      expect(crumbs).toHaveLength(3);
      expect(crumbs[0]).toEqual({ label: "Supervision", href: "/supervision" });
      expect(crumbs[1]).toEqual({ label: "Opportunities", href: "/supervision?tab=future" });
      expect(crumbs[2].label).toBe("LLM Patch Synthesis");
    });
  });

  describe("Breadcrumbs UI Component", () => {
    test("does not render on root path", () => {
      const { container } = render(<Breadcrumbs path="/" />);
      expect(container.firstChild).toBeNull();
    });

    test("renders Schema.org BreadcrumbList microdata on inner pages", () => {
      const { container } = render(
        <Breadcrumbs
          path="/research"
          items={[{ label: "Research", href: null }]}
        />
      );

      const nav = container.querySelector("nav[aria-label='Breadcrumb']");
      expect(nav).toBeTruthy();

      const ol = container.querySelector("ol[itemtype='https://schema.org/BreadcrumbList']");
      expect(ol).toBeTruthy();

      const listItems = container.querySelectorAll("li[itemtype='https://schema.org/ListItem']");
      expect(listItems.length).toBe(2); // Home + Research

      const positions = container.querySelectorAll("meta[itemprop='position']");
      expect(positions[0].getAttribute("content")).toBe("1");
      expect(positions[1].getAttribute("content")).toBe("2");
    });
  });

  describe("SEO Structured Data Schemas", () => {
    test("clientServicesSchema produces valid OfferCatalog for commercial & industrial clients", () => {
      const schema = clientServicesSchema();
      expect(schema["@type"]).toEqual(expect.arrayContaining(["ProfessionalService", "ResearchOrganization"]));
      expect(schema.hasOfferCatalog).toBeDefined();
      expect(schema.hasOfferCatalog["@type"]).toBe("OfferCatalog");
      expect(schema.hasOfferCatalog.itemListElement.length).toBeGreaterThanOrEqual(5);

      const offerNames = schema.hasOfferCatalog.itemListElement.map((o) => o.itemOffered.name);
      expect(offerNames.some((n) => n.includes("Static Application Security Testing"))).toBe(true);
      expect(offerNames.some((n) => n.includes("Vulnerability Detection"))).toBe(true);
      expect(offerNames.some((n) => n.includes("Code Clone"))).toBe(true);
      expect(offerNames.some((n) => n.includes("Malware"))).toBe(true);
    });

    test("breadcrumbSchema produces valid Schema.org BreadcrumbList", () => {
      const schema = breadcrumbSchema([
        { name: "Supervision", url: "https://www.ssa-lab.tech/supervision" },
        { name: "Projects", url: "https://www.ssa-lab.tech/supervision/projects/sample" },
      ]);
      expect(schema["@type"]).toBe("BreadcrumbList");
      expect(schema.itemListElement).toHaveLength(3); // Home + 2 crumbs
      expect(schema.itemListElement[0].position).toBe(1);
      expect(schema.itemListElement[0].name).toBe("Home");
      expect(schema.itemListElement[1].position).toBe(2);
      expect(schema.itemListElement[1].name).toBe("Supervision");
      expect(schema.itemListElement[2].position).toBe(3);
      expect(schema.itemListElement[2].name).toBe("Projects");
    });

    test("organizationSchema includes international contactPoint and address", () => {
      const org = organizationSchema();
      expect(org["@type"]).toBe("ResearchOrganization");
      expect(org.address).toBeDefined();
      expect(org.address.addressCountry).toBe("CN");
      expect(org.contactPoint).toBeDefined();
      expect(org.contactPoint[0].areaServed).toBe("Worldwide");
    });

    test("speakableSchema outputs valid SpeakableSpecification for AI/voice agents", () => {
      const speakable = speakableSchema({
        url: "https://www.ssa-lab.tech/research",
        cssSelectors: ["h1", "p.lead"],
      });
      expect(speakable.speakable["@type"]).toBe("SpeakableSpecification");
      expect(speakable.speakable.cssSelector).toEqual(["h1", "p.lead"]);
    });

    test("faqSchema produces valid Schema.org FAQPage with Questions and Answers", () => {
      const faq = faqSchema([
        {
          question: "Can companies hire SSA Lab for software security assessments?",
          answer: "Yes, SSA Lab conducts industrial code auditing and vulnerability assessment.",
        },
      ]);
      expect(faq["@type"]).toBe("FAQPage");
      expect(faq.mainEntity[0]["@type"]).toBe("Question");
      expect(faq.mainEntity[0].name).toBe("Can companies hire SSA Lab for software security assessments?");
      expect(faq.mainEntity[0].acceptedAnswer["@type"]).toBe("Answer");
      expect(faq.mainEntity[0].acceptedAnswer.text).toBe(
        "Yes, SSA Lab conducts industrial code auditing and vulnerability assessment."
      );
    });
  });
});
