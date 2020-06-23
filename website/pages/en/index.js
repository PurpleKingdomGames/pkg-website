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
        <div className="container paddingBottom lightBackground">
            <div className="wrapper">
                <div className="gridBlock">
                    <div className="blockElement alignLeft imageAlignTop twoByGridBlock">
                        <h2>Who Are We?</h2>
                        <MarkdownBlock>
                            Having met many moons ago while making websites and Flash games for clients,
                            we subsequently went our separate ways and got real jobs.
                        </MarkdownBlock>
                        <MarkdownBlock>
                            Now with over 20 years of making software between us, we've come together again
                            to do what we're best at... making tools to help developers make
                            games (and making a few games ourselves)!
                        </MarkdownBlock>
                    </div>
                    <div className="blockElement paddingTop alignLeft imageAlignTop twoByGridBlock">
                        <MarkdownBlock>
                            If you like what we do and want to help us in our endevours, you can! We're on the
                            [Github Sponsors](https://github.com/sponsors/PurpleKingdomGames) program, which means
                            that from as little as $1 a month you can help us to keep delivering great software.
                        </MarkdownBlock>
                        <MarkdownBlock>
                            Every sponsorship means a great deal to us, and we'd love to have you along as we help
                            make the game development more fun.
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
        </div>
      </div>
    );
  }
}

module.exports = Index;
