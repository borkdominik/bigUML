grammar Uml

import 'terminals'

entry Model :   '{'    (   '"elements"' ':' '[' ( (  elements += Element  ) (  ','   elements += Element  )* ) ']' )   '}' ;
Element :   '{'  '""__"type"' ':' '"Element"'   ( ','  '"__id"' ':' '"' __id = LANGIUM_ID '"' ) ( ','  '"name"' ':' '"' name = LANGIUM_ID '"' )   '}' ;
