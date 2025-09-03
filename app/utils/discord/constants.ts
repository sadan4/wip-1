import type { DiscordReleaseChannel } from "./types"

export const CHANNEL_ORIGINS: Record<DiscordReleaseChannel, string> = {
    'stable': 'https://discord.com',
    'canary': 'https://canary.discord.com',
    'ptb': 'https://ptb.discord.com',
}

export const ASSETS_BASE = 'https://static-edge.discord.com/assets'
