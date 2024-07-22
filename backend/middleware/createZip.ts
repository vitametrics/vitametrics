import path from 'path';
import fs from 'fs';
import { zip } from 'zip-a-folder';

async function createZipFile(files: { fileName: string, data: string}[], projectId: string, archiveName?: string) {
    const tempDir = path.join(__dirname, '..', 'tmp', projectId);
    const zipFileName = `${archiveName || 'data'}.zip`;
    const zipFilePath = path.join(tempDir, zipFileName);

    await fs.promises.mkdir(tempDir, { recursive: true });

    for (const file of files) {
        await fs.promises.writeFile(path.join(tempDir, file.fileName), file.data);
    }

    await zip(tempDir, zipFilePath);

    for (const file of files) {
        await fs.promises.unlink(path.join(tempDir, file.fileName));
    }

    return zipFilePath;
}

export default createZipFile;