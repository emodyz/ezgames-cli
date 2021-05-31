export default abstract class Patch {
  abstract readonly version: string

  abstract readonly restrictions: string

  public abstract run (env: Record<string, any>): Record<string, any>
}
