/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

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

    const ToolsCallout = () => (
        <div className="container">
            <div className="wrapper" style={{ textAlign: 'left' }}>
                <div className="gridBlock">
                    <div className="blockElement alignLeft imageAlignSide imageAlignRight twoByGridBlock">
                        <div class="blockContent">
                            <h2>Tools</h2>
                            <MarkdownBlock>
                                We're dedicated to creating tools for programmers to make amazing games! Our flagship game engine [Indigo](https://indigoengine.io) lets functional developers create stunning pixel games in Scala that compile to Javascript.
                            </MarkdownBlock>
                            <MarkdownBlock>
                                Our [Unity Input Mapper](https://github.com/PurpleKingdomGames/UnityInputManager) puts game developers back in the driving seat when defining how controls are mapped.
                            </MarkdownBlock>
                        </div>
                        <div class="blockImage"><img src="/img/indigo_logo.svg" /></div>
                    </div>
                </div>
            </div>
        </div>
    );

    const GamesCallout = () => (
        <div className="container lightBackground">
            <div className="wrapper">
                <div className="gridBlock">
                    <div className="blockElement alignRight imageAlignSide imageAlignLeft twoByGridBlock">
                        <div class="blockImage algae-cover">
                            <img src="/img/algae.png" />
                        </div>
                        <div class="blockContent">
                            <h2>Games</h2>
                            <MarkdownBlock>
                                Prior to creating our own game engine, we used Unity to create a host of games to scrtach that game development itch!
                            </MarkdownBlock>
                            <MarkdownBlock>
                                [Algae](https://store.steampowered.com/app/900390/Algae/) was our biggest project as we dabbled in Steam and native games. It's a cute 2D puzzle platformer that sees you take control of a sentient Algae in your bid to escape the beaker your were created in.
                            </MarkdownBlock>
                            <MarkdownBlock>
                                [Penguin Fling!](https://play.google.com/store/apps/details?id=com.pks.penguinfling&hl=en_US) was a side project to see what we could do in Unity with little time and limited resources. What was created was a quick game mobile game, and our only game so far to [spawn a sequel](https://play.google.com/store/apps/details?id=com.purplekingdomgames.penguinfling2&hl=en_US).
                            </MarkdownBlock>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
      <div>
        <HomeSplash siteConfig={siteConfig} language={language} />
        <div className="mainContainer">
          <ToolsCallout />
          <GamesCallout />
        </div>
      </div>
    );
  }
}

module.exports = Index;
