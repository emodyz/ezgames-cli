import {request} from '@octokit/request'

export default class GitHub {
  public static requestWithAuth = request.defaults({
    headers: {
      authorization: process.env.EZG_CLI_GITHUB_TOKEN,
    },
  });

  public static requestAnonymously = request
}
