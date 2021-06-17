export interface SearchResult {
  kind?: SearchResult.KindEnum;
  result: any;
}

// tslint:disable-next-line: no-namespace
export namespace SearchResult {
  export type KindEnum = 'user' | 'group' | 'post' | 'comment';
  export const KindEnum = {
    User: 'user' as KindEnum,
    Group: 'group' as KindEnum,
    Post: 'post' as KindEnum,
    Comment: 'comment' as KindEnum
  };
}
