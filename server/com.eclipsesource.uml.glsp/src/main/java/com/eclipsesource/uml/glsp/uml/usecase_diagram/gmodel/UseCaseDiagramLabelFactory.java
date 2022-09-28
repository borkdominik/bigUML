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
package com.eclipsesource.uml.glsp.uml.usecase_diagram.gmodel;

import org.eclipse.glsp.graph.GLabel;
import org.eclipse.glsp.graph.builder.impl.GLabelBuilder;
import org.eclipse.uml2.uml.ExtensionPoint;
import org.eclipse.uml2.uml.NamedElement;
import org.eclipse.uml2.uml.UseCase;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.uml.usecase_diagram.constants.UseCaseTypes;
import com.eclipsesource.uml.glsp.utils.UmlConfig;

public class UseCaseDiagramLabelFactory extends UseCaseAbstractGModelFactory<NamedElement, GLabel> {

   public UseCaseDiagramLabelFactory(final UmlModelState modelState) {
      super(modelState);
   }

   @Override
   public GLabel create(final NamedElement namedElement) {

      return null;
   }

   public GLabel createUseCaseExtensionPointsHeading(final UseCase useCase) {
      String label = "extension points";

      return new GLabelBuilder(UmlConfig.Types.LABEL_TEXT)
         .id(toId(useCase) + "_epheading")
         .text(label)
         .addCssClass("bold")
         .build();
   }

   public GLabel createUseCaseExtensionPointsLabel(final ExtensionPoint extensionPoint) {
      String label = extensionPoint.getName();

      return new GLabelBuilder(UseCaseTypes.EXTENSIONPOINT)
         .id(toId(extensionPoint))
         .text(label)
         .build();
   }

}
