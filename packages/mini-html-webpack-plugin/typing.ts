import type { Options as HtmlMinifierOptions } from 'html-minifier-terser'

interface HtmlTagObject {
  attributes: {
    [attributeName: string]: string | boolean | null | undefined;
  };
  tagName: string;
  innerHTML?: string;
  /**
   * 单闭合标签
   * area, base, br, col, embed, hr, img, input, link, meta, source, track, wbr
   */
  voidTag: boolean;
  meta: {
    plugin?: string,
    [metaAttributeName: string]: any;
  };
}

export declare namespace IMiniHtmlWebpackPlugin {
  interface Options {
    template?: string;
    filename?: string | ((entryName: string) => string);
    publicPath?: string | "auto";
    hash?: boolean;
    inject?:false | true | "body" | "head";
    scriptLoading?: "blocking" | "defer" | "module";
    favicon?: false | string;
    cache?: boolean;
    showErrors?: boolean;
    chunks?: "all" | string[];
    excludeChunks?: string[];
    chunksSortMode?: "auto" | "manual" | ((entryNameA: string, entryNameB: string) => number);
    meta?:false| {
          [name: string]:string| false | { [attributeName: string]: string | boolean };
        };
    title?: string;
    [option: string]: any;
  }

  type RequiredOptions = Required<Options>
  
  interface ProcessedOptions extends RequiredOptions {
    filename: string;
  }
}