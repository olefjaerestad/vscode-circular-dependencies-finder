/**
 * Extracts the filename from a filepath.
 */
export function filename(filepath: string) {
 const slash = filepath.includes('\\') ? '\\' : '/';
 const lastSlashIndex = filepath.lastIndexOf(slash);
 
 return lastSlashIndex !== -1 
	 ? filepath.substring(lastSlashIndex + 1, filepath.length)
	 : filepath;
}
