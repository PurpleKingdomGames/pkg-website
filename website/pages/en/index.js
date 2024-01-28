/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */

class HomeSplash extends React.Component {
  render() {
    const {siteConfig} = this.props;
    const {baseUrl} = siteConfig;

    const SplashContainer = props => (
      <div className="homeContainer">
        <div className="homeSplashFade">
          <div className="wrapper homeWrapper">{props.children}</div>
        </div>
      </div>
    );

    const Logo = props => (
      <div className="projectLogo">
        <img src={props.img_src} alt={props.alt} />
      </div>
    );

    const PromoSection = props => (
      <div className="section promoSection">
        <div className="promoRow">
          <div className="pluginRowBlock">{props.children}</div>
        </div>
      </div>
    );

    return (
      <SplashContainer>
        <Logo img_src={`${baseUrl}img/pk-large.svg`} alt={`${siteConfig.title} - ${siteConfig.tagline}`} />
      </SplashContainer>
    );
  }
}

class Index extends React.Component {
  render() {
    const {config: siteConfig, language = ''} = this.props;

    const showcase = siteConfig.productCallouts.map(callout => (
        <div className="blockElement alignCenter imageAlignTop threeByGridBlock" key={callout.title}>
            <div className="blockImage">
                <img src={callout.image} />
            </div>
            <div className="blockContent">
                <h2>{callout.title}</h2>
                <MarkdownBlock>{callout.text}</MarkdownBlock>
            </div>
        </div>
    ))

    const ProductCallouts = () => (
        <div className="container paddingTop">
            <div className="wrapper">
                <div className="gridBlock">
                    {showcase}
                </div>
            </div>
        </div>
    )

    const WhoAreWe = () => (
        <div className="container paddingBottom lighterBackground">
            <div className="wrapper">
                <div className="gridBlock">
                    <div className="blockElement alignLeft imageAlignTop twoByGridBlock">
                        <h2>About us</h2>
                        <MarkdownBlock>
                            Purple Kindgom Games was set up by two long-time co-conspirators named David, both of whom ought to have known better.
                        </MarkdownBlock>
                        <MarkdownBlock>
                            Our mission is to make whatever games and gaming technology appeals to us most at any given moment, while having as much fun as possible.
                        </MarkdownBlock>
                        <MarkdownBlock>
                            As chaotic as that sounds, the result has been years of sustained and surprisingly focused work, primarily on our game engine, Indigo, and also on our web frontend framework, Tyrian.
                        </MarkdownBlock>
                    </div>
                    <div className="blockElement paddingTop alignCenter imageAlignTop twoByGridBlock">
                        <img src="img/pk-large.svg" height="300px" />
                    </div>
                </div>
            </div>
        </div>
    );

    const SponsorUs = () => (
        <div className="container paddingBottom lightBackground">
            <div className="wrapper">
                <div className="gridBlock">
                    <div className="blockElement paddingTop alignCenter imageAlignTop twoByGridBlock">
                      <img src="img/pk-small.svg" height="100px" />
                      &nbsp;&nbsp;
                      &nbsp;&nbsp;
                      &nbsp;&nbsp;
                      <img src="img/indigo_logo.svg" height="100px" />
                      &nbsp;&nbsp;
                      &nbsp;&nbsp;
                      &nbsp;&nbsp;
                      <img src="img/tyrian.svg" height="100px" />
                    </div>
                    <div className="blockElement alignLeft imageAlignTop twoByGridBlock">
                        <h2>Support our work!</h2>
                        <MarkdownBlock>
                            Like what we're doing? Consider supporting us!
                        </MarkdownBlock>
                        <MarkdownBlock>
                            We appreciate support in all it's forms, and are ever grateful to all of the wonderful people who
                            have contributed to our projects over the years, whether by raising issues, contributing code, or
                            even just by showing up and sharing screenshots of their creations!
                        </MarkdownBlock>
                        <MarkdownBlock>
                            We are particularly grateful to our [financial backers](https://github.com/sponsors/PurpleKingdomGames?o=esb)
                            who help us keep the lights on! 💜
                        </MarkdownBlock>
                        <MarkdownBlock>
                            If you'd like to sponsor our work, we prefer accepting sponsorship via
                            [Github](https://github.com/sponsors/PurpleKingdomGames?o=esb), but please reach out if you'd like to support
                            us via another means, we'd love to hear from you!
                        </MarkdownBlock>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
      <div>
        <HomeSplash siteConfig={siteConfig} language={language} />
        <div className="mainContainer">
            <ProductCallouts/>
            <WhoAreWe/>
            <SponsorUs/>
        </div>
      </div>
    );
  }
}

module.exports = Index;
