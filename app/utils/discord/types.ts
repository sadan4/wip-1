export type DiscordReleaseChannel = 'stable' | 'canary' | 'ptb'

export interface Build {
    id: string
    envVars: Record<string, string>
    entryScripts: string[]
    webpack?: {
        entryChunk: string
        chunks: Record<string, string>
    }
    chunks: Record<string, string[]>
}

export interface Chunk {
    modules: string[]
}
