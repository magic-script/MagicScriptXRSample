import React from 'react';
import { View, Text } from 'magic-script-components';
import AnchorCube from './anchor-cube.js';

import { authorize } from 'react-native-app-auth';
import { NativeModules } from 'react-native';

const { XrClientBridge } = NativeModules;

const oAuthConfig = {
  cacheKey: 'auth/prod',
  issuer: 'https://auth.magicleap.com',
  clientId: 'com.magicleap.mobile.magicscript',
  redirectUrl: 'magicscript://code-callback',
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

const getUUID = (id, pose) => `${id}#[${pose}]`;

class MyApp extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      scenes: {},
      anchorCount: 0
    };
  }

  async componentDidMount () {
    const oauth = await this.authorizeToXrServer(oAuthConfig);
    const status = await this.connectToXrServer(oauth);

    this._updateInterval = setInterval(() => this.updateAnchors(), 1000);
  }

  componentWillUnmount () {
    if (Object.keys(this.state.scenes).length > 0) {
      XrClientBridge.removeAllAnchors();
    }
  }

  async authorizeToXrServer (config) {
    console.log('MyXrDemoApp: authorizing');
    const result = await authorize(config);
    console.log('MyXrDemoApp: oAuthData', result);
    return result;
  }

  async connectToXrServer (config) {
    console.log('MyXrDemoApp: XrClientBridge.connecting');
    const result = await XrClientBridge.connect(config.accessToken);
    console.log('MyXrDemoApp: XrClientBridge.connect result', result);
    return result;
  }

  async updateAnchors () {
    const status = await XrClientBridge.getLocalizationStatus();
    console.log('MyXrDemoApp: localization status', status);

    if (status === 'localized' && this.state.anchorCount === 0) {
      const pcfList = await XrClientBridge.getAllPCFs();
      console.log(`MyXrDemoApp: received ${pcfList.length} PCFs`);

      if (pcfList.length > 0) {
        clearInterval(this._updateInterval);
      }

      var scenes = {};

      pcfList.forEach(pcfData => this.updateScenes(scenes, pcfData));

      Object.values(scenes).forEach(scene => {
        XrClientBridge.createAnchor(scene.uuid, scene.pcfPose);
      });

      this.setState({ scenes: scenes, anchorCount: pcfList.length });
    }
  }

  updateScenes (scenes, pcfData) {
    const uuid = getUUID(pcfData.anchorId, pcfData.pose);

    if (scenes[pcfData.anchorId] === undefined) {
      scenes[pcfData.anchorId] = {
        uuid: uuid,
        pcfId: pcfData.anchorId,
        pcfPose: pcfData.pose
      };
    }
  }

  render () {
    const scenes = Object.values(this.state.scenes);
    return (
      <View name='main-view'>
        { scenes.length === 0
          ? (<Text text='Initializing ...' />)
          : scenes.map( scene => <AnchorCube key={scene.uuid} uuid={scene.uuid} id={scene.pcfId} />)
        }
      </View>
    );
  }
}

export default MyApp;
