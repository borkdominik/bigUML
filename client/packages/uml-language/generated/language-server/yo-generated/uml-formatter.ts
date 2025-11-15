/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/
import { AbstractFormatter, AstNode, Formatting } from 'langium';

const ROOT_KEYWORDS = ['entity', 'relationship', 'diagram'];
const OTHER_KEYWORDS = [
   'description',
   'attributes',
   'source',
   'target',
   'type',
   'properties',
   ':=',
   'node',
   'edge',
   'for',
   'x',
   'y',
   'width',
   'height',
   'source',
   'target'
];

export class UmlModelFormatter extends AbstractFormatter {
   protected format(node: AstNode): void {
      const formatter = this.getNodeFormatter(node);
      formatter.keywords(...ROOT_KEYWORDS).prepend(Formatting.noSpace({ allowLess: false, allowMore: false, priority: 1 }));
      formatter.keywords(...OTHER_KEYWORDS).surround(Formatting.oneSpace({ allowLess: false, allowMore: false, priority: 1 }));
      formatter
         .interior(formatter.keyword('{'), formatter.keyword('}'))
         .prepend(Formatting.indent({ allowLess: false, allowMore: false, priority: 1 }));
      formatter
         .keywords(';')
         .prepend(Formatting.noSpace({ allowLess: false, allowMore: false, priority: 1 }))
         .append(Formatting.newLine());
   }
}