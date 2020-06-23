/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

const siteConfig = {
  title: 'Purple Kingdom Games', // Title for your website.
  tagline: 'Building tools for games developers',
  url: 'https://purplekingdomgames.com/', // Your website URL
  baseUrl: '/', // Base URL for your project */
  cleanUrl: true,
  // For github.io type URLs, you would set the url and baseUrl like:
  //   url: 'https://facebook.github.io',
  //   baseUrl: '/test-site/',

  // Used for publishing and more
  projectName: 'purple-kingdom-games-site',
  organizationName: 'PurpleKingdomGames',
  // For top-level user or org sites, the organization is still the same.
  // e.g., for the https://JoelMarcey.github.io site, it would be set like...
  //   organizationName: 'JoelMarcey'

  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [],


  /* path to images for header/footer */
  headerIcon: 'img/pk-small.svg',
  footerIcon: 'img/pk-small.svg',
  favicon: 'img/pk-small.svg',

  /* Colors for website */
  colors: {
    primaryColor: '#14002a',
    secondaryColor: '#190033',
  },

  /* Custom fonts for website */

  fonts: {
    myFont: [
      "Maven-Pro",
      "Helvetica",
      "sans-serif"
    ],
    myOtherFont: [
      "sans-serif",
      "-apple-system",
      "system-ui"
    ]
  },

  productCallouts: [
    {
        image: "/img/indigo_logo_solid_text.svg",
        title: "Indigo",
        text: "Our flagship game engine [Indigo](https://indigoengine.io) lets functional developers create stunning pixel games in Scala that compile to Javascript!"
    },
    {
        image: "/img/input_mapper_unity.png",
        title: "Unity Input Mapper",
        text: "Our [Input Mapper for Unity](https://github.com/PurpleKingdomGames/UnityInputManager) puts game developers back in the driving seat when defining how controls are mapped."
    },
    {
        image: "/img/algae.png",
        title: "Algae",
        text: "[Algae](https://store.steampowered.com/app/900390/Algae/) is a cute 2D puzzle platformer that sees you take control of a sentient Algae in your bid to escape the beaker your were created in!"
    },
    {
        image: "/img/penguin_fling.png",
        title: "Penguin Fling!",
        text: "[Penguin Fling!](https://play.google.com/store/apps/details?id=com.pks.penguinfling&hl=en_US) is a quick game mobile kid-friendly game of fling the penguin, and our only game so far to [spawn a sequel](https://play.google.com/store/apps/details?id=com.purplekingdomgames.penguinfling2&hl=en_US)."
    }
  ],

  // This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
  copyright: `Copyright © ${new Date().getFullYear()} Purple Kingdom Games Ltd.`,

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks.
    theme: 'default',
  },

  // Add custom scripts here that would be placed in <script> tags.
  scripts: [
      'https://buttons.github.io/buttons.js',
      '/js/main.js'
    ],

  // On page navigation for the current documentation page.
  onPageNav: 'separate',
  // No .html extensions for paths.
  cleanUrl: true,

  // Open Graph and Twitter card images.
  ogImage: 'img/undraw_online.svg',
  twitter: true,
  twitterUsername: "purple_herald",
  twitterImage: 'img/undraw_tweetstorm.svg',
  gaTrackingId: 'UA-123348618-2',
  // For sites with a sizable amount of content, set collapsible to true.
  // Expand/collapse the links and subcategories under categories.
  // docsSideNavCollapsible: true,

  // Show documentation's last contributor's name.
  // enableUpdateBy: true,

  // Show documentation's last update time.
  // enableUpdateTime: true,

  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  //   repoUrl: 'https://github.com/facebook/test-site',
};

module.exports = siteConfig;
