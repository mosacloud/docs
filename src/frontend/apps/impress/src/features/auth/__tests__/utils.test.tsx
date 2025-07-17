import { Crisp } from 'crisp-sdk-web';
import fetchMock from 'fetch-mock';

import { gotoLogout } from '../utils';

jest.mock('crisp-sdk-web', () => ({
  ...jest.requireActual('crisp-sdk-web'),
  Crisp: {
    isCrispInjected: jest.fn().mockReturnValue(true),
    setTokenId: jest.fn(),
    user: {
      setEmail: jest.fn(),
    },
    session: {
      reset: jest.fn(),
    },
  },
}));

describe('utils', () => {
  afterEach(() => {
    jest.clearAllMocks();
    fetchMock.restore();
  });

  it('checks support session is terminated when logout', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    window.$crisp = true;
    const propertyDescriptors = Object.getOwnPropertyDescriptors(window);
    for (const key in propertyDescriptors) {
      propertyDescriptors[key].configurable = true;
    }
    const clonedWindow = Object.defineProperties({}, propertyDescriptors);

    Object.defineProperty(clonedWindow, 'location', {
      value: {
        ...window.location,
        replace: jest.fn(),
      },
      writable: true,
      configurable: true,
    });

    gotoLogout();

    expect(Crisp.session.reset).toHaveBeenCalled();
  });
});
