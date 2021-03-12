import {request} from '@octokit/request'

export default class GitHub {
  public static requestWithAuth = request.defaults({
    headers: {
      authorization: 'token e12aa60c10ef896220582de8daf851d903f78e9c',
    },
  });
}
