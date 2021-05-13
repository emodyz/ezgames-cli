import simpleGit, {SimpleGit, SimpleGitOptions} from 'simple-git'

export interface GitInfoBasic {
  current: string;
  isDirty: boolean;
  isTag: boolean;
}

export async function getGitInfo(cwd = process.cwd()): Promise<GitInfoBasic> {
  const options: Partial<SimpleGitOptions> = {
    baseDir: cwd,
    binary: 'git',
    maxConcurrentProcesses: 6,
  }

  const git: SimpleGit = simpleGit(options)

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

  return repoStatus
}
