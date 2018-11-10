import { Registry, withRegistry } from '@bem-react/di';
import AppCommon from './App';

import MobileCard from './../Card/Card@mobile';
import MobileImage from './../Image/Image@mobile';

const registry = new Registry({ id: 'App' });

registry.set('Card', MobileCard);
registry.set('Image', MobileImage);

export default withRegistry(registry)(AppCommon);
