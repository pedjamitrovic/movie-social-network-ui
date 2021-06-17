import { ContentVM } from './content-vm.model';

export interface PostVM extends ContentVM {
  filePath?: string;
}
