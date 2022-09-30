import '@testing-library/jest-dom';
import 'jest-localstorage-mock';

import { initializeDatabaseTesting } from '../../server/src/utils/databaseTest';

initializeDatabaseTesting();
