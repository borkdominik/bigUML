/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.elements.association;

import java.util.Set;

import org.eclipse.glsp.server.operations.CreateEdgeOperation;
import org.eclipse.uml2.uml.Association;
import org.eclipse.uml2.uml.Type;

import com.eclipsesource.uml.glsp.uml.handler.element.EdgeOperationHandler;
import com.eclipsesource.uml.modelserver.uml.elements.association.commands.CreateAssociationArgument;
import com.eclipsesource.uml.modelserver.uml.elements.association.constants.AssociationType;

public class AssociationOperationHandler extends EdgeOperationHandler<Association, Type, Type> {

   public AssociationOperationHandler() {
      super(Set.of(AssociationConfiguration.typeId(), AssociationConfiguration.Variant.aggregationTypeId(),
         AssociationConfiguration.Variant.compositionTypeId()));
   }

   @Override
   protected Object createArgument(final CreateEdgeOperation operation, final Type source, final Type target) {
      var typeId = operation.getElementTypeId();
      if (typeId.equals(AssociationConfiguration.Variant.aggregationTypeId())) {
         return new CreateAssociationArgument(AssociationType.AGGREGATION);
      } else if (typeId.equals(AssociationConfiguration.Variant.compositionTypeId())) {
         return new CreateAssociationArgument(AssociationType.COMPOSITION);
      }

      return new CreateAssociationArgument(AssociationType.ASSOCIATION);
   }

}
