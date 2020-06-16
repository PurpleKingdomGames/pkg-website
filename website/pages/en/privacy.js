/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

function Help(props) {
  const {config: siteConfig, language = ''} = props;
  const {baseUrl, docsUrl} = siteConfig;
  const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
  const langPart = `${language ? `${language}/` : ''}`;
  const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

  return (
    <div className="docMainWrapper wrapper">
      <Container className="mainContainer documentContainer postContainer">
        <div className="post">
          <header className="postHeader">
            <h1>Privacy</h1>
          </header>
          <p>
            Here at Purple Kingdom Games we strive to ensure that we never collect any more information than is absolutely necessary. That said, we do sometime need to collect information to help us provide services to you, and to inform us of how popular sites or games are. We don't like long and overly complicated privacy policies, so here is the breakdown of what is collected and why.
          </p>
          <h2>What we collect when you visit our sites</h2>
          <p>
            We use <a href="https://www.google.com/analytics">Google Analytics</a> to track visitors to our site. When we do this we ensure that we annonymise all personal information (including your IP Address) so that you personally cannot be identified. We use this information to guage how popular our sites are, and roughly where people are visiting from. That way we can then provide more resource or translations as required.
          </p>
          <p>
            If you want to opt-out of Google Analytics, you can either go to <a href="http://www.google.com/policies/privacy/partners/">Google's Privacy Page</a> or install <a href="https://tools.google.com/dlpage/gaoptout">Google's Opt-Out Browser Extension</a>.
          </p>
          <h2>What we collect when you play our games</h2>
          <p>
            We use Unity to create a majority of our games, but don't run Unity Analytics. This is because we don't yet feel the need to collect information on how many player sessions are active, or any other analytical information at this time. If we do, we'll list here exactly what we take and what we use it for. Unity may collect additional information without Analytics installed, and more information on that can be found on <a href="https://unity3d.com/legal/privacy-policy">Unity's Privacy Page</a>.
          </p>
          <p>
            Additionally if you've played one of our free mobile games, then you may have been shown adverts. These adverts are powered by <a href="https://unity3d.com/unity/features/ads">Unity Ads</a> and personalisation can be opted out of from within the Advert. More information on what is collected from adverts can be found on <a href="https://unity3d.com/legal/privacy-policy">Unity's Privacy Page</a>.
          </p>
        </div>
      </Container>
    </div>
  );
}

module.exports = Help;
