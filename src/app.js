import React from 'react';
import { Prism, Scene, Text } from 'magic-script-components';
import AnchorCube from './anchor-cube.js';

import { XrClientProvider } from 'magic-script-components';

const xrClient = XrClientProvider.getXrClient();

const oAuthConfig = {
  issuer: 'https://auth.magicleap.com',
  clientId: undefined,    // Generate from https://developer.magicleap.com --> Publish tab --> Clients tab
  redirectUrl: undefined, // Generated along with client ID
  scopes: [
    'openid',
    'profile',
    'email'
  ],
  serviceConfiguration: {
    authorizationEndpoint: 'https://oauth.magicleap.com/auth',
    tokenEndpoint: 'https://oauth.magicleap.com/token'
  }
};

export default class MyApp extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      pcfs: []
    };
  }

  async componentDidMount () {
    let accessToken;
    if (typeof XrClientProvider.authorize === 'function') {
      const oAuthResult = await XrClientProvider.authorize(oAuthConfig);
      accessToken = oAuthResult.accessToken;
    }

    const status = await xrClient.connect(accessToken);
    console.log(`xrClient.connect: ${status}`);

    this._updateInterval = setInterval(() => this.updateAnchors(), 1000);
  }

  componentWillUnmount () {
    if (this.state.pcfs.length > 0) {
      xrClient.removeAllAnchors();
    }
    clearInterval(this._updateInterval);
  }

  async updateAnchors () {
    const status = await xrClient.getLocalizationStatus();
    console.log(`localization status: ${status}`);

    if (status === 'localized' && this.state.pcfs.length === 0) {
      const pcfs = await xrClient.getAllPCFs();
      console.log(`received ${pcfs.length} PCFs`);

      if (pcfs.length > 0) {
        clearInterval(this._updateInterval);
      }

      pcfs.forEach(pcf => xrClient.createAnchor(pcf.anchorId, pcf.pose));

      this.setState({ pcfs });
    }
  }

  render () {
    const pcfs = this.state.pcfs;
    return (
      <Scene>
        { pcfs.length === 0
          ? (
            <Prism
              debug={true}
              size={[0.5, 0.5, 0.1]}
              positionRelativeToCamera={true}
              orientRelativeToCamera={true}
              position={[0, 0, -1]}
              orientation={[0, 0, 0, 1]}
            >
              <Text text='Initializing ...' />
            </Prism>
          )
          : pcfs.map(pcf => (
            <Prism
              debug={true}
              size={[0.5, 0.5, 0.5]}
              key={pcf.anchorId}
              anchorUuid={pcf.anchorId}
            >
              <AnchorCube id={pcf.anchorId} />
            </Prism>
          ))
        }
      </Scene>
    );
  }
}
