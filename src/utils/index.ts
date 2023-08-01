/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/require-await */
import FileSaver from 'file-saver';
import { surpriseMePrompts } from '../constants/constants';

export function getRandomPrompt(prompt: string) {
  const randomIndex = Math.floor(Math.random() * surpriseMePrompts.length);
  const randomPrompt = surpriseMePrompts[randomIndex];

  if (randomPrompt === prompt) return getRandomPrompt(prompt);

  return randomPrompt;
}

export async function downloadImage(_id: any, photo: string | Blob) {
  FileSaver.saveAs(photo, `download-${_id}.jpg`);
}
