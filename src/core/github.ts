import {request} from '@octokit/request'

export default class GitHub {
  public static requestWithAuth = request.defaults({
    headers: {
      authorization: 'token 22899cef2b1e2fd31b299b354d107f0fa7383b94',
    },
  });
}
