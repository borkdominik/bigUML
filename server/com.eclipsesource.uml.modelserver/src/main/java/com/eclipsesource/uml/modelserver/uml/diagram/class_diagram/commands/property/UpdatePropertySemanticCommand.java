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
package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.property;

import org.eclipse.uml2.uml.Property;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseUpdateSemanticElementCommand;

public final class UpdatePropertySemanticCommand
   extends BaseUpdateSemanticElementCommand<Property, UpdatePropertyArgument> {

   public UpdatePropertySemanticCommand(final ModelContext context, final Property semanticElement,
      final UpdatePropertyArgument updateArgument) {
      super(context, semanticElement, updateArgument);
   }

   @Override
   protected void updateSemanticElement(final Property semanticElement, final UpdatePropertyArgument updateArgument) {
      updateArgument.isDerived().ifPresent(arg -> {
         semanticElement.setIsDerived(arg);
      });
      updateArgument.isOrdered().ifPresent(arg -> {
         semanticElement.setIsOrdered(arg);
      });
      updateArgument.isStatic().ifPresent(arg -> {
         semanticElement.setIsStatic(arg);
      });
      updateArgument.isDerivedUnion().ifPresent(arg -> {
         semanticElement.setIsDerivedUnion(arg);
      });
      updateArgument.isReadOnly().ifPresent(arg -> {
         semanticElement.setIsReadOnly(arg);
      });
      updateArgument.isUnique().ifPresent(arg -> {
         semanticElement.setIsUnique(arg);
      });
      updateArgument.visibilityKind().ifPresent(arg -> {
         semanticElement.setVisibility(arg);
      });
      updateArgument.lowerBound().ifPresent(arg -> {
         semanticElement.setLower(arg);
      });
      updateArgument.upperBound().ifPresent(arg -> {
         semanticElement.setUpper(arg);
      });
   }

}
