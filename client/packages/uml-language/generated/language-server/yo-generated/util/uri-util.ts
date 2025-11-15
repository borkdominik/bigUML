/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/
import * as fs from 'fs';
import * as nodePath from 'path';
import { URI, Utils as UriUtils } from 'vscode-uri';

const posixPath = nodePath.posix || nodePath;

export namespace Utils {
   /**
    * @param parent parent URI
    * @param child child URI
    * @returns true if the child URI is actually a child of the parent URI
    */
   export function isChildOf(parent: URI, child: URI): boolean {
      const relative = posixPath.relative(parent.fsPath, child.fsPath);
      return !!relative && !relative.startsWith('..') && !posixPath.isAbsolute(relative);
   }

   /**
    * Return true if all given URIs match the same folder if applied with the folderProvider function.
    * If no or only a single URI is given, true is returned.
    *
    * @param folderProvider mapping from URI to folder URI
    * @param uris URIs
    * @returns true if all folder URIs match
    */
   export function matchSameFolder(folderProvider: (uri?: URI) => URI | undefined, ...uris: URI[]): boolean {
      if (uris.length < 2) {
         return true;
      }
      const [first, ...rest] = uris;
      const folder = folderProvider(first);
      return rest.every(uri => folderProvider(uri)?.fsPath === folder?.fsPath);
   }

   /**
    * Finds a new URI based on the given URI by increasing a counter after the file name.
    * If a file with that name already exists, the counter is increased.
    *
    * @param uri base URI
    * @returns a new URI where no file exists
    */
   export function findNewUri(uri: URI): URI {
      if (!exists(uri)) {
         return uri;
      }
      let newUri = uri;
      const dirName = UriUtils.dirname(newUri);
      const baseName = UriUtils.basename(uri);
      const [base, ...extensions] = baseName.split('.');
      const extension = extensions.join('.');
      let counter = 0;
      do {
         newUri = UriUtils.joinPath(dirName, base + counter++ + '.' + extension);
      } while (exists(newUri));
      return newUri;
   }

   /**
    * Returns true if a file for the given URI exists.
    *
    * @param uri URI
    * @returns true if a file for the given URI exists, false otherwise.
    */
   export function exists(uri: URI): boolean {
      return fs.existsSync(uri.fsPath);
   }

   /**
    * Creates an absolute, canonicalized URI for the given URI.
    *
    * @param uri URI
    * @returns absolute, canonicalized URI
    */
   export function toRealURI(uri: URI): URI {
      return URI.file(fs.realpathSync(uri.fsPath));
   }

   /**
    * Return true if the given URI represents a directory.
    *
    * @param uri URI
    * @returns true if the given URI represents a directory, false otherwise.
    */
   export function isDirectory(uri: URI): boolean | undefined {
      try {
         return fs.lstatSync(uri.fsPath).isDirectory();
      } catch (error) {
         return undefined;
      }
   }

   /**
    * Return true if the given URI represents a file.
    *
    * @param uri URI
    * @returns true if the given URI represents a file, false otherwise.
    */
   export function isFile(uri: URI): boolean {
      return !isDirectory(uri);
   }

   /**
    * Flattens the given URI to an array. If the URI represents a file that URI is returned as the only element.
    * If the URI represents a directory, all files will be returned in array as well as all files in all sub-directories recursively.
    *
    * @param uri URI
    * @returns an array of all file URIs contained in the given URI.
    */
   export function flatten(uri: URI): URI[] {
      return isFile(uri) ? [uri] : fs.readdirSync(uri.fsPath).flatMap(child => flatten(UriUtils.resolvePath(uri, child)));
   }

   /**
    * Returns the textual content of the file represented by the given URI.
    *
    * @param uri file URI
    * @returns textual content
    */
   export function readFile(uri: URI): string {
      return fs.readFileSync(uri.fsPath, 'utf8');
   }
}