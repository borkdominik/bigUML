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
package com.eclipsesource.uml.glsp.gmodel;

import org.eclipse.glsp.graph.GLabel;
import org.eclipse.glsp.graph.builder.impl.GLabelBuilder;
import org.eclipse.uml2.uml.*;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.util.UmlConfig.Types;
import com.eclipsesource.uml.glsp.util.UmlLabelUtil;

public class LabelFactory extends AbstractGModelFactory<NamedElement, GLabel> {

   public LabelFactory(final UmlModelState modelState) {
      super(modelState);
   }

   @Override
   public GLabel create(final NamedElement namedElement) {
      if (namedElement instanceof Property) {
         return createPropertyLabel((Property) namedElement);
      }
      return null;
   }

   protected GLabel createPropertyLabel(final Property property) {
      String label = property.getName()
         .concat(UmlLabelUtil.getTypeName(property))
         .concat(UmlLabelUtil.getMultiplicity(property));

      return new GLabelBuilder(Types.PROPERTY)
         .id(toId(property))
         .text(label)
         .build();
   }

   protected GLabel createAttributeLabel(final Property attribute) {
      return new GLabelBuilder(Types.ATTRIBUTE)
              .id(toId(attribute))
              .text("NewAttribute" + UmlLabelUtil.getMultiplicity(attribute))
              .build();
   }

   protected GLabel createUseCaseExtensionPointsHeading(final UseCase useCase) {
      String label = "extension points";

      return new GLabelBuilder(Types.LABEL_TEXT)
              .id(toId(useCase) + "_epheading")
              .text(label)
              .addCssClass("bold")
              .build();
   }

   protected GLabel createUseCaseExtensionPointsLabel(final ExtensionPoint extensionPoint) {
      String label = extensionPoint.getName();

      return new GLabelBuilder(Types.EXTENSIONPOINT)
              .id(toId(extensionPoint))
              .text(label)
              .build();
   }

}
