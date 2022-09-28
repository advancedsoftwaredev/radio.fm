import '@testing-library/jest-dom';
import 'jest-localstorage-mock';

import { testClient } from '../../server/src/apiInterface/tests';
import { initializeDatabaseTesting } from '../../server/src/utils/databaseTest';

testClient;
initializeDatabaseTesting();
