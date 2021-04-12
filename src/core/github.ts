import {request} from '@octokit/request'

export default class GitHub {
  public static requestWithAuth = request.defaults({
    headers: {
      authorization: 'token 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',
    },
  });
}
