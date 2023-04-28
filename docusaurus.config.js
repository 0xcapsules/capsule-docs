// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Capsules",
  tagline: "Metadata, ownership, and market standard for assets on Sui",
  url: "https://www.capsulecraft.dev",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/logo.svg",
  organizationName: "CapsuleCraft",
  projectName: "Capsules Docs",
  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: "/",
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://github.com/capsule-craft/capsule-docs/tree/master",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
        blog: false,
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "Capsules",
        logo: {
          alt: "Capsules",
          src: "img/logo.svg",
        },
        items: [
          {
            label: "GitHub",
            position: "right",
            href: "https://github.com/capsule-craft",
          },
        ],
      },
      colorMode: {
        defaultMode: "dark",
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Community",
            items: [
              {
                label: "Discord",
                href: "https://discord.gg/uUtGfNJy",
              },
              {
                label: "Twitter",
                href: "https://twitter.com/CapsuleCrafter",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "GitHub",
                href: "https://github.com/capsule-craft",
              },
            ],
          },
        ],
        copyright: `Copyright &copy; ${new Date().getFullYear()} CapsuleCraft`,
      },

      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        defaultLanguage: "rust",
        additionalLanguages: ["rust"],
      },
    }),
};

module.exports = config;
