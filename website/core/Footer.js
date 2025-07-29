/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

class Footer extends React.Component {
  docUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    const docsUrl = this.props.config.docsUrl;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    return `${baseUrl}${docsPart}${langPart}${doc}`;
  }

  pageUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return baseUrl + (language ? `${language}/` : '') + doc;
  }

  render() {
    return (
      <footer className="nav-footer" id="footer">
        <section className="sitemap">
          <a href={this.props.config.baseUrl} className="nav-home">
            {this.props.config.footerIcon && (
              <img
                src={this.props.config.baseUrl + this.props.config.footerIcon}
                alt={this.props.config.title}
                width="66"
                height="58"
              />
            )}
          </a>
          <div>
            <a href="/privacy">
              Privacy Policy
            </a>
            <a href="mailto:info@purplekingdomgames.com">
              Contact Us
            </a>
          </div>
          <div>
          </div>
          <div>
            <a href="https://github.com/PurpleKingdomGames">GitHub</a>
            <a href="https://www.youtube.com/@purplekingdomgames">Youtube</a>
            <a href="https://bsky.app/profile/davidnorth-pkg.bsky.social">Bluesky</a>
            <a href="https://mastodon.gamedev.place/@davesmith00000">Mastodon</a>
            <a href="https://purple-kingdom-games.itch.io/">Itch.io</a>
            <iframe className="sponsor-button" src="https://github.com/sponsors/PurpleKingdomGames/button" title="Sponsor PurpleKingdomGames"></iframe>
            <a href="https://purplekingdomgames.com/blog/feed.xml">RSS Feed</a>
            <a href="https://purplekingdomgames.com/blog/atom.xml">Atom Feed</a>
          </div>
        </section>
        <section className="copyright">{this.props.config.copyright}</section>
      </footer>
    );
  }
}

module.exports = Footer;
