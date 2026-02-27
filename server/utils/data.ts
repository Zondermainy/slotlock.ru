import { readFile } from 'fs/promises'
import { join, dirname } from 'path'

export const getDataPath = (filename: string) => {
  const isProduction = process.env.NODE_ENV === 'production'
  if (isProduction) {
    return join(process.cwd(), 'server', 'data', filename)
  }
  return join(process.cwd(), 'server', 'data', filename)
}

export const readDataFile = async (filename: string) => {
  const filePath = getDataPath(filename)
  const data = await readFile(filePath, 'utf-8')
  return JSON.parse(data)
}
