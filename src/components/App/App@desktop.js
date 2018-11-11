import { Registry, withRegistry } from '@bem-react/di';
import AppCommon from './App';

import DesktopCard from './../Card/Card@desktop';
import DesktopImage from './../Image/Image@desktop';

const registry = new Registry({ id: 'App' });

registry.set('Card', DesktopCard);
registry.set('Image', DesktopImage);

export default withRegistry(registry)(AppCommon);
