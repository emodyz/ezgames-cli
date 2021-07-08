import simpleGit, {SimpleGit, SimpleGitOptions} from 'simple-git'
import {EZG_APP_PATH} from './paths'

export interface GitInfoBasic {
  current: string;
  isDirty: boolean;
  isTag: boolean;
}

// TODO Make this a singleton
export function getGitInstance(cwd = EZG_APP_PATH): SimpleGit {
  const options: Partial<SimpleGitOptions> = {
    baseDir: cwd,
    binary: 'git',
    maxConcurrentProcesses: 6,
  }

  return simpleGit(options)
}

export async function getGitInfo(cwd = EZG_APP_PATH): Promise<GitInfoBasic> {
  const git: SimpleGit = getGitInstance(cwd)

  await git.fetch()
  await git.fetch(['origin', '--tags', '--force'])

  const repoStatus = {
    current: '',
    isDirty: Boolean(await git.diff(['HEAD'])),
    isTag: true,
  }

  repoStatus.current = await git.tag(['--points-at', 'HEAD'])
  if (!repoStatus.current) {
    const {current} = await git.branch()
    repoStatus.current = current
    repoStatus.isTag = false
  }
  repoStatus.current = repoStatus.current.replace(/(\r\n|\n|\r)/gm, '')

  /**
   * ⚠️ TODO: Remove this before publishing
   */
  // repoStatus.current = 'v0.0.1'
  // repoStatus.isTag = true
  return repoStatus
}
