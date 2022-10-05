/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.object_diagram.gmodel;

public class ObjectDiagramLabelFactory { /*-

   public ObjectDiagramLabelFactory(final UmlModelState modelState) {
      super(modelState);
   }

   @Override
   public GLabel create(final NamedElement namedElement) {
      if (namedElement instanceof Property) {
         return createPropertyLabel((Property) namedElement);
      }
      return null;
   }

   public GLabel createPropertyLabel(final Property property) {
      String label = property.getName()
         .concat(PropertyUtil.getTypeName(property))
         .concat(PropertyUtil.getMultiplicity(property));

      return new GLabelBuilder(ObjectTypes.PROPERTY)
         .id(toId(property))
         .text(label)
         .build();
   }
   */
}
