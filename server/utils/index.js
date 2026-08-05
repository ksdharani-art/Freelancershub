export const now = () => new Date()

export const safeFileName = (name) => name.replace(/[^a-z0-9.\-]/gi, '_')
