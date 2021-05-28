import {request} from '@octokit/request'

export default class GitHub {
  public static requestWithAuth = request.defaults({
    headers: {
      authorization: `token ${process.env.EZG_CLI_GITHUB_TOKEN}`,
    },
  });

  public static requestAnonymously = request
}

export const gitHubApi = process.env.EZG_CLI_GITHUB_TOKEN ? GitHub.requestWithAuth : GitHub.requestAnonymously
