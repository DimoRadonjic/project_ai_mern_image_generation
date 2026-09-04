import FileSaver from 'file-saver';
import { surpriseMePrompts } from '../constants/constants';

export function getRandomPrompt(prompt: string) {
  const randomIndex = Math.floor(Math.random() * surpriseMePrompts.length);
  const randomPrompt = surpriseMePrompts[randomIndex];

  if (randomPrompt === prompt) return getRandomPrompt(prompt);

  return randomPrompt;
}

export function downloadImage(id: string, photo: string | Blob) {
  FileSaver.saveAs(photo, `download-${id}.jpg`);
}
