const path = require('node:path');
import { findUp } from 'find-up';
export async function getPackageDirectory({ cwd } = {}) {
    const filePath = await findUp('package.json', { cwd });
    return filePath && path.dirname(filePath);
}
export async function getTemplatesDirectory({ cwd } = {}) {
    const filePath = await findUp('pastries', { cwd });
    return filePath && path.dirname(filePath) + '/pastries';
}
